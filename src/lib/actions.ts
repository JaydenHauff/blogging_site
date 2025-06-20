
'use server';

import { z } from 'zod';
import type { BlogPost, Comment } from '@/types'; 
import { MOCK_BLOG_POSTS, MOCK_SUBSCRIBERS, MOCK_COMMENTS } from './constants';
import { revalidatePath } from 'next/cache';

const emailSchema = z.string().email({ message: "Invalid email address." }).optional().or(z.literal(''));
const newsletterSchema = z.object({
  email: z.string().email({ message: "Invalid email address." }),
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
  email: z.string().email({ message: "Invalid email address." }),
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

const categorySchema = z.object({
  categoryName: z.string().min(1, { message: "Category name is required." }),
  categoryDescription: z.string().optional(),
});

export async function createCategoryAction(prevState: any, formData: FormData) {
  const validatedFields = categorySchema.safeParse({
    categoryName: formData.get('categoryName'),
    categoryDescription: formData.get('categoryDescription'),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Invalid category data. Please check the fields below.',
      isError: true,
    };
  }

  const { categoryName, categoryDescription } = validatedFields.data;

  console.log(`New category "created" (mock): Name: ${categoryName}, Description: ${categoryDescription || 'N/A'}`);

  await new Promise(resolve => setTimeout(resolve, 1000));
  revalidatePath('/admin/categories');
  revalidatePath('/admin/dashboard');

  return {
    message: `Category "${categoryName}" "created" successfully! It has been logged to the server console. (Mock data, won't appear in the list unless a blog post uses this category name).`,
    errors: null,
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

  await new Promise(resolve => setTimeout(resolve, 1000));
  
  revalidatePath('/admin/settings');
  revalidatePath('/'); 

  return {
    message: 'Site settings have been "saved" successfully (logged to console). These changes are for demonstration and are not persistently stored in this prototype.',
    errors: null,
    isError: false,
  };
}

// Comment Actions
const commentSchema = z.object({
  blogPostId: z.string().min(1),
  blogPostSlug: z.string().min(1),
  authorName: z.string().min(2, { message: "Name must be at least 2 characters." }),
  authorEmail: emailSchema,
  text: z.string().min(3, { message: "Comment must be at least 3 characters." }),
});

export async function addCommentAction(prevState: any, formData: FormData) {
  const validatedFields = commentSchema.safeParse({
    blogPostId: formData.get('blogPostId'),
    blogPostSlug: formData.get('blogPostSlug'),
    authorName: formData.get('authorName'),
    authorEmail: formData.get('authorEmail'),
    text: formData.get('text'),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Invalid comment data.',
      isError: true,
    };
  }

  const { blogPostId, blogPostSlug, authorName, authorEmail, text } = validatedFields.data;
  
  const newComment: Comment = {
    id: `comment-${Date.now()}`,
    blogPostId,
    blogPostSlug,
    authorName,
    authorEmail: authorEmail || undefined,
    userAvatarUrl: `https://placehold.co/40x40.png?text=${authorName.substring(0,2).toUpperCase()}`,
    date: new Date().toISOString(),
    text,
    isApproved: true, // Auto-approve for now
  };

  console.log('New comment submitted (mock):', newComment);
  // MOCK_COMMENTS.unshift(newComment); // This would add to the array in memory, but won't persist across requests for server components.

  await new Promise(resolve => setTimeout(resolve, 700));
  revalidatePath(`/blogs/${blogPostSlug}`);
  revalidatePath('/admin/comments');

  return {
    errors: null,
    message: 'Your comment has been submitted and logged to the console (mock action).',
    isError: false,
  };
}

const replyCommentSchema = z.object({
  commentId: z.string().min(1),
  replyText: z.string().min(3, { message: "Reply must be at least 3 characters." }),
});

export async function replyToCommentAction(prevState: any, formData: FormData) {
  const validatedFields = replyCommentSchema.safeParse({
    commentId: formData.get('commentId'),
    replyText: formData.get('replyText'),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Invalid reply data.',
      isError: true,
    };
  }

  const { commentId, replyText } = validatedFields.data;
  console.log(`Admin reply to comment ID ${commentId}: ${replyText} (mock action)`);

  // Simulate updating the mock data (won't persist on page reload)
  const commentIndex = MOCK_COMMENTS.findIndex(c => c.id === commentId);
  if (commentIndex !== -1) {
    // MOCK_COMMENTS[commentIndex].replyText = replyText;
    // MOCK_COMMENTS[commentIndex].date = new Date().toISOString(); // Optionally update date
     console.log(`Mock comment ${commentId} would be updated with reply.`)
  }


  await new Promise(resolve => setTimeout(resolve, 700));
  revalidatePath('/admin/comments');
  // Also revalidate the specific blog post if replies are shown there directly
  if (commentIndex !== -1) {
    revalidatePath(`/blogs/${MOCK_COMMENTS[commentIndex].blogPostSlug}`);
  }
  
  return {
    errors: null,
    message: 'Reply submitted and logged (mock action).',
    isError: false,
  };
}

export async function deleteCommentAction(prevState: any, formData: FormData) {
    const validatedFields = deleteByIdSchema.safeParse({
        id: formData.get('commentId'),
    });

    if (!validatedFields.success) {
        return {
        message: 'Invalid Comment ID for deletion.',
        isError: true,
        };
    }
    const { id: commentId } = validatedFields.data;
    const comment = MOCK_COMMENTS.find(c => c.id === commentId);
    console.log(`Mock delete attempt for comment ID: ${commentId} from post ${comment?.blogPostSlug}`);
    
    // Simulate removal from mock data
    // const commentIndex = MOCK_COMMENTS.findIndex(c => c.id === commentId);
    // if (commentIndex !== -1) {
    //     MOCK_COMMENTS.splice(commentIndex, 1);
    // }

    await new Promise(resolve => setTimeout(resolve, 500));
    revalidatePath('/admin/comments');
    if (comment) {
        revalidatePath(`/blogs/${comment.blogPostSlug}`);
    }
    return {
        message: `Comment with ID ${commentId} has been "deleted" (logged to console). (Mock data, won't persist).`,
        isError: false,
    };
}
