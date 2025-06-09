import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import User from '@/models/User';
import ActivityLog from '@/models/ActivityLog';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Helper function to verify JWT token
function verifyToken(token: string) {
  try {
    return jwt.verify(token, JWT_SECRET) as { id: string; email: string; role: string };
  } catch (error) {
    return null;
  }
}

// GET - Get user profile
export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get('token')?.value;
    
    if (!token) {
      return NextResponse.json(
        { success: false, error: 'Authentication required' },
        { status: 401 }
      );
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      return NextResponse.json(
        { success: false, error: 'Invalid token' },
        { status: 401 }
      );
    }

    await connectToDatabase();
    const user = await User.findById(decoded.id).select('-password');

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      user
    });
  } catch (error) {
    console.error('Profile fetch error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PUT - Update user profile
export async function PUT(request: NextRequest) {
  try {
    const token = request.cookies.get('token')?.value;
    
    if (!token) {
      return NextResponse.json(
        { success: false, error: 'Authentication required' },
        { status: 401 }
      );
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      return NextResponse.json(
        { success: false, error: 'Invalid token' },
        { status: 401 }
      );
    }

    const { name, email, phone, address, bio } = await request.json();

    // Validate required fields
    if (!name || !email) {
      return NextResponse.json(
        { success: false, error: 'Name and email are required' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { success: false, error: 'Invalid email format' },
        { status: 400 }
      );
    }

    await connectToDatabase();
    
    // Check if email is already taken by another user
    const existingUser = await User.findOne({
      email,
      _id: { $ne: decoded.id }
    });

    if (existingUser) {
      return NextResponse.json(
        { success: false, error: 'Email is already taken' },
        { status: 400 }
      );
    }

    // Get current user data for comparison
    const currentUser = await User.findById(decoded.id);

    if (!currentUser) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      );
    }

    // Update user profile
    const updateData = {
      name,
      email,
      phone: phone || '',
      address: address || '',
      bio: bio || '',
      updatedAt: new Date()
    };

    const result = await User.findByIdAndUpdate(
      decoded.id,
      updateData,
      { 
        new: true,
        select: '-password' // Exclude password from response
      }
    );

    if (!result) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      );
    }

    // Log the profile update activity
    try {
      // Determine what fields were changed
      const changedFields = [];
      if (currentUser.name !== name) changedFields.push('name');
      if (currentUser.email !== email) changedFields.push('email');
      if (currentUser.phone !== (phone || '')) changedFields.push('phone');
      if (currentUser.address !== (address || '')) changedFields.push('address');
      if (currentUser.bio !== (bio || '')) changedFields.push('bio');

      if (changedFields.length > 0) {
        const activityLog = new ActivityLog({
          userId: decoded.id,
          action: 'Profile Update',
          resource: 'User Profile',
          details: `Updated fields: ${changedFields.join(', ')}`,
          ipAddress: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown',
          userAgent: request.headers.get('user-agent') || 'unknown',
          timestamp: new Date(),
          status: 'success'
        });
        await activityLog.save();
      }
    } catch (logError) {
      console.error('Failed to log profile update activity:', logError);
      // Don't fail the request if logging fails
    }

    return NextResponse.json({
      success: true,
      message: 'Profile updated successfully',
      user: result
    });
  } catch (error) {
    console.error('Profile update error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}