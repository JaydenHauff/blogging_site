
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
  blogPostId: string;
  userId: string;
  userName: string;
  userAvatarUrl?: string;
  date: string;
  text: string;
}
