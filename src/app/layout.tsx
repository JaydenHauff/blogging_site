import type {Metadata} from 'next';
import './globals.css';
import { MainLayout } from '@/components/layout/main-layout';

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
    <html lang="en" className="scroll-smooth" suppressHydrationWarning={true}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Belleza&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Alegreya:ital,wght@0,400..900;1,400..900&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased">
        <MainLayout>
          {children}
        </MainLayout>
      </body>
    </html>
  );
}
