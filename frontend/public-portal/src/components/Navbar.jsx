import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Briefcase, Bookmark, User, LogOut, LogIn, Menu, X, Sun, Moon } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { Button, Avatar } from '@heroui/react';
import LoginModal from './navbar/LoginModal';
import RegisterModal from './navbar/RegisterModal';
import { useProfile } from '../hooks/useProfile';
import api from '../services/api';

export const ApplyDriveLogo = ({ className = "h-8 w-8" }) => (
  <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={`${className} text-zinc-950 dark:text-zinc-50`}>
    <rect width="100" height="100" rx="24" fill="currentColor" />
    <path d="M50 22L26 70H38L50 44L62 70H74L50 22Z" fill="white" className="dark:fill-zinc-950" />
    <rect x="30" y="76" width="40" height="6" rx="3" fill="white" className="dark:fill-zinc-950" />
  </svg>
);

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = React.useState(false);
  const { theme, toggleTheme } = useTheme();

  // Authentication status
  const user = JSON.parse(localStorage.getItem('user'));
  const isLoggedIn = !!localStorage.getItem('user');

  // Fetch profile details via react-query to keep picture in sync
  const { data: profile } = useProfile(isLoggedIn);

  const displayName = profile?.fullName || user?.fullName || '';
  const displayEmail = profile?.email || user?.email || '';
  const displayPic = profile?.profileImageUrl || user?.profileImageUrl || '';

  // Modal open states
  const [isLoginOpen, setIsLoginOpen] = React.useState(false);
  const [isRegisterOpen, setIsRegisterOpen] = React.useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = React.useState(false);

  React.useEffect(() => {
    const handleOpenLogin = () => setIsLoginOpen(true);
    window.addEventListener('open-login-modal', handleOpenLogin);
    return () => window.removeEventListener('open-login-modal', handleOpenLogin);
  }, []);

  const handleLogout = async () => {
    try {
      await api.post('/auth/logout');
    } catch (err) {
      console.error('Logout error', err);
    }
    localStorage.removeItem('user');
    navigate('/');
    window.location.reload();
  };

  const switchToRegister = () => {
    setIsLoginOpen(false);
    setIsRegisterOpen(true);
  };

  const switchToLogin = () => {
    setIsRegisterOpen(false);
    setIsLoginOpen(true);
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="bg-white/85 dark:bg-zinc-950/80 backdrop-blur-md border-b border-zinc-200 dark:border-zinc-800/80 sticky top-0 z-50 transition-colors">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-3">
              <ApplyDriveLogo className="h-9 w-9 pointer-events-none" />
              <span className="font-bold text-lg text-zinc-900 dark:text-white tracking-tight">ApplyDrive</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            
            <Link to="/" className={`flex items-center space-x-1.5 py-1.5 px-3 rounded-md text-xs font-semibold tracking-wide transition ${
              isActive('/') 
                ? 'text-zinc-900 bg-zinc-100 dark:text-zinc-50 dark:bg-zinc-800/80 border border-zinc-200 dark:border-zinc-700/50' 
                : 'text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white hover:bg-zinc-50 dark:hover:bg-zinc-900/50 border border-transparent'
            }`}>
              <Briefcase className="h-3.5 w-3.5" />
              <span>Jobs</span>
            </Link>

            

            <Link 
              to="/saved-jobs" 
              onClick={(e) => {
                if (!isLoggedIn) {
                  e.preventDefault();
                  setIsLoginOpen(true);
                }
              }}
              className={`flex items-center space-x-1.5 py-1.5 px-3 rounded-md text-xs font-semibold tracking-wide transition ${
                isActive('/saved-jobs') 
                  ? 'text-zinc-900 bg-zinc-100 dark:text-zinc-50 dark:bg-zinc-800/80 border border-zinc-200 dark:border-zinc-700/50' 
                  : 'text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white hover:bg-zinc-50 dark:hover:bg-zinc-900/50 border border-transparent'
              }`}
            >
              <Bookmark className="h-3.5 w-3.5" />
              <span>Saved Drives</span>
            </Link>

            <Link 
              to="/about"
              className={`flex items-center space-x-1.5 py-1.5 px-3 rounded-md text-xs font-semibold tracking-wide transition ${
                isActive('/about') 
                  ? 'text-zinc-900 bg-zinc-100 dark:text-zinc-50 dark:bg-zinc-800/80 border border-zinc-200 dark:border-zinc-700/50' 
                  : 'text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white hover:bg-zinc-50 dark:hover:bg-zinc-900/50 border border-transparent'
              }`}
            >
              About
            </Link>

            {/* Light/Dark Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-md border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-900 transition"
              aria-label="Toggle theme"
            >
              {theme === 'light' ? <Moon className="h-3.5 w-3.5" /> : <Sun className="h-3.5 w-3.5" />}
            </button>

            {isLoggedIn ? (
              <div className="relative">
                <button 
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center space-x-1.5 focus:outline-none py-1"
                >
                  <Avatar 
                    src={displayPic} 
                    name={displayName} 
                    size="sm" 
                    className="h-8 w-8 text-xs border border-zinc-200 dark:border-zinc-800 cursor-pointer pointer-events-none hover:opacity-90 transition rounded-full" 
                  />
                </button>
                
                {isDropdownOpen && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setIsDropdownOpen(false)} />
                    <div className="absolute right-0 mt-2 w-52 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-md shadow-md py-1.5 z-50 transition-all font-sans">
                      <div className="px-3 py-2 border-b border-zinc-200 dark:border-zinc-800/80">
                        <p className="text-xs font-bold text-zinc-900 dark:text-white truncate">{displayName}</p>
                        <p className="text-[10px] text-zinc-500 dark:text-zinc-400 truncate mt-0.5">{displayEmail}</p>
                      </div>
                      
                      <div className="p-1 space-y-0.5">
                        <Link 
                          to="/profile"
                          onClick={() => setIsDropdownOpen(false)}
                          className="flex items-center space-x-2 w-full text-left px-2 py-1.5 text-xs text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-900 rounded transition font-semibold"
                        >
                          <User className="h-3.5 w-3.5" />
                          <span>My Profile</span>
                        </Link>
                        
                        <Link 
                          to="/saved-jobs"
                          onClick={() => setIsDropdownOpen(false)}
                          className="flex items-center space-x-2 w-full text-left px-2 py-1.5 text-xs text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-900 rounded transition font-semibold"
                        >
                          <Bookmark className="h-3.5 w-3.5" />
                          <span>Saved Drives</span>
                        </Link>
                      </div>
                      
                      <div className="border-t border-zinc-200 dark:border-zinc-800/85 p-1 mt-1">
                        <button 
                          onClick={() => {
                            setIsDropdownOpen(false);
                            handleLogout();
                          }}
                          className="flex items-center space-x-2 w-full text-left px-2 py-1.5 text-xs text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition font-bold"
                        >
                          <LogOut className="h-3.5 w-3.5" />
                          <span>Logout</span>
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Button 
                  onPress={() => setIsLoginOpen(true)}
                  className="font-semibold text-xs text-white dark:text-zinc-900 bg-zinc-900 hover:bg-zinc-900/90 dark:bg-zinc-50 dark:hover:bg-zinc-50/90 shadow h-8 rounded-md px-4"
                  startContent={<LogIn className="h-3.5 w-3.5" />}
                >
                  Sign In
                </Button>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center space-x-2.5 md:hidden">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-md border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-900 transition"
              aria-label="Toggle theme"
            >
              {theme === 'light' ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
            </button>

            {isLoggedIn && (
              <Link to="/profile">
                <Avatar 
                  src={displayPic} 
                  name={displayName} 
                  size="sm" 
                  className="h-8 w-8 text-xs border border-zinc-200 dark:border-zinc-800 cursor-pointer rounded-full" 
                />
              </Link>
            )}

            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white p-2 rounded-md border border-zinc-200 dark:border-zinc-800"
              aria-label="Toggle menu"
            >
              {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {isOpen && (
        <div className="md:hidden bg-white dark:bg-zinc-950 border-t border-zinc-200 dark:border-zinc-800 px-4 pt-2 pb-4 space-y-1 shadow-lg transition-colors">
          {isLoggedIn && (
            <div className="flex items-center space-x-3 px-3 py-3 mb-2 border-b border-zinc-200 dark:border-zinc-800">
              <Avatar 
                src={displayPic} 
                name={displayName} 
                size="sm" 
                className="h-9 w-9 text-xs border border-zinc-200 dark:border-zinc-800 rounded-full" 
              />
              <div className="min-w-0 flex-1">
                <p className="text-xs font-bold text-zinc-900 dark:text-white truncate">{displayName}</p>
                <p className="text-[10px] text-zinc-500 dark:text-zinc-400 truncate mt-0.5">{displayEmail}</p>
              </div>
            </div>
          )}

          <Link
            to="/"
            onClick={() => setIsOpen(false)}
            className="flex items-center space-x-2 py-2.5 px-3 rounded-md text-sm font-medium text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-900"
          >
            <Briefcase className="h-4 w-4 text-zinc-500" />
            <span>Browse Jobs</span>
          </Link>

          <Link
            to="/about"
            onClick={() => setIsOpen(false)}
            className={`flex items-center space-x-2 py-2.5 px-3 rounded-md text-sm font-medium transition ${
              isActive('/about')
                ? 'text-zinc-900 bg-zinc-100 dark:text-zinc-50 dark:bg-zinc-800/80 border border-zinc-200 dark:border-zinc-700/50 font-bold'
                : 'text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-900'
            }`}
          >
            <Briefcase className="h-4 w-4 text-zinc-500" />
            <span>About</span>
          </Link>

          <Link
            to="/saved-jobs"
            onClick={(e) => {
              setIsOpen(false);
              if (!isLoggedIn) {
                e.preventDefault();
                setIsLoginOpen(true);
              }
            }}
            className="flex items-center space-x-2 py-2.5 px-3 rounded-md text-sm font-medium text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-900"
          >
            <Bookmark className="h-4 w-4 text-zinc-500" />
            <span>Saved Drives</span>
          </Link>

          {isLoggedIn ? (
            <>
              <Link
                to="/profile"
                onClick={() => setIsOpen(false)}
                className="flex items-center space-x-2 py-2.5 px-3 rounded-md text-sm font-medium text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-900"
              >
                <User className="h-4 w-4 text-zinc-500" />
                <span>My Profile</span>
              </Link>

              <button
                onClick={() => {
                  setIsOpen(false);
                  handleLogout();
                }}
                className="flex w-full items-center space-x-2 py-2.5 px-3 rounded-md text-sm font-medium text-red-650 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
              >
                <LogOut className="h-4 w-4" />
                <span>Sign Out</span>
              </button>
            </>
          ) : (
            <div className="pt-4 border-t border-zinc-200 dark:border-zinc-800">
              <button
                onClick={() => {
                  setIsOpen(false);
                  setIsLoginOpen(true);
                }}
                className="flex w-full justify-center items-center py-2.5 rounded-md text-xs font-semibold text-white dark:text-zinc-900 bg-zinc-900 hover:bg-zinc-900/90 dark:bg-zinc-50 dark:hover:bg-zinc-50/90 shadow-sm"
              >
                Sign In
              </button>
            </div>
          )}
        </div>
      )}

      <LoginModal isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} switchToRegister={switchToRegister} />
      <RegisterModal isOpen={isRegisterOpen} onClose={() => setIsRegisterOpen(false)} switchToLogin={switchToLogin} />
    </nav>
  );
}
