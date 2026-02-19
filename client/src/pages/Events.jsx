import { useEffect, useState } from 'react';
import Sidebar from '../components/Sidebar';
import EventCard from '../components/EventFeed';

export default function Events() {
  const [user, setUser] = useState(null);
  const [events, setEvents] = useState([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetch('http://localhost:3001/api/users/me/profile', {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    })
      .then((res) => res.json())
      .then((data) => setUser(data));

    fetchEvents();
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

  const initials = user?.name
    ? user.name
      .split(' ')
      .map((part) => part[0])
      .join('')
      .slice(0, 2)
      .toUpperCase()
    : 'HB';

  return (
    <div className="min-h-screen bg-[#f3efe8] p-4 md:p-6">
      <div className="mx-auto max-w-[1380px] rounded-[28px] border border-black/10 bg-[#f7f3ec] p-3 shadow-[0_12px_30px_rgba(0,0,0,0.08)] md:p-4">
        <div className="flex flex-col gap-4 lg:flex-row">
          <Sidebar userRole={user?.role} />

          <main className="flex-1 rounded-2xl bg-[#f9f6ef] p-4 md:p-5">
            <header className="mb-4 rounded-2xl bg-white p-4 border border-black/10">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-xs text-black/45">Dashboard / Events</p>
                  <h1 className="text-3xl font-semibold tracking-tight text-[#1a1a1a]">Events</h1>
                </div>

                <div className="flex items-center gap-2">
                  <button className="grid h-9 w-9 place-items-center rounded-full bg-[#161616] text-white">+</button>
                  <button className="grid h-9 w-9 place-items-center rounded-full bg-[#161616] text-white">*</button>
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

            <section className="mb-5 rounded-2xl border border-black/10 bg-white p-4 shadow-sm">
              <div className="flex flex-wrap items-center gap-2">
                <button className="rounded-full bg-[#ff6b35] px-4 py-1.5 text-xs font-semibold text-white">Active ({events.length})</button>
                <button className="rounded-full bg-[#f3ece2] px-4 py-1.5 text-xs font-medium text-black/60">Draft</button>
                <button className="rounded-full bg-[#f3ece2] px-4 py-1.5 text-xs font-medium text-black/60">Past</button>

                <div className="ml-auto flex min-w-[260px] items-center rounded-full border border-black/10 bg-[#faf8f2] px-4 py-2">
                  <input
                    type="text"
                    value={search}
                    onChange={handleSearch}
                    placeholder="Search event, location, etc"
                    className="w-full bg-transparent text-xs text-black/70 outline-none placeholder:text-black/35"
                  />
                </div>

                <button className="rounded-full bg-[#f3ece2] px-4 py-2 text-xs text-black/70">All Category</button>
                <button className="rounded-full bg-[#f3ece2] px-4 py-2 text-xs text-black/70">This Month</button>
              </div>
            </section>

            <section className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
              {events.length > 0 ? (
                events.map((event, index) => (
                  <EventCard
                    key={event.id}
                    event={event}
                    index={index}
                    onRefresh={fetchEvents}
                  />
                ))
              ) : (
                <p className="col-span-full rounded-2xl bg-white p-10 text-center text-sm text-black/55 border border-black/10">
                  No events found. Try a different search term.
                </p>
              )}
            </section>
          </main>
        </div>
      </div>
    </div>
  );
}
