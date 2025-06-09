import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import SuccessStory from '@/models/SuccessStory';

// GET - Fetch success stories for home page (latest first, max 20)
export async function GET() {
  try {
    await connectToDatabase();
    
    const stories = await SuccessStory.find()
      .sort({ createdAt: -1 }) // Latest first
      .limit(20) // Max 20 stories
      .select('customerName customerImage jobTitle company location testimonial rating createdAt')
      .lean();

    return NextResponse.json({
      success: true,
      data: stories
    });
  } catch (error) {
    console.error('Error fetching success stories:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch success stories' },
      { status: 500 }
    );
  }
}