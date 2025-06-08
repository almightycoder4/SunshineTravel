import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import User from '@/models/User';
import { compare } from 'bcrypt';
import jwt from 'jsonwebtoken';
import { ObjectId } from 'mongodb';

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    // Validate input
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Connect to the database
    await connectToDatabase();

    // Find the user
    const user = await User.findOne({ email });
    if (!user) {
      // Log failed login attempt
      try {
        const { db } = await connectToDatabase();
        await db.collection('activity_logs').insertOne({
          userId: null,
          action: 'Login Attempt',
          resource: 'Authentication',
          details: `Failed login attempt for email: ${email} (user not found)`,
          ipAddress: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown',
          userAgent: request.headers.get('user-agent') || 'unknown',
          timestamp: new Date(),
          status: 'failed'
        });
      } catch (logError) {
        console.error('Failed to log login attempt:', logError);
      }
      
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // Verify password
    const isPasswordValid = await compare(password, user.password);
    if (!isPasswordValid) {
      // Log failed login attempt
      try {
        const { db } = await connectToDatabase();
        await db.collection('activity_logs').insertOne({
          userId: new ObjectId(user._id),
          action: 'Login Attempt',
          resource: 'Authentication',
          details: `Failed login attempt for email: ${email} (invalid password)`,
          ipAddress: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown',
          userAgent: request.headers.get('user-agent') || 'unknown',
          timestamp: new Date(),
          status: 'failed'
        });
      } catch (logError) {
        console.error('Failed to log login attempt:', logError);
      }
      
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // Create JWT token
    const token = jwt.sign(
      { 
        id: user._id,
        email: user.email,
        role: user.role 
      },
      process.env.JWT_SECRET || 'fallback_secret',
      { expiresIn: '1d' }
    );

    // Set cookie with the token
    const response = NextResponse.json(
      { 
        success: true, 
        message: 'Login successful',
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role
        }
      },
      { status: 200 }
    );

    // Set HTTP-only cookie
    response.cookies.set({
      name: 'token',
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 86400, // 1 day in seconds
      path: '/',
    });

    // Log successful login
    try {
      const { db } = await connectToDatabase();
      await db.collection('activity_logs').insertOne({
        userId: new ObjectId(user._id),
        action: 'Login',
        resource: 'Authentication',
        details: `Successful login for ${user.name} (${user.email})`,
        ipAddress: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown',
        userAgent: request.headers.get('user-agent') || 'unknown',
        timestamp: new Date(),
        status: 'success'
      });
    } catch (logError) {
      console.error('Failed to log successful login:', logError);
      // Don't fail the login if logging fails
    }

    return response;
  } catch (error) {
    console.error('Error in user login:', error);
    return NextResponse.json(
      { error: 'Failed to login' },
      { status: 500 }
    );
  }
}