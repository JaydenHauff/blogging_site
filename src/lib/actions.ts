
'use server';

import { z } from 'zod';
import type { BlogPost } from '@/types'; 
import { MOCK_BLOG_POSTS, MOCK_SUBSCRIBERS } from './constants';
import { revalidatePath } from 'next/cache';

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
  
  const isAlreadySubscribed = MOCK_SUBSCRIBERS.some(sub => sub.email === email);
  if (isAlreadySubscribed) {
    return {
      errors: null,
      message: `${email} is already subscribed!`,
      isError: false, 
    };
  }

  await new Promise(resolve => setTimeout(resolve, 1000));

  if (email === "fail@example.com") {
    return {
      errors: null,
      message: "Failed to subscribe. Please try again later.",
      isError: true,
    };
  }
  
  console.log(`Mock subscription successful for: ${email}. This user would be added to a database.`);
  revalidatePath('/admin/subscribers'); 

  return {
    errors: null,
    message: `Thank you for subscribing, ${email}! Your subscription has been logged.`,
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

  await new Promise(resolve => setTimeout(resolve, 1000));
  revalidatePath('/blogs');
  revalidatePath('/');
  revalidatePath(`/blogs/${newPost.slug}`);
  revalidatePath('/admin/posts');

  return {
    message: `Blog post "${newPost.title}" created successfully! It has been logged to the server console. (Mock data, won't persist new posts on page reload).`,
    errors: null,
    isError: false,
    newPostSlug: newPost.slug,
  };
}

const updatePostSchema = z.object({
  ...postSchemaBase,
  id: z.string().min(1, { message: "Post ID is required." }),
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
    slug,
    author,
    category: category || undefined,
    tags: tags ? tags.split(',').map(tag => tag.trim()).filter(tag => tag) : [],
    excerpt,
    imageUrl: finalImageUrl,
    imageHint: imageHint || undefined,
    content,
    date: new Date().toISOString(), 
  };

  console.log(`Attempting to update post with ID ${id} (mock). New data:`, updatedPostData);

  await new Promise(resolve => setTimeout(resolve, 1000));

  revalidatePath('/blogs');
  revalidatePath(`/blogs/${slug}`);
  if (MOCK_BLOG_POSTS[postIndex].slug !== slug) {
    revalidatePath(`/blogs/${MOCK_BLOG_POSTS[postIndex].slug}`);
  }
  revalidatePath('/');
  revalidatePath('/admin/dashboard');
  revalidatePath('/admin/posts');

  return {
    message: `Blog post "${title}" (ID: ${id}) has been "updated" successfully (logged to console). (Mock data, won't persist changes on page reload).`,
    errors: null,
    isError: false,
    updatedPostSlug: slug,
  };
}

const deleteByIdSchema = z.object({
  id: z.string().min(1, { message: "ID is required for deletion." }),
});

export async function deletePostAction(prevState: any, formData: FormData) {
  const validatedFields = deleteByIdSchema.safeParse({
    id: formData.get('id'),
  });

  if (!validatedFields.success) {
    return {
      message: 'Invalid ID for deletion.',
      isError: true,
    };
  }
  const { id } = validatedFields.data;
  console.log(`Mock delete attempt for post with ID: ${id}`);

  await new Promise(resolve => setTimeout(resolve, 500));
  revalidatePath('/admin/posts');
  revalidatePath('/admin/dashboard');
  revalidatePath('/blogs');
  revalidatePath('/');
  return {
    message: `Post with ID ${id} has been "deleted" (logged to console). (Mock data, won't persist changes on page reload).`,
    isError: false,
  };
}

export async function removeSubscriberAction(prevState: any, formData: FormData) {
  const validatedFields = deleteByIdSchema.safeParse({ 
    id: formData.get('id'),
  });

  if (!validatedFields.success) {
    return {
      message: 'Invalid ID for removal.',
      isError: true,
    };
  }
  const { id } = validatedFields.data;
  const subscriber = MOCK_SUBSCRIBERS.find(s => s.id === id);
  console.log(`Mock removal attempt for subscriber with ID: ${id} (Email: ${subscriber?.email})`);

  await new Promise(resolve => setTimeout(resolve, 500));
  revalidatePath('/admin/subscribers');
  revalidatePath('/admin/dashboard');
  return {
    message: `Subscriber with ID ${id} (Email: ${subscriber?.email}) has been "removed" (logged to console). (Mock data, won't persist changes on page reload).`,
    isError: false,
  };
}

const deleteCategorySchema = z.object({
  categoryName: z.string().min(1, { message: "Category name is required." }),
});

export async function deleteCategoryAction(prevState: any, formData: FormData) {
  const validatedFields = deleteCategorySchema.safeParse({
    categoryName: formData.get('categoryName'),
  });

  if (!validatedFields.success) {
    return {
      message: 'Invalid category name for deletion.',
      isError: true,
    };
  }
  const { categoryName } = validatedFields.data;
  console.log(`Mock delete attempt for category: ${categoryName}`);

  await new Promise(resolve => setTimeout(resolve, 500));
  revalidatePath('/admin/categories');
  revalidatePath('/admin/dashboard');
  return {
    message: `Category "${categoryName}" has been "deleted" (logged to console). (Mock data, won't persist changes on page reload).`,
    isError: false,
  };
}

// Site Settings Action
const siteSettingsSchema = z.object({
  siteName: z.string().min(3, { message: "Site Name must be at least 3 characters." }),
  siteDescription: z.string().min(10, { message: "Site Description must be at least 10 characters." }),
  footerCopyrightText: z.string().optional(),
  allowNewUserRegistrations: z.preprocess((val) => val === 'on' || val === true, z.boolean().optional()),
  enableCommentsGlobally: z.preprocess((val) => val === 'on' || val === true, z.boolean().optional()),
});

export async function updateSiteSettingsAction(prevState: any, formData: FormData) {
  const validatedFields = siteSettingsSchema.safeParse({
    siteName: formData.get('siteName'),
    siteDescription: formData.get('siteDescription'),
    footerCopyrightText: formData.get('footerCopyrightText'),
    allowNewUserRegistrations: formData.get('allowNewUserRegistrations'),
    enableCommentsGlobally: formData.get('enableCommentsGlobally'),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Invalid site settings. Please check the fields below.',
      isError: true,
    };
  }

  const settings = validatedFields.data;

  console.log('Site settings "updated" (mock):', settings);
  // In a real app, you would save these settings to a database.
  // MOCK_ constants like SITE_NAME, SITE_DESCRIPTION are not dynamically updated here.

  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Revalidate paths that might consume these settings if they were dynamic
  revalidatePath('/admin/settings');
  revalidatePath('/'); // Potentially for site name/description in layout/meta
  // Add other relevant paths if settings affected them directly

  return {
    message: 'Site settings have been "saved" successfully (logged to console). These changes are for demonstration and are not persistently stored in this prototype.',
    errors: null,
    isError: false,
  };
}
