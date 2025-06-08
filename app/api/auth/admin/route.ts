import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import User from '@/models/User';
import { hash } from 'bcryptjs';
import { AuthRequest, authenticateUser, isAdmin, unauthorized, forbidden } from '@/middleware/auth';

export async function POST(req: NextRequest) {
  try {
    // Authenticate user
    const authReq = await authenticateUser(req as AuthRequest);
    if (!authReq) {
      return unauthorized();
    }

    // Check if user is admin
    if (!isAdmin(authReq)) {
      return forbidden();
    }

    // Parse request body
    const { name, email, password } = await req.json();

    // Validate input
    if (!name || !email || !password) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
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