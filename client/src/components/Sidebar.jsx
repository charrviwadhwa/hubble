import { Link, useLocation } from 'react-router-dom';

// 1. Helper component for SVGs
function Icon({ type }) {
  const common = 'h-5 w-5 stroke-[2]'; // Thickened the strokes slightly to match the bolder aesthetic

  if (type === 'grid') {
    return <svg viewBox="0 0 24 24" fill="none" className={common}><rect x="4" y="4" width="6" height="6" stroke="currentColor" rx="1" /><rect x="14" y="4" width="6" height="6" stroke="currentColor" rx="1" /><rect x="4" y="14" width="6" height="6" stroke="currentColor" rx="1" /><rect x="14" y="14" width="6" height="6" stroke="currentColor" rx="1" /></svg>;
  }
  if (type === 'spark') {
    return <svg viewBox="0 0 24 24" fill="none" className={common}><path d="m12 3 1.8 4.2L18 9l-4.2 1.8L12 15l-1.8-4.2L6 9l4.2-1.8L12 3Z" stroke="currentColor" strokeLinejoin="round" /></svg>;
  }
  if (type === 'image') {
    return <svg viewBox="0 0 24 24" fill="none" className={common}><rect x="4" y="5" width="16" height="14" rx="2" stroke="currentColor" /><circle cx="9" cy="10" r="1.5" stroke="currentColor" /><path d="m6 17 4.2-4 2.8 2.4L16 12l2 2.5" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" /></svg>;
  }
  if (type === 'profile') {
    return <svg viewBox="0 0 24 24" fill="none" className={common}><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" stroke="currentColor" strokeLinecap="round" /><circle cx="12" cy="7" r="4" stroke="currentColor" /></svg>;
  }
  if (type === 'settings') {
    return <svg viewBox="0 0 24 24" fill="none" className={common}><circle cx="12" cy="12" r="3" stroke="currentColor" /><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1Z" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" /></svg>;
  }

  return <svg viewBox="0 0 24 24" fill="none" className={common}><path d="m12 4 2.4 4.8 5.3.8-3.8 3.8.9 5.3L12 16.2l-4.8 2.5.9-5.3-3.8-3.8 5.3-.8L12 4Z" stroke="currentColor" strokeLinejoin="round" /></svg>;
}

const menuItems = [
  { label: 'Overview', to: '/dashboard', icon: 'grid' }, 
  { label: 'Events', to: '/events', icon: 'spark' },
  { label: 'Societies', to: '/my-societies', icon: 'image' },
  { label: 'Profile', to: '/profile', icon: 'profile' },
  { label: 'Settings', to: '/settings', icon: 'settings' }
];

export default function Sidebar({ userRole }) {
  const location = useLocation();

  return (
    <aside className="w-full lg:w-64 flex flex-col h-full min-h-[calc(100vh-2rem)] bg-transparent pt-2">
      
      {/* 🟠 THE NEW HUBBLE BRAND HEADER (Matches Landing Page) */}
      <div className="mb-12 flex items-center gap-2 px-6 pt-4">
        {/* Soft pulse animation inline */}
        <style dangerouslySetInnerHTML={{__html: `
          @keyframes pulse-soft {
            0%, 100% { transform: scale(1); opacity: 1; }
            50% { transform: scale(1.1); opacity: 0.8; }
          }
          .animate-pulse-soft { animation: pulse-soft 3s ease-in-out infinite; }
        `}} />
        <div className="w-4 h-4 bg-[#ff6b35] rounded-full animate-pulse-soft"></div>
        <p className="text-3xl font-black tracking-tighter text-black">Hubble</p>
      </div>

      {/* 📋 Navigation Links */}
      <nav className="flex-1 space-y-2 px-3">
        {menuItems.map((item) => {
          const isActive = location.pathname.includes(item.to); 
          return (
            <Link
              key={item.label}
              to={item.to}
              className="flex items-center gap-4 rounded-xl px-3 py-3 transition-colors group"
            >
              {/* Icon Container - Active State */}
              <div 
                className={`flex h-10 w-10 items-center justify-center rounded-full transition-all duration-300 ${
                  isActive 
                    ? 'bg-[#ff6b35] text-white shadow-md shadow-[#ff6b35]/30' 
                    : 'bg-transparent text-gray-400 group-hover:bg-gray-100 group-hover:text-gray-900'
                }`}
              >
                <Icon type={item.icon} />
              </div>
              
              {/* Label - Bolder font weights to match landing page aesthetic */}
              <span 
                className={`text-[15px] tracking-wide transition-colors ${
                  isActive 
                    ? 'font-black text-black' 
                    : 'font-bold text-gray-500 group-hover:text-black'
                }`}
              >
                {item.label}
              </span>
            </Link>
          );
        })}
      </nav>

      {/* 🚪 Bottom Section (Role & Sign Out) */}
      <div className="mt-auto px-6 pb-6 pt-10">
        
        {/* Role Badge */}
        <div className="mb-6 rounded-2xl bg-gray-50 p-4 border border-gray-200 text-center">
          <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">Current Role</p>
          <p className="text-sm font-bold text-black capitalize">{userRole || 'Member'}</p>
        </div>
        
        {/* Sign Out Button */}
        <button
          onClick={() => { localStorage.clear(); window.location.href = '/login'; }}
          className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm font-bold text-gray-500 transition-colors hover:bg-red-50 hover:text-red-600 group"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-transparent text-gray-400 group-hover:text-red-600">
            <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5 stroke-[2] stroke-currentColor text-inherit">
              <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4M10 17l5-5-5-5M15 12H3" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          Sign Out
        </button>
      </div>
    </aside>
  );
}