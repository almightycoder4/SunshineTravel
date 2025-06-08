import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import Job from '@/models/Job';
import { AuthRequest, authenticateUser, isAdmin, unauthorized, forbidden } from '@/middleware/auth';
import { ObjectId } from 'mongodb';

// GET - Fetch all jobs or filter jobs
export async function GET(req: NextRequest) {
  try {
    // Connect to the database
    await connectToDatabase();

    // Parse query parameters for filtering
    const searchParams = req.nextUrl.searchParams;
    const search = searchParams.get('search');
    const trade = searchParams.get('trade');
    const country = searchParams.get('country');
    const featured = searchParams.get('featured');

    // Build query
    const query: any = {};

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { company: { $regex: search, $options: 'i' } },
        { location: { $regex: search, $options: 'i' } },
      ];
    }

    if (trade && trade !== 'All Trades') {
      query.trade = trade;
    }

    if (country && country !== 'All Countries') {
      query.country = country;
    }

    if (featured === 'true') {
      query.featured = true;
    }

    // Fetch jobs
    const jobs = await Job.find(query).sort({ date: -1 });

    return NextResponse.json({ success: true, jobs });
  } catch (error) {
    console.error('Error fetching jobs:', error);
    return NextResponse.json(
      { error: 'Failed to fetch jobs' },
      { status: 500 }
    );
  }
}

// POST - Create a new job (admin only)
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

    // Connect to the database
    await connectToDatabase();

    // Parse request body
    const jobData = await req.json();

    // Create job
    const job = await Job.create({
      ...jobData,
      date: jobData.date || new Date().toISOString().split('T')[0],
    });

    // Log job creation activity
    try {
      const { db } = await connectToDatabase();
      await db.collection('activity_logs').insertOne({
        userId: new ObjectId(authReq.user.id),
        action: 'Job Created',
        resource: 'Job Management',
        details: `Created job: ${jobData.title} at ${jobData.company} (${jobData.location})`,
        ipAddress: req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown',
        userAgent: req.headers.get('user-agent') || 'unknown',
        timestamp: new Date(),
        status: 'success'
      });
    } catch (logError) {
      console.error('Failed to log job creation activity:', logError);
      // Don't fail the request if logging fails
    }

    return NextResponse.json(
      { success: true, message: 'Job created successfully', job },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating job:', error);
    return NextResponse.json(
      { error: 'Failed to create job' },
      { status: 500 }
    );
  }
}