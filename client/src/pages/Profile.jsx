import { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import TopBar from '../components/TopBar';
import { triggerHubbleNotif } from '../utils/notify';

export default function Profile() {
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState({ totalRegistered: 0, attended: 0, upcoming: 0 });
  const [pastEvents, setPastEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '', branch: '', year: '', github: '', linkedin: '', leetcode: '', codechef: ''
  });

  const fetchData = async () => {
    try {
      const headers = { Authorization: `Bearer ${localStorage.getItem('token')}` };

      // 1. Fetch User Profile
      const userRes = await fetch('https://hubble-d9l6.onrender.com/api/users/me/profile', { headers });
      const userData = await userRes.json();
      
      setUser(userData);
      setFormData({
        name: userData.name || '',
        branch: userData.branch || '',
        year: userData.year || '',
        github: userData.github || '',
        linkedin: userData.linkedin || '',
        leetcode: userData.leetcode || '',
        codechef: userData.codechef || ''
      });

      // 2. Fetch Registrations
      const regRes = await fetch('https://hubble-d9l6.onrender.com/api/events/my-registrations', { headers });
      const regData = await regRes.json();

      if (Array.isArray(regData)) {
        const now = new Date();
        const total = regData.length;
        const attendedCount = regData.filter(event => event.attended).length;
        const upcomingCount = regData.filter(event => new Date(event.startDate) > now).length;

        setStats({ totalRegistered: total, attended: attendedCount, upcoming: upcomingCount });
        setPastEvents(regData.filter(event => new Date(event.startDate) <= now));
      }
      setLoading(false);
    } catch (err) {
      console.error("Failed to load profile data", err);
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const handleSaveProfile = async (e) => {
  e.preventDefault();
  
  // Create a clean object with ONLY the columns that exist in your schema.js
  const cleanData = {
    name: formData.name,
    branch: formData.branch,
    year: formData.year,
    github: formData.github,
    linkedin: formData.linkedin
  };

  try {
    const res = await fetch('https://hubble-d9l6.onrender.com/api/users/me/profile', {
      method: 'PATCH',
      headers: { 
        'Content-Type': 'application/json', 
        Authorization: `Bearer ${localStorage.getItem('token')}` 
      },
      body: JSON.stringify(cleanData) // Send the cleaned data
    });

    if (res.ok) {
      setUser({ ...user, ...cleanData });
      setIsEditing(false);
      triggerHubbleNotif("Success", "Profile updated!");
    } else {
      const errorData = await res.json();
      console.error("Backend rejection:", errorData);
    }
  } catch (err) {
    console.error("Network error:", err);
  }
};

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  if (loading) return <div className="min-h-screen bg-[#f1f3f6] flex items-center justify-center font-bold text-[#ff6b35]">Loading Profile...</div>;

  return (
    <div className="min-h-screen bg-[#f1f3f6] font-sans relative">
      <div className="mx-auto flex gap-6 rounded-2xl bg-white p-4 shadow-sm min-h-[90vh]">
        
        <div className="w-64 flex-shrink-0 hidden lg:block border-r border-gray-100 pr-4">
           <Sidebar userRole={user?.role} />
        </div>

        <main className="flex-1 overflow-y-auto pt-4 pl-4 md:pl-8 pr-6 pb-20">
          <TopBar user={user} />

          <header className="mb-8 mt-4 flex justify-between items-end">
            <div>
              <h1 className="text-3xl font-black text-gray-900 tracking-tight">My Profile</h1>
              <p className="text-sm text-gray-500 mt-1 font-medium">Manage your campus identity and activity.</p>
            </div>
          </header>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* LEFT COLUMN: THE ID CARD */}
            <div className="lg:col-span-4 space-y-6">
              <div className="bg-white rounded-3xl border border-gray-200 p-8 text-center shadow-sm relative overflow-hidden group">
                <button onClick={() => setIsEditing(true)} className="absolute top-4 right-4 w-8 h-8 rounded-full bg-orange-50 text-[#ff6b35] hover:bg-[#ff6b35] hover:text-white flex items-center justify-center transition-colors z-10">
                  <i className="fi fi-rr-pencil text-xs mt-0.5"></i>
                </button>
                <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-br from-orange-50 to-orange-100/50 -z-10"></div>
                {/* Replace the initial logic with this dynamic avatar URL */}
                  <div className="relative mx-auto w-28 h-28 mb-4 mt-2">
                    <img 
                      src={`https://api.dicebear.com/7.x/lorelei/svg?seed=${user?.name}&backgroundColor=ff6b35,f1f3f6`} 
                      alt="Avatar"
                      className="w-full h-full rounded-full bg-white shadow-xl ring-4 ring-white object-cover"
                    />
                    {user?.role === 'Founder' && (
                      <div className="absolute bottom-0 right-0 bg-[#ff6b35] text-white p-2 rounded-full ring-4 ring-white shadow-lg">
                        <i className="fi fi-rr-star text-xs"></i>
                      </div>
                    )}
                  </div>
                <h2 className="text-xl font-black text-gray-900">{user?.name}</h2>
                <p className="text-sm font-mono text-gray-500 mb-4">{user?.email}</p>
                <span className="inline-block bg-orange-50 text-[#ff6b35] border border-orange-100 text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-lg mb-6">
                  {user?.role || "Student"}
                </span>
                <div className="bg-gray-50 rounded-2xl p-4 text-left space-y-3 border border-gray-100 mb-6">
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Branch</p>
                    <p className="text-sm font-bold text-gray-900">{user?.branch || "Not set"}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Year</p>
                    <p className="text-sm font-bold text-gray-900">{user?.year || "Not set"}</p>
                  </div>
                </div>
                <div className="flex flex-wrap justify-center gap-3">
                  {user?.github && <a href={user.github} target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-600 hover:bg-gray-900 border border-gray-200"><i className="fi fi-brands-github text-lg mt-1"></i></a>}
                  {user?.linkedin && <a href={user.linkedin} target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 hover:bg-blue-600 border border-blue-100"><i className="fi fi-brands-linkedin text-lg mt-1"></i></a>}
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN: THE DASHBOARD */}
            <div className="lg:col-span-8 space-y-8">
              {/* STATS GRID */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white border border-gray-200 rounded-3xl p-6 shadow-sm">
                  <p className="text-[11px] font-black uppercase tracking-widest text-gray-400">Total Joined</p>
                  <p className="text-3xl font-black text-gray-900 mt-1">{stats.totalRegistered}</p>
                </div>
                <div className="bg-white border border-gray-200 rounded-3xl p-6 shadow-sm">
                  <p className="text-[11px] font-black uppercase tracking-widest text-gray-400">Attended</p>
                  <p className="text-3xl font-black text-gray-900 mt-1">{stats.attended}</p>
                </div>
                <div className="bg-gray-900 rounded-3xl p-6 shadow-sm">
                  <p className="text-[11px] font-black uppercase tracking-widest text-gray-400">Upcoming</p>
                  <p className="text-3xl font-black text-white mt-1">{stats.upcoming}</p>
                </div>
              </div>

              {/* EVENT HISTORY */}
              <div className="space-y-4">
                <h3 className="text-lg font-black text-gray-900">Event History</h3>
                {pastEvents.map((event) => (
                  <div key={event.id} className="flex items-center gap-4 p-4 rounded-2xl bg-gray-50/50 border border-gray-100 hover:bg-white hover:shadow-md transition-all group">
                    <div className="w-12 h-12 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-400 group-hover:text-[#ff6b35] transition-colors">
                      <i className={`fi ${event.eventType?.toLowerCase() === 'hackathon' ? 'fi-rr-rocket-lunch' : 'fi-rr-presentation'} text-lg mt-1`}></i>
                    </div>
                    <div className="flex-1">
                      <h4 className="text-sm font-bold text-gray-900">{event.title}</h4>
                      <p className="text-xs font-medium text-gray-500 mt-0.5">{event.eventType || "Event"}</p>
                    </div>
                    <div className="text-right">
                      {event.attended ? (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-green-50 text-green-600 text-[10px] font-black uppercase tracking-wider">
                          <i className="fi fi-rr-check text-[8px]"></i> Attended
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gray-100 text-gray-400 text-[10px] font-black uppercase tracking-wider">
                          Absent
                        </span>
                      )}
                      <p className="text-[11px] font-bold text-gray-400 mt-1.5">
                        {new Date(event.startDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
                      </p>
                    </div>
                  </div>
                ))}
                {pastEvents.length === 0 && (
                  <div className="py-10 text-center text-gray-400">
                    <i className="fi fi-rr-ghost text-3xl mb-3 block opacity-50"></i>
                    <p className="text-sm font-medium">No event history yet.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* EDIT MODAL (Remains as you had it) */}
      {isEditing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/40 backdrop-blur-sm">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden animate-in slide-in-from-bottom-4">
            <div className="px-6 py-4 border-b flex justify-between items-center bg-gray-50/50">
              <h3 className="font-black text-lg text-gray-900">Edit Profile</h3>
              <button onClick={() => setIsEditing(false)} className="text-gray-400 hover:text-gray-700">
                <i className="fi fi-rr-cross"></i>
              </button>
            </div>
            <form onSubmit={handleSaveProfile} className="p-6 space-y-5 max-h-[70vh] overflow-y-auto">
              <div className="space-y-4">
                <h4 className="text-[10px] font-black uppercase tracking-widest text-[#ff6b35]">Campus Info</h4>
                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-1.5">Full Name</label>
                  <input type="text" name="name" value={formData.name} onChange={handleInputChange} className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-[#ff6b35]" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-500 mb-1.5">Branch</label>
                    <input type="text" name="branch" value={formData.branch} onChange={handleInputChange} className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-[#ff6b35]" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 mb-1.5">Year</label>
                    <select name="year" value={formData.year} onChange={handleInputChange} className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-[#ff6b35] bg-white">
                      <option value="">Select Year</option>
                      <option value="1st Year">1st Year</option>
                      <option value="2nd Year">2nd Year</option>
                      <option value="3rd Year">3rd Year</option>
                      <option value="4th Year">4th Year</option>
                    </select>
                  </div>
                </div>
              </div>
              <div className="space-y-4 pt-4 border-t">
                <h4 className="text-[10px] font-black uppercase tracking-widest text-[#ff6b35]">Social Links</h4>
                <input type="url" name="github" value={formData.github} onChange={handleInputChange} placeholder="GitHub URL" className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-[#ff6b35]" />
                <input type="url" name="linkedin" value={formData.linkedin} onChange={handleInputChange} placeholder="LinkedIn URL" className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-[#ff6b35]" />
              </div>
              <button type="submit" className="w-full bg-[#ff6b35] text-white font-bold py-3 rounded-xl shadow-lg">Save Changes</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}