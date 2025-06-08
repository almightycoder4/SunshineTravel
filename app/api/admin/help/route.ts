import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import User from '@/models/User';
import HelpTicket from '@/models/HelpTicket';
import ActivityLog from '@/models/ActivityLog';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Helper function to verify JWT token
function verifyToken(token: string) {
  try {
    return jwt.verify(token, JWT_SECRET) as { userId: string; email: string; role: string };
  } catch (error) {
    return null;
  }
}

// Create nodemailer transporter
const createTransporter = () => {
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER || 'your-email@gmail.com',
      pass: process.env.EMAIL_PASSWORD || 'your-app-password'
    }
  });
};

// POST - Submit help ticket
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

    // Check if user is admin
    if (decoded.role !== 'admin') {
      return NextResponse.json(
        { success: false, error: 'Admin access required' },
        { status: 403 }
      );
    }

    const { problemType, subject, message, priority = 'medium' } = await request.json();

    // Validate required fields
    if (!problemType || !subject || !message) {
      return NextResponse.json(
        { success: false, error: 'Problem type, subject, and message are required' },
        { status: 400 }
      );
    }

    await connectToDatabase();
    
    // Get user details
    const user = await User.findById(decoded.userId).select('-password');

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      );
    }

    // Create help ticket
    const helpTicket = new HelpTicket({
      userId: decoded.userId,
      userEmail: user.email,
      userName: user.name,
      problemType,
      subject,
      message,
      priority,
      status: 'open'
    });

    const result = await helpTicket.save();

    // Send email notification
    try {
      const transporter = createTransporter();
      
      const emailContent = `
        <h2>New Help Ticket Submitted</h2>
        <p><strong>Ticket ID:</strong> ${result._id}</p>
        <p><strong>From:</strong> ${user.name} (${user.email})</p>
        <p><strong>Problem Type:</strong> ${problemType}</p>
        <p><strong>Priority:</strong> ${priority}</p>
        <p><strong>Subject:</strong> ${subject}</p>
        <p><strong>Message:</strong></p>
        <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin: 10px 0;">
          ${message.replace(/\n/g, '<br>')}
        </div>
        <p><strong>Submitted At:</strong> ${new Date().toLocaleString()}</p>
        <hr>
        <p><em>This is an automated message from Sunshine Travel Admin Portal.</em></p>
      `;

      await transporter.sendMail({
        from: process.env.EMAIL_USER || 'noreply@sunshinetravel.com',
        to: 'pawandevmern@gmail.com',
        subject: `[Help Ticket] ${problemType}: ${subject}`,
        html: emailContent
      });

      // Log the help ticket submission activity
      const activityLog = new ActivityLog({
        userId: decoded.userId,
        action: 'Help Ticket Submitted',
        resource: 'Support System',
        details: `Submitted help ticket for: ${problemType} - ${subject}`,
        ipAddress: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown',
        userAgent: request.headers.get('user-agent') || 'unknown',
        timestamp: new Date(),
        status: 'success'
      });
      await activityLog.save();

      return NextResponse.json({
        success: true,
        message: 'Help ticket submitted successfully. You will receive a response via email.',
        ticketId: result._id
      });
    } catch (emailError) {
      console.error('Failed to send email notification:', emailError);
      
      // Still return success but mention email issue
      return NextResponse.json({
        success: true,
        message: 'Help ticket submitted successfully, but email notification failed. Please contact support directly if urgent.',
        ticketId: result._id,
        warning: 'Email notification failed'
      });
    }
  } catch (error) {
    console.error('Help ticket submission error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// GET - Get help tickets for the user
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

    await connectToDatabase();
    
    // Build query filter
    const filter: any = {
      userId: decoded.userId
    };

    if (status && status !== 'all') {
      filter.status = status;
    }

    // Get total count for pagination
    const total = await HelpTicket.countDocuments(filter);

    // Get tickets with pagination
    const tickets = await HelpTicket
      .find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();

    return NextResponse.json({
      success: true,
      tickets,
      total,
      page,
      totalPages: Math.ceil(total / limit)
    });
  } catch (error) {
    console.error('Help tickets fetch error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}