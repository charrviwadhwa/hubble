import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/TopBar';

export default function Settings() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [currentTab, setCurrentTab] = useState('Account Settings');
  const [loading, setLoading] = useState(false);

  // Data States
  const [formData, setFormData] = useState({ name: '', email: '', phone: '+91 ' });
  const [mySocieties, setMySocieties] = useState([]);
  const [organizedEvents, setOrganizedEvents] = useState([]);
  
  // UI States
  const [twoFactor, setTwoFactor] = useState(true);
  const [loginAlert, setLoginAlert] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem('token');
      if (!token) return;

      const headers = { Authorization: `Bearer ${token}` };
      
      try {
        // 1. Fetch User Profile
        const userRes = await fetch('http://localhost:3001/api/users/me/profile', { headers });
        const userData = await userRes.json();
        setUser(userData);
        setFormData({ 
          name: userData.name || '', 
          email: userData.email || '', 
          phone: userData.phone || '+91 ' 
        });

        // 2. Fetch Societies you OWN
        const socRes = await fetch('http://localhost:3001/api/societies/my', { headers });
        const socData = await socRes.json();
        const mySocList = Array.isArray(socData) ? socData : [];
        setMySocieties(mySocList);

        // 3. Fetch ALL events and filter bulletproof-style
        const eventRes = await fetch('http://localhost:3001/api/events', { headers });
        const eventData = await eventRes.json();
        
        // 🔥 Get an array of IDs for the societies you own
        const mySocietyIds = mySocList.map(soc => Number(soc.id));
        
        // 🔥 Filter: Show event if you made it OR if it belongs to a society you own
        const filtered = eventData.filter(e => {
          const matchesSociety = mySocietyIds.includes(Number(e.societyId));
          const matchesCreator = Number(e.createdBy) === Number(userData.id);
          return matchesSociety || matchesCreator;
        });

        // Sort them so the newest ones are at the top
        filtered.sort((a, b) => new Date(b.startDate) - new Date(a.startDate));
        
        setOrganizedEvents(filtered);
      } catch (err) {
        console.error("Data Fetch Error:", err);
      }
    };
    fetchData();
  }, []);

  const handleSaveAccount = async () => {
    setLoading(true);
    try {
      const res = await fetch('http://localhost:3001/api/users/me/update', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ name: formData.name, phone: formData.phone }),
      });
      if (res.ok) alert("Account settings saved successfully!");
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const tabs = ['Account Settings', 'My Societies', 'My Events'];

  return (
    <div className="min-h-screen bg-[#f1f3f6]  text-[#1a1a1a] font-sans">
      <div className="mx-auto flex  gap-6 rounded-2xl bg-white p-4 shadow-sm min-h-[90vh]">
        <div className="w-64 flex-shrink-0 hidden lg:block border-r border-gray-100 pr-4">
           <Sidebar userRole={user?.role} />
        </div>

        <main className="flex-1 overflow-y-auto pt-4 pl-4 md:pl-8">
          <Navbar user={user} />
          
          <header className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4 pr-6">
            <h1 className="text-3xl font-medium text-gray-900">Settings</h1>
            {currentTab === 'Account Settings' && (
              <button 
                onClick={handleSaveAccount}
                disabled={loading}
                className="rounded-full bg-[#ff6b35] px-6 py-2.5 text-sm font-medium text-white shadow-md hover:bg-[#e85a25] transition-colors disabled:opacity-50"
              >
                {loading ? 'Saving...' : 'Save Changes'}
              </button>
            )}
          </header>

          <div className="mb-10 border-b border-gray-200">
            <div className="flex gap-8 overflow-x-auto">
              {tabs.map(tab => (
                <button
                  key={tab}
                  onClick={() => setCurrentTab(tab)}
                  className={`relative pb-4 text-sm font-medium transition-colors ${
                    currentTab === tab 
                      ? "text-[#ff6b35]" 
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  <span className="flex items-center gap-2">
                    {tab === 'Account Settings' && <i className="fi fi-rr-user text-lg"></i>}
                    {tab === 'My Societies' && <i className="fi fi-rr-bank text-lg"></i>}
                    {tab === 'My Events' && <i className="fi fi-rr-calendar-star text-lg"></i>}
                    {tab}
                  </span>
                  {currentTab === tab && (
                    <div className="absolute bottom-0 left-0 h-[2px] w-full bg-[#ff6b35]" />
                  )}
                </button>
              ))}
            </div>
          </div>

          <div className="max-w-3xl pr-6 pb-20">
            
            {/* =========================================
                ACCOUNT SETTINGS TAB
            ========================================= */}
            {currentTab === 'Account Settings' && (
              <div className="space-y-10 animate-in fade-in duration-500">
                <section>
                  <h3 className="text-base font-semibold text-gray-900 mb-1">Profile Information</h3>
                  <p className="text-sm text-gray-500 mb-8">Manage your personal details and keep your contact info up to date.</p>
                  
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-[150px_1fr] items-center gap-4">
                      <label className="text-sm text-gray-700">Profile Picture</label>
                      <div className="flex items-center gap-4">
                        <div className="h-12 w-12 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 font-bold overflow-hidden">
                           {user?.name ? user.name[0].toUpperCase() : 'U'}
                        </div>
                        <button className="text-sm text-gray-500 hover:text-gray-800">Delete</button>
                        <button className="text-sm text-[#ff6b35] hover:text-[#e85a25] font-medium">Update</button>
                      </div>
                    </div>

                    <BoutiqInput label="Name" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
                    <BoutiqInput label="Email" value={formData.email} readOnly={true} />
                    <BoutiqInput label="Phone Number" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
                  </div>
                </section>

                <hr className="border-gray-200" />

                <section>
                  <h3 className="text-base font-semibold text-gray-900 mb-1">Security</h3>
                  <p className="text-sm text-gray-500 mb-8">Keep your account secure with extra authentication and alerts.</p>
                  <div className="space-y-6">
                    <ToggleRow label="Two-Factor Authentication" description="Add an extra layer of protection to your account." isOn={twoFactor} onToggle={() => setTwoFactor(!twoFactor)} />
                    <ToggleRow label="Login Alert Notification" description="Get notified when your account is accessed from a new device." isOn={loginAlert} onToggle={() => setLoginAlert(!loginAlert)} />
                  </div>
                </section>
              </div>
            )}

            {/* =========================================
                MY SOCIETIES TAB
            ========================================= */}
            {currentTab === 'My Societies' && (
              <div className="space-y-6 animate-in fade-in duration-500">
                <h3 className="text-base font-semibold text-gray-900 mb-1">Manage Societies</h3>
                <p className="text-sm text-gray-500 mb-6">Select a society to edit its details, roster, and settings.</p>

                <div className="grid gap-3">
                  {mySocieties.length > 0 ? mySocieties.map(soc => (
                    <div 
                      key={soc.id} 
                      onClick={() => navigate(`/settings/societies/${soc.id}`)}
                      className="group flex items-center justify-between p-4 rounded-xl border border-gray-200 hover:border-[#ff6b35] hover:shadow-sm transition-all cursor-pointer bg-white"
                    >
                      <div className="flex items-center gap-4">
                        <img src={`http://localhost:3001${soc.logo}`} alt="" className="h-10 w-10 rounded-lg object-cover bg-gray-50" />
                        <div>
                          <h4 className="text-sm font-semibold text-gray-900">{soc.name}</h4>
                          <p className="text-xs text-gray-500">{soc.category}</p>
                        </div>
                      </div>
                      <div className="text-[#ff6b35] opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-2 text-sm font-medium">
                        Edit <i className="fi fi-rr-arrow-right"></i>
                      </div>
                    </div>
                  )) : <p className="text-sm text-gray-500 italic">You don't manage any societies yet.</p>}
                </div>
              </div>
            )}

            {/* =========================================
                MY EVENTS TAB
            ========================================= */}
            {currentTab === 'My Events' && (
              <div className="space-y-6 animate-in fade-in duration-500">
                <h3 className="text-base font-semibold text-gray-900 mb-1">Manage Events</h3>
                <p className="text-sm text-gray-500 mb-6">Select any event linked to your account or societies to edit its details.</p>

                <div className="grid gap-3">
                  {organizedEvents.length > 0 ? organizedEvents.map(event => {
                    const isPast = new Date(event.startDate) < new Date();
                    return (
                    <div 
                      key={event.id} 
                      onClick={() => navigate(`/settings/events/${event.id}`)}
                      className={`group flex items-center justify-between p-4 rounded-xl border border-gray-200 hover:border-[#ff6b35] hover:shadow-sm transition-all cursor-pointer bg-white ${isPast ? 'opacity-60 grayscale-[0.5]' : ''}`}
                    >
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="text-sm font-semibold text-gray-900">{event.title}</h4>
                          <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-md ${isPast ? 'bg-gray-100 text-gray-500' : 'bg-[#ff6b35]/10 text-[#ff6b35]'}`}>
                            {isPast ? 'Past' : 'Upcoming'}
                          </span>
                        </div>
                        <p className="text-xs text-gray-500">
                          {new Date(event.startDate).toLocaleDateString()} • {event.location}
                        </p>
                      </div>
                      <div className="text-[#ff6b35] opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-2 text-sm font-medium">
                        Edit <i className="fi fi-rr-arrow-right"></i>
                      </div>
                    </div>
                  )}) : <p className="text-sm text-gray-500 italic">You haven't created any events yet.</p>}
                </div>
              </div>
            )}

          </div>
        </main>
      </div>
    </div>
  );
}

function BoutiqInput({ label, value, onChange, readOnly = false }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-[150px_1fr] items-center gap-4">
      <label className="text-sm text-gray-700">{label}</label>
      <input 
        type="text" 
        value={value} 
        onChange={onChange}
        readOnly={readOnly}
        className={`w-full max-w-md rounded-lg border border-gray-300 px-4 py-2.5 text-sm text-gray-900 outline-none transition-colors ${
          readOnly ? 'bg-gray-50 text-gray-500 cursor-not-allowed' : 'focus:border-[#ff6b35] focus:ring-1 focus:ring-[#ff6b35]'
        }`}
      />
    </div>
  );
}

function ToggleRow({ label, description, isOn, onToggle }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-[150px_1fr] items-start gap-4">
      <label className="text-sm text-gray-700 pt-1">{label}</label>
      <div>
        <button 
          onClick={onToggle}
          className={`relative h-6 w-11 rounded-full transition-colors duration-300 ${isOn ? 'bg-[#ff6b35]' : 'bg-gray-300'}`}
        >
          <div className={`absolute top-1 left-1 h-4 w-4 rounded-full bg-white transition-transform duration-300 ${isOn ? 'translate-x-5' : 'translate-x-0'}`} />
        </button>
        <p className="text-xs text-gray-500 mt-2">{description}</p>
      </div>
    </div>
  );
}