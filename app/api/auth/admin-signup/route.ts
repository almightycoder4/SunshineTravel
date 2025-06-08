import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import User from '@/models/User';
import { hash } from 'bcrypt';

export async function POST(req: NextRequest) {
  try {
    // Check if signup is allowed (only in development or if no admin exists)
    if (process.env.NODE_ENV === 'production') {
      // In production, check if any admin exists
      await connectToDatabase();
      const adminExists = await User.findOne({ role: 'admin' });
      
      if (adminExists) {
        return NextResponse.json(
          { error: 'Admin signup is disabled in production when admins already exist' },
          { status: 403 }
        );
      }
    }

    // Parse request body
    const { name, email, password, signupCode } = await req.json();

    // Validate input
    if (!name || !email || !password) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Verify signup code (simple security measure)
    const validSignupCode = process.env.ADMIN_SIGNUP_CODE || 'sunshine_admin_signup';
    if (signupCode !== validSignupCode) {
      return NextResponse.json(
        { error: 'Invalid signup code' },
        { status: 401 }
      );
    }

    // Connect to the database
    await connectToDatabase();

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 409 }
      );
    }

    // Hash the password
    const hashedPassword = await hash(password, 10);

    // Create the admin user
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: 'admin',
    });

    // Return the user without the password
    const userObject = user.toObject();
    const { password: _, ...userWithoutPassword } = userObject;

    return NextResponse.json(
      { 
        success: true, 
        message: 'Admin user created successfully',
        user: userWithoutPassword
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating admin user:', error);
    return NextResponse.json(
      { error: 'Failed to create admin user' },
      { status: 500 }
    );
  }
}