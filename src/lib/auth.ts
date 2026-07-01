import { jwtVerify, SignJWT } from 'jose';

interface JwtPayload {
  id: string | number;
  email: string;
  role: string;
  [key: string]: any;
}

export const getJwtSecretKey = () => {
  const secret = process.env.JWT_SECRET || 'super_secret_purnorganic_jwt_key_2026';
  if (!secret || secret.length === 0) {
    throw new Error('The environment variable JWT_SECRET is not set.');
  }
  return secret;
};

export async function signJwt(payload: JwtPayload): Promise<string> {
  const secret = new TextEncoder().encode(getJwtSecretKey());
  
  return new SignJWT(payload as any)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('24h') // Token expires in 24 hours
    .sign(secret);
}

export async function verifyJwt(token: string): Promise<JwtPayload | null> {
  try {
    const secret = new TextEncoder().encode(getJwtSecretKey());
    const { payload } = await jwtVerify(token, secret);
    return payload as JwtPayload;
  } catch (error) {
    return null;
  }
}
