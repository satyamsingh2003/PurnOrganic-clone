"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import styles from './page.module.css';

type Customer = {
  id: number;
  name: string;
  email: string;
  phone: string;
  orders_count: number;
  total_spent: number;
  created_at: string;
  status: string;
};

export default function CustomersPage() {
  const router = useRouter();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [filteredCustomers, setFilteredCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All Status');

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/customers');
      if (res.ok) {
        const data = await res.json();
        setCustomers(data);
        setFilteredCustomers(data);
      }
    } catch (err) {
      console.error('Failed to load customers', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    let filtered = customers;
    
    if (searchQuery) {
      const lowerQuery = searchQuery.toLowerCase();
      filtered = filtered.filter(c => 
        (c.name && c.name.toLowerCase().includes(lowerQuery)) ||
        (c.email && c.email.toLowerCase().includes(lowerQuery)) ||
        (c.phone && c.phone.includes(lowerQuery))
      );
    }
    
    if (statusFilter !== 'All Status') {
      filtered = filtered.filter(c => c.status === statusFilter);
    }
    
    setFilteredCustomers(filtered);
  };

  const handleReset = () => {
    setSearchQuery('');
    setStatusFilter('All Status');
    setFilteredCustomers(customers);
  };

  const toggleStatus = async (id: number, currentStatus: string) => {
    const newStatus = currentStatus === 'Active' ? 'Blocked' : 'Active';
    
    if (!window.confirm(`Are you sure you want to change this customer's status to ${newStatus}?`)) {
      return;
    }
    
    try {
      const res = await fetch(`/api/customers/${id}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      if (res.ok) {
        // Update local state without full refetch for better UX
        const updated = customers.map(c => c.id === id ? { ...c, status: newStatus } : c);
        setCustomers(updated);
        
        // Also update filtered state
        let filtered = updated;
        if (searchQuery) {
          const lowerQuery = searchQuery.toLowerCase();
          filtered = filtered.filter(c => 
            (c.name && c.name.toLowerCase().includes(lowerQuery)) ||
            (c.email && c.email.toLowerCase().includes(lowerQuery)) ||
            (c.phone && c.phone.includes(lowerQuery))
          );
        }
        if (statusFilter !== 'All Status') {
          filtered = filtered.filter(c => c.status === statusFilter);
        }
        setFilteredCustomers(filtered);
      }
    } catch (err) {
      console.error('Error toggling status:', err);
      alert('Failed to update status');
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1 className={styles.title}>Customers</h1>
        <p className={styles.subtitle}>{customers.length} registered customers</p>
      </div>

      <div className={styles.filterBar}>
        <input 
          type="text" 
          placeholder="Search by name, phone, or email" 
          className={styles.searchInput}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
        />
        <select 
          className={styles.statusSelect}
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="All Status">All Status</option>
          <option value="Active">Active</option>
          <option value="Blocked">Blocked</option>
        </select>
        <button className={styles.searchBtn} onClick={handleSearch}>Search</button>
        <button className={styles.resetBtn} onClick={handleReset}>Reset</button>
      </div>

      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>#</th>
              <th>NAME</th>
              <th>PHONE</th>
              <th>EMAIL</th>
              <th>ORDERS</th>
              <th>TOTAL SPENT</th>
              <th>JOINED</th>
              <th>STATUS</th>
              <th>ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={9} style={{ textAlign: 'center', padding: '2rem' }}>Loading customers...</td>
              </tr>
            ) : filteredCustomers.length === 0 ? (
              <tr>
                <td colSpan={9} style={{ textAlign: 'center', padding: '2rem' }}>No customers found.</td>
              </tr>
            ) : (
              filteredCustomers.map((customer, index) => (
                <tr key={customer.id}>
                  <td className={styles.lightText}>{index + 1}</td>
                  <td>
                    <div className={styles.customerInfo}>
                      <div className={styles.avatar}>
                        {customer.name ? customer.name.charAt(0).toUpperCase() : 'C'}
                      </div>
                      <strong>{customer.name || 'Customer'}</strong>
                    </div>
                  </td>
                  <td>{customer.phone || '—'}</td>
                  <td className={styles.lightText}>{customer.email || '—'}</td>
                  <td>{customer.orders_count || 0}</td>
                  <td className={styles.fwBold}>₹{Number(customer.total_spent).toFixed(2)}</td>
                  <td className={styles.lightText}>
                    {new Date(customer.created_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                  </td>
                  <td>
                    <span className={`${styles.statusBadge} ${customer.status === 'Active' ? styles.active : styles.blocked}`}>
                      {customer.status}
                    </span>
                  </td>
                  <td>
                    <div className={styles.actionButtons}>
                      <Link href={`/admin/customers/${customer.id}`} className={styles.viewBtn} title="View Profile">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                      </Link>
                      <button 
                        className={styles.blockBtn} 
                        onClick={() => toggleStatus(customer.id, customer.status)}
                        title={customer.status === 'Active' ? 'Block Customer' : 'Unblock Customer'}
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="4.93" y1="4.93" x2="19.07" y2="19.07"/></svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
