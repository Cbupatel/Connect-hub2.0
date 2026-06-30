/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { ActiveTab } from '../types';
import { auth, signInWithGoogle, logoutUser } from '../lib/firebase';

interface NavbarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  onOpenRegister: () => void;
  onOpenAuth: () => void;
}

export default function Navbar({ activeTab, setActiveTab, onOpenRegister, onOpenAuth }: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(auth.currentUser);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setCurrentUser(user);
    });
    return () => unsubscribe();
  }, []);

  const navLinks: { id: ActiveTab; label: string }[] = [
    { id: 'find-coaches', label: 'Find Coaches' },
    { id: 'find-players', label: 'Find Players' },
    { id: 'training-plans', label: 'Training Plans' },
    { id: 'about-us', label: 'About Us' },
  ];

  if (currentUser) {
    navLinks.push({ id: 'profile', label: 'My Profile' });
  }

  return (
    <nav className="bg-surface-container/80 backdrop-blur-md fixed top-0 left-0 right-0 z-50 h-20 flex items-center border-b border-outline-variant shadow-lg">
      <div className="flex justify-between items-center w-full px-10 max-w-7xl mx-auto h-20">
        {/* Logo */}
        <div 
          onClick={() => setActiveTab('home')} 
          className="flex items-center gap-3 cursor-pointer select-none group"
          id="nav_logo"
        >
          <div className="bg-secondary-fixed/10 text-secondary-fixed p-1.5 rounded-xl group-hover:rotate-12 transition-transform duration-300">
            <span className="material-symbols-outlined align-middle text-2xl font-bold" style={{ fontVariationSettings: "'FILL' 1" }}>sports_soccer</span>
          </div>
          <span className="font-display text-2xl text-white font-extrabold tracking-tight">Connect<span className="text-secondary-fixed">Hub</span></span>
        </div>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <button
              key={link.id}
              onClick={() => {
                setActiveTab(link.id);
                setMobileMenuOpen(false);
              }}
              id={`nav_link_${link.id}`}
              className={`font-display text-xs font-bold tracking-wider uppercase pb-1 transition-all cursor-pointer ${
                activeTab === link.id
                  ? 'text-secondary-fixed border-b-2 border-secondary-fixed'
                  : 'text-on-surface-variant hover:text-white'
              }`}
            >
              {link.label}
            </button>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3">
          {currentUser ? (
            <div 
              onClick={() => setActiveTab('profile')}
              id="nav_avatar_capsule"
              className="flex items-center gap-2 bg-surface-container-low p-1 rounded-xl border border-outline-variant select-none cursor-pointer hover:border-secondary-fixed transition-all"
            >
              <img
                src={currentUser.photoURL || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=150'}
                alt="User avatar"
                referrerPolicy="no-referrer"
                className="w-7 h-7 rounded-lg object-cover"
              />
              <span className="text-white text-[10px] font-bold font-sans hidden sm:inline-block max-w-[80px] truncate">
                {currentUser.displayName?.split(' ')[0] || 'Athlete'}
              </span>
              <button
                onClick={logoutUser}
                title="Sign Out"
                className="text-on-surface-variant hover:text-red-400 transition-colors cursor-pointer flex items-center justify-center p-1"
                aria-label="Sign Out"
              >
                <span className="material-symbols-outlined text-sm font-bold">logout</span>
              </button>
            </div>
          ) : (
            <button
              onClick={onOpenAuth}
              className="bg-surface-container-high hover:bg-surface-container-highest text-white border border-outline-variant px-3.5 py-2 rounded-xl font-display text-[10px] uppercase tracking-wider font-bold transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <svg className="w-3 h-3 fill-current text-secondary-fixed" viewBox="0 0 24 24">
                <path d="M12.24 10.285V14.4h6.887c-.648 2.41-2.519 4.114-5.136 4.114A5.53 5.53 0 0 1 8.4 13a5.53 5.53 0 0 1 5.59-5.513c1.47 0 2.8.5 3.84 1.487l3.193-3.193C18.985 3.793 16.63 3 14 3 7.925 3 3 7.925 3 14s4.925 11 11 11c6.51 0 10.51-4.51 10.51-10.714 0-.693-.075-1.357-.18-1.996L12.24 10.285Z" />
              </svg>
              <span>Sign In</span>
            </button>
          )}

          <button 
            onClick={onOpenRegister}
            id="nav_join_btn"
            className="bg-secondary-fixed text-primary px-5 py-2.5 rounded-xl font-display text-xs font-bold shadow-xl shadow-secondary-fixed/10 hover:brightness-110 transition-all active:scale-95 cursor-pointer"
          >
            Join Network
          </button>

          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden text-secondary-fixed flex items-center cursor-pointer"
            id="nav_menu_toggle"
          >
            <span className="material-symbols-outlined text-3xl">
              {mobileMenuOpen ? 'close' : 'menu'}
            </span>
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute top-20 left-0 right-0 bg-surface-container border-b border-outline-variant py-6 px-10 flex flex-col gap-6 shadow-2xl animate-fade-in z-50">
          {navLinks.map((link) => (
            <button
              key={link.id}
              onClick={() => {
                setActiveTab(link.id);
                setMobileMenuOpen(false);
              }}
              className={`text-left font-display text-sm font-bold tracking-wider uppercase py-2 transition-colors cursor-pointer ${
                activeTab === link.id
                  ? 'text-secondary-fixed border-l-4 border-secondary-fixed pl-4'
                  : 'text-on-surface-variant hover:text-white pl-0'
              }`}
            >
              {link.label}
            </button>
          ))}
        </div>
      )}
    </nav>
  );
}
