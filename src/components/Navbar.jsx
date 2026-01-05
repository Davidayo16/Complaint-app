import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FaUserCircle, FaBars, FaTimes } from 'react-icons/fa';

const navLinks = [
  { to: '/dashboard', label: 'Dashboard', roles: ['user'] },
  { to: '/admin', label: 'Admin', roles: ['admin'] },
];

const Navbar = () => {
  const { user, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  const handleSidebarToggle = () => setSidebarOpen((open) => !open);
  const closeSidebar = () => setSidebarOpen(false);

  return (
    <nav className="sticky top-0 z-30 bg-white/80 backdrop-blur-xl shadow-[0_1px_3px_rgba(0,0,0,0.04)] border-b border-[#D2D2D7]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
        <Link to="/" className="text-xl font-semibold text-[#1D1D1F] tracking-tight flex items-center gap-1.5 hover:opacity-80 transition-opacity">
          <span className="text-[#007AFF]">PHCN</span>
          <span className="text-[#86868B]">Complaints</span>
        </Link>
        <div className="hidden md:flex items-center gap-6">
          {user && (
            <span className="flex items-center gap-2 text-[#86868B] text-sm font-medium">
              <FaUserCircle className="text-lg" /> {user.name}
            </span>
          )}
          {user && navLinks.filter(l => l.roles.includes(user.role)).map(link => (
            <Link
              key={link.to}
              to={link.to}
              className={`text-sm font-medium px-3 py-1.5 rounded-lg transition-colors ${
                location.pathname === link.to 
                  ? 'bg-[#007AFF]/10 text-[#007AFF]' 
                  : 'text-[#86868B] hover:text-[#1D1D1F] hover:bg-[#FBFBFD]'
              }`}
            >
              {link.label}
            </Link>
          ))}
          {!user && (
            <>
              <Link to="/login" className="text-sm font-medium px-3 py-1.5 rounded-lg text-[#86868B] hover:text-[#1D1D1F] transition-colors">Sign in</Link>
              <Link to="/register" className="text-sm font-medium px-4 py-1.5 rounded-lg bg-[#007AFF] text-white hover:bg-[#0051D5] transition-colors">Sign up</Link>
            </>
          )}
          {user && (
            <button
              onClick={logout}
              className="px-4 py-1.5 rounded-lg bg-[#007AFF] text-white text-sm font-medium hover:bg-[#0051D5] active:scale-[0.98] transition-all"
            >
              Sign out
            </button>
          )}
        </div>
        {/* Hamburger for mobile */}
        <button
          className="md:hidden text-xl text-[#1D1D1F] focus:outline-none hover:opacity-70 transition-opacity"
          onClick={handleSidebarToggle}
          aria-label="Open menu"
        >
          <FaBars />
        </button>
      </div>
      {/* Sidebar for mobile */}
      {sidebarOpen && (
        <>
          <div
            className="fixed inset-0 z-[100] bg-black/40 backdrop-blur-sm transition-opacity duration-200"
            onClick={closeSidebar}
          />
          <aside
            className="fixed top-0 left-0 h-full w-64 shadow-[0_8px_24px_rgba(0,0,0,0.12)] z-[101] transform transition-transform duration-300 ease-out"
            style={{ backgroundColor: '#FFFFFF' }}
            aria-label="Sidebar"
          >
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#D2D2D7] bg-white">
          <Link to="/" className="text-lg font-semibold text-[#1D1D1F] tracking-tight flex items-center gap-1.5" onClick={closeSidebar}>
            <span className="text-[#007AFF]">PHCN</span>
            <span className="text-[#86868B]">Complaints</span>
          </Link>
          <button className="text-xl text-[#86868B] hover:text-[#1D1D1F] transition-colors" onClick={closeSidebar} aria-label="Close menu">
            <FaTimes />
          </button>
        </div>
        <div className="flex flex-col gap-2 px-6 py-6 bg-white">
          {user && (
            <div className="flex items-center gap-2 text-[#86868B] text-sm font-medium mb-4 px-3 py-2 bg-[#FBFBFD] rounded-lg">
              <FaUserCircle className="text-lg" /> {user.name}
            </div>
          )}
          {user && navLinks.filter(l => l.roles.includes(user.role)).map(link => (
            <Link
              key={link.to}
              to={link.to}
              className={`text-sm font-medium px-3 py-2.5 rounded-lg transition-colors ${
                location.pathname === link.to 
                  ? 'bg-[#007AFF]/10 text-[#007AFF]' 
                  : 'text-[#86868B] hover:text-[#1D1D1F] hover:bg-[#FBFBFD]'
              }`}
              onClick={closeSidebar}
            >
              {link.label}
            </Link>
          ))}
          {!user && (
            <>
              <Link to="/login" className="text-sm font-medium px-3 py-2.5 rounded-lg text-[#86868B] hover:text-[#1D1D1F] hover:bg-[#FBFBFD] transition-colors" onClick={closeSidebar}>Sign in</Link>
              <Link to="/register" className="text-sm font-medium px-3 py-2.5 rounded-lg bg-[#007AFF] text-white hover:bg-[#0051D5] transition-colors text-center" onClick={closeSidebar}>Sign up</Link>
            </>
          )}
          {user && (
            <button
              onClick={() => { logout(); closeSidebar(); }}
              className="mt-4 px-4 py-2.5 rounded-lg bg-[#007AFF] text-white text-sm font-medium hover:bg-[#0051D5] active:scale-[0.98] transition-all"
            >
              Sign out
            </button>
          )}
        </div>
      </aside>
        </>
      )}
    </nav>
  );
};

export default Navbar; 