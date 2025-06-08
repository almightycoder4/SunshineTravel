import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Job from '@/models/Job';
import { AuthRequest, authenticateUser, isAdmin, unauthorized, forbidden } from '@/middleware/auth';

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

    // Find and update job
    const job = await Job.findByIdAndUpdate(
      id,
      { ...jobData },
      { new: true, runValidators: true }
    );

    if (!job) {
      return NextResponse.json(
        { error: 'Job not found' },
        { status: 404 }
      );
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

    // Find and delete job
    const job = await Job.findByIdAndDelete(id);

    if (!job) {
      return NextResponse.json(
        { error: 'Job not found' },
        { status: 404 }
      );
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