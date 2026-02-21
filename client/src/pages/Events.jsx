import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import EventCard from '../components/EventFeed';

export default function Events() {
  const [user, setUser] = useState(null);
  const [events, setEvents] = useState([]);
  const [mySocieties, setMySocieties] = useState([]); // Track if user leads a society
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('active');
  const navigate = useNavigate();

  const now = new Date();
  const activeEvents = events.filter(e => new Date(e.startDate) >= now);
  const pastEvents = events.filter(e => new Date(e.startDate) < now);

  const displayedEvents = filter === 'active' ? activeEvents : pastEvents;

  useEffect(() => {
    // 1. Fetch User Profile for Sidebar and Role
    fetch('http://localhost:3001/api/users/me/profile', {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    })
      .then((res) => res.json())
      .then((data) => setUser(data));

    // 2. Fetch User's Societies to verify eligibility for hosting
    fetch('http://localhost:3001/api/societies/my', {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    })
      .then((res) => res.json())
      .then((data) => setMySocieties(data));

    fetchEvents();
  }, []);


// 1. Ensure the initial state is always an empty array
const [userRegistrations, setUserRegistrations] = useState([]);

const fetchUserRegistrations = async () => {
  try {
    const res = await fetch('http://localhost:3001/api/events/my-registrations', {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    });
    
    const data = await res.json();

    // 2. Check if the data is actually an array before setting state
    if (Array.isArray(data)) {
      setUserRegistrations(data);
    } else {
      console.warn("Expected array for registrations, got:", data);
      setUserRegistrations([]); // Fallback to empty array to prevent crash
    }
  } catch (err) {
    console.error("Error fetching registrations:", err);
    setUserRegistrations([]); // Fallback on network error
  }
};

useEffect(() => {
  fetchEvents();
  fetchUserRegistrations();
}, []);
  const fetchEvents = async (query = '') => {
    const url = query
      ? `http://localhost:3001/api/events?q=${query}`
      : 'http://localhost:3001/api/events';
    const res = await fetch(url);
    const data = await res.json();
    setEvents(data);
  };

  const handleSearch = (e) => {
    setSearch(e.target.value);
    fetchEvents(e.target.value);
  };

  const initials = user?.name ? user.name.split(' ').map(p => p[0]).join('').slice(0, 2).toUpperCase() : 'HB';

  return (
    <div className="min-h-screen bg-[#f3efe8] p-4 md:p-6">
      <div className="mx-auto max-w-[1380px] rounded-[28px] border border-black/10 bg-[#f7f3ec] p-3 shadow-lg md:p-4">
        <div className="flex flex-col gap-4 lg:flex-row">
          <Sidebar userRole={user?.role} />

          <main className="flex-1 rounded-2xl bg-[#f9f6ef] p-4 md:p-5 overflow-y-auto">
            <header className="mb-4 rounded-2xl bg-white p-4 border border-black/10">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-xs text-black/45">Dashboard / Events</p>
                  <h1 className="text-3xl font-semibold tracking-tight text-[#1a1a1a]">Events</h1>
                </div>

                <div className="flex items-center gap-2">
                  {/* --- FUNCTIONAL CREATE BUTTON --- */}
                  <button 
                    onClick={() => mySocieties.length > 0 ? navigate('/create-event') : null}
                    className={`flex items-center gap-2 rounded-full px-5 py-2.5 text-xs font-bold transition-all ${
                      mySocieties.length > 0 
                      ? 'bg-[#ff6b35] text-white shadow-lg shadow-[#ff6b35]/20 hover:scale-105' 
                      : 'bg-black/5 text-black/20 cursor-not-allowed'
                    }`}
                  >
                    <span className="text-lg">+</span> Create Event
                  </button>
                  
                  <div className="ml-1 flex items-center gap-2 rounded-full border border-black/10 bg-white px-2 py-1.5 shadow-sm">
                    <div className="grid h-8 w-8 place-items-center rounded-full bg-[#ff6b35] text-xs font-bold text-white">{initials}</div>
                    <div className="pr-2">
                      <p className="text-xs font-semibold text-[#1b1b1b]">{user?.name || 'Loading...'}</p>
                      <p className="text-[10px] capitalize text-black/50">{user?.role || 'member'}</p>
                    </div>
                  </div>
                </div>
              </div>
            </header>

            {/* If user is not a lead, show the Placeholder Card */}
            {mySocieties.length === 0 && (
              <NoSocietyPlaceholder onRegister={() => navigate('/create-society')} />
            )}

            {/* Filters Section */}
{/* Filters Section */}
<section className="mb-5 rounded-2xl border border-black/10 bg-white p-4 shadow-sm">
  <div className="flex flex-wrap items-center gap-2">
    <button 
      onClick={() => setFilter('active')}
      className={`rounded-full px-4 py-1.5 text-xs font-semibold transition-all ${
        filter === 'active' 
        ? "bg-[#ff6b35] text-white shadow-md shadow-[#ff6b35]/20" 
        : "bg-black/5 text-black/40 hover:bg-black/10"
      }`}
    >
      Active ({activeEvents.length})
    </button>

    <button 
      onClick={() => setFilter('past')}
      className={`rounded-full px-4 py-1.5 text-xs font-semibold transition-all ${
        filter === 'past' 
        ? "bg-[#ff6b35] text-white shadow-md shadow-black/20" 
        : "bg-black/5 text-black/40 hover:bg-black/10"
      }`}
    >
      Past ({pastEvents.length})
    </button>

    <div className="ml-auto flex min-w-[260px] items-center rounded-full border border-black/10 bg-[#faf8f2] px-4 py-2">
      <input
        type="text"
        value={search}
        onChange={handleSearch}
        placeholder="Search events at MSIT..."
        className="w-full bg-transparent text-xs text-black/70 outline-none placeholder:text-black/35"
      />
    </div>
  </div>
</section>

{/* 🟢 The ONLY Event Grid you need */}
<section className={`grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4 transition-all duration-500 ${filter === 'past' ? 'opacity-70 grayscale-[0.3]' : ''}`}>
  {displayedEvents.length > 0 ? (
    displayedEvents.map((event, index) => (
      <EventCard 
        key={event.id} 
        event={event} 
        onRefresh={() => { fetchEvents(); fetchUserRegistrations(); }}
        isRegistered={(userRegistrations || []).some(reg => reg.id === event.id)} 
      />
    ))
  ) : (
    <div className="col-span-full rounded-2xl bg-white/50 p-12 text-center border border-dashed border-black/10">
      <p className="text-sm text-black/40 italic">No {filter} events found matching your search.</p>
    </div>
  )}
</section>

{/* ❌ DELETE THE OLD SECTION THAT WAS BELOW THIS LINE ❌ */}

       
            
          </main>
        </div>
      </div>
    </div>
  );
}

// 🏛️ Placeholder Component for Regular Students
function NoSocietyPlaceholder({ onRegister }) {
  return (
    <div className="mb-6 flex flex-col items-center justify-between rounded-[32px] bg-gradient-to-r from-[#ff6b35]/5 to-transparent p-8 border border-[#ff6b35]/10 md:flex-row">
      <div className="max-w-md text-center md:text-left">
        <h2 className="text-xl font-bold text-[#1a1a1a]">Become a Society Leader</h2>
        <p className="mt-2 text-sm text-black/40 leading-relaxed">
          You aren't currently leading any societies at MSIT. To host events and access the Society Hub, you'll need to register your organization first.
        </p>
      </div>
      <button 
        onClick={onRegister}
        className="mt-6 rounded-2xl bg-white border border-black/10 px-8 py-3 text-xs font-bold text-black hover:bg-black hover:text-white transition-all shadow-sm md:mt-0"
      >
        Register My Society →
      </button>
    </div>
  );
}