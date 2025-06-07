import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(request: Request) {
  try {
    // Parse form data
    const formData = await request.formData();
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const phone = formData.get("phone") as string;
    const jobRole = formData.get("jobRole") as string;
    const country = formData.get("country") as string;
    const experience = formData.get("experience") as string;
    const message = formData.get("message") as string;
    const resume = formData.get("resume") as File;

    // Validate input
    if (!name || !email || !phone || !jobRole || !resume) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // In a production environment, you would set up a real email service
    // This is a placeholder for demonstration purposes
    const transporter = nodemailer.createTransport({
      host: "smtp.example.com",
      port: 587,
      secure: false,
      auth: {
        user: "your-email@example.com",
        pass: "your-password",
      },
    });

    // Convert the file to buffer
    const buffer = await resume.arrayBuffer();
    
    const mailOptions = {
      from: `"${name}" <${email}>`,
      to: "sunshine.travel40@gmail.com",
      subject: `Job Application: ${jobRole} in ${country}`,
      text: `
        Name: ${name}
        Email: ${email}
        Phone: ${phone}
        Job Role: ${jobRole}
        Preferred Country: ${country}
        Experience: ${experience}
        
        Message:
        ${message || "No additional message provided."}
      `,
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 600px;">
          <h2 style="color: #3b82f6;">New Job Application</h2>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Phone:</strong> ${phone}</p>
          <p><strong>Job Role:</strong> ${jobRole}</p>
          <p><strong>Preferred Country:</strong> ${country}</p>
          <p><strong>Experience:</strong> ${experience}</p>
          <div style="margin-top: 20px; padding: 15px; background-color: #f9fafb; border-left: 4px solid #3b82f6;">
            <h3 style="margin-top: 0;">Additional Message:</h3>
            <p style="white-space: pre-line;">${message || "No additional message provided."}</p>
          </div>
        </div>
      `,
      attachments: [
        {
          filename: resume.name,
          content: Buffer.from(buffer),
        },
      ],
    };

    // In a real implementation, you would uncomment this
    // await transporter.sendMail(mailOptions);

    // For demo purposes, just return success
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error in job application submission:", error);
    return NextResponse.json(
      { error: "Failed to submit application" },
      { status: 500 }
    );
  }
}