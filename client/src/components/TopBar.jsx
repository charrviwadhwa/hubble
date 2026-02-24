import { useState, useEffect } from 'react';

// The trigger function can be imported from your utils or defined here for safety
const triggerHubbleNotif = (title, message) => {
  const saved = JSON.parse(localStorage.getItem('hubble_notifs') || '[]');
  const newEntry = {
    id: Date.now(),
    title,
    message,
    read: false,
    timestamp: new Date().toISOString()
  };
  localStorage.setItem('hubble_notifs', JSON.stringify([newEntry, ...saved]));
  window.dispatchEvent(new Event('hubble_update')); 
};

export default function TopBar({ user }) {
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([]);

  // Sync notifications from localStorage
  const syncNotifs = () => {
    const saved = JSON.parse(localStorage.getItem('hubble_notifs') || '[]');
    setNotifications(saved);
  };

  useEffect(() => {
    syncNotifs();
    window.addEventListener('hubble_update', syncNotifs);
    window.addEventListener('storage', syncNotifs);
    return () => {
      window.removeEventListener('hubble_update', syncNotifs);
      window.removeEventListener('storage', syncNotifs);
    };
  }, []);

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAllRead = () => {
    const updated = notifications.map(n => ({ ...n, read: true }));
    localStorage.setItem('hubble_notifs', JSON.stringify(updated));
    setNotifications(updated);
  };

  return (
    <div className="relative mb-8 flex items-center justify-end gap-4 pr-6">
      
      {/* 1. Notification System */}
      <div className="relative">
        <button 
          onClick={() => setShowNotifications(!showNotifications)}
          className={`flex h-10 w-10 items-center justify-center rounded-xl border transition-all shadow-sm ${
            showNotifications ? 'bg-gray-50 border-gray-300' : 'bg-white border-gray-100'
          }`}
        >
          <i className={`fi fi-rr-bell mt-1 text-lg ${unreadCount > 0 ? 'text-[#ff6b35]' : 'text-gray-400'}`}></i>
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-[#ff6b35] text-[10px] font-bold text-white border-2 border-white">
              {unreadCount}
            </span>
          )}
        </button>

        {/* Dropdown Menu */}
        {showNotifications && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setShowNotifications(false)}></div>
            <div className="absolute right-0 mt-3 w-80 rounded-2xl border border-gray-100 bg-white shadow-2xl z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
              <div className="p-4 border-b border-gray-50 flex items-center justify-between bg-gray-50/50">
                <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Inbox</h3>
                {unreadCount > 0 && (
                  <button onClick={markAllRead} className="text-[10px] font-bold text-[#ff6b35] hover:underline">
                    Mark Read
                  </button>
                )}
              </div>
              
              <div className="max-h-[300px] overflow-y-auto">
                {notifications.length > 0 ? (
                  notifications.map(n => (
                    <div key={n.id} className={`p-4 border-b border-gray-50 last:border-0 transition-colors ${!n.read ? 'bg-orange-50/20' : 'opacity-60'}`}>
                      <p className="text-xs font-bold text-gray-900">{n.title}</p>
                      <p className="text-[11px] text-gray-500 mt-0.5 line-clamp-2 leading-relaxed">{n.message}</p>
                      <p className="text-[9px] text-gray-400 mt-2 font-mono">
                        {new Date(n.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                      </p>
                    </div>
                  ))
                ) : (
                  <div className="p-10 text-center">
                    <i className="fi fi-rr-envelope-open text-2xl text-gray-200"></i>
                    <p className="text-xs text-gray-400 mt-2 italic">No new missions.</p>
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </div>

      {/* 2. User Profile Group */}
      <div className="flex items-center gap-3 pl-4 border-l border-gray-100">
        <div className="text-right hidden sm:block">
          <p className="text-xs font-bold text-gray-900">{user?.name || 'Hubble User'}</p>
        </div>
        <div className="h-10 w-10 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center font-bold text-[#ff6b35] shadow-sm">
          {user?.name?.[0] || 'H'}
        </div>
      </div>
    </div>
  );
}