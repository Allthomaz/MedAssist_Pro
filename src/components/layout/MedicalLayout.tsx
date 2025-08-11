import React from 'react';
import { MedicalSidebar } from './MedicalSidebar';

interface MedicalLayoutProps {
  children: React.ReactNode;
}

export function MedicalLayout({ children }: MedicalLayoutProps) {
  return (
    <div className="flex min-h-screen w-full bg-background">
      {/* Sidebar */}
      <div className="hidden lg:flex lg:w-72 lg:flex-col">
        <MedicalSidebar />
      </div>

      {/* Main Content */}
      <div className="flex flex-1 flex-col">
        {/* Header */}
        <header className="flex items-center justify-between px-6 py-4 bg-card border-b border-border lg:hidden">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg medical-gradient">
              <span className="text-sm font-bold text-white">M</span>
            </div>
            <h1 className="text-lg font-semibold">MedAssist Pro</h1>
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