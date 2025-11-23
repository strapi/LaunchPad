import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

const contactSchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Invalid email"),
  subject: z.string().min(5, "Subject is required"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const data = contactSchema.parse(body);

    // If Resend API key is not set, just log it
    if (!process.env.RESEND_API_KEY) {
      console.log("Contact form submission:", data);
      return NextResponse.json(
        { success: true, message: "Message received (email service not configured)" },
        { status: 200 }
      );
    }

    // Send email via Resend
    const result = await resend.emails.send({
      from: "contact@peter-sung.com",
      to: "contact@peter-sung.com",
      reply_to: data.email,
      subject: `New Contact Form Submission: ${data.subject}`,
      html: `
        <h2>${data.subject}</h2>
        <p><strong>From:</strong> ${data.name} (${data.email})</p>
        <hr />
        <p>${data.message.replace(/\n/g, "<br />")}</p>
      `,
    });

    if (result.error) {
      return NextResponse.json(
        { error: result.error.message },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: true, message: "Email sent successfully" },
      { status: 200 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.issues[0].message },
        { status: 400 }
      );
    }

    console.error("Contact form error:", error);
    return NextResponse.json(
      { error: "Failed to send message" },
      { status: 500 }
    );
  }
}
