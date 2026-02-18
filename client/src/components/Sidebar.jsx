import { Link, useLocation } from 'react-router-dom';

// 1. Helper component for SVGs
function Icon({ type }) {
  const common = 'h-4 w-4 stroke-[1.8]';

  if (type === 'grid') {
    return <svg viewBox="0 0 24 24" fill="none" className={common}><rect x="4" y="4" width="6" height="6" stroke="currentColor" /><rect x="14" y="4" width="6" height="6" stroke="currentColor" /><rect x="4" y="14" width="6" height="6" stroke="currentColor" /><rect x="14" y="14" width="6" height="6" stroke="currentColor" /></svg>;
  }
  if (type === 'ticket') {
    return <svg viewBox="0 0 24 24" fill="none" className={common}><rect x="4" y="7" width="16" height="10" rx="2" stroke="currentColor" /><path d="M9 7v10M15 7v10" stroke="currentColor" /></svg>;
  }
  if (type === 'invoice') {
    return <svg viewBox="0 0 24 24" fill="none" className={common}><rect x="5" y="4" width="14" height="16" rx="2" stroke="currentColor" /><path d="M8 9h8M8 13h8M8 17h5" stroke="currentColor" /></svg>;
  }
  if (type === 'mail') {
    return <svg viewBox="0 0 24 24" fill="none" className={common}><rect x="4" y="6" width="16" height="12" rx="2" stroke="currentColor" /><path d="m5 8 7 5 7-5" stroke="currentColor" /></svg>;
  }
  if (type === 'calendar') {
    return <svg viewBox="0 0 24 24" fill="none" className={common}><rect x="4" y="6" width="16" height="14" rx="2" stroke="currentColor" /><path d="M8 4v4M16 4v4M4 10h16" stroke="currentColor" /></svg>;
  }
  if (type === 'spark') {
    return <svg viewBox="0 0 24 24" fill="none" className={common}><path d="m12 3 1.8 4.2L18 9l-4.2 1.8L12 15l-1.8-4.2L6 9l4.2-1.8L12 3Z" stroke="currentColor" /></svg>;
  }
  if (type === 'coin') {
    return <svg viewBox="0 0 24 24" fill="none" className={common}><circle cx="12" cy="12" r="8" stroke="currentColor" /><path d="M9.5 10.5c.3-1 1.3-1.7 2.5-1.7 1.4 0 2.5 1 2.5 2.2 0 1.1-.9 1.8-2.2 2.1l-.6.1c-1.2.3-2 .9-2 1.9 0 1.2 1.1 2.2 2.5 2.2 1.2 0 2.2-.7 2.5-1.7" stroke="currentColor" /></svg>;
  }
  if (type === 'image') {
    return <svg viewBox="0 0 24 24" fill="none" className={common}><rect x="4" y="5" width="16" height="14" rx="2" stroke="currentColor" /><circle cx="9" cy="10" r="1.4" stroke="currentColor" /><path d="m6 17 4.2-4 2.8 2.4L16 12l2 2.5" stroke="currentColor" /></svg>;
  }

  return <svg viewBox="0 0 24 24" fill="none" className={common}><path d="m12 4 2.4 4.8 5.3.8-3.8 3.8.9 5.3L12 16.2l-4.8 2.5.9-5.3-3.8-3.8 5.3-.8L12 4Z" stroke="currentColor" /></svg>;
}

const menuItems = [
  { label: 'Dashboard', to: '/dashboard', icon: 'grid' },
  { label: 'My Tickets', to: '/my-registrations', icon: 'ticket' },
  { label: 'Events', to: '/events', icon: 'spark' },
  { label: 'Calendar', to: '/calendar', icon: 'calendar' },
  { label: 'Profile', to: '/profile', icon: 'image' },
  { label: 'Feedback', to: '/feedback', icon: 'star' }
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
          <p className="text-[10px] uppercase font-bold text-black/40">{userRole || 'student'}</p>
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

      {/* Admin Section */}
      {userRole === 'admin' && (
        <div className="mt-4 p-3 bg-white/40 rounded-xl border border-dashed border-black/10">
          <p className="text-[10px] font-bold text-black/50 mb-2 uppercase">Admin Tools</p>
          <Link to="/create-event" className="block text-center bg-white border border-black/10 py-2 rounded-lg text-xs font-bold hover:bg-white transition shadow-sm">
            + Create Event
          </Link>
        </div>
      )}

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