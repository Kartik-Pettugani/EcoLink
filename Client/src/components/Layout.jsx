import React, { useEffect, useState } from 'react';
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom';
import ThemeToggle from './ThemeToggle';
import { AnimatePresence, motion } from 'framer-motion';
import { useSelector } from 'react-redux';
import { Leaf, Menu, X } from 'lucide-react';
import useUnreadMessages from '../hooks/useUnreadMessages';

export default function Layout({ children }) {
  const location = useLocation();
  const userData = useSelector((s) => s.user.userData);
  const [open, setOpen] = useState(false);
  useEffect(() => { setOpen(false); }, [location.pathname]);
  const unreadMessages = useUnreadMessages();
  return (
    <div className="min-h-screen bg-(--bg) text-(--fg)">
      <header className="sticky top-0 z-50 border-b border-(--border) bg-(--card)/80 backdrop-blur-xl">
        <div className="container-app h-18 flex items-center justify-between">
          <Link to="/" className="inline-flex items-center gap-3 font-bold group">
            <div className="relative">
              <div className="absolute inset-0 bg-linear-to-r from-emerald-400 to-emerald-600 rounded-xl blur opacity-75 group-hover:opacity-100 transition-opacity"></div>
              <div className="relative bg-linear-to-r from-emerald-500 to-emerald-600 p-2 rounded-xl">
                <Leaf className="h-6 w-6 text-white" />
              </div>
            </div>
            <span className="text-2xl gradient-text font-extrabold">EcoLink</span>
          </Link>
          <nav className="hidden md:flex items-center gap-1">
            {userData ? (
              <>
                <NavLink 
                  to="/browse" 
                  className={({isActive}) => `px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                    isActive 
                      ? 'bg-linear-to-r from-emerald-500 to-emerald-600 text-white shadow-lg shadow-emerald-500/25' 
                      : 'text-(--fg) hover:bg-(--surface-hover) hover:text-(--brand)'
                  }`}
                >
                  Browse
                </NavLink>
                <NavLink 
                  to="/post-item" 
                  className={({isActive}) => `px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                    isActive 
                      ? 'bg-linear-to-r from-emerald-500 to-emerald-600 text-white shadow-lg shadow-emerald-500/25' 
                      : 'text-(--fg) hover:bg-(--surface-hover) hover:text-(--brand)'
                  }`}
                >
                  Post Item
                </NavLink>
                <NavLink 
                  to="/dashboard" 
                  className={({isActive}) => `px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                    isActive 
                      ? 'bg-linear-to-r from-emerald-500 to-emerald-600 text-white shadow-lg shadow-emerald-500/25' 
                      : 'text-(--fg) hover:bg-(--surface-hover) hover:text-(--brand)'
                  }`}
                >
                  Dashboard
                </NavLink>
                <NavLink 
                  to="/home" 
                  className={({isActive}) => `px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                    isActive 
                      ? 'bg-linear-to-r from-emerald-500 to-emerald-600 text-white shadow-lg shadow-emerald-500/25' 
                      : 'text-(--fg) hover:bg-(--surface-hover) hover:text-(--brand)'
                  }`}
                >
                  Home
                </NavLink>
                <NavLink 
                  to="/messages" 
                  className={({isActive}) => `px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 relative ${
                    isActive 
                      ? 'bg-linear-to-r from-emerald-500 to-emerald-600 text-white shadow-lg shadow-emerald-500/25' 
                      : 'text-(--fg) hover:bg-(--surface-hover) hover:text-(--brand)'
                  }`}
                >
                  Messages
                  {unreadMessages > 0 && (
                    <span className="absolute -top-2 -right-2 bg-emerald-500 text-white text-xs rounded-full px-2 py-0.5 shadow font-bold">{unreadMessages}</span>
                  )}
                </NavLink>
                <NavLink 
                  to="/profile" 
                  className={({isActive}) => `px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                    isActive 
                      ? 'bg-linear-to-r from-emerald-500 to-emerald-600 text-white shadow-lg shadow-emerald-500/25' 
                      : 'text-(--fg) hover:bg-(--surface-hover) hover:text-(--brand)'
                  }`}
                >
                  Profile
                </NavLink>
              </>
            ) : (
              <>
                <NavLink 
                  to="/signin" 
                  className={({isActive}) => `px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                    isActive 
                      ? 'bg-linear-to-r from-emerald-500 to-emerald-600 text-white shadow-lg shadow-emerald-500/25'
                      : 'text-(--fg) hover:bg-(--surface-hover) hover:text-(--brand)'
                  }`}
                >
                  Sign In
                </NavLink>
              </>
            )}
          </nav>
          <div className="flex items-center gap-3">
            {!userData && (
              <Link 
                to="/signup" 
                className="hidden sm:inline-flex btn btn-primary btn-sm"
              >
                Get Started
              </Link>
            )}
            <ThemeToggle />
            <button 
              aria-label="Open menu" 
              className="md:hidden btn btn-outline btn-sm p-2" 
              onClick={() => setOpen((v)=>!v)}
            >
              {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="md:hidden border-b border-(--border) bg-(--card)/95 backdrop-blur-xl"
          >
            <div className="container-app py-4 flex flex-col gap-1">
              {userData ? (
                <>
                  <NavLink 
                    to="/browse" 
                    className="px-4 py-3 rounded-xl text-sm font-medium text-(--fg) hover:bg-(--surface-hover) hover:text-(--brand) transition-all duration-200"
                  >
                    Browse Items
                  </NavLink>
                  <NavLink 
                    to="/post-item" 
                    className="px-4 py-3 rounded-xl text-sm font-medium text-(--fg) hover:bg-(--surface-hover) hover:text-(--brand) transition-all duration-200"
                  >
                    Post Item
                  </NavLink>
                  <NavLink 
                    to="/dashboard" 
                    className="px-4 py-3 rounded-xl text-sm font-medium text-(--fg) hover:bg-(--surface-hover) hover:text-(--brand) transition-all duration-200"
                  >
                    Dashboard
                  </NavLink>
                  <NavLink 
                    to="/home" 
                    className="px-4 py-3 rounded-xl text-sm font-medium text-(--fg) hover:bg-(--surface-hover) hover:text-(--brand) transition-all duration-200"
                  >
                    Home
                  </NavLink>
                  <NavLink 
                    to="/messages" 
                    className="px-4 py-3 rounded-xl text-sm font-medium text-(--fg) hover:bg-(--surface-hover) hover:text-(--brand) transition-all duration-200 relative"
                  >
                    Messages
                    {unreadMessages > 0 && (
                      <span className="absolute -top-2 -right-2 bg-emerald-500 text-white text-xs rounded-full px-2 py-0.5 shadow font-bold">{unreadMessages}</span>
                    )}
                  </NavLink>
                  <NavLink 
                    to="/profile" 
                    className="px-4 py-3 rounded-xl text-sm font-medium text-(--fg) hover:bg-(--surface-hover) hover:text-(--brand) transition-all duration-200"
                  >
                    Profile
                  </NavLink>
                </>
              ) : (
                <>
                  <NavLink 
                    to="/signin" 
                    className="px-4 py-3 rounded-xl text-sm font-medium text-(--fg) hover:bg-(--surface-hover) hover:text-(--brand) transition-all duration-200"
                  >
                    Sign In
                  </NavLink>
                  <NavLink 
                    to="/signup" 
                    className="px-4 py-3 rounded-xl text-sm font-medium bg-linear-to-r from-emerald-500 to-emerald-600 text-white hover:from-emerald-600 hover:to-emerald-700 transition-all duration-200"
                  >
                    Get Started
                  </NavLink>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <main className="container-app py-12">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
          >
            {children ?? <Outlet />}
          </motion.div>
        </AnimatePresence>
      </main>

      <footer className="mt-20 border-t border-(--border) bg-(--card)/50 backdrop-blur-sm">
        <div className="container-app py-12">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-3">
              <div className="bg-linear-to-r from-emerald-500 to-emerald-600 p-2 rounded-xl">
                <Leaf className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold gradient-text">EcoLink</span>
            </div>
            <div className="text-sm text-(--muted) text-center md:text-right">
              <p>© 2025 EcoLink. Building sustainable communities together.</p>
              <p className="mt-1">Made with 🌱 for a greener future</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
