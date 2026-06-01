'use client';

import { Moon, Sun, Menu, LogOut, User } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import Link from 'next/link';

export function Header() {
  const { theme, setTheme } = useTheme();
  const { user, signOut, loading } = useAuth();
  const [mounted, setMounted] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Close user menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (showUserMenu && !target.closest('.user-menu-container')) {
        setShowUserMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showUserMenu]);

  if (!mounted) {
    return null;
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b backdrop-blur-header bg-black/80 dark:bg-black/80 border-[#2A2A2A] dark:border-[#2A2A2A]">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 max-w-[1280px]">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
          <div className="h-8 w-8 rounded-lg bg-[#008751] flex items-center justify-center">
            <span className="text-white font-bold text-lg">360</span>
          </div>
          <span className="text-xl font-bold text-white">
            Naija
          </span>
        </Link>

        {/* Actions */}
        <div className="flex items-center gap-4">
          {/* Theme Toggle */}
          <button
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="p-2 rounded-lg hover:bg-[#1A1A1A] transition-colors"
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? (
              <Sun className="h-5 w-5 text-[#A3A3A3]" />
            ) : (
              <Moon className="h-5 w-5 text-[#A3A3A3]" />
            )}
          </button>

          {/* Mobile Menu */}
          <button className="md:hidden p-2 rounded-lg hover:bg-[#1A1A1A] transition-colors">
            <Menu className="h-5 w-5 text-[#A3A3A3]" />
          </button>

          {/* User Menu or Login Button */}
          {loading ? (
            <div className="hidden md:block w-10 h-10 rounded-full bg-[#1A1A1A] animate-pulse" />
          ) : user ? (
            <div className="relative user-menu-container">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center gap-2 p-2 rounded-lg hover:bg-[#1A1A1A] transition-colors"
              >
                {user.photoURL ? (
                  <img
                    src={user.photoURL}
                    alt={user.displayName || 'User'}
                    className="h-8 w-8 rounded-full"
                  />
                ) : (
                  <div className="h-8 w-8 rounded-full bg-[#008751] flex items-center justify-center">
                    <User className="h-4 w-4 text-white" />
                  </div>
                )}
                <span className="hidden md:block text-sm font-medium text-[#A3A3A3]">
                  {user.displayName || user.email?.split('@')[0]}
                </span>
              </button>

              {/* User Dropdown Menu */}
              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-48 rounded-lg bg-[#1A1A1A] shadow-[0_8px_24px_rgba(0,0,0,0.5)] border border-[#2A2A2A] py-2 animate-scale-in">
                  <div className="px-4 py-2 border-b border-[#2A2A2A]">
                    <p className="text-sm font-medium text-white">
                      {user.displayName || 'User'}
                    </p>
                    <p className="text-xs text-[#737373] truncate">
                      {user.email}
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      signOut();
                      setShowUserMenu(false);
                    }}
                    className="w-full flex items-center gap-2 px-4 py-2 text-sm text-[#A3A3A3] hover:bg-[#0A0A0A] transition-colors"
                  >
                    <LogOut className="h-4 w-4" />
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link
              href="/login"
              className="hidden lg:block px-6 py-2.5 rounded-lg bg-[#008751] text-white font-semibold hover:bg-[#006B3F] transition-all hover:shadow-[0_4px_12px_rgba(0,135,81,0.3)] hover:-translate-y-0.5"
            >
              Login
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
