import React from 'react';
import { MedicalSidebar } from './MedicalSidebar';
import { ThemeToggle } from './ThemeToggle';
import { Button } from '../ui/button';
import { UserCircle } from 'lucide-react';
import { NotificationButton } from '../notifications/NotificationButton';

interface MedicalLayoutProps {
  children: React.ReactNode;
}

export function MedicalLayout({ children }: MedicalLayoutProps) {
  return (
    <div className="flex min-h-screen w-full bg-background text-foreground">
      {/* Sidebar */}
      <div className="hidden lg:flex lg:w-72 lg:flex-col">
        <MedicalSidebar />
      </div>

      {/* Main Content */}
      <div className="flex flex-1 flex-col">
        {/* Header */}
        <header className="flex items-center justify-between px-6 py-4 border-b border-border">
          {/* Mobile Header */}
          <div className="flex items-center gap-3 lg:hidden">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg medical-gradient">
              <span className="text-sm font-bold text-white">M</span>
            </div>
            <h1 className="text-lg font-semibold">MedAssist Pro</h1>
          </div>

          {/* Desktop Header */}
          <div className="hidden lg:flex items-center gap-4">
            {/* You can add breadcrumbs or page titles here */}
          </div>

          <div className="flex items-center gap-4">
            <NotificationButton />
            <ThemeToggle />
            <Button variant="ghost" size="icon">
              <UserCircle className="w-6 h-6" />
            </Button>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-6">
          {children}
        </main>
      </div>
    </div>
  );
}