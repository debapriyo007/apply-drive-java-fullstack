import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link, useNavigate, useLocation } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import JobManagement from './pages/JobManagement';
import CompanyManagement from './pages/CompanyManagement';
import UserManagement from './pages/UserManagement';
import api from './services/api';
import Login from './pages/Login';
import { Briefcase, Users, LayoutDashboard, Building2, LogOut, ChevronRight, Sun, Moon, Menu, X } from 'lucide-react';
import { useTheme } from './context/ThemeContext';
import { Button } from '@heroui/react';

const ApplyDriveLogo = ({ className = "h-7 w-7" }) => (
  <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={`${className} text-zinc-950 dark:text-zinc-50`}>
    <rect width="100" height="100" rx="24" fill="currentColor" />
    <path d="M50 22L26 70H38L50 44L62 70H74L50 22Z" fill="white" className="dark:fill-zinc-950" />
    <rect x="30" y="76" width="40" height="6" rx="3" fill="white" className="dark:fill-zinc-950" />
  </svg>
);

const AdminProtectedRoute = ({ children }) => {
  const user = localStorage.getItem('adminUser');
  return user ? children : <Navigate to="/login" replace />;
};

function SidebarLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);

  const handleLogout = async () => {
    try {
      await api.post('/admin/auth/logout');
    } catch (err) {
      console.error('Logout error', err);
    }
    localStorage.removeItem('adminUser');
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  const handleNavLinkClick = () => {
    setIsSidebarOpen(false);
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 transition-colors duration-200 font-sans">
      {/* Mobile Top Header */}
      <header className="flex items-center justify-between h-14 px-4 bg-white dark:bg-zinc-950 border-b border-zinc-200 dark:border-zinc-800 md:hidden transition-colors flex-shrink-0">
        <div className="flex items-center space-x-2.5">
          <button 
            onClick={() => setIsSidebarOpen(true)}
            className="p-1.5 rounded-md border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-900 transition"
            aria-label="Open sidebar"
          >
            <Menu className="h-5 w-5" />
          </button>
          <span className="font-bold text-sm text-zinc-950 dark:text-white tracking-tight">ApplyDrive Admin</span>
        </div>
        <ApplyDriveLogo className="h-7 w-7 pointer-events-none" />
      </header>

      {/* Sidebar Overlay Backdrop for Mobile */}
      {isSidebarOpen && (
        <div 
          onClick={() => setIsSidebarOpen(false)} 
          className="fixed inset-0 z-40 bg-zinc-950/45 dark:bg-black/60 md:hidden transition-opacity"
        />
      )}

      {/* Sidebar Drawer */}
      <aside 
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-zinc-950 border-r border-zinc-200 dark:border-zinc-800 flex flex-col transition-transform duration-200 ease-in-out md:relative md:translate-x-0 ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="p-5 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <ApplyDriveLogo className="h-8 w-8 pointer-events-none" />
            <span className="font-bold text-sm text-zinc-950 dark:text-white tracking-tight">ApplyDrive Admin</span>
          </div>
          <button
            onClick={() => setIsSidebarOpen(false)}
            className="p-1 rounded-md text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-900 md:hidden"
            aria-label="Close sidebar"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <nav className="flex-grow p-4 space-y-1.5">
          <Link
            to="/"
            onClick={handleNavLinkClick}
            className={`flex items-center justify-between p-2.5 rounded-md text-xs font-semibold tracking-wide transition ${
              isActive('/') 
                ? 'bg-zinc-100 dark:bg-zinc-800/80 text-zinc-900 dark:text-zinc-50 border border-zinc-200 dark:border-zinc-700/50' 
                : 'text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white hover:bg-zinc-50 dark:hover:bg-zinc-900/50 border border-transparent'
            }`}
          >
            <div className="flex items-center space-x-3.5">
              <LayoutDashboard className="h-4 w-4" />
              <span>Dashboard</span>
            </div>
            <ChevronRight className="h-3.5 w-3.5" />
          </Link>

          <Link
            to="/jobs"
            onClick={handleNavLinkClick}
            className={`flex items-center justify-between p-2.5 rounded-md text-xs font-semibold tracking-wide transition ${
              isActive('/jobs') 
                ? 'bg-zinc-100 dark:bg-zinc-800/80 text-zinc-900 dark:text-zinc-50 border border-zinc-200 dark:border-zinc-700/50' 
                : 'text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white hover:bg-zinc-50 dark:hover:bg-zinc-900/50 border border-transparent'
            }`}
          >
            <div className="flex items-center space-x-3.5">
              <Briefcase className="h-4 w-4" />
              <span>Jobs Management</span>
            </div>
            <ChevronRight className="h-3.5 w-3.5" />
          </Link>

          <Link
            to="/companies"
            onClick={handleNavLinkClick}
            className={`flex items-center justify-between p-2.5 rounded-md text-xs font-semibold tracking-wide transition ${
              isActive('/companies') 
                ? 'bg-zinc-100 dark:bg-zinc-800/80 text-zinc-900 dark:text-zinc-50 border border-zinc-200 dark:border-zinc-700/50' 
                : 'text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white hover:bg-zinc-50 dark:hover:bg-zinc-900/50 border border-transparent'
            }`}
          >
            <div className="flex items-center space-x-3.5">
              <Building2 className="h-4 w-4" />
              <span>Companies Setup</span>
            </div>
            <ChevronRight className="h-3.5 w-3.5" />
          </Link>

          <Link
            to="/users"
            onClick={handleNavLinkClick}
            className={`flex items-center justify-between p-2.5 rounded-md text-xs font-semibold tracking-wide transition ${
              isActive('/users') 
                ? 'bg-zinc-100 dark:bg-zinc-800/80 text-zinc-900 dark:text-zinc-50 border border-zinc-200 dark:border-zinc-700/50' 
                : 'text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white hover:bg-zinc-50 dark:hover:bg-zinc-900/50 border border-transparent'
            }`}
          >
            <div className="flex items-center space-x-3.5">
              <Users className="h-4 w-4" />
              <span>Student Accounts</span>
            </div>
            <ChevronRight className="h-3.5 w-3.5" />
          </Link>
        </nav>

        <div className="p-4 border-t border-zinc-200 dark:border-zinc-800 flex flex-col space-y-2">
          <Button
            onPress={toggleTheme}
            variant="light"
            className="flex items-center justify-start space-x-3.5 w-full p-2.5 h-auto rounded-md text-xs font-semibold tracking-wide transition text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-900 border border-zinc-200 dark:border-zinc-800/60"
            startContent={theme === 'light' ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
          >
            {theme === 'light' ? 'Dark Mode' : 'Light Mode'}
          </Button>

          <Button
            onPress={handleLogout}
            variant="light"
            className="flex items-center justify-start space-x-3.5 w-full p-2.5 h-auto rounded-md text-xs font-semibold tracking-wide text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/20 transition border border-transparent"
            startContent={<LogOut className="h-4 w-4" />}
          >
            Sign Out
          </Button>
        </div>
      </aside>

      {/* Main Content Pane */}
      <main className="flex-grow bg-zinc-50 dark:bg-zinc-950 overflow-y-auto transition-colors duration-200">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/jobs" element={<JobManagement />} />
          <Route path="/companies" element={<CompanyManagement />} />
          <Route path="/users" element={<UserManagement />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="/*"
          element={
            <AdminProtectedRoute>
              <SidebarLayout />
            </AdminProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}
