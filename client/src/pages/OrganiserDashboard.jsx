import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import TopBar from '../components/TopBar';

export default function OrganizerAttendance() {
  const [events, setEvents] = useState([]);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const headers = { Authorization: `Bearer ${localStorage.getItem('token')}` };
    
    // Fetch profile
    fetch('https://hubble-d9l6.onrender.com/api/users/me/profile', { headers })
      .then(res => res.json()).then(data => setUser(data));

    // Fetch only events this user manages (founder/cofounder)
    fetch('https://hubble-d9l6.onrender.com/api/events/organizer/my-events', { headers })
      .then(res => res.json()).then(data => setEvents(data));
  }, []);

  return (
    <div className="min-h-screen bg-[#f1f3f6]">
      <div className="mx-auto flex gap-6 rounded-2xl bg-white p-4 shadow-sm min-h-[90vh]">
        <div className="w-64 flex-shrink-0 hidden lg:block border-r border-gray-100 pr-4">
          <Sidebar userRole={user?.role} />
        </div>

        <main className="flex-1 pt-4 pl-4 md:pl-8 pr-6">
          <TopBar user={user} />
          
          <header className="mb-10">
            <h1 className="text-2xl font-bold text-gray-900">Attendance Center</h1>
            <p className="text-sm text-gray-500">Select an event to manage check-ins.</p>
          </header>

          <div className="grid grid-cols-1 gap-4">
            {events.map(event => (
              <div key={event.id} className="flex items-center justify-between p-5 rounded-2xl border border-gray-200 bg-white hover:border-[#ff6b35] transition-all">
                <div>
                  <h3 className="font-bold text-gray-900">{event.title}</h3>
                  <p className="text-xs text-gray-500">{new Date(event.startDate).toDateString()} • {event.location}</p>
                </div>
                <button 
                  onClick={() => navigate(`/manage-event/${event.id}/attendees`)}
                  className="rounded-xl bg-orange-50 px-4 py-2 text-xs font-bold text-[#ff6b35] border border-orange-100 hover:bg-[#ff6b35] hover:text-white transition-all"
                >
                  Manage Attendees
                </button>
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}