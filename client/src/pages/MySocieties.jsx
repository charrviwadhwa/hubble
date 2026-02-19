import { useEffect, useState } from 'react';
import Sidebar from '../components/Sidebar';

export default function MySocieties() {
   const [user, setUser] = useState(null);
  const [societies, setSocieties] = useState([]);
  const [selectedSociety, setSelectedSociety] = useState(null);
  const [societyEvents, setSocietyEvents] = useState({ upcoming: [], past: [] });

  useEffect(() => {
    // Fetch societies the user is part of or all campus societies
    fetch("http://localhost:3001/api/societies/my", {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    })
    .then(res => res.json())
    .then(data => setSocieties(data));
  }, []);
  useEffect(() => {
      // 1. Fetch Profile
      fetch('http://localhost:3001/api/users/profile', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      })
        .then((res) => res.json())
        .then((data) => setUser(data));
  
    }, []);

  // frontend/pages/MySocieties.jsx

// Inside your handleViewSociety function
const handleViewSociety = async (society) => {
  setSelectedSociety(society);
  
  // Notice the query parameter: ?societyId=...
  const res = await fetch(`http://localhost:3001/api/events?societyId=${society.id}`); 
  const data = await res.json();
  
  const now = new Date();
  setSocietyEvents({
    upcoming: data.filter(e => new Date(e.date) >= now),
    past: data.filter(e => new Date(e.date) < now)
  });
};
  const initials = user?.name ? user.name.split(' ').map(p => p[0]).join('').slice(0, 2).toUpperCase() : 'HB';

  return (
    <div className="min-h-screen bg-[#f3efe8] p-4 md:p-6">
      <div className="mx-auto max-w-[1380px] rounded-[28px] border border-black/10 bg-[#f7f3ec] p-3 shadow-lg md:p-4">
        <div className="flex flex-col gap-4 lg:flex-row">
          <Sidebar />

          <main className="flex-1 rounded-2xl bg-[#f9f6ef] p-4 md:p-6 overflow-y-auto">
            {!selectedSociety ? (
              <>
            <header className="mb-4 rounded-2xl bg-white p-4 border border-black/10">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-xs text-black/45">My Societies</p>
                  <h1 className="text-3xl font-semibold tracking-tight text-[#1a1a1a]">My Societies</h1>
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
                {/* List View Style (from your reference) */}
                <div className="space-y-3">
                  {societies.map(soc => (
                    <div key={soc.id} className="group flex items-center justify-between rounded-2xl border border-black/5 bg-white p-4 transition-all hover:border-[#ff6b35] hover:shadow-md">
                      <div className="flex items-center gap-4">
                        <div className="grid h-14 w-14 place-items-center rounded-xl bg-[#f7f3ec] text-xl font-bold text-[#ff6b35]">
                          {soc.logo ? <img src={soc.logo} alt="" className="rounded-xl" /> : soc.name[0]}
                        </div>
                        <div>
                          <h3 className="font-bold text-gray-900">{soc.name}</h3>
                          <p className="text-xs text-black/40 line-clamp-1">{soc.description}</p>
                        </div>
                      </div>
                      <button 
                        onClick={() => handleViewSociety(soc)}
                        className="rounded-full bg-[#161616] px-5 py-2 text-xs font-bold text-white transition hover:bg-[#ff6b35]"
                      >
                        View Events
                      </button>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <SocietyDetail 
                society={selectedSociety} 
                events={societyEvents} 
                onBack={() => setSelectedSociety(null)} 
              />
            )}
          </main>
        </div>
      </div>
    </div>
  );
}

function SocietyDetail({ society, events, onBack }) {
  return (
    <div>
      <button onClick={onBack} className="mb-6 text-xs font-bold text-black/40 hover:text-black">← Back to Societies</button>
      
      <div className="mb-10 flex items-center gap-6">
        <div className="h-20 w-20 rounded-3xl bg-white border border-black/10 grid place-items-center text-3xl">{society.name[0]}</div>
        <div>
          <h2 className="text-4xl font-bold tracking-tight">{society.name}</h2>
          <p className="text-gray-500">{society.description}</p>
        </div>
      </div>

      <div className="space-y-12">
        {/* Upcoming Events */}
        <section>
          <h3 className="mb-4 flex items-center gap-2 font-bold text-gray-800">
            <span className="h-2 w-2 rounded-full bg-green-500"></span> Upcoming Events
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {events.upcoming.map(e => <SmallEventCard key={e.id} event={e} />)}
            {events.upcoming.length === 0 && <p className="text-sm text-black/30 italic">No upcoming events scheduled.</p>}
          </div>
        </section>

        {/* Past Events */}
        <section>
          <h3 className="mb-4 flex items-center gap-2 font-bold text-gray-800">
            <span className="h-2 w-2 rounded-full bg-gray-400"></span> Archive
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 opacity-70 grayscale-[0.5]">
            {events.past.map(e => <SmallEventCard key={e.id} event={e} />)}
          </div>
        </section>
      </div>
    </div>
  );
}

function SmallEventCard({ event }) {
  return (
    <div className="flex items-center gap-4 rounded-2xl bg-white border border-black/5 p-3">
       <div className="h-12 w-12 rounded-lg bg-[#f7f3ec] flex flex-col items-center justify-center text-[10px] font-bold">
         <span className="text-[#ff6b35]">{new Date(event.date).toLocaleString('default', { month: 'short' })}</span>
         <span>{new Date(event.date).getDate()}</span>
       </div>
       <div>
         <h4 className="font-bold text-sm leading-tight">{event.title}</h4>
         <p className="text-[10px] text-black/40">{event.location}</p>
       </div>
    </div>
  );
}