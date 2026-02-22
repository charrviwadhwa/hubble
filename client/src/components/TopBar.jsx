import { useState } from 'react';


export default function TopBar({ user }) {
  const [searchQuery, setSearchQuery] = useState('');

  // Fallback data if user hasn't loaded yet
  const userName = user?.name || 'MSIT Student';
  const userEmail = user?.email || 'student@msit.in';
  const initials = userName.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();

  return (
    <nav className="mb-8 flex flex-col-reverse gap-4 md:flex-row md:items-center justify-between">
      
      {/* 🔍 Left: Search Bar */}
      <div className="relative w-full max-w-md">
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
          <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4 stroke-[2] stroke-currentColor">
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.3-4.3" strokeLinecap="round" />
          </svg>
        </div>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search anything ..."
          className="w-full rounded-xl border border-gray-200 bg-white py-2.5 pl-10 pr-4 text-sm text-gray-900 outline-none transition-all placeholder:text-gray-400 focus:border-[#ff6b35] focus:ring-1 focus:ring-[#ff6b35]"
        />
      </div>

      {/* 👤 Right: Actions & Profile */}
      <div className="flex items-center justify-end gap-4 md:gap-3">
        
        {/* Action Icons (Bell & Envelope in circular borders) */}
        <button className="flex h-9 w-9 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-600 transition-colors hover:bg-gray-50 hover:text-gray-900">
          <i className="fi fi-rr-bell text-sm flex items-center mt-0.5"></i>
        </button>
        <button className="flex h-9 w-9 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-600 transition-colors hover:bg-gray-50 hover:text-gray-900">
          <i className="fi fi-rr-envelope text-sm flex items-center mt-0.5"></i>
        </button>

        {/* Vertical Divider */}
        <div className="hidden h-8 w-px bg-gray-200 md:block"></div>

        {/* User Profile Dropdown Trigger */}
        <button className="flex items-center gap-3 text-left transition-opacity hover:opacity-80">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-gray-800 to-black text-xs font-bold text-white shadow-sm overflow-hidden">
            {/* If you have a user profile picture, put the <img src={user.avatar} /> here instead */}
            {initials}
          </div>
          <div className="hidden flex-col md:flex">
            <span className="text-sm font-semibold text-gray-900 leading-tight">{userName}</span>
            <span className="text-xs font-medium text-gray-500">{userEmail}</span>
          </div>
          <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4 stroke-[2] stroke-gray-400 hidden md:block ml-1">
            <path d="m6 9 6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>

      </div>
    </nav>
  );
}