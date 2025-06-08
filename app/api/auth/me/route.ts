import { NextRequest, NextResponse } from 'next/server';
import { AuthRequest, authenticateUser } from '@/middleware/auth';
import connectToDatabase from '@/lib/mongodb';
import User from '@/models/User';

export async function GET(req: NextRequest) {
  try {
    // Authenticate user
    const authReq = await authenticateUser(req as AuthRequest);
    if (!authReq || !authReq.user) {
      return NextResponse.json(
        { authenticated: false },
        { status: 401 }
      );
    }

    // Connect to the database
    await connectToDatabase();

    // Get user details (excluding password)
    const user = await User.findById(authReq.user.id).select('-password');

    if (!user) {
      return NextResponse.json(
        { authenticated: false, error: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      authenticated: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error('Error checking authentication:', error);
    return NextResponse.json(
      { authenticated: false, error: 'Authentication check failed' },
      { status: 500 }
    );
  }
}