import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import TopBar from '../components/TopBar';

export default function MySocieties() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [societies, setSocieties] = useState([]);
  const [selectedSociety, setSelectedSociety] = useState(null);
  const [societyEvents, setSocietyEvents] = useState({ upcoming: [], past: [] });
  const [hubStats, setHubStats] = useState(null);

  useEffect(() => {
    // Fetch User Profile
    fetch('http://localhost:3001/api/users/me/profile', {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    })
    .then((res) => res.json())
    .then((data) => setUser(data))
    .catch(err => console.error(err));

    // Fetch User's Societies
    fetch("http://localhost:3001/api/societies/my", {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    })
    .then(res => res.json())
    .then(data => setSocieties(data))
    .catch(err => console.error(err));
  }, []);

  const handleViewSociety = async (society) => {
    setSelectedSociety(society);
    
    // Fetch Events
    const resEvents = await fetch(`http://localhost:3001/api/events?societyId=${society.id}`); 
    const dataEvents = await resEvents.json();
    
    // Fetch Hub Stats
    const resStats = await fetch(`http://localhost:3001/api/societies/${society.id}/stats`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    });
    const dataStats = await resStats.json();
    setHubStats(dataStats);

    const now = new Date();
    setSocietyEvents({
      upcoming: dataEvents.filter(e => new Date(e.startDate || e.date) >= now),
      past: dataEvents.filter(e => new Date(e.startDate || e.date) < now)
    });
  };

  return (
    <div className="min-h-screen bg-[#f1f3f6]  text-[#1a1a1a] font-sans">
      <div className="mx-auto flex  gap-6 rounded-2xl bg-white p-4 shadow-sm min-h-[90vh]">
        <div className="w-64 flex-shrink-0 hidden lg:block border-r border-gray-100 pr-4">
           <Sidebar userRole={user?.role} />
        </div>

        <main className="flex-1 overflow-y-auto pt-4 pl-4 md:pl-8">
          <TopBar user={user} />

          {!selectedSociety ? (
            <div className="animate-in fade-in duration-500">
              <header className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4 pr-6">
                <div>
                  <h1 className="text-3xl font-medium text-gray-900">My Societies</h1>
                  <p className="text-sm text-gray-500 mt-1">Manage your college organizations and hubs.</p>
                </div>
                <button 
                  onClick={() => navigate('/create-society')}
                  className="rounded-full bg-[#ff6b35] px-6 py-2.5 text-sm font-medium text-white shadow-md hover:bg-[#e85a25] transition-colors flex items-center gap-2"
                >
                  <i className="fi fi-rr-plus text-xs"></i> Register Society
                </button>
              </header>

              <div className="max-w-4xl pr-6 pb-20">
                {societies.length > 0 ? (
                  <div className="grid gap-3">
                    {societies.map(soc => (
                      <div key={soc.id} className="group flex items-center justify-between p-4 rounded-xl border border-gray-200 hover:border-[#ff6b35] hover:shadow-sm transition-all bg-white cursor-pointer" onClick={() => handleViewSociety(soc)}>
                        <div className="flex items-center gap-4">
                          <div className="h-12 w-12 rounded-lg bg-gray-50 border border-gray-100 overflow-hidden flex items-center justify-center text-[#ff6b35] font-bold">
                            {soc.logo ? (
                              <img src={`http://localhost:3001${soc.logo}`} alt={soc.name} className="h-full w-full object-cover" />
                            ) : soc.name[0].toUpperCase()}
                          </div>
                          <div>
                            <h3 className="text-sm font-semibold text-gray-900">{soc.name}</h3>
                            <p className="text-xs text-gray-500 line-clamp-1 mt-0.5">{soc.description}</p>
                          </div>
                        </div>
                        <div className="text-[#ff6b35] opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-2 text-sm font-medium">
                          View Hub <i className="fi fi-rr-arrow-right"></i>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-20 text-center border border-dashed border-gray-200 rounded-2xl bg-gray-50/50">
                    <div className="mb-4 h-16 w-16 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-400 text-2xl shadow-sm">
                      <i className="fi fi-rr-bank"></i>
                    </div>
                    <h2 className="text-base font-semibold text-gray-900">No Societies Found</h2>
                    <p className="mt-1 max-w-sm text-sm text-gray-500">You aren't currently leading any societies at MSIT. Ready to start something new?</p>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <SocietyDetail 
              society={selectedSociety} 
              events={societyEvents} 
              stats={hubStats} 
              onBack={() => { setSelectedSociety(null); setHubStats(null); }} 
            />
          )}
        </main>
      </div>
    </div>
  );
}

function SocietyDetail({ society, events, stats, onBack }) {
  const [viewingAttendeesFor, setViewingAttendeesFor] = useState(null);
  const [attendees, setAttendees] = useState([]);

  const handleViewAttendees = async (event) => {
    if (!event || !event.title) return;
    setViewingAttendeesFor(event);
    try {
      const res = await fetch(`http://localhost:3001/api/events/organizer/all-stats`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      if (res.ok) {
        const data = await res.json();
        setAttendees(data.filter(item => item.eventTitle === event.title));
      }
    } catch (err) {
      console.error("Failed to fetch attendees:", err);
    }
  };

  if (viewingAttendeesFor) {
    return (
      <div className="max-w-4xl pr-6 pb-20 animate-in fade-in slide-in-from-right-4 duration-300">
        <button onClick={() => setViewingAttendeesFor(null)} className="mb-6 flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-[#ff6b35] transition-colors">
          <i className="fi fi-rr-arrow-left"></i> Back to Hub
        </button>
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-gray-900">{viewingAttendeesFor.title}</h2>
          <p className="text-sm text-gray-500 mb-6 mt-1">Attendee Roster</p>
          <div className="overflow-hidden rounded-xl border border-gray-100">
            <table className="w-full text-left">
              <thead className="bg-gray-50">
                <tr className="border-b border-gray-200 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  <th className="py-3 px-4">Student Name</th>
                  <th className="py-3 px-4">Email</th>
                  <th className="py-3 px-4 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {attendees.map((person, i) => (
                  <tr key={i} className="hover:bg-gray-50/50 transition-colors">
                    <td className="py-3 px-4 text-sm font-medium text-gray-900">{person.studentName}</td>
                    <td className="py-3 px-4 text-sm text-gray-500">{person.studentEmail}</td>
                    <td className="py-3 px-4 text-right">
                       <span className="px-2.5 py-1 bg-green-50 text-green-700 rounded-md text-xs font-medium border border-green-200">Registered</span>
                    </td>
                  </tr>
                ))}
                {attendees.length === 0 && (
                  <tr>
                    <td colSpan="3" className="py-8 text-center text-sm text-gray-500 italic">No students registered yet.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl pr-6 pb-20 space-y-8 animate-in fade-in slide-in-from-right-4 duration-300">
      <button onClick={onBack} className="flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-[#ff6b35] transition-colors">
        <i className="fi fi-rr-arrow-left"></i> Back to Societies
      </button>
      
      {/* 1. Hub Stats Header */}
      <section className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8 rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
        <div className="flex items-center gap-6">
          <div className="h-20 w-20 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center text-3xl font-bold text-[#ff6b35] overflow-hidden">
            {society.logo ? (
              <img src={`http://localhost:3001${society.logo}`} alt={society.name} className="h-full w-full object-cover" />
            ) : society.name[0].toUpperCase()}
          </div>
          <div>
            <h2 className="text-2xl font-semibold text-gray-900">{society?.name}</h2>
            <p className="text-sm text-gray-500 font-medium mt-1">{society?.category}</p>
          </div>
        </div>
        <div className="flex gap-4 w-full md:w-auto">
          <QuickStat label="Registered" value={stats?.stats?.totalRegistrations || 0} icon="fi-rr-users" />
          <QuickStat label="Attended" value={stats?.stats?.totalAttended || 0} icon="fi-rr-checkbox" />
        </div>
      </section>

      {/* 2. Achievement Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <h3 className="text-base font-semibold text-gray-900 mb-6">Society Milestones</h3>
          <div className="flex justify-around">
            <HubBadge icon="fi-rr-leaf" title="Pioneer" unlocked={stats?.badges?.pioneer} />
            <HubBadge icon="fi-rr-flame" title="Active" unlocked={stats?.badges?.regular} />
            <HubBadge icon="fi-rr-crown" title="Lead" unlocked={stats?.badges?.organizer} />
          </div>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <h3 className="text-base font-semibold text-gray-900 mb-6">Society Insights</h3>
          <div className="flex gap-4">
            <QuickStat label="Total Events" value={(events?.upcoming?.length || 0) + (events?.past?.length || 0)} icon="fi-rr-calendar" />
            <QuickStat label="Impact Score" value={(stats?.stats?.totalAttended || 0) * 10} icon="fi-rr-star" />
          </div>
        </div>
      </div>

      {/* 3. Event Lists Section */}
      <div className="space-y-8">
        <section>
          <h3 className="mb-4 text-base font-semibold text-gray-900 flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-green-500"></span> Upcoming Events
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {events?.upcoming?.map(e => (
              <SmallEventCard key={e.id} event={e} onClick={() => handleViewAttendees(e)} />
            ))}
            {(!events?.upcoming || events.upcoming.length === 0) && (
              <div className="col-span-full py-8 text-center rounded-xl border border-dashed border-gray-200 bg-gray-50/50">
                <p className="text-sm text-gray-500 italic">No active events.</p>
              </div>
            )}
          </div>
        </section>

        <section>
          <h3 className="mb-4 text-base font-semibold text-gray-900 flex items-center gap-2 opacity-60">
            <span className="h-2 w-2 rounded-full bg-gray-400"></span> Past Archive
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 opacity-70 grayscale hover:grayscale-0 transition-all duration-500">
            {events?.past?.map(e => (
              <SmallEventCard key={e.id} event={e} onClick={() => handleViewAttendees(e)} />
            ))}
            {(!events?.past || events.past.length === 0) && (
              <p className="text-sm text-gray-400 italic">Archive is empty.</p>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}

function SmallEventCard({ event, onClick }) {
  const formatDate = (dateString) => {
    if (!dateString) return "TBA";
    return new Date(dateString).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
  };

  return (
    <div onClick={onClick} className="group flex items-center gap-4 rounded-xl border border-gray-200 bg-white p-3 transition-all hover:border-[#ff6b35] hover:shadow-sm cursor-pointer">
      <div className="h-14 w-14 flex-shrink-0 overflow-hidden rounded-lg bg-gray-50 border border-gray-100 flex items-center justify-center text-gray-300">
        {event.banner ? (
          <img src={`http://localhost:3001${event.banner}`} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" alt="Event" />
        ) : (
          <i className="fi fi-rr-picture text-xl"></i>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <h4 className="truncate text-sm font-semibold text-gray-900">{event.title}</h4>
        <div className="flex items-center gap-1.5 text-xs text-gray-500 mt-1">
          <i className="fi fi-rr-calendar text-gray-400"></i>
          <span>{formatDate(event.startDate)}</span>
        </div>
      </div>
      <div className="h-8 w-8 rounded-full flex items-center justify-center text-gray-400 group-hover:bg-[#ff6b35]/10 group-hover:text-[#ff6b35] transition-colors">
        <i className="fi fi-rr-arrow-right text-sm"></i>
      </div>
    </div>
  );
}

/* Boutiq Styled Sub-components */
function QuickStat({ label, value, icon }) {
  return (
    <div className="flex-1 flex items-center gap-3 rounded-xl border border-gray-200 bg-gray-50/50 p-4 min-w-[130px]">
      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white border border-gray-200 text-gray-500 shadow-sm">
        <i className={`fi ${icon} text-lg mt-0.5`}></i>
      </div>
      <div>
        <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">{label}</p>
        <p className="text-xl font-bold text-gray-900 leading-tight">{value || 0}</p>
      </div>
    </div>
  );
}

function HubBadge({ icon, title, unlocked }) {
  return (
    <div className={`flex flex-col items-center gap-2 transition-all duration-500 ${unlocked ? 'opacity-100' : 'opacity-40 grayscale'}`}>
      <div className={`flex h-14 w-14 items-center justify-center rounded-full border-2 shadow-sm ${unlocked ? 'border-[#ff6b35]/20 bg-[#ff6b35]/5 text-[#ff6b35]' : 'border-gray-200 bg-gray-50 text-gray-400'}`}>
        <i className={`fi ${icon} text-xl mt-1`}></i>
      </div>
      <p className="text-xs font-semibold text-gray-700">{title}</p>
    </div>
  );
}