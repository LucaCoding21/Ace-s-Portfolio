import { Resend } from "resend";
import { NextResponse } from "next/server";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  const { name, email, shootType, message } = await request.json();

  if (!name || !email || !shootType || !message) {
    return NextResponse.json(
      { error: "All fields are required." },
      { status: 400 }
    );
  }

  try {
    const { data, error } = await resend.emails.send({
      from: "Contact Form <contact@acesuasola.com>",
      to: ["acesuasola@gmail.com", "nguyen.william0121@gmail.com"],
      replyTo: email,
      subject: `New inquiry: ${shootType} — from ${name}`,
      text: [
        `Name: ${name}`,
        `Email: ${email}`,
        `Service: ${shootType}`,
        ``,
        `Message:`,
        message,
      ].join("\n"),
    });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ id: data?.id });
  } catch {
    return NextResponse.json(
      { error: "Failed to send message. Please try again." },
      { status: 500 }
    );
  }
}
