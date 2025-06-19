
import type React from 'react';

export default function EditPostLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // This layout can be customized for the "Edit Post" page if needed
  // For now, it will inherit from the main AdminLayout
  return <>{children}</>;
}
