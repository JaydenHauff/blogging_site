
import type React from 'react';

export default function CreatePostLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // This layout can be customized for the "Create New Post" page if needed
  // For now, it will inherit from the main AdminLayout
  return <>{children}</>;
}
