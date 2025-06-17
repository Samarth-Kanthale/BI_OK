export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
const nodemailer = require('nodemailer');

/*──────────────────── Types ───────────────────*/
interface ContactFormBody {
  formType: 'contact';
  name: string;
  email: string;
  category: string;
  subject: string;
  message: string;
}

interface LeadGenBody {
  formType: 'lead-generation-form';
  name: string;
  email: string;
  phone?: string;
  serviceTitle: string;
  investmentAmount?: string;
  loanAmount?: string;
  message: string;
}

type EmailRequestBody = ContactFormBody | LeadGenBody;

/*──────────────────── Handler ─────────────────*/
export async function POST(req: Request) {
  const body: EmailRequestBody = await req.json();

  /* Guard: mail credentials */
  if (!process.env.GMAIL_USER || !process.env.GMAIL_PASS) {
    return NextResponse.json(
      { success: false, error: 'Email configuration missing' },
      { status: 500 }
    );
  }

  /* Transport */
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_PASS,
    },
  });

  /* Build subject & html */
  let subjectLine = '';
  let html = '';

  if (body.formType === 'contact') {
    const { name, email, category, subject, message } = body;
    subjectLine = 'New Contact Form Submission';
    html = `
      <h2>Contact Form Submission</h2>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Category:</strong> ${category}</p>
      <p><strong>Subject:</strong> ${subject}</p>
      <p><strong>Message:</strong><br/>${message}</p>
    `;
  } else {
    /* lead-generation-form */
    const {
      name,
      email,
      phone,
      serviceTitle,
      investmentAmount,
      loanAmount,
      message,
    } = body;
    subjectLine = 'New Lead Generation Inquiry';
    html = `
      <h2>Lead Generation Inquiry</h2>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      ${phone ? `<p><strong>Phone:</strong> ${phone}</p>` : ''}
      <p><strong>Service Interested:</strong> ${serviceTitle}</p>
      ${
        investmentAmount && investmentAmount !== ''
          ? `<p><strong>Investment Amount:</strong> ${investmentAmount}</p>`
          : ''
      }
      ${
        loanAmount && loanAmount !== ''
          ? `<p><strong>Loan Amount:</strong> ${loanAmount}</p>`
          : ''
      }
      <p><strong>Message:</strong><br/>${message}</p>
    `;
  }

  const mailOptions = {
    from: `"Beart India" <${process.env.GMAIL_USER}>`,
    to: 'ultimatexam@gmail.com',
    subject: subjectLine,
    html,
  };

  try {
    await transporter.sendMail(mailOptions);
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('📧 Email sending error:', err);
    return NextResponse.json(
      { success: false, error: 'Failed to send email' },
      { status: 500 }
    );
  }
}
