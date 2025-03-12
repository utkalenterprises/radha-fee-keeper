
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Bell, Menu, X } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

const Header: React.FC = () => {
  const location = useLocation();
  const isMobile = useIsMobile();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const navigation = [
    { name: 'Dashboard', path: '/' },
    { name: 'Members', path: '/members' },
    { name: 'Collections', path: '/collections' },
    { name: 'Reminders', path: '/reminders' },
    { name: 'Reports', path: '/reports' },
  ];

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu when changing routes
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-in-out',
        scrolled 
          ? 'bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg shadow-sm py-2'
          : 'bg-transparent py-4'
      )}
    >
      <div className="container mx-auto flex items-center justify-between px-4">
        <div className="flex items-center space-x-2">
          <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
            Radha Giridhari
          </span>
          <span className="text-sm font-medium text-muted-foreground">Sevaashram</span>
        </div>

        {isMobile ? (
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </Button>
        ) : (
          <nav className="flex items-center space-x-6">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className={cn(
                  'nav-link transition-all duration-200',
                  location.pathname === item.path ? 'active' : ''
                )}
              >
                {item.name}
              </Link>
            ))}
            <Button size="icon" variant="ghost" className="ml-2 relative">
              <Bell size={20} />
              <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] text-white">
                3
              </span>
            </Button>
          </nav>
        )}

        {/* Mobile Menu */}
        {isMobile && (
          <div
            className={cn(
              'fixed inset-0 bg-background/80 backdrop-blur-sm z-50 transition-all duration-300 ease-in-out',
              isMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
            )}
          >
            <div className="container h-full flex flex-col pt-20 pb-6 px-6">
              <nav className="flex flex-col space-y-4">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    to={item.path}
                    className={cn(
                      'text-lg py-3 border-b border-border',
                      location.pathname === item.path ? 'text-primary font-medium' : 'text-foreground'
                    )}
                  >
                    {item.name}
                  </Link>
                ))}
              </nav>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
