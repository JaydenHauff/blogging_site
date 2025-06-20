
export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  date: string; // ISO string format
  author: string;
  imageUrl?: string;
  imageHint?: string;
  excerpt: string;
  content: string; // Full content, potentially HTML
  category?: string;
  tags?: string[];
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  imageUrl?: string;
  imageHint?: string;
  bio: string;
}

export interface Comment {
  id: string;
  blogPostId: string; // ID of the blog post it belongs to
  blogPostSlug: string; // Slug of the blog post for linking
  authorName: string;
  authorEmail?: string; // Optional
  userAvatarUrl?: string; // URL for avatar, can be placeholder
  date: string; // ISO string format
  text: string;
  replyText?: string; // Text of the admin's reply
  isApproved: boolean; // For moderation, default to true for now
}
