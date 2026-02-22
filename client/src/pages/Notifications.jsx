import { useState, useEffect } from 'react';

export default function TopBar({ user }) {
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([]);

  const loadNotifications = () => {
    const data = JSON.parse(localStorage.getItem('hubble_notifications') || '[]');
    setNotifications(data);
  };

  useEffect(() => {
    loadNotifications();
    // Listen for new notifications being added
    window.addEventListener('notif_update', loadNotifications);
    return () => window.removeEventListener('notif_update', loadNotifications);
  }, []);

  const markAllRead = () => {
    const updated = notifications.map(n => ({ ...n, read: true }));
    localStorage.setItem('hubble_notifications', JSON.stringify(updated));
    setNotifications(updated);
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="relative mb-8 flex items-center justify-end gap-4 pr-6">
      <div className="relative">
        <button 
          onClick={() => setShowNotifications(!showNotifications)}
          className="flex h-10 w-10 items-center justify-center rounded-xl bg-white border border-gray-100 text-gray-400 hover:text-[#ff6b35] transition-all shadow-sm"
        >
          <i className="fi fi-rr-bell mt-1"></i>
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-[#ff6b35] text-[10px] font-bold text-white border-2 border-white">
              {unreadCount}
            </span>
          )}
        </button>

        {showNotifications && (
          <div className="absolute right-0 mt-3 w-80 rounded-2xl border border-gray-100 bg-white shadow-2xl z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="p-4 border-b border-gray-50 flex items-center justify-between bg-gray-50/30">
              <h3 className="text-sm font-bold text-gray-900">Notifications</h3>
              <button 
                onClick={markAllRead}
                className="text-[10px] font-bold text-[#ff6b35] uppercase tracking-wider hover:underline"
              >
                Mark all as read
              </button>
            </div>
            <div className="max-h-[350px] overflow-y-auto">
              {notifications.length > 0 ? (
                notifications.map(n => (
                  <div key={n.id} className={`p-4 border-b border-gray-50 transition-colors ${!n.read ? 'bg-orange-50/20' : 'opacity-60'}`}>
                    <p className="text-xs font-bold text-gray-900">{n.title}</p>
                    <p className="text-[11px] text-gray-500 mt-1 line-clamp-2">{n.message}</p>
                    <p className="text-[9px] text-gray-400 mt-2 font-mono">
                       {new Date(n.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                ))
              ) : (
                <div className="p-10 text-center text-gray-400 text-xs italic">No new transmissions.</div>
              )}
            </div>
          </div>
        )}
      </div>

      <div className="flex items-center gap-3 pl-4 border-l border-gray-100">
        <div className="text-right hidden sm:block">
          <p className="text-xs font-bold text-gray-900">{user?.name}</p>
          <p className="text-[10px] text-gray-400 uppercase font-black tracking-widest">{user?.role}</p>
        </div>
        <div className="h-10 w-10 rounded-xl bg-gray-100 border border-gray-200 flex items-center justify-center font-bold text-[#ff6b35]">
          {user?.name?.[0]}
        </div>
      </div>
    </div>
  );
}