import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import Job from '@/models/Job';
import { AuthRequest, authenticateUser, isAdmin, unauthorized, forbidden } from '@/middleware/auth';
import { ObjectId } from 'mongodb';

// GET - Fetch a single job by ID
export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params;

    // Connect to the database
    await connectToDatabase();

    // Find job by ID
    const job = await Job.findById(id);

    if (!job) {
      return NextResponse.json(
        { error: 'Job not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, job });
  } catch (error) {
    console.error(`Error fetching job ${params.id}:`, error);
    return NextResponse.json(
      { error: 'Failed to fetch job' },
      { status: 500 }
    );
  }
}

// PUT - Update a job (admin only)
export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params;

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

    // Get original job data for logging
    const originalJob = await Job.findById(id);
    if (!originalJob) {
      return NextResponse.json(
        { error: 'Job not found' },
        { status: 404 }
      );
    }

    // Find and update job
    const job = await Job.findByIdAndUpdate(
      id,
      { ...jobData },
      { new: true, runValidators: true }
    );

    // Log job update activity
    try {
      const { db } = await connectToDatabase();
      await db.collection('activity_logs').insertOne({
        userId: new ObjectId(authReq.user.id),
        action: 'Job Updated',
        resource: 'Job Management',
        details: `Updated job: ${originalJob.title} at ${originalJob.company} (ID: ${id})`,
        ipAddress: req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown',
        userAgent: req.headers.get('user-agent') || 'unknown',
        timestamp: new Date(),
        status: 'success'
      });
    } catch (logError) {
      console.error('Failed to log job update activity:', logError);
      // Don't fail the request if logging fails
    }

    return NextResponse.json({ success: true, message: 'Job updated successfully', job });
  } catch (error) {
    console.error(`Error updating job ${params.id}:`, error);
    return NextResponse.json(
      { error: 'Failed to update job' },
      { status: 500 }
    );
  }
}

// DELETE - Delete a job (admin only)
export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params;

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

    // Find job first for logging
    const job = await Job.findById(id);
    if (!job) {
      return NextResponse.json(
        { error: 'Job not found' },
        { status: 404 }
      );
    }

    // Delete the job
    await Job.findByIdAndDelete(id);

    // Log job deletion activity
    try {
      const { db } = await connectToDatabase();
      await db.collection('activity_logs').insertOne({
        userId: new ObjectId(authReq.user.id),
        action: 'Job Deleted',
        resource: 'Job Management',
        details: `Deleted job: ${job.title} at ${job.company} (ID: ${id})`,
        ipAddress: req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown',
        userAgent: req.headers.get('user-agent') || 'unknown',
        timestamp: new Date(),
        status: 'success'
      });
    } catch (logError) {
      console.error('Failed to log job deletion activity:', logError);
      // Don't fail the request if logging fails
    }

    return NextResponse.json({ success: true, message: 'Job deleted successfully' });
  } catch (error) {
    console.error(`Error deleting job ${params.id}:`, error);
    return NextResponse.json(
      { error: 'Failed to delete job' },
      { status: 500 }
    );
  }
}