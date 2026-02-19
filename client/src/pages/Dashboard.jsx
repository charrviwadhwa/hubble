import { useEffect, useState } from 'react';
import Sidebar from '../components/Sidebar';
import EventCard from '../components/EventFeed'; // Assuming EventCard is inside EventFeed.jsx

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [registeredEvents, setRegisteredEvents] = useState([]);

  useEffect(() => {
    // 1. Fetch Profile
    fetch('http://localhost:3001/api/users/me/profile', {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    })
      .then((res) => res.json())
      .then((data) => setUser(data));

    // 2. Fetch ONLY joined events for the personal dashboard
    fetchMyRegistrations();
  }, []);

  // Dashboard.jsx

const fetchMyRegistrations = async () => {
  try {
    const res = await fetch('http://localhost:3001/api/events/my-registrations', {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    });
    
    // Check if the response is okay before parsing JSON
    if (!res.ok) throw new Error("Failed to fetch");

    const data = await res.json();
    
    // 🛡️ Always ensure data is an array before setting state
    setRegisteredEvents(Array.isArray(data) ? data : []);
  } catch (err) {
    console.error("Dashboard Fetch Error:", err);
    setRegisteredEvents([]); // Fallback to empty list
  }
};

  const initials = user?.name ? user.name.split(' ').map(p => p[0]).join('').slice(0, 2).toUpperCase() : 'HB';

  return (
    <div className="min-h-screen bg-[#f3efe8] p-4 md:p-6">
      <div className="mx-auto max-w-[1380px] rounded-[28px] border border-black/10 bg-[#f7f3ec] p-3 shadow-[0_12px_30px_rgba(0,0,0,0.08)] md:p-4">
        <div className="flex flex-col gap-4 lg:flex-row">
          <Sidebar userRole={user?.role} />

          <main className="flex-1 rounded-2xl bg-[#f9f6ef] p-4 md:p-5">
            <header className="mb-4 rounded-2xl bg-white p-4 border border-black/10">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-xs text-black/45">Overview / Dashboard</p>
                  <h1 className="text-3xl font-semibold tracking-tight text-[#1a1a1a]">My Schedule</h1>
                </div>

                <div className="flex items-center gap-2">
                  <div className="ml-1 flex items-center gap-2 rounded-full border border-black/10 bg-white px-2 py-1.5 shadow-sm">
                    <div className="grid h-8 w-8 place-items-center rounded-full bg-[#ff6b35] text-xs font-bold text-white">
                      {initials}
                    </div>
                    <div className="pr-2">
                      <p className="text-xs font-semibold text-[#1b1b1b]">{user?.name || 'Loading...'}</p>
                      <p className="text-[10px] capitalize text-black/50">{user?.role || 'member'}</p>
                    </div>
                  </div>
                </div>
              </div>
            </header>

            {/* Dashboard Summary Stats */}
            <section className="mb-5 grid grid-cols-1 md:grid-cols-3 gap-4">
               <div className="rounded-2xl border border-black/10 bg-white p-4">
                  <p className="text-[10px] font-bold text-black/40 uppercase">Upcoming Events</p>
                  <p className="text-2xl font-bold text-[#ff6b35]">{registeredEvents.length}</p>
               </div>
               <div className="rounded-2xl border border-black/10 bg-white p-4">
                  <p className="text-[10px] font-bold text-black/40 uppercase">Account Status</p>
                  <p className="text-2xl font-bold text-green-600">Active</p>
               </div>
            </section>

            <h2 className="mb-4 text-lg font-bold text-black/70 px-1">Registered Events</h2>
            
            <section className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
              {registeredEvents.length > 0 ? (
                registeredEvents.map((event, index) => (
                  <EventCard
                    key={event.id}
                    event={event}
                    index={index}
                    isRegistered={true} // 🔥 Hardcoded true for Dashboard
                    onRefresh={fetchMyRegistrations}
                  />
                ))
              ) : (
                <div className="col-span-full rounded-2xl bg-white/50 border border-dashed border-black/10 p-16 text-center">
                  <p className="text-sm text-black/40">You haven't joined any events yet.</p>
                  <button onClick={() => window.location.href='/events'} className="mt-4 text-xs font-bold text-[#ff6b35] hover:underline">
                    Browse All Events →
                  </button>
                </div>
              )}
            </section>
          </main>
        </div>
      </div>
    </div>
  );
}