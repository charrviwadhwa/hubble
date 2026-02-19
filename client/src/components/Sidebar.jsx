import { Link, useLocation } from 'react-router-dom';

// 1. Helper component for SVGs
function Icon({ type }) {
  const common = 'h-4 w-4 stroke-[1.8]';

  if (type === 'grid') {
    return <svg viewBox="0 0 24 24" fill="none" className={common}><rect x="4" y="4" width="6" height="6" stroke="currentColor" /><rect x="14" y="4" width="6" height="6" stroke="currentColor" /><rect x="4" y="14" width="6" height="6" stroke="currentColor" /><rect x="14" y="14" width="6" height="6" stroke="currentColor" /></svg>;
  }
  if (type === 'spark') {
    return <svg viewBox="0 0 24 24" fill="none" className={common}><path d="m12 3 1.8 4.2L18 9l-4.2 1.8L12 15l-1.8-4.2L6 9l4.2-1.8L12 3Z" stroke="currentColor" /></svg>;
  }
  if (type === 'image') {
    return <svg viewBox="0 0 24 24" fill="none" className={common}><rect x="4" y="5" width="16" height="14" rx="2" stroke="currentColor" /><circle cx="9" cy="10" r="1.4" stroke="currentColor" /><path d="m6 17 4.2-4 2.8 2.4L16 12l2 2.5" stroke="currentColor" /></svg>;
  }
  if (type === 'profile') {
    return <svg viewBox="0 0 24 24" fill="none" className={common}><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" stroke="currentColor" /><circle cx="12" cy="7" r="4" stroke="currentColor" /></svg>;
  }
  if (type === 'settings') {
    return <svg viewBox="0 0 24 24" fill="none" className={common}><circle cx="12" cy="12" r="3" stroke="currentColor" /><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1Z" stroke="currentColor" /></svg>;
  }

  return <svg viewBox="0 0 24 24" fill="none" className={common}><path d="m12 4 2.4 4.8 5.3.8-3.8 3.8.9 5.3L12 16.2l-4.8 2.5.9-5.3-3.8-3.8 5.3-.8L12 4Z" stroke="currentColor" /></svg>;
}

const menuItems = [
  { label: 'Dashboard', to: '/dashboard', icon: 'grid' },
  { label: 'Events', to: '/events', icon: 'spark' },
  { label: 'My Societies', to: '/my-societies', icon: 'image' },
  { label: 'Profile', to: '/profile', icon: 'profile' },
  { label: 'Settings', to: '/settings', icon: 'settings' }
];

export default function Sidebar({ userRole }) {
  const location = useLocation();

  return (
    <aside className="w-full rounded-2xl border border-black/10 bg-[#ece6dc] p-4 lg:w-64 lg:min-h-[calc(100vh-2rem)] flex flex-col">
      {/* Brand Header */}
      <div className="mb-6 flex items-center gap-3 rounded-xl bg-white px-3 py-4 border border-black/10">
        <div className="grid h-8 w-8 place-items-center rounded-lg bg-[#ff6b35] text-white font-bold">
          H
        </div>
        <div>
          <p className="text-xl font-semibold tracking-tight text-[#1a1a1a]">Hubble</p>
          <p className="text-[10px] uppercase font-bold text-black/40">{userRole || 'Member'}</p>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="space-y-1 flex-1">
        {menuItems.map((item) => {
          const isActive = location.pathname === item.to;
          return (
            <Link
              key={item.label}
              to={item.to}
              className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${
                isActive
                  ? 'bg-[#161616] text-white shadow-md'
                  : 'text-black/70 hover:bg-white/50'
              }`}
            >
              <Icon type={item.icon} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Logout */}
      <button
        onClick={() => { localStorage.clear(); window.location.href = '/login'; }}
        className="mt-6 w-full rounded-xl border border-black/10 bg-white px-4 py-2.5 text-sm font-bold text-black/70 hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-all"
      >
        Sign Out
      </button>
    </aside>
  );
}