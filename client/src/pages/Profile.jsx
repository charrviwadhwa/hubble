import { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import TopBar from '../components/TopBar';

export default function Profile() {
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState({ totalRegistered: 0, attended: 0, upcoming: 0 });
  const [pastEvents, setPastEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // 🟢 Modal State
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '', branch: '', year: '', github: '', linkedin: '', leetcode: '', codechef: ''
  });

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const headers = { Authorization: `Bearer ${localStorage.getItem('token')}` };

        // 1. Fetch Real User Profile
        // (Ensure this matches your actual profile route)
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

        // 2. Fetch Real Registrations & Calculate Stats
        const regRes = await fetch('https://hubble-d9l6.onrender.com/api/events/my-registrations', { headers });
        const regData = await regRes.json();

        if (Array.isArray(regData)) {
          const now = new Date();
          
          // 🧮 The Math
          const total = regData.length;
          const attendedCount = regData.filter(event => event.attended).length;
          const upcomingCount = regData.filter(event => new Date(event.startDate) > now).length;

          setStats({
            totalRegistered: total,
            attended: attendedCount,
            upcoming: upcomingCount
          });

          // Show past events (things that have already happened)
          const history = regData.filter(event => new Date(event.startDate) <= now);
          setPastEvents(history);
        }

        setLoading(false);
      } catch (err) {
        console.error("Failed to load profile data", err);
        setLoading(false);
      }
    };

    fetchProfileData();
  }, []);

  // 🟢 Handle Save Function
  const handleSaveProfile = async (e) => {
    e.preventDefault();
    
    // Optimistic UI Update (Instantly updates the screen)
    setUser({ ...user, ...formData });
    setIsEditing(false);

    // 🔗 TODO: Send `formData` to your backend using a PATCH request here!
    /*
    await fetch('https://hubble-d9l6.onrender.com/api/users/me/profile', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${localStorage.getItem('token')}` },
      body: JSON.stringify(formData)
    });
    */
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
              <p className="text-sm text-gray-500 mt-1 font-medium">Manage your campus identity and view your activity.</p>
            </div>
          </header>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* LEFT COLUMN: THE ID CARD */}
            <div className="lg:col-span-4 space-y-6">
              <div className="bg-white rounded-3xl border border-gray-200 p-8 text-center shadow-sm relative overflow-hidden group">
                
                {/* 🟢 EDIT BUTTON */}
                <button 
                  onClick={() => setIsEditing(true)}
                  className="absolute top-4 right-4 w-8 h-8 rounded-full bg-orange-50 text-[#ff6b35] hover:bg-[#ff6b35] hover:text-white flex items-center justify-center transition-colors z-10"
                  title="Edit Profile"
                >
                  <i className="fi fi-rr-pencil text-xs mt-0.5"></i>
                </button>

                <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-br from-orange-50 to-orange-100/50 -z-10"></div>

                <div className="relative mx-auto w-28 h-28 mb-4 mt-2">
                  <div className="w-full h-full rounded-full bg-gray-900 text-white flex items-center justify-center text-4xl font-black shadow-xl ring-4 ring-white">
                    {user?.name?.charAt(0)}
                  </div>
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

                {/* Social Links Row */}
                <div className="flex flex-wrap justify-center gap-3">
                  {user?.github && (
                    <a href={user.github} target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-600 hover:bg-gray-900 hover:text-white transition-all border border-gray-200">
                      <i className="fi fi-brands-github text-lg mt-1"></i>
                    </a>
                  )}
                  {user?.linkedin && (
                    <a href={user.linkedin} target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 hover:bg-blue-600 hover:text-white transition-all border border-blue-100">
                      <i className="fi fi-brands-linkedin text-lg mt-1"></i>
                    </a>
                  )}
                  
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN: THE DASHBOARD */}
            {/* Past Attended Events List */}
<div className="space-y-4">
  {pastEvents.map((event) => (
    <div key={event.id} className="flex items-center gap-4 p-4 rounded-2xl bg-gray-50/50 border border-gray-100 hover:bg-white hover:shadow-md transition-all group">
      <div className="w-12 h-12 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-400 group-hover:text-[#ff6b35] group-hover:border-[#ff6b35] transition-colors">
        <i className={`fi ${event.eventType?.toLowerCase() === 'hackathon' ? 'fi-rr-rocket-lunch' : 'fi-rr-presentation'} text-lg mt-1`}></i>
      </div>
      <div className="flex-1">
        <h4 className="text-sm font-bold text-gray-900">{event.title}</h4>
        <p className="text-xs font-medium text-gray-500 mt-0.5">{event.eventType || "Event"}</p>
      </div>
      <div className="text-right">
        {event.attended ? (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-green-50 text-green-600 text-[10px] font-black uppercase tracking-wider border border-green-100">
            <i className="fi fi-rr-check text-[8px]"></i> Attended
          </span>
        ) : (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gray-100 text-gray-400 text-[10px] font-black uppercase tracking-wider border border-gray-200">
            Absent
          </span>
        )}
        <p className="text-[11px] font-bold text-gray-400 mt-1.5">
          {new Date(event.startDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
        </p>
      </div>
    </div>
  ))}
  
  {pastEvents.length === 0 && (
    <div className="py-10 text-center text-gray-400">
      <i className="fi fi-rr-ghost text-3xl mb-3 block opacity-50"></i>
      <p className="text-sm font-medium">No event history yet. Time to explore!</p>
    </div>
  )}
</div>

          </div>
        </main>
      </div>

      {/* 🟢 EDIT PROFILE MODAL */}
      {isEditing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden animate-in slide-in-from-bottom-4 duration-300">
            
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
              <h3 className="font-black text-lg text-gray-900">Edit Profile</h3>
              <button onClick={() => setIsEditing(false)} className="text-gray-400 hover:text-gray-700 transition-colors">
                <i className="fi fi-rr-cross"></i>
              </button>
            </div>

            <form onSubmit={handleSaveProfile} className="p-6 space-y-5 max-h-[70vh] overflow-y-auto">
              {/* Campus Info */}
              <div className="space-y-4">
                <h4 className="text-[10px] font-black uppercase tracking-widest text-[#ff6b35]">Campus Info</h4>
                
                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-1.5">Full Name</label>
                  <input type="text" name="name" value={formData.name} onChange={handleInputChange} className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:border-[#ff6b35] outline-none transition-colors" />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-500 mb-1.5">Branch</label>
                    <input type="text" name="branch" value={formData.branch} onChange={handleInputChange} placeholder="e.g. Information Technology" className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:border-[#ff6b35] outline-none transition-colors" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 mb-1.5">Year</label>
                    <select name="year" value={formData.year} onChange={handleInputChange} className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:border-[#ff6b35] outline-none transition-colors bg-white">
                      <option value="">Select Year</option>
                      <option value="1st Year">1st Year</option>
                      <option value="2nd Year">2nd Year</option>
                      <option value="3rd Year">3rd Year</option>
                      <option value="4th Year">4th Year</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Coding Profiles */}
              <div className="space-y-4 pt-4 border-t border-gray-100">
                <h4 className="text-[10px] font-black uppercase tracking-widest text-[#ff6b35]">Coding & Social Links</h4>
                
                <div className="relative">
                  <i className="fi fi-brands-github absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"></i>
                  <input type="url" name="github" value={formData.github} onChange={handleInputChange} placeholder="GitHub URL" className="w-full rounded-xl border border-gray-200 pl-11 pr-4 py-2.5 text-sm focus:border-[#ff6b35] outline-none transition-colors" />
                </div>

                <div className="relative">
                  <i className="fi fi-brands-linkedin absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"></i>
                  <input type="url" name="linkedin" value={formData.linkedin} onChange={handleInputChange} placeholder="LinkedIn URL" className="w-full rounded-xl border border-gray-200 pl-11 pr-4 py-2.5 text-sm focus:border-[#ff6b35] outline-none transition-colors" />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="relative">
                    <i className="fi fi-rr-code absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"></i>
                    <input type="url" name="leetcode" value={formData.leetcode} onChange={handleInputChange} placeholder="LeetCode URL" className="w-full rounded-xl border border-gray-200 pl-9 pr-3 py-2.5 text-xs focus:border-[#ff6b35] outline-none transition-colors" />
                  </div>
                  <div className="relative">
                    <i className="fi fi-rr-laptop-code absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"></i>
                    <input type="url" name="codechef" value={formData.codechef} onChange={handleInputChange} placeholder="CodeChef URL" className="w-full rounded-xl border border-gray-200 pl-9 pr-3 py-2.5 text-xs focus:border-[#ff6b35] outline-none transition-colors" />
                  </div>
                </div>
              </div>

              <div className="pt-6">
                <button type="submit" className="w-full bg-[#ff6b35] text-white font-bold py-3 rounded-xl hover:bg-[#e85a25] transition-colors shadow-lg shadow-orange-100">
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}