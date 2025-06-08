import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

export interface AuthRequest extends NextRequest {
  user?: {
    id: string;
    email: string;
    role: string;
  };
}

export async function authenticateUser(req: AuthRequest) {
  try {
    // Get token from cookies
    const token = req.cookies.get('token')?.value;

    if (!token) {
      return null;
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret');
    
    // Add user to request
    req.user = decoded as { id: string; email: string; role: string };
    
    return req;
  } catch (error) {
    console.error('Authentication error:', error);
    return null;
  }
}

export function isAdmin(req: AuthRequest) {
  return req.user?.role === 'admin';
}

export function unauthorized() {
  return NextResponse.json(
    { error: 'Unauthorized' },
    { status: 401 }
  );
}

export function forbidden() {
  return NextResponse.json(
    { error: 'Forbidden' },
    { status: 403 }
  );
}