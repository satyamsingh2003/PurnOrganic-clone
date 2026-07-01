"use client";

import React, { useEffect, useState } from 'react';
import styles from './page.module.css';

type Enquiry = {
  id: number;
  name: string;
  email: string;
  phone: string;
  message: string;
  created_at: string;
  status: 'pending' | 'reviewed';
};

export default function EnquiriesPage() {
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedEnquiry, setSelectedEnquiry] = useState<Enquiry | null>(null);
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'pending' | 'reviewed'>('newest');

  useEffect(() => {
    const fetchEnquiries = async () => {
      try {
        const res = await fetch('/api/enquiries');
        if (res.ok) {
          const data = await res.json();
          setEnquiries(data);
        }
      } catch (err) {
        console.error('Failed to load enquiries', err);
      } finally {
        setLoading(false);
      }
    };
    fetchEnquiries();
  }, []);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const handleStatusChange = async (id: number, newStatus: 'pending' | 'reviewed') => {
    try {
      const res = await fetch(`/api/enquiries/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      
      if (res.ok) {
        setEnquiries(prev => prev.map(enq => enq.id === id ? { ...enq, status: newStatus } : enq));
      } else {
        alert('Failed to update status');
      }
    } catch (err) {
      alert('Error updating status');
    }
  };

  const sortedEnquiries = [...enquiries].sort((a, b) => {
    if (sortBy === 'newest') {
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    } else if (sortBy === 'oldest') {
      return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
    } else if (sortBy === 'pending') {
      if (a.status === 'pending' && b.status !== 'pending') return -1;
      if (a.status !== 'pending' && b.status === 'pending') return 1;
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    } else if (sortBy === 'reviewed') {
      if (a.status === 'reviewed' && b.status !== 'reviewed') return -1;
      if (a.status !== 'reviewed' && b.status === 'reviewed') return 1;
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    }
    return 0;
  });

  return (
    <div className={styles.pageContainer}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Enquiries</h1>
          <p className={styles.subtitle}>{enquiries.length} enquiries</p>
        </div>
        
        <div className={styles.controls}>
          <label className={styles.sortLabel}>Sort By:</label>
          <select 
            className={styles.sortSelect} 
            value={sortBy} 
            onChange={(e) => setSortBy(e.target.value as any)}
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="pending">Pending First</option>
            <option value="reviewed">Reviewed First</option>
          </select>
        </div>
      </div>

      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>#</th>
              <th>NAME</th>
              <th>PHONE</th>
              <th>EMAIL</th>
              <th>SUBJECT</th>
              <th>DATE</th>
              <th>STATUS</th>
              <th>ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={8} className={styles.emptyState}>Loading enquiries...</td>
              </tr>
            ) : sortedEnquiries.length === 0 ? (
              <tr>
                <td colSpan={8} className={styles.emptyState}>No enquiries yet.</td>
              </tr>
            ) : (
              sortedEnquiries.map((enq, index) => (
                <tr key={enq.id}>
                  <td>{index + 1}</td>
                  <td className={styles.bold}>{enq.name}</td>
                  <td>{enq.phone || '-'}</td>
                  <td>{enq.email}</td>
                  <td className={styles.truncate} title={enq.message}>{enq.message}</td>
                  <td>{formatDate(enq.created_at)}</td>
                  <td>
                    <select 
                      className={enq.status === 'pending' ? styles.statusSelectPending : styles.statusSelectReviewed}
                      value={enq.status}
                      onChange={(e) => handleStatusChange(enq.id, e.target.value as 'pending' | 'reviewed')}
                    >
                      <option value="pending">Pending</option>
                      <option value="reviewed">Reviewed</option>
                    </select>
                  </td>
                  <td>
                    <button className={styles.actionBtn} onClick={() => setSelectedEnquiry(enq)}>
                      View
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {selectedEnquiry && (
        <div className={styles.modalOverlay} onClick={() => setSelectedEnquiry(null)}>
          <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h2 className={styles.modalTitle}>Enquiry Details</h2>
              <button className={styles.closeBtn} onClick={() => setSelectedEnquiry(null)}>×</button>
            </div>
            
            <div className={styles.modalBody}>
              <div className={styles.modalRow}>
                <strong>From:</strong> {selectedEnquiry.name}
              </div>
              <div className={styles.modalRow}>
                <strong>Email:</strong> {selectedEnquiry.email}
              </div>
              <div className={styles.modalRow}>
                <strong>Phone:</strong> {selectedEnquiry.phone || 'N/A'}
              </div>
              <div className={styles.modalRow}>
                <strong>Date:</strong> {formatDate(selectedEnquiry.created_at)}
              </div>
              
              <div className={styles.messageBox}>
                <strong>Message:</strong>
                <p className={styles.messageText}>{selectedEnquiry.message}</p>
              </div>
            </div>
            
            <div className={styles.modalFooter}>
              <button className={styles.closeModalBtn} onClick={() => setSelectedEnquiry(null)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
