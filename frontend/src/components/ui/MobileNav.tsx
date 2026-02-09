'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

interface MobileNavProps {
  userEmail?: string;
  onLogout: () => void;
}

export default function MobileNav({ userEmail, onLogout }: MobileNavProps) {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  return (
    <div className="md:hidden">
      {/* Mobile menu button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex items-center justify-center p-2 rounded-md text-text-primary dark:text-text-primary hover:bg-bg-surface dark:hover:bg-bg-surface focus:outline-none focus:ring-2 focus:ring-inset focus:ring-accent-primary dark:focus:ring-accent-primary min-h-[44px] min-w-[44px]"
        aria-expanded="false"
      >
        <span className="sr-only">Open main menu</span>
        {!isOpen ? (
          <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        ) : (
          <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        )}
      </button>

      {/* Mobile menu panel */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/50 z-40"
            onClick={() => setIsOpen(false)}
          />

          {/* Slide-in panel */}
          <div className="fixed top-14 left-0 right-0 bg-bg-card dark:bg-bg-card shadow-lg z-50 border-t border-border-default dark:border-border-default">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <div className="px-3 py-2 text-sm text-text-secondary dark:text-text-secondary border-b border-border-default dark:border-border-default">
                {userEmail}
              </div>
              <button
                onClick={() => {
                  setIsOpen(false);
                  router.push('/dashboard');
                }}
                className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-text-primary dark:text-text-primary hover:bg-accent-primary dark:hover:bg-accent-primary hover:text-white min-h-[44px]"
              >
                Dashboard
              </button>
              <button
                onClick={() => {
                  setIsOpen(false);
                  onLogout();
                }}
                className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-white bg-accent-danger dark:bg-accent-danger hover:opacity-90 min-h-[44px]"
              >
                Logout
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
