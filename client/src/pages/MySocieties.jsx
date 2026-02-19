import { useEffect, useState } from 'react';
import Sidebar from '../components/Sidebar';

export default function MySocieties() {
   const [user, setUser] = useState(null);
  const [societies, setSocieties] = useState([]);
  const [selectedSociety, setSelectedSociety] = useState(null);
  const [societyEvents, setSocietyEvents] = useState({ upcoming: [], past: [] });
  const [hubStats, setHubStats] = useState(null);

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
      fetch('http://localhost:3001/api/users/me/profile', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      })
        .then((res) => res.json())
        .then((data) => setUser(data));
  
    }, []);


const handleViewSociety = async (society) => {
  setSelectedSociety(society);
  
  // 1. Fetch Events
  const resEvents = await fetch(`http://localhost:3001/api/events?societyId=${society.id}`); 
  const dataEvents = await resEvents.json();
  
  // 2. Fetch Hub Stats (Registrations/Attendance/Badges)
  const resStats = await fetch(`http://localhost:3001/api/societies/${society.id}/stats`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
  });
  const dataStats = await resStats.json();
  setHubStats(dataStats); // Save the stats to state

  const now = new Date();
  setSocietyEvents({
    upcoming: dataEvents.filter(e => new Date(e.date) >= now),
    past: dataEvents.filter(e => new Date(e.date) < now)
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
                {societies.length > 0 ? (
        <div className="space-y-3">
          {societies.map(soc => (
            <div key={soc.id} className="group flex items-center justify-between rounded-2xl border border-black/5 bg-white p-4 transition-all hover:border-[#ff6b35] hover:shadow-md">
               {/* Society Card Content */}
               <div className="flex items-center gap-4">
                  <div className="grid h-14 w-14 place-items-center rounded-xl bg-[#f7f3ec] text-xl font-bold text-[#ff6b35] overflow-hidden">
                        {soc.logo ? (
                            <img 
                            src={`http://localhost:3001${soc.logo}`} // Maps to your Express static folder
                            alt={soc.name} 
                            className="h-full w-full object-cover" 
                            />
                        ) : (
                            soc.name[0]
                        )}
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
                 View Hub
               </button>
            </div>
          ))}
        </div>
      ) : (
        /* --- Clean Empty State --- */
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="mb-6 h-20 w-20 rounded-[32px] bg-white border border-dashed border-black/10 grid place-items-center text-4xl opacity-30">
            🏛️
          </div>
          <h2 className="text-xl font-bold text-black/70">No Societies Found</h2>
          <p className="mt-2 max-w-xs text-sm text-black/30 leading-relaxed">
            You aren't currently leading any societies at MSIT. Ready to start something new?
          </p>
          <button 
            onClick={() => window.location.href = '/create-society'}
            className="mt-8 rounded-2xl bg-white border border-black/10 px-8 py-3 text-xs font-bold text-black hover:bg-black hover:text-white transition-all shadow-sm"
          >
            + Create a Society
          </button>
        </div>
      )}
    </>
  ) :(
              <SocietyDetail 
                society={selectedSociety} 
                events={societyEvents} 
                stats={hubStats} // Pass the stats here
                onBack={() => { setSelectedSociety(null); setHubStats(null); }} 
                />
            )}
          </main>
        </div>
      </div>
    </div>
  );
}

function SocietyDetail({ society, events, stats, onBack }) {
  const [showEdit, setShowEdit] = useState(false);
  const [viewingAttendeesFor, setViewingAttendeesFor] = useState(null);
  const [attendees, setAttendees] = useState([]);

  const handleViewAttendees = async (event) => {
    setViewingAttendeesFor(event);
    const res = await fetch(`http://localhost:3001/api/events/organizer/all-stats`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    });
    const data = await res.json();
    const eventAttendees = data.filter(item => item.eventTitle === event.title);
    setAttendees(eventAttendees);
  };

  if (viewingAttendeesFor) {
    return (
      <div className="space-y-6">
        <button onClick={() => setViewingAttendeesFor(null)} className="text-[10px] font-bold uppercase text-black/40 hover:text-black">
          ← Back to Hub
        </button>
        <div className="rounded-[32px] bg-white p-8 border border-black/5 shadow-sm">
          <h2 className="text-2xl font-black mb-2">{viewingAttendeesFor.title}</h2>
          <p className="text-sm text-black/40 mb-6">Attendee Roster</p>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-gray-50 text-[10px] font-bold uppercase text-black/30">
                  <th className="pb-4 px-2">Student Name</th>
                  <th className="pb-4 px-2">Email</th>
                  <th className="pb-4 px-2 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {attendees.map((person, i) => (
                  <tr key={i} className="group hover:bg-gray-50/50 transition-colors">
                    <td className="py-4 px-2 text-sm font-semibold text-gray-700">{person.studentName}</td>
                    <td className="py-4 px-2 text-sm text-gray-400">{person.studentEmail}</td>
                    <td className="py-4 px-2 text-right">
                       <span className="px-3 py-1 bg-green-50 text-green-600 rounded-full text-[10px] font-bold uppercase">Registered</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <button onClick={onBack} className="text-[10px] font-bold uppercase tracking-widest text-black/40 hover:text-black">← Back to List</button>
      
      {/* 1. Hub Stats Header */}
      <div className="rounded-[32px] bg-white p-8 border border-black/5 shadow-sm">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-6">
            <div className="grid h-14 w-14 place-items-center rounded-xl bg-[#f7f3ec] text-xl font-bold text-[#ff6b35] overflow-hidden">
                    {society.logo ? (
                        <img 
                        src={`http://localhost:3001${society.logo}`} 
                        alt={society.name} 
                        className="h-full w-full object-cover" 
                        />
                    ) : (
                        society.name[0]
                    )}
                    </div>
            <div>
              <h2 className="text-3xl font-bold tracking-tight">{society?.name}</h2>
              <p className="text-black/40 text-sm">{society?.category}</p>
            </div>
          </div>
          
          <div className="flex gap-4">
            <StatPill label="Registered" value={stats?.stats?.totalRegistrations} />
            <StatPill label="Attended" value={stats?.stats?.totalAttended} />
            <button onClick={() => setShowEdit(true)} className="h-14 w-14 rounded-2xl border border-black/10 flex items-center justify-center hover:bg-gray-50 transition">⚙️</button>
          </div>
        </div>
      </div>

      {/* 2. Achievement Section - Added this to make HubBadge visible */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
  <div className="rounded-[32px] bg-white p-6 border border-black/5 shadow-sm">
    <h3 className="text-lg font-bold mb-6">Society Milestones</h3>
    <div className="flex justify-around">
      <HubBadge icon="🌱" title="Pioneer" unlocked={stats?.badges?.pioneer} color="bg-orange-50" />
      <HubBadge icon="🔥" title="Active" unlocked={stats?.badges?.regular} color="bg-blue-50" />
      <HubBadge icon="👑" title="Lead" unlocked={stats?.badges?.organizer} color="bg-purple-50" />
    </div>
  </div>

  {/* 🚀 NEW: Using QuickStat for Society Insights */}
  <div className="rounded-[32px] bg-white p-6 border border-black/5 shadow-sm">
    <h3 className="text-lg font-bold mb-6">Society Insights</h3>
    <div className="flex gap-4 overflow-x-auto pb-2">
      <QuickStat 
        label="Total Events" 
        value={(events?.upcoming?.length || 0) + (events?.past?.length || 0)} 
        icon="📅" 
      />
      <QuickStat 
        label="Impact Score" 
        value={stats?.stats?.totalAttended * 10 || 0} 
        icon="✨" 
      />
    </div>
  </div>
</div>

      {/* 3. Event Lists Section */}
      <div className="space-y-12">
        <section>
          <h3 className="mb-4 flex items-center gap-2 font-bold text-gray-800">
            <span className="h-2 w-2 rounded-full bg-green-500"></span> Upcoming Events
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {events?.upcoming?.map(e => (
              <SmallEventCard key={e.id} event={e} onClick={() => handleViewAttendees(e)} />
            ))}
            {(!events?.upcoming || events.upcoming.length === 0) && <p className="text-sm text-black/30 italic">No active events.</p>}
          </div>
        </section>

        <section>
          <h3 className="mb-4 flex items-center gap-2 font-bold text-gray-800">
            <span className="h-2 w-2 rounded-full bg-gray-300"></span> Past Archive
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 opacity-60 grayscale-[0.3]">
            {events?.past?.map(e => (
              <SmallEventCard key={e.id} event={e} onClick={() => handleViewAttendees(e)} />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
function SmallEventCard({ event, onClick }) {
  return (
    <div className="flex items-center justify-between rounded-2xl bg-white border border-black/5 p-4 hover:border-[#ff6b35]/30 transition-all">
       <div className="flex items-center gap-4">
          <div className="h-12 w-12 rounded-lg bg-[#f7f3ec] flex flex-col items-center justify-center text-[10px] font-bold">
            <span className="text-[#ff6b35]">{new Date(event.date).toLocaleString('default', { month: 'short' })}</span>
            <span>{new Date(event.date).getDate()}</span>
          </div>
          <div>
            <h4 className="font-bold text-sm leading-tight text-gray-800">{event.title}</h4>
            <p className="text-[10px] text-black/40">{event.location}</p>
          </div>
       </div>
       <button 
         onClick={onClick}
         className="text-[10px] font-bold text-[#ff6b35] hover:underline"
       >
         View Attendees →
       </button>
    </div>
  );
}
function StatPill({ label, value }) {
  return (
    <div className="bg-[#f7f3ec] p-4 rounded-2xl min-w-[110px] text-center border border-black/5">
      <p className="text-[9px] font-bold text-black/30 uppercase tracking-tighter">{label}</p>
      <p className="text-2xl font-black text-[#1a1a1a]">{value || 0}</p>
    </div>
  );
}

// 2. HubBadge: Shows the gamified society achievements
function HubBadge({ icon, title, unlocked, color }) {
  return (
    <div className={`text-center transition-all duration-500 ${unlocked ? 'opacity-100 scale-100' : 'opacity-20 grayscale scale-90'}`}>
      <div className={`h-16 w-16 ${color} rounded-full flex items-center justify-center text-2xl mb-2 shadow-inner border border-black/5`}>
        {icon}
      </div>
      <p className="text-[9px] font-black uppercase text-black/60">{title}</p>
    </div>
  );
}

// 3. QuickStat: Used for general stats if needed
function QuickStat({ label, value, icon }) {
  return (
    <div className="rounded-3xl bg-white p-4 text-center border border-black/5 shadow-sm min-w-[100px]">
      <div className="text-lg mb-1">{icon}</div>
      <p className="text-xl font-black">{value || 0}</p>
      <p className="text-[9px] font-bold uppercase text-black/30 tracking-wider">{label}</p>
    </div>
  );
}

