
import React from 'react';
import Header from './Header';
import { cn } from '@/lib/utils';

interface LayoutProps {
  children: React.ReactNode;
  className?: string;
}

const Layout: React.FC<LayoutProps> = ({ children, className }) => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className={cn('pt-24 pb-12 px-4 container mx-auto transition-all duration-300 ease-in-out animate-fade-in', className)}>
        {children}
      </main>
      <footer className="py-6 border-t border-border/30 mt-auto">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} Radha Giridhari Sevaashram. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
