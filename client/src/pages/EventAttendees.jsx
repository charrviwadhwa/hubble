import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import TopBar from '../components/TopBar';
import { triggerHubbleNotif } from '../utils/notify';

export default function EventAttendees() {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [attendees, setAttendees] = useState([]);
  const [eventData, setEventData] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const headers = { Authorization: `Bearer ${localStorage.getItem('token')}` };

  const fetchData = async () => {
    try {
      // 1. Fetch event details (to show title/society info)
      const eventRes = await fetch(`http://localhost:3001/api/events/${eventId}`, { headers });
      const eData = await eventRes.json();
      setEventData(eData);

      // 2. Fetch attendee list
      const res = await fetch(`http://localhost:3001/api/events/${eventId}/attendees`, { headers });
      const data = await res.json();
      setAttendees(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Error loading attendees:", err);
    }
  };

  useEffect(() => {
    // Fetch user profile for Sidebar
    fetch('http://localhost:3001/api/users/me/profile', { headers })
      .then(res => res.json())
      .then(data => setUser(data));

    fetchData();
  }, [eventId]);

  // Handle Attendance Toggle
  const handleToggleAttendance = async (studentId, currentStatus) => {
    try {
      const res = await fetch(`http://localhost:3001/api/events/${eventId}/attendees/${studentId}/check-in`, {
        method: 'PATCH',
        headers: { ...headers, 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: !currentStatus })
      });

      if (res.ok) {
        // Optimistic UI update: Toggle the state locally so it feels instant
        setAttendees(prev => prev.map(a => 
          a.userId === studentId ? { ...a, attended: !currentStatus } : a
        ));
        triggerHubbleNotif("Success", currentStatus ? "Marked as Absent" : "Student Checked In!");
      }
    } catch (err) {
      console.error("Toggle error:", err);
    }
  };

  // Filter attendees based on search input
  const filteredAttendees = attendees.filter(a => 
    a.studentName.toLowerCase().includes(searchTerm.toLowerCase()) || 
    a.studentEmail.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#f1f3f6] font-sans">
      <div className="mx-auto flex gap-6 rounded-2xl bg-white p-4 shadow-sm min-h-[90vh]">
        
        <div className="w-64 flex-shrink-0 hidden lg:block border-r border-gray-100 pr-4">
           <Sidebar userRole={user?.role} />
        </div>

        <main className="flex-1 overflow-y-auto pt-4 pl-4 md:pl-8 pr-4">
          <TopBar user={user} />

          <button onClick={() => navigate(-1)} className="mb-6 flex items-center gap-2 text-sm text-gray-500 hover:text-[#ff6b35] transition-colors">
            <i className="fi fi-rr-arrow-left"></i> Back
          </button>

          <header className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#ff6b35] bg-orange-50 px-2 py-1 rounded">
                {eventData?.society?.name || "Society Event"}
              </span>
              <h1 className="text-3xl font-bold text-gray-900 mt-2">{eventData?.event?.title}</h1>
              <p className="text-sm text-gray-500 mt-1">
                Total Registrations: <span className="font-bold text-gray-800">{attendees.length}</span>
              </p>
            </div>

            {/* Search Bar */}
            <div className="relative w-full max-w-xs">
              <i className="fi fi-rr-search absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm"></i>
              <input 
                type="text" 
                placeholder="Search by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full rounded-xl border border-gray-200 pl-10 pr-4 py-2 text-sm outline-none focus:border-[#ff6b35] transition-all"
              />
            </div>
          </header>

          {/* Attendee Table */}
          <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm animate-in fade-in slide-in-from-bottom-4 duration-500">
            <table className="w-full text-left">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-[11px] font-black uppercase tracking-wider text-gray-400">Student Info</th>
                  <th className="px-6 py-4 text-[11px] font-black uppercase tracking-wider text-gray-400">Registration Date</th>
                  <th className="px-6 py-4 text-[11px] font-black uppercase tracking-wider text-gray-400 text-right">Attendance</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredAttendees.map((student) => (
                  <tr key={student.userId} className="hover:bg-gray-50/50 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className={`h-9 w-9 rounded-full flex items-center justify-center font-bold text-xs ${student.attended ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'}`}>
                          {student.studentName[0]}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-gray-900">{student.studentName}</p>
                          <p className="text-xs text-gray-500 font-mono">{student.studentEmail}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-xs text-gray-400">
                      {new Date(student.registeredAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => handleToggleAttendance(student.userId, student.attended)}
                        className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black transition-all ${
                          student.attended 
                            ? "bg-green-500 text-white shadow-lg shadow-green-100" 
                            : "bg-white text-gray-400 border border-gray-200 hover:border-[#ff6b35] hover:text-[#ff6b35]"
                        }`}
                      >
                        <i className={`fi ${student.attended ? 'fi-rr-check' : 'fi-rr-plus-small'} text-sm`}></i>
                        {student.attended ? "PRESENT" : "MARK PRESENT"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            
            {filteredAttendees.length === 0 && (
              <div className="p-20 text-center">
                <i className="fi fi-rr-info text-3xl text-gray-200 mb-4 block"></i>
                <p className="text-sm text-gray-400 italic">No students found matching that criteria.</p>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}