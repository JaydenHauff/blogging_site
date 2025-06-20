
import type {Metadata} from 'next';
import './globals.css';
import { MainLayout } from '@/components/layout/main-layout';
import { Belleza, Alegreya } from 'next/font/google';

const belleza = Belleza({
  weight: '400',
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-belleza',
});

const alegreya = Alegreya({
  subsets: ['latin'],
  style: ['normal', 'italic'],
  weight: ['400', '500', '600', '700', '800', '900'],
  display: 'swap',
  variable: '--font-alegreya',
});

export const metadata: Metadata = {
  title: 'MuseBlog - Your Source for Creative Inspiration',
  description: 'Discover engaging articles and stories on MuseBlog. A modern blogging platform.',
  keywords: ['blog', 'articles', 'creative writing', 'inspiration', 'modern blog'],
  openGraph: {
    title: 'MuseBlog - Your Source for Creative Inspiration',
    description: 'Discover engaging articles and stories on MuseBlog.',
    type: 'website',
    // images: [{ url: '/og-image.png' }], // Replace with actual OG image URL
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${belleza.variable} ${alegreya.variable} scroll-smooth`} suppressHydrationWarning={true}>
      <head>
        {/* Removed direct Google Font links, handled by next/font */}
      </head>
      <body className="font-body antialiased">
        <MainLayout>
          {children}
        </MainLayout>
      </body>
    </html>
  );
}
