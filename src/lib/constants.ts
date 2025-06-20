
import type { BlogPost, TeamMember } from '@/types';

export const MOCK_BLOG_POSTS: BlogPost[] = [
  {
    id: '1',
    slug: 'first-post-journey-begins',
    title: 'My First Post: A Journey Begins',
    date: '2024-07-28',
    author: 'Jane Doe',
    imageUrl: 'https://placehold.co/600x400.png',
    imageHint: 'journey path',
    excerpt: 'This is the beginning of a beautiful journey into the world of blogging. Exploring new ideas and sharing thoughts.',
    content: '<p>This is the full content of the first blog post. It supports <strong>rich text formatting</strong>, including headings, lists, and more.</p><h2>A New Chapter</h2><p>Embarking on this blogging adventure opens up a new chapter of creativity and expression.</p><ul><li>Explore new topics</li><li>Share insights</li><li>Connect with readers</li></ul>',
    category: 'Personal Growth',
    tags: ['new beginnings', 'blogging', 'creativity'],
  },
  {
    id: '2',
    slug: 'mastering-modern-design',
    title: 'Mastering Modern Design Principles',
    date: '2024-07-25',
    author: 'John Art',
    imageUrl: 'https://placehold.co/600x400.png',
    imageHint: 'design tools',
    excerpt: 'Dive into the core principles of modern design, from minimalism to user experience.',
    content: '<p>Modern design is constantly evolving. This post explores key principles that stand the test of time.</p><h3>Color Theory</h3><p>Understanding how colors interact is crucial for impactful design.</p>',
    category: 'Design',
    tags: ['ui/ux', 'minimalism', 'web design'],
  },
  {
    id: '3',
    slug: 'the-art-of-storytelling',
    title: 'The Art of Storytelling in the Digital Age',
    date: '2024-07-22',
    author: 'Alice Writer',
    imageUrl: 'https://placehold.co/600x400.png',
    imageHint: 'open book',
    excerpt: 'Learn how to captivate your audience with compelling narratives in the digital landscape.',
    content: '<p>Storytelling is a powerful tool. In the digital age, it takes many forms, from blog posts to social media content.</p>',
    category: 'Writing',
    tags: ['content creation', 'narrative', 'digital media'],
  },
  {
    id: '4',
    slug: 'tech-innovations-2024',
    title: 'Top Tech Innovations to Watch in 2024',
    date: '2024-07-20',
    author: 'Tech Savvy',
    imageUrl: 'https://placehold.co/600x400.png',
    imageHint: 'futuristic tech',
    excerpt: 'A look at the groundbreaking technologies shaping our future this year.',
    content: '<p>From AI advancements to sustainable tech, 2024 is a year of exciting innovations. We cover the most impactful ones here.</p>',
    category: 'Technology',
    tags: ['ai', 'innovation', 'future tech'],
  },
   {
    id: '5',
    slug: 'healthy-mind-healthy-life',
    title: 'Cultivating a Healthy Mind for a Healthy Life',
    date: '2024-07-18',
    author: 'Dr. Wellness',
    imageUrl: 'https://placehold.co/600x400.png',
    imageHint: 'serene meditation',
    excerpt: 'Explore practical tips for mental well-being and building resilience in everyday life.',
    content: '<p>Mental health is as important as physical health. This article discusses various techniques like mindfulness, stress management, and seeking support.</p>',
    category: 'Personal Growth',
    tags: ['mental health', 'mindfulness', 'well-being'],
  },
];

export const MOCK_TEAM_MEMBERS: TeamMember[] = [
  {
    id: '1',
    name: 'Eleanor Vance',
    role: 'Chief Editor & Visionary',
    imageUrl: 'https://placehold.co/300x300.png',
    imageHint: 'professional woman',
    bio: 'Eleanor drives the creative direction of MuseBlog, ensuring every piece inspires and enlightens.',
  },
  {
    id: '2',
    name: 'Marcus Chen',
    role: 'Lead Technology Architect',
    imageUrl: 'https://placehold.co/300x300.png',
    imageHint: 'man coding',
    bio: 'Marcus is the brain behind MuseBlog\'s sleek design and seamless user experience.',
  },
  {
    id: '3',
    name: 'Sophia Lorenzi',
    role: 'Head of Community Engagement',
    imageUrl: 'https://placehold.co/300x300.png',
    imageHint: 'woman smiling',
    bio: 'Sophia fosters a vibrant community, connecting readers and writers on MuseBlog.',
  },
];

export const MOCK_SUBSCRIBERS: { id: string; email: string; subscribedAt: string }[] = [
  { id: 'sub1', email: 'subscriber1@example.com', subscribedAt: '2024-07-01T10:00:00Z' },
  { id: 'sub2', email: 'another.fan@example.com', subscribedAt: '2024-07-05T14:30:00Z' },
  { id: 'sub3', email: 'avidreader@example.net', subscribedAt: '2024-07-10T09:15:00Z' },
];

export const SITE_NAME = "MuseBlog";
export const SITE_DESCRIPTION = "Discover engaging articles and stories on MuseBlog. A modern blogging platform designed for creative inspiration and thoughtful discussions.";
