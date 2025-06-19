
'use server';

import { z } from 'zod';
import type { BlogPost } from '@/types'; 

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
      isError: true, 
    };
  }

  const email = validatedFields.data.email;
  console.log(`Newsletter subscription attempt for: ${email}`);
  
  await new Promise(resolve => setTimeout(resolve, 1000));

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

  await new Promise(resolve => setTimeout(resolve, 1000));
  
  return {
    errors: null,
    message: 'Thank you for your message! We will get back to you soon.',
    isError: false,
  };
}

// Schema for creating a new blog post
const createPostSchema = z.object({
  title: z.string().min(3, { message: "Title must be at least 3 characters." }),
  slug: z.string().min(3, { message: "Slug must be at least 3 characters." })
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, { message: "Slug must be URL-friendly (e.g., my-post-slug)." }),
  author: z.string().min(2, { message: "Author name must be at least 2 characters." }),
  category: z.string().optional(),
  tags: z.string().optional(), 
  excerpt: z.string().min(10, { message: "Excerpt must be at least 10 characters." }),
  imageUrl: z.string().url({ message: "Please enter a valid URL for the image." }).optional().or(z.literal('')),
  imageDataUri: z.string().optional(), // For uploaded image data URI
  imageHint: z.string().optional(),
  content: z.string().min(10, { message: "Content must be at least 10 characters." }), // Reduced min for easier testing
});

export async function createBlogPostAction(prevState: any, formData: FormData) {
  const validatedFields = createPostSchema.safeParse({
    title: formData.get('title'),
    slug: formData.get('slug'),
    author: formData.get('author'),
    category: formData.get('category'),
    tags: formData.get('tags'),
    excerpt: formData.get('excerpt'),
    imageUrl: formData.get('imageUrl'),
    imageDataUri: formData.get('imageDataUri'),
    imageHint: formData.get('imageHint'),
    content: formData.get('content'),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Invalid form data. Please check the fields below.',
      isError: true,
    };
  }

  const { title, slug, author, category, tags, excerpt, imageUrl, imageDataUri, imageHint, content } = validatedFields.data;

  // Prioritize uploaded image data URI, then fallback to URL input
  const finalImageUrl = imageDataUri && imageDataUri.startsWith('data:image') ? imageDataUri : (imageUrl || undefined);

  const newPost: BlogPost = {
    id: Date.now().toString(), 
    date: new Date().toISOString(),
    title,
    slug,
    author,
    category: category || undefined,
    tags: tags ? tags.split(',').map(tag => tag.trim()).filter(tag => tag) : [],
    excerpt,
    imageUrl: finalImageUrl,
    imageHint: imageHint || undefined,
    content,
  };

  console.log('New blog post created (mock):', newPost);
  // In a real application, if imageDataUri was present, you would upload it to a storage 
  // service here and use the returned URL for newPost.imageUrl.

  await new Promise(resolve => setTimeout(resolve, 1000));

  return {
    message: `Blog post "${newPost.title}" created successfully! It has been logged to the server console.`,
    errors: null,
    isError: false,
    newPostSlug: newPost.slug,
  };
}
