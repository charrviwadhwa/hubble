import { Link, useLocation } from 'react-router-dom';

// 1. Helper component for SVGs (Adjusted stroke width for a sleeker look)
function Icon({ type }) {
  const common = 'h-5 w-5 stroke-[1.5]';

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
  { label: 'Overview', to: '/dashboard', icon: 'grid' }, // Renamed to match Boutiq style
  { label: 'Events', to: '/events', icon: 'spark' },
  { label: 'Societies', to: '/my-societies', icon: 'image' },
  { label: 'Profile', to: '/profile', icon: 'profile' },
  { label: 'Settings', to: '/settings', icon: 'settings' }
];

export default function Sidebar({ userRole }) {
  const location = useLocation();

  return (
    <aside className="w-full lg:w-64 flex flex-col h-full min-h-[calc(100vh-2rem)] bg-transparent pt-2">
      
      {/* 🔶 Brand Header (Styled like the Boutiq Logo) */}
      <div className="mb-10 flex items-center gap-3 px-6">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-[#ff6b35] to-[#e85a25] text-white shadow-sm">
          <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
            <path d="M4 4h4v16H4V4zm12 0h4v16h-4V4zm-6 4h4v8h-4V8z" />
          </svg>
        </div>
        <p className="text-xl font-bold tracking-tight text-gray-900">Hubble</p>
      </div>

      {/* 📋 Navigation Links */}
      <nav className="flex-1 space-y-2 px-3">
        {menuItems.map((item) => {
          const isActive = location.pathname.includes(item.to); // .includes handles sub-routes
          return (
            <Link
              key={item.label}
              to={item.to}
              className="flex items-center gap-4 rounded-xl px-3 py-3 transition-colors group"
            >
              {/* Icon Container - Changes to Orange Circle when active */}
              <div 
                className={`flex h-9 w-9 items-center justify-center rounded-full transition-all duration-300 ${
                  isActive 
                    ? 'bg-[#ff6b35] text-white shadow-md shadow-[#ff6b35]/30' 
                    : 'bg-transparent text-gray-400 group-hover:bg-gray-100 group-hover:text-gray-600'
                }`}
              >
                <Icon type={item.icon} />
              </div>
              
              {/* Label - Bold black when active, muted gray when inactive */}
              <span 
                className={`text-sm tracking-wide transition-colors ${
                  isActive 
                    ? 'font-semibold text-gray-900' 
                    : 'font-medium text-gray-500 group-hover:text-gray-900'
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
        <div className="mb-4 rounded-2xl bg-gray-50 p-4 border border-gray-100 text-center">
          <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1">Current Role</p>
          <p className="text-sm font-semibold text-gray-800 capitalize">{userRole || 'Member'}</p>
        </div>
        
        <button
          onClick={() => { localStorage.clear(); window.location.href = '/login'; }}
          className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium text-gray-500 transition-colors hover:bg-red-50 hover:text-red-600"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-transparent text-gray-400 group-hover:text-red-600">
            <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5 stroke-[1.5] stroke-currentColor text-inherit">
              <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4M10 17l5-5-5-5M15 12H3" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          Sign Out
        </button>
      </div>
    </aside>
  );
}