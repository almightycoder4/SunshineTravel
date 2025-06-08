import { NextResponse } from 'next/server';
import { seedJobs, seedAdminUser } from '@/lib/seed';

// This route should only be used in development or during initial deployment
export async function GET() {
  try {
    // Only allow in development mode
    if (process.env.NODE_ENV === 'production') {
      return NextResponse.json(
        { error: 'This route is not available in production' },
        { status: 403 }
      );
    }

    // Seed jobs
    const jobsResult = await seedJobs();
    
    // Seed admin user
    const adminResult = await seedAdminUser();

    if (jobsResult.success && adminResult.success) {
      return NextResponse.json({
        success: true,
        message: 'Database seeded successfully',
      });
    } else {
      return NextResponse.json(
        { 
          success: false, 
          jobsError: jobsResult.success ? null : jobsResult.error,
          adminError: adminResult.success ? null : adminResult.error,
        },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Error seeding database:', error);
    return NextResponse.json(
      { error: 'Failed to seed database' },
      { status: 500 }
    );
  }
}