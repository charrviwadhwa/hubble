import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import TopBar from '../components/TopBar'; 
import EventCard from '../components/EventFeed';
import Pagination from '../components/Pagination';

export default function Events() {
  const [user, setUser] = useState(null);
  const [events, setEvents] = useState([]);
  const [mySocieties, setMySocieties] = useState([]);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('active');
  const [userRegistrations, setUserRegistrations] = useState([]);
  const navigate = useNavigate();

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  // 1. Data Fetching
  useEffect(() => {
    const headers = { Authorization: `Bearer ${localStorage.getItem('token')}` };
    
    fetch('http://localhost:3001/api/users/me/profile', { headers })
      .then(res => res.json())
      .then(data => setUser(data))
      .catch(err => console.error(err));

    fetch('http://localhost:3001/api/societies/my', { headers })
      .then(res => res.json())
      .then(data => setMySocieties(data))
      .catch(err => console.error(err));

    fetchEvents();
    fetchUserRegistrations();
  }, []);

  const fetchUserRegistrations = async () => {
    try {
      const res = await fetch('http://localhost:3001/api/events/my-registrations', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      const data = await res.json();
      setUserRegistrations(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Error fetching registrations:", err);
      setUserRegistrations([]);
    }
  };

  const fetchEvents = async (query = '') => {
    const url = query
      ? `http://localhost:3001/api/events?q=${query}`
      : 'http://localhost:3001/api/events';
    try {
      const res = await fetch(url);
      const data = await res.json();
      setEvents(data);
      setCurrentPage(1); // 💡 Reset to page 1 whenever search or data changes
    } catch (err) {
      console.error("Error fetching events:", err);
    }
  };

  const handleSearch = (e) => {
    setSearch(e.target.value);
    fetchEvents(e.target.value);
  };

  // 🛠️ CORRECTED LOGIC SECTION
  const now = new Date();
  
  // 1. Filter the events first
  const activeEvents = events.filter(e => new Date(e.startDate) >= now);
  const pastEvents = events.filter(e => new Date(e.startDate) < now);
  const filteredList = filter === 'active' ? activeEvents : pastEvents;

  // 2. Calculate pagination based on the FILTERED list, not the raw array
  const totalPages = Math.ceil(filteredList.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  
  // 3. This is the final 4 events to show
  const currentEvents = filteredList.slice(indexOfFirstItem, indexOfLastItem);

  return (
    <div className="min-h-screen bg-[#f1f3f6] text-[#1a1a1a] font-sans">
      <div className="mx-auto flex gap-6 rounded-2xl bg-white p-4 shadow-sm min-h-[90vh]">
        <div className="w-64 flex-shrink-0 hidden lg:block border-r border-gray-100 pr-4">
           <Sidebar userRole={user?.role} />
        </div>

        <main className="flex-1 overflow-y-auto pt-4 pl-4 md:pl-8">
          <TopBar user={user} />

          <header className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4 pr-6">
            <div>
              <h1 className="text-3xl font-medium text-gray-900">Events Feed</h1>
              <p className="text-sm text-gray-500 mt-1">Discover and register for upcoming campus events.</p>
            </div>
            
            <button 
              onClick={() => mySocieties.length > 0 ? navigate('/create-event') : null}
              className={`flex items-center gap-2 rounded-full px-6 py-2.5 text-sm font-medium transition-colors shadow-md ${
                mySocieties.length > 0 
                ? 'bg-[#ff6b35] text-white hover:bg-[#e85a25]' 
                : 'bg-gray-100 text-gray-400 cursor-not-allowed shadow-none'
              }`}
            >
              <i className="fi fi-rr-plus text-xs"></i> Create Event
            </button>
          </header>

          {mySocieties.length === 0 && (
            <div className="mb-8 pr-6">
               <NoSocietyPlaceholder onRegister={() => navigate('/create-society')} />
            </div>
          )}

          <div className="max-w-7xl pr-6 pb-20">
            <div className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-gray-200 pb-4">
              <div className="flex gap-6">
                <button 
                  onClick={() => { setFilter('active'); setCurrentPage(1); }}
                  className={`relative pb-2 text-sm font-medium transition-colors ${
                    filter === 'active' ? "text-[#ff6b35]" : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  Active Events <span className="ml-1 rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-600">{activeEvents.length}</span>
                  {filter === 'active' && <div className="absolute -bottom-[17px] left-0 h-[2px] w-full bg-[#ff6b35]" />}
                </button>

                <button 
                  onClick={() => { setFilter('past'); setCurrentPage(1); }}
                  className={`relative pb-2 text-sm font-medium transition-colors ${
                    filter === 'past' ? "text-[#ff6b35]" : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  Past Archive <span className="ml-1 rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-600">{pastEvents.length}</span>
                  {filter === 'past' && <div className="absolute -bottom-[17px] left-0 h-[2px] w-full bg-[#ff6b35]" />}
                </button>
              </div>

              <div className="relative w-full sm:w-64">
                <i className="fi fi-rr-search absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs"></i>
                <input
                  type="text"
                  value={search}
                  onChange={handleSearch}
                  placeholder="Filter events..."
                  className="w-full rounded-lg border border-gray-200 bg-gray-50 py-2 pl-9 pr-4 text-sm text-gray-900 outline-none focus:bg-white focus:border-[#ff6b35] focus:ring-1 focus:ring-[#ff6b35]"
                />
              </div>
            </div>

            <section className={`grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3`}>
              {currentEvents.length > 0 ? (
                currentEvents.map((event) => (
                  <EventCard 
                    key={event.id} 
                    event={event} 
                    onRefresh={() => { fetchEvents(); fetchUserRegistrations(); }}
                    isRegistered={(userRegistrations || []).some(reg => reg.id === event.id)} 
                  />
                ))
              ) : (
                <div className="col-span-full py-20 text-center rounded-2xl border border-dashed border-gray-200 bg-gray-50/50">
                  <h3 className="text-base font-semibold text-gray-900">No events found</h3>
                  <p className="mt-1 text-sm text-gray-500">We couldn't find any {filter} events matching your search criteria.</p>
                </div>
              )}
            </section>

            {/* 💡 Pagination placed inside the content container */}
            <Pagination 
              currentPage={currentPage} 
              totalPages={totalPages} 
              onPageChange={(page) => {
                setCurrentPage(page);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }} 
            />
          </div>
        </main>
      </div>
    </div>
  );
}

function NoSocietyPlaceholder({ onRegister }) {
  return (
    <div className="flex flex-col sm:flex-row items-center justify-between rounded-2xl border border-gray-200 bg-gray-50 p-6 shadow-sm gap-6">
      <div className="flex items-center gap-5 text-center sm:text-left">
        <div className="hidden sm:flex h-14 w-14 items-center justify-center rounded-full bg-white border border-gray-200 text-[#ff6b35] shadow-sm text-2xl">
          <i className="fi fi-rr-bank"></i>
        </div>
        <div>
          <h2 className="text-base font-semibold text-gray-900">Unlock Event Creation</h2>
          <p className="mt-1 text-sm text-gray-500 max-w-lg">
            You aren't currently leading any societies at MSIT. Register your organization to host and manage events.
          </p>
        </div>
      </div>
      <button 
        onClick={onRegister}
        className="rounded-lg border border-gray-200 bg-white px-6 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-100 hover:text-gray-900 whitespace-nowrap"
      >
        Register a Society
      </button>
    </div>
  );
}