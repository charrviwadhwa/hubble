import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import TopBar from '../components/TopBar'; // Integrates the Boutiq top bar
import EventCard from '../components/EventFeed';

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [registeredEvents, setRegisteredEvents] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;

    const headers = { Authorization: `Bearer ${token}` };

    // 1. Fetch Profile
    fetch('http://localhost:3001/api/users/me/profile', { headers })
      .then((res) => res.json())
      .then((data) => setUser(data))
      .catch(err => console.error(err));

    // 2. Fetch ONLY joined events for the personal dashboard
    fetchMyRegistrations(headers);
  }, []);

  const fetchMyRegistrations = async (headers) => {
    try {
      const res = await fetch('http://localhost:3001/api/events/my-registrations', { 
        headers: headers || { Authorization: `Bearer ${localStorage.getItem('token')}` } 
      });
      
      if (!res.ok) throw new Error("Failed to fetch");

      const data = await res.json();
      
      // 🛡️ Always ensure data is an array before setting state
      setRegisteredEvents(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Dashboard Fetch Error:", err);
      setRegisteredEvents([]); // Fallback to empty list
    }
  };

  return (
    <div className="min-h-screen bg-[#f1f3f6]  text-[#1a1a1a] font-sans">
      <div className="mx-auto flex  gap-6 rounded-2xl bg-white p-4 shadow-sm min-h-[90vh]">
        
        {/* Sidebar Space */}
        <div className="w-64 flex-shrink-0 hidden lg:block border-r border-gray-100 pr-4">
           <Sidebar userRole={user?.role} />
        </div>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto pt-4 pl-4 md:pl-8 pr-6 pb-20">
          
          <TopBar user={user} />

          <header className="mb-8">
            <h1 className="text-3xl font-medium text-gray-900">Overview</h1>
            <p className="text-sm text-gray-500 mt-1">Welcome back! Here's what's happening across your Hubble account.</p>
          </header>

          {/* 📊 Dashboard Summary Stats */}
          <section className="mb-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            
            {/* Stat 1: Upcoming Events */}
            <div className="flex items-center gap-4 rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-orange-50 text-[#ff6b35]">
                <i className="fi fi-rr-calendar-star text-xl mt-1"></i>
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Upcoming Events</p>
                <p className="text-2xl font-bold text-gray-900 leading-tight">{registeredEvents.length}</p>
              </div>
            </div>

            {/* Stat 2: Lifetime Registrations */}
            <div className="flex items-center gap-4 rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-50 text-blue-600">
                <i className="fi fi-rr-chart-pie-alt text-xl mt-1"></i>
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Lifetime Joined</p>
                <p className="text-2xl font-bold text-gray-900 leading-tight">{user?.totalRegistrations || 0}</p>
              </div>
            </div>

            {/* Stat 3: Account Status */}
            <div className="flex items-center gap-4 rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-50 text-green-600">
                <i className="fi fi-rr-shield-check text-xl mt-1"></i>
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Account Status</p>
                <p className="text-xl font-bold text-gray-900 leading-tight">Active</p>
              </div>
            </div>

          </section>

          {/* 📅 Schedule Header */}
          <div className="mb-6 flex items-center justify-between border-b border-gray-200 pb-4">
            <h2 className="text-lg font-semibold text-gray-900">My Schedule</h2>
            <button 
              onClick={() => navigate('/events')} 
              className="text-sm font-medium text-[#ff6b35] hover:text-[#e85a25] transition-colors"
            >
              Browse Events &rarr;
            </button>
          </div>

          {/* 🟢 Event Grid */}
          <section className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
            {registeredEvents.length > 0 ? (
              registeredEvents.map((event, index) => (
                <EventCard
                  key={event.id}
                  event={event}
                  index={index}
                  isRegistered={true} // 🔥 Hardcoded true for Dashboard
                  onRefresh={() => fetchMyRegistrations()}
                />
              ))
            ) : (
              <div className="col-span-full py-16 text-center rounded-2xl border border-dashed border-gray-200 bg-gray-50/50">
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-white border border-gray-200 text-gray-400 shadow-sm text-2xl">
                  <i className="fi fi-rr-calendar-lines"></i>
                </div>
                <h3 className="text-base font-semibold text-gray-900">Your schedule is clear</h3>
                <p className="mt-1 text-sm text-gray-500 mb-6">You haven't joined any upcoming events yet.</p>
                <button 
                  onClick={() => navigate('/events')} 
                  className="rounded-lg bg-white border border-gray-200 px-6 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-colors shadow-sm"
                >
                  Find an Event
                </button>
              </div>
            )}
          </section>

          {/* 🛡️ Organizer Management Section (Only shows if they manage societies) */}
{user?.role === 'admin' && (
  <section className="mt-12">
    <div className="mb-6 flex items-center justify-between border-b border-gray-200 pb-4">
      <h2 className="text-lg font-semibold text-gray-900">Manage Your Hubs</h2>
      <button 
        onClick={() => navigate('/settings')} 
        className="text-sm font-medium text-gray-500 hover:text-[#ff6b35] transition-colors"
      >
        Hub Settings &rarr;
      </button>
    </div>

    <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
      {/* Example of a quick-action card for organizers */}
      <div className="group rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition-all hover:border-[#ff6b35] hover:shadow-md">
        <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-orange-50 text-[#ff6b35]">
          <i className="fi fi-rr-settings-sliders text-lg"></i>
        </div>
        <h3 className="font-bold text-gray-900">Society Admin</h3>
        <p className="mt-1 text-xs text-gray-500 mb-4">Edit society details, manage co-founders, and view stats.</p>
        <button 
          onClick={() => navigate('/settings')}
          className="w-full rounded-lg bg-gray-900 py-2 text-xs font-bold text-white transition-colors hover:bg-black"
        >
          Open Hub Settings
        </button>
      </div>

      <div className="group rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition-all hover:border-[#ff6b35] hover:shadow-md">
        <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
          <i className="fi fi-rr-users text-lg"></i>
        </div>
        <h3 className="font-bold text-gray-900">Attendance Center</h3>
        <p className="mt-1 text-xs text-gray-500 mb-4">View registrations and mark attendance for your events.</p>
        <button 
          onClick={() => navigate('/organizer/attendance')}
          className="w-full rounded-lg bg-blue-600 py-2 text-xs font-bold text-white transition-colors hover:bg-blue-700"
        >
          Review Registrations
        </button>
      </div>
    </div>
  </section>
)}

        </main>
      </div>
    </div>
  );
}