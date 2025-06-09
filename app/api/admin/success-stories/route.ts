import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import SuccessStory from '@/models/SuccessStory';
import ActivityLog from '@/models/ActivityLog';
import jwt from 'jsonwebtoken';
import { writeFile } from 'fs/promises';
import path from 'path';

const JWT_SECRET = process.env.JWT_SECRET!;

// Helper function to verify JWT token
function verifyToken(token: string) {
  try {
    return jwt.verify(token, JWT_SECRET) as { id: string; email: string; role: string };
  } catch (error) {
    return null;
  }
}

// GET - Fetch all success stories
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
    if (!decoded || decoded.role !== 'admin') {
      return NextResponse.json(
        { success: false, error: 'Admin access required' },
        { status: 403 }
      );
    }

    await connectToDatabase();
    
    const stories = await SuccessStory.find({})
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json({
      success: true,
      stories
    });
  } catch (error) {
    console.error('Error fetching success stories:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST - Create new success story
export async function POST(request: NextRequest) {
  try {
    const token = request.cookies.get('token')?.value;
    
    if (!token) {
      return NextResponse.json(
        { success: false, error: 'Authentication required' },
        { status: 401 }
      );
    }

    const decoded = verifyToken(token);
    if (!decoded || decoded.role !== 'admin') {
      return NextResponse.json(
        { success: false, error: 'Admin access required' },
        { status: 403 }
      );
    }

    const formData = await request.formData();
    const customerName = formData.get('customerName') as string;
    const jobTitle = formData.get('jobTitle') as string;
    const company = formData.get('company') as string;
    const location = formData.get('location') as string;
    const testimonial = formData.get('testimonial') as string;
    const rating = parseInt(formData.get('rating') as string);
    const imageFile = formData.get('customerImage') as File;

    if (!customerName || !jobTitle || !company || !location || !testimonial || !rating || !imageFile) {
      return NextResponse.json(
        { success: false, error: 'All fields are required' },
        { status: 400 }
      );
    }

    // Save image file
    const bytes = await imageFile.arrayBuffer();
    const buffer = Buffer.from(bytes);
    
    // Create unique filename
    const timestamp = Date.now();
    const extension = path.extname(imageFile.name);
    const filename = `success-story-${timestamp}${extension}`;
    const filepath = path.join(process.cwd(), 'public', 'uploads', 'success-stories', filename);
    
    // Ensure directory exists
    const { mkdir } = require('fs/promises');
    const uploadDir = path.dirname(filepath);
    await mkdir(uploadDir, { recursive: true });
    
    await writeFile(filepath, buffer);
    
    const customerImage = `/uploads/success-stories/${filename}`;

    await connectToDatabase();
    
    const newStory = new SuccessStory({
      customerName,
      customerImage,
      jobTitle,
      company,
      location,
      testimonial,
      rating,
      createdBy: decoded.id
    });

    const savedStory = await newStory.save();

    // Log the activity
    try {
      await ActivityLog.create({
        userId: decoded.id,
        action: 'CREATE',
        resource: 'Success Story',
        details: `Added success story for ${customerName} - ${jobTitle} at ${company}`,
        ipAddress: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown',
        userAgent: request.headers.get('user-agent') || 'unknown',
        status: 'SUCCESS'
      });
    } catch (logError) {
      console.error('Error logging activity:', logError);
    }

    return NextResponse.json({
      success: true,
      message: 'Success story added successfully',
      story: savedStory
    });
  } catch (error) {
    console.error('Error creating success story:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}