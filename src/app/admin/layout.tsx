
import type React from 'react';
import Link from 'next/link';
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarTrigger,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarInset,
  SidebarGroup,
  SidebarGroupLabel,
} from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { BookOpenText, LayoutDashboard, Newspaper, Settings, Tags, Users, LogOut, MessageSquareText } from 'lucide-react';
import { SITE_NAME } from '@/lib/constants';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider defaultOpen>
      <Sidebar>
        <SidebarHeader className="p-4 border-b border-sidebar-border">
          <div className="flex items-center justify-between">
            <Link href="/admin/dashboard" className="flex items-center space-x-2 text-sidebar-primary hover:text-sidebar-accent transition-colors">
              <BookOpenText className="h-7 w-7" />
              <span className="text-2xl font-headline font-bold">{SITE_NAME} Admin</span>
            </Link>
            <SidebarTrigger className="md:hidden text-sidebar-foreground hover:text-sidebar-primary" />
          </div>
        </SidebarHeader>
        <SidebarContent className="p-0">
          <SidebarMenu className="gap-1 p-2">
            <SidebarMenuItem>
              <SidebarMenuButton asChild tooltip="Dashboard">
                <Link href="/admin/dashboard">
                  <LayoutDashboard />
                  <span>Dashboard</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            
            <SidebarGroup className="p-0 mt-2">
              <SidebarGroupLabel className="px-2 text-xs font-semibold text-sidebar-foreground/70">Blog Management</SidebarGroupLabel>
              <SidebarMenu className="gap-1 p-0 mt-1">
                <SidebarMenuItem>
                  <SidebarMenuButton asChild tooltip="Manage Posts">
                    <Link href="/admin/posts">
                      <Newspaper />
                      <span>Posts</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild tooltip="Manage Categories">
                    <Link href="/admin/categories">
                      <Tags />
                      <span>Categories</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                 <SidebarMenuItem>
                  <SidebarMenuButton asChild tooltip="Manage Comments">
                    <Link href="/admin/comments">
                      <MessageSquareText />
                      <span>Comments</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroup>

            <SidebarGroup className="p-0 mt-2">
              <SidebarGroupLabel className="px-2 text-xs font-semibold text-sidebar-foreground/70">User Management</SidebarGroupLabel>
              <SidebarMenu className="gap-1 p-0 mt-1">
                <SidebarMenuItem>
                  <SidebarMenuButton asChild tooltip="Manage Subscribers">
                    <Link href="/admin/subscribers">
                      <Users />
                      <span>Subscribers</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroup>
            
            <SidebarGroup className="p-0 mt-2">
              <SidebarGroupLabel className="px-2 text-xs font-semibold text-sidebar-foreground/70">Site</SidebarGroupLabel>
              <SidebarMenu className="gap-1 p-0 mt-1">
                <SidebarMenuItem>
                  <SidebarMenuButton asChild tooltip="Site Settings">
                    <Link href="/admin/settings">
                      <Settings />
                      <span>Site Settings</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroup>
          </SidebarMenu>
        </SidebarContent>
        <SidebarFooter className="p-4 border-t border-sidebar-border">
          <Button variant="ghost" className="w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground" disabled>
            <LogOut className="mr-2" />
            Logout (Placeholder)
          </Button>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset className="bg-background">
        <div className="p-4 md:p-6 lg:p-8">
          {children}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
