
'use server';

import { z } from 'zod';
import type { BlogPost } from '@/types'; // Assuming BlogPost type includes all necessary fields

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
      isError: true, // Ensure isError is set
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
  tags: z.string().optional(), // Comma-separated string
  excerpt: z.string().min(10, { message: "Excerpt must be at least 10 characters." }),
  imageUrl: z.string().url({ message: "Please enter a valid URL for the image." }).optional().or(z.literal('')),
  imageHint: z.string().optional(),
  content: z.string().min(50, { message: "Content must be at least 50 characters." }),
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

  const { title, slug, author, category, tags, excerpt, imageUrl, imageHint, content } = validatedFields.data;

  const newPost: BlogPost = {
    id: Date.now().toString(), // Generate a simple unique ID for mock
    date: new Date().toISOString(), // Set current date
    title,
    slug,
    author,
    category: category || undefined,
    tags: tags ? tags.split(',').map(tag => tag.trim()).filter(tag => tag) : [],
    excerpt,
    imageUrl: imageUrl || undefined,
    imageHint: imageHint || undefined,
    content,
  };

  console.log('New blog post created (mock):', newPost);
  // In a real application, you would save this `newPost` object to your database.
  // For example: await db.collection('posts').insertOne(newPost);
  // You would also handle potential database errors here.

  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 1000));

  // Example of simulating a slug conflict (though MOCK_BLOG_POSTS is not checked here)
  // if (newPost.slug === 'existing-slug') {
  //   return {
  //     errors: { slug: ['This slug is already taken. Please choose another.'] },
  //     message: 'Slug conflict.',
  //     isError: true,
  //   };
  // }

  return {
    message: `Blog post "${newPost.title}" created successfully! It has been logged to the server console.`,
    errors: null,
    isError: false,
    newPostSlug: newPost.slug, // Pass slug for potential redirect
  };
}
