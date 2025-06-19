'use server';

import { z } from 'zod';

const emailSchema = z.string().email({ message: "Invalid email address." });
const newsletterSchema = z.object({
  email: emailSchema,
});

export async function subscribeToNewsletter(prevState: any, formData: FormData) {
  const validatedFields = newsletterSchema.safeParse({
    email: formData.get('email'),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Invalid email.',
    };
  }

  const email = validatedFields.data.email;
  console.log(`Newsletter subscription attempt for: ${email}`);
  // Placeholder for actual database interaction
  // e.g., await db.collection('newsletter_subscriptions').insertOne({ email, subscribedAt: new Date() });
  
  // Simulate database operation
  await new Promise(resolve => setTimeout(resolve, 1000));

  // Check if email is "fail@example.com" to simulate an error
  if (email === "fail@example.com") {
    return {
      errors: null,
      message: "Failed to subscribe. Please try again later.",
      isError: true,
    };
  }

  return {
    errors: null,
    message: `Thank you for subscribing, ${email}!`,
    isError: false,
  };
}


const contactFormSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: emailSchema,
  message: z.string().min(10, { message: "Message must be at least 10 characters." }),
});

export async function submitContactForm(prevState: any, formData: FormData) {
  const validatedFields = contactFormSchema.safeParse({
    name: formData.get('name'),
    email: formData.get('email'),
    message: formData.get('message'),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Invalid form data.',
      isError: true,
    };
  }

  const { name, email, message } = validatedFields.data;
  console.log(`Contact form submission: Name: ${name}, Email: ${email}, Message: ${message}`);
  // Placeholder for actual database interaction or email sending
  // e.g., await db.collection('contact_submissions').insertOne({ name, email, message, submittedAt: new Date() });

  await new Promise(resolve => setTimeout(resolve, 1000));
  
  return {
    errors: null,
    message: 'Thank you for your message! We will get back to you soon.',
    isError: false,
  };
}
