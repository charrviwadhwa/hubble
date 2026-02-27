import { useState, useEffect, useRef } from 'react';
import Sidebar from '../components/Sidebar';
import TopBar from '../components/TopBar';
import { triggerHubbleNotif } from '../utils/notify';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export default function Profile() {
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState({ totalRegistered: 0, attended: 0, upcoming: 0 });
  const [pastEvents, setPastEvents] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [generatingId, setGeneratingId] = useState(null);
  const [formData, setFormData] = useState({
    name: '', branch: '', year: '', github: '', linkedin: ''
  });

  // Certificate Refs & State
  const certificateRef = useRef();
  const [certData, setCertData] = useState({ 
    eventName: '', 
    date: '', 
    societyName: '', 
    societyLogo: '' ,
    collegeName: '',
  });


  const fetchData = async () => {
    try {
      const headers = { Authorization: `Bearer ${localStorage.getItem('token')}` };

      // 1. Fetch User Profile
      const userRes = await fetch('https://hubble-d9l6.onrender.com/api/users/me/profile', { headers });
      if (userRes.ok) {
        const userData = await userRes.json();
        setUser(userData);
        setFormData({
          name: userData.name || '',
          branch: userData.branch || '',
          year: userData.year || '',
          github: userData.github || '',
          linkedin: userData.linkedin || ''
        });
      }

      // 2. Fetch Registrations
      const regRes = await fetch('https://hubble-d9l6.onrender.com/api/events/my-registrations', { headers });
      if (regRes.ok) {
        const regData = await regRes.json();
        if (Array.isArray(regData)) {
          const now = new Date();
          const total = regData.length;
          const attendedCount = regData.filter(event => event.attended).length;
          const upcomingCount = regData.filter(event => new Date(event.startDate) > now).length;

          setStats({ totalRegistered: total, attended: attendedCount, upcoming: upcomingCount });
          setPastEvents(regData.filter(event => new Date(event.startDate) <= now));
        }
      }
    } catch (err) {
      console.error("Failed to load profile data", err);
    }
  };

  useEffect(() => { fetchData(); }, []);

  // Inside downloadCertificate in Profile.jsx

const downloadCertificate = async (event) => {
  setGeneratingId(event.id);

  try {
    const headers = { Authorization: `Bearer ${localStorage.getItem('token')}` };

    const res = await fetch(
      `https://hubble-d9l6.onrender.com/api/events/certificate/${event.id}`,
      { headers }
    );

    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.message || "Failed to fetch certificate");
    }

    const data = await res.json();

    setCertData({
      eventName: data.eventName,
      date: new Date(data.issueDate).toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      }),
      societyName: data.societyName,
      societyLogo: data.societyLogo
        ? `https://hubble-d9l6.onrender.com${data.societyLogo}`
        : null,
      collegeName: data.collegeName,
      certId: data.certId
    });

    setTimeout(async () => {
      const canvas = await html2canvas(certificateRef.current, {
        scale: 2,
        useCORS: true
      });

      const imgData = canvas.toDataURL("image/png");

      const pdf = new jsPDF({
        orientation: "landscape",
        unit: "px",
        format: [1123, 794]
      });

      pdf.addImage(imgData, "PNG", 0, 0, 1123, 794);
      pdf.save(`${data.eventName}-Certificate.pdf`);
    }, 500);

  } catch (err) {
    triggerHubbleNotif("Error", err.message);
  } finally {
    setGeneratingId(null);
  }
};

  const handleSaveProfile = async (e) => {
    e.preventDefault();
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
        body: JSON.stringify(cleanData)
      });

      if (res.ok) {
        setUser({ ...user, ...cleanData });
        setIsEditing(false);
        triggerHubbleNotif("Success", "Profile updated!");
      }
    } catch (err) {
      console.error("Network error:", err);
    }
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="min-h-screen bg-[#f1f3f6] font-sans relative">
      
      {/* 🟢 HIDDEN CERTIFICATE TEMPLATE - Mosaic Branding */}
      <div style={{ position: 'absolute', top: '-15000px', left: '0' }}>
        <div 
          ref={certificateRef}
          style={{ 
            width: '1123px', height: '794px', backgroundColor: '#ffffff', 
            padding: '80px', display: 'flex', flexDirection: 'column', 
            justifyContent: 'center', alignItems: 'center', position: 'relative', 
            boxSizing: 'border-box', textAlign: 'center', border: '4px solid #000'
          }}
        >
          {/* Mosaic Decorative Borders */}
          <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: '60px', backgroundColor: '#ff6b35' }}></div>
          <div style={{ position: 'absolute', right: 0, top: 0, bottom: 0, width: '60px', backgroundColor: '#000000' }}></div>

          {/* Hubble Logo Top Left */}
          <div style={{ position: 'absolute', top: '60px', left: '100px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ width: '16px', height: '16px', backgroundColor: '#ff6b35', borderRadius: '50%' }}></div>
            <p style={{ fontSize: '24px', fontWeight: '900', color: '#000', margin: 0 }}>Hubble</p>
          </div>

          <div style={{ marginBottom: '30px' }}>
            <h1 style={{ fontSize: '80px', fontWeight: '900', color: '#000', margin: 0, letterSpacing: '6px' }}>CERTIFICATE</h1>
            <p style={{ fontSize: '24px', fontWeight: '700', color: '#ff6b35', letterSpacing: '8px', textTransform: 'uppercase' }}>of achievement</p>
          </div>

          {/* In your hidden template wrapper */}
          <div style={{ textAlign: 'center' }}>
            <p style={{ fontSize: '20px', color: '#6b7280' }}>This is proudly presented to</p>
            <h2 style={{ fontSize: '72px', color: '#000', fontWeight: '900', borderBottom: '10px solid #ff6b35' }}>
              {user?.name}
            </h2>
            <p style={{ fontSize: '22px', fontWeight: '800' }}>
              Mission: <span style={{ color: '#ff6b35' }}>"{certData.eventName}"</span> <br/>
              Organization: <span style={{ color: '#000' }}>{certData.societyName}</span> <br/>
              Host: <span style={{ color: '#000' }}>{certData.collegeName}</span>
            </p>
          </div>
          

          <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: '60px', padding: '0 60px' }}>
            <div style={{ textAlign: 'left' }}>
              <p style={{ fontSize: '14px', fontWeight: '900', color: '#9ca3af', textTransform: 'uppercase', margin: 0 }}>Issue Date</p>
              <p style={{ fontSize: '20px', fontWeight: '900', color: '#000', margin: 0 }}>{certData.date}</p>
            </div>
            
            {certData.societyLogo && (
               <img src={certData.societyLogo} style={{ height: '80px', width: '80px', objectFit: 'contain', border: '4px solid #000', borderRadius: '12px' }} alt="SocLogo" />
            )}

            <div style={{ textAlign: 'right' }}>
              <p style={{ fontSize: '14px', fontWeight: '900', color: '#9ca3af', textTransform: 'uppercase', margin: 0 }}>Verification ID</p>
              <p style={{ fontSize: '16px', fontWeight: '800', color: '#ff6b35', margin: 0 }}>{certData.certId}</p>
            </div>
          </div>
        </div>
      </div>

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
            
            <div className="lg:col-span-4 space-y-6">
              <div className="bg-white rounded-3xl border border-gray-200 p-8 text-center shadow-sm relative overflow-hidden group">
                <button onClick={() => setIsEditing(true)} className="absolute top-4 right-4 w-8 h-8 rounded-full bg-orange-50 text-[#ff6b35] hover:bg-[#ff6b35] hover:text-white flex items-center justify-center transition-colors z-10">
                  <i className="fi fi-rr-pencil text-xs mt-0.5"></i>
                </button>
                <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-br from-orange-50 to-orange-100/50 -z-10"></div>
                
                <div className="relative mx-auto w-28 h-28 mb-4 mt-2">
                  <img 
                    src={`https://api.dicebear.com/7.x/lorelei/svg?seed=${user?.name || 'Hubble'}&backgroundColor=ff6b35,f1f3f6`} 
                    alt="Avatar"
                    className="w-full h-full rounded-full bg-white shadow-xl ring-4 ring-white object-cover"
                  />
                  {user?.role === 'Founder' && (
                    <div className="absolute bottom-0 right-0 bg-[#ff6b35] text-white p-2 rounded-full ring-4 ring-white shadow-lg">
                      <i className="fi fi-rr-star text-xs"></i>
                    </div>
                  )}
                </div>

                <h2 className="text-xl font-black text-gray-900">{user?.name || "Hubble Member"}</h2>
                <p className="text-sm font-mono text-gray-500 mb-4">{user?.email || "..."}</p>
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

            <div className="lg:col-span-8 space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white border border-gray-200 rounded-3xl p-6 shadow-sm">
                  <p className="text-[11px] font-black uppercase tracking-widest text-gray-400">Total Joined</p>
                  <p className="text-3xl font-black text-gray-900 mt-1">{stats.totalRegistered}</p>
                </div>
                <div className="bg-white border border-gray-200 rounded-3xl p-6 shadow-sm">
                  <p className="text-[11px] font-black uppercase tracking-widest text-gray-400">Attended</p>
                  <p className="text-3xl font-black text-gray-900 mt-1">{stats.attended}</p>
                </div>
                <div className="bg-[#ff6b35] rounded-3xl p-6 shadow-sm">
                  <p className="text-[11px] font-black uppercase tracking-widest text-white/70">Upcoming</p>
                  <p className="text-3xl font-black text-white mt-1">{stats.upcoming}</p>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-black text-gray-900">Event History</h3>
                {pastEvents.map((event) => (
                  <div key={event.id} className="flex items-center gap-4 p-4 rounded-2xl bg-gray-50/50 border border-gray-100 hover:bg-white hover:shadow-md transition-all group">
                    <div className="w-12 h-12 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-400 group-hover:text-[#ff6b35] transition-colors">
                      <i className={`fi ${event.eventType?.toLowerCase() === 'hackathon' ? 'fi-rr-rocket-lunch' : 'fi-rr-presentation'} text-lg mt-1`}></i>
                    </div>
                    <div className="flex-1">
                      <h4 className="text-sm font-bold text-gray-900">{event.title}</h4>
                      <p className="text-xs font-medium text-gray-500 mt-0.5">{event.societyName || "Event"}</p>
                    </div>
                    <div className="text-right flex flex-col items-end gap-2">
                      {event.attended ? (
                        <>
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-green-50 text-green-600 text-[10px] font-black uppercase tracking-wider">
                            <i className="fi fi-rr-check text-[8px]"></i> Attended
                          </span>
                          <button 
                            disabled={generatingId === event.id}
                            onClick={() => downloadCertificate(event)}
                            className="text-[10px] font-black text-[#ff6b35] underline disabled:opacity-50"
                          >
                            {generatingId === event.id ? "Processing..." : "Download Cert"}
                          </button>
                        </>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gray-100 text-gray-400 text-[10px] font-black uppercase tracking-wider">
                          Absent
                        </span>
                      )}
                      <p className="text-[11px] font-bold text-gray-400 mt-0.5">
                        {new Date(event.startDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>

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