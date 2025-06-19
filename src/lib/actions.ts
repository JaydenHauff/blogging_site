
'use server';

import { z } from 'zod';
import type { BlogPost } from '@/types'; 
import { MOCK_BLOG_POSTS } from './constants'; // Import for finding post by slug for update
import { revalidatePath } from 'next/cache'; // To potentially clear cache after update

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

const postSchemaBase = {
  title: z.string().min(3, { message: "Title must be at least 3 characters." }),
  slug: z.string().min(3, { message: "Slug must be at least 3 characters." })
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, { message: "Slug must be URL-friendly (e.g., my-post-slug)." }),
  author: z.string().min(2, { message: "Author name must be at least 2 characters." }),
  category: z.string().optional(),
  tags: z.string().optional(), 
  excerpt: z.string().min(10, { message: "Excerpt must be at least 10 characters." }),
  imageUrl: z.string().url({ message: "Please enter a valid URL for the image." }).optional().or(z.literal('')),
  imageDataUri: z.string().optional(),
  imageHint: z.string().optional(),
  content: z.string().min(10, { message: "Content must be at least 10 characters." }),
};

// Schema for creating a new blog post
const createPostSchema = z.object(postSchemaBase);

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
  // And you would save the newPost to a database.
  // For now, we add to MOCK_BLOG_POSTS (note: this won't persist across requests in serverless environments)
  // MOCK_BLOG_POSTS.unshift(newPost); // This is a side effect and generally not good for server actions with const arrays.
                                   // For the prototype, this won't actually update the shared constant.

  await new Promise(resolve => setTimeout(resolve, 1000));
  revalidatePath('/blogs');
  revalidatePath('/');
  revalidatePath(`/blogs/${newPost.slug}`);

  return {
    message: `Blog post "${newPost.title}" created successfully! It has been logged to the server console. (Mock data, won't persist new posts on page reload unless MOCK_BLOG_POSTS is mutated at module level - which is not ideal).`,
    errors: null,
    isError: false,
    newPostSlug: newPost.slug, // Used to redirect or indicate success
  };
}

// Schema for updating an existing blog post
const updatePostSchema = z.object({
  ...postSchemaBase,
  id: z.string().min(1, { message: "Post ID is required." }), // ID of the post to update
});


export async function updateBlogPostAction(prevState: any, formData: FormData) {
  const validatedFields = updatePostSchema.safeParse({
    id: formData.get('id'),
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
      message: 'Invalid form data for update. Please check the fields below.',
      isError: true,
    };
  }
  
  const { id, title, slug, author, category, tags, excerpt, imageUrl, imageDataUri, imageHint, content } = validatedFields.data;

  // In a real app, find and update the post in the database
  // For this prototype, we'll find it in MOCK_BLOG_POSTS (this won't modify the actual const array effectively across requests)
  const postIndex = MOCK_BLOG_POSTS.findIndex(p => p.id === id);

  if (postIndex === -1) {
    return {
      message: `Error: Post with ID "${id}" not found for update.`,
      errors: null,
      isError: true,
    };
  }

  const finalImageUrl = imageDataUri && imageDataUri.startsWith('data:image') ? imageDataUri : (imageUrl || MOCK_BLOG_POSTS[postIndex].imageUrl);


  const updatedPostData: Partial<BlogPost> = {
    title,
    slug, // Note: If slug changes, old links will break. Careful handling needed in real apps.
    author,
    category: category || undefined,
    tags: tags ? tags.split(',').map(tag => tag.trim()).filter(tag => tag) : [],
    excerpt,
    imageUrl: finalImageUrl,
    imageHint: imageHint || undefined,
    content,
    date: new Date().toISOString(), // Update the date to reflect modification time
  };

  console.log(`Attempting to update post with ID ${id} (mock). New data:`, updatedPostData);
  // MOCK_BLOG_POSTS[postIndex] = { ...MOCK_BLOG_POSTS[postIndex], ...updatedPostData }; // This won't persist due to const nature and module caching

  await new Promise(resolve => setTimeout(resolve, 1000));

  // Revalidate paths that might display this blog post
  revalidatePath('/blogs');
  revalidatePath(`/blogs/${slug}`); // new slug
  if (MOCK_BLOG_POSTS[postIndex].slug !== slug) {
    revalidatePath(`/blogs/${MOCK_BLOG_POSTS[postIndex].slug}`); // old slug
  }
  revalidatePath('/');
  revalidatePath('/admin/dashboard');


  return {
    message: `Blog post "${title}" (ID: ${id}) has been "updated" successfully (logged to console). (Mock data, won't persist changes on page reload).`,
    errors: null,
    isError: false,
    updatedPostSlug: slug,
  };
}
