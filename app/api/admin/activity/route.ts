import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Helper function to verify JWT token
function verifyToken(token: string) {
  try {
    return jwt.verify(token, JWT_SECRET) as { userId: string; email: string; role: string };
  } catch (error) {
    return null;
  }
}

// GET - Get activity logs
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

    // Check if user is admin
    if (decoded.role !== 'admin') {
      return NextResponse.json(
        { success: false, error: 'Admin access required' },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const status = searchParams.get('status');
    const action = searchParams.get('action');
    const search = searchParams.get('search');

    const { db } = await connectToDatabase();
    
    // Build query filter
    const filter: any = {
      userId: new ObjectId(decoded.userId)
    };

    if (status && status !== 'all') {
      filter.status = status;
    }

    if (action && action !== 'all') {
      filter.action = new RegExp(action, 'i');
    }

    if (search) {
      filter.$or = [
        { action: new RegExp(search, 'i') },
        { resource: new RegExp(search, 'i') },
        { details: new RegExp(search, 'i') }
      ];
    }

    // Get total count for pagination
    const total = await db.collection('activity_logs').countDocuments(filter);

    // Get activities with pagination
    const activities = await db.collection('activity_logs')
      .find(filter)
      .sort({ timestamp: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .toArray();

    return NextResponse.json({
      success: true,
      activities,
      total,
      page,
      totalPages: Math.ceil(total / limit)
    });
  } catch (error) {
    console.error('Activity logs fetch error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST - Create activity log
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
    if (!decoded) {
      return NextResponse.json(
        { success: false, error: 'Invalid token' },
        { status: 401 }
      );
    }

    const { action, resource, details, status = 'success' } = await request.json();

    // Validate required fields
    if (!action || !resource || !details) {
      return NextResponse.json(
        { success: false, error: 'Action, resource, and details are required' },
        { status: 400 }
      );
    }

    const { db } = await connectToDatabase();
    
    // Create activity log
    const activityLog = {
      userId: new ObjectId(decoded.userId),
      action,
      resource,
      details,
      ipAddress: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown',
      userAgent: request.headers.get('user-agent') || 'unknown',
      timestamp: new Date(),
      status
    };

    const result = await db.collection('activity_logs').insertOne(activityLog);

    return NextResponse.json({
      success: true,
      message: 'Activity logged successfully',
      activityId: result.insertedId
    });
  } catch (error) {
    console.error('Activity log creation error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}