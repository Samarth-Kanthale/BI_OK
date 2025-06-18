// src/app/actions/submit-contact.ts
'use server';

import { z } from 'zod';
import {
  getFirestore,
  FieldValue,
  Firestore,
} from 'firebase-admin/firestore';
import { initializeFirebaseAdminApp } from '@/lib/firebase-admin-init';
import { headers } from 'next/headers';

/*───────────────────────────────────────────────────────────────────────────*/
/*  Schema includes all fields */
const ContactFormSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().min(1, 'Email is required').email('Invalid email address'),
  category: z.string().min(1, 'Category is required'),
  subject: z.string().min(1, 'Subject is required'),
  message: z.string().min(5, 'Message must be at least 5 characters long'),
});

export type ContactPayload = z.infer<typeof ContactFormSchema>;

interface ContactActionResult {
  success: boolean;
  error?: string;
  data?: ContactPayload;
}

const APP_NAME = 'contactApp';

/*───────────────────────────────────────────────────────────────────────────*/
export async function submitContactFormAction(
  formData: FormData
): Promise<ContactActionResult> {
  const rawData: ContactPayload = {
    name: (formData.get('name') || '').toString(),
    email: (formData.get('email') || '').toString(),
    category: (formData.get('category') || '').toString(),
    subject: (formData.get('subject') || '').toString(),
    message: (formData.get('message') || '').toString(),
  };

  const validation = ContactFormSchema.safeParse(rawData);
  if (!validation.success) {
    const errorMsg = validation.error.errors
      .map((e) => `${e.path.join('.')}: ${e.message}`)
      .join(', ');
    console.error('❌ Validation Error:', validation.error.flatten());
    return { success: false, error: `Validation failed: ${errorMsg}` };
  }

  const data = validation.data;

  try {
    const app = await initializeFirebaseAdminApp(APP_NAME);
    const db = getFirestore(app);

    await db.collection('contacts').add({
      ...data,
      submittedAt: FieldValue.serverTimestamp(),
    });

    // Send email with all form data
    try {
      const reqHeaders = headers(); // no await needed
      const host = reqHeaders.get('host');
      const protocol = process.env.NODE_ENV === 'production' ? 'https' : 'http';
      const baseUrl = `${protocol}://${host}`;

      await fetch(`${baseUrl}/api/send-email`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ formType: 'contact', ...data }),
      });
      console.log('📧 Email sent with form data');
    } catch (emailErr) {
      console.error('📧 Email dispatch error:', emailErr);
    }

    return { success: true, data };
  } catch (err: any) {
    console.error('🔥 Submission Error:', err.message);
    return {
      success: false,
      error:
        'Server error occurred. Please try again later.',
    };
  }
}
