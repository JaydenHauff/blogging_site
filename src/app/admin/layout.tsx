import type React from 'react';
// For a real admin panel, you might want a different layout,
// but for now, we'll reuse the MainLayout or a simplified version.
// This ensures the admin page still gets basic structure like Toaster.
// Authentication and authorization would be handled by middleware.

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // Optionally, wrap with a specific AdminNav or Sidebar component here
    // For simplicity, just passing children through. Header/Footer from MainLayout will apply.
    <div className="bg-secondary/30 min-h-screen"> {/* Slightly different bg for admin area */}
      {children}
    </div>
  );
}
