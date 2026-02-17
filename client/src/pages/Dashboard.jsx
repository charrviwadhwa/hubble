import { useEffect, useState } from 'react';
import Sidebar from '../components/Sidebar';
import EventCard from '../components/EventFeed';

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [events, setEvents] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    // 1. Fetch User Profile
    fetch("http://localhost:3001/api/users/profile", {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    })
    .then(res => res.json())
    .then(data => setUser(data));

    // 2. Fetch Initial Events
    fetchEvents();
  }, []);

  const fetchEvents = async (query = "") => {
    const url = query 
      ? `http://localhost:3001/api/events?q=${query}` 
      : "http://localhost:3001/api/events";
    
    const res = await fetch(url);
    const data = await res.json();
    setEvents(data);
  };

  const handleSearch = (e) => {
    setSearch(e.target.value);
    fetchEvents(e.target.value);
  };

  return (
    <div className="flex h-screen bg-[#F9FAFB] overflow-hidden font-sans">
      {/* Sidebar Component */}
      <Sidebar userRole={user?.role} />

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto px-8 py-6">
        
        {/* Top Navigation Bar */}
        <header className="flex justify-between items-center mb-10">
          <div>
            <nav className="text-xs text-gray-400 mb-1">Dashboard / <span className="text-blue-600">Events</span></nav>
            <h1 className="text-3xl font-bold text-gray-900">Events</h1>
          </div>

          <div className="flex items-center gap-4">
            <div className="relative">
              <span className="absolute left-3 top-2.5 text-gray-400">🔍</span>
              <input 
                type="text" 
                value={search}
                onChange={handleSearch}
                placeholder="Search event, location, etc..." 
                className="pl-10 pr-4 py-2 w-72 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              />
            </div>
            <div className="flex items-center gap-3 ml-4 bg-white p-1 pr-4 rounded-full border border-gray-100 shadow-sm">
               <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold uppercase">
                 {user?.name?.substring(0, 2) || "HB"}
               </div>
               <div className="text-left">
                 <p className="text-xs font-bold leading-tight">{user?.name || "Loading..."}</p>
                 <p className="text-[10px] text-gray-400 capitalize">{user?.role}</p>
               </div>
            </div>
          </div>
        </header>

        {/* Filters/Tabs (Like Ventixe) */}
        <div className="flex items-center gap-4 mb-8">
          <button className="bg-blue-600 text-white px-5 py-1.5 rounded-full text-sm font-medium">Active</button>
          <button className="text-gray-500 hover:bg-gray-100 px-5 py-1.5 rounded-full text-sm font-medium">Past</button>
        </div>

        {/* Event Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {events.length > 0 ? (
            events.map(event => (
              <EventCard 
                key={event.id} 
                event={event} 
                onRefresh={fetchEvents}
              />
            ))
          ) : (
            <p className="col-span-full text-center text-gray-500 py-20">No events found. Try a different search!</p>
          )}
        </div>
      </main>
    </div>
  );
}