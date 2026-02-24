import { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import TopBar from '../components/TopBar'; 

export default function Profile() {
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    fetch('http://localhost:3001/api/users/me/profile', {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    })
    .then(res => res.json())
    .then(data => {
      setUserData(data);
    })
    .catch(err => {
      console.error("Profile Fetch Error:", err);
    });
  }, []);

  const initials = userData?.name 
    ? userData.name.split(' ').map(p => p[0]).join('').slice(0, 2).toUpperCase() 
    : 'U'; // Fallback to 'U' instead of 'HB'

  const xp = userData?.xp || 0;
  const xpPercentage = Math.min((xp / 8000) * 100, 100);

  return (
    <div className="min-h-screen bg-[#f1f3f6] text-[#1a1a1a] font-sans">
      <div className="mx-auto flex gap-6 rounded-2xl bg-white p-4 shadow-sm min-h-[90vh]">
        
        {/* Sidebar Container */}
        <div className="w-64 flex-shrink-0 hidden lg:block border-r border-gray-100 pr-4">
           <Sidebar userRole={userData?.role} />
        </div>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto pt-4 pl-4 md:pl-8">
          
          <TopBar user={userData} />

          <header className="mb-8 pr-6">
            <h1 className="text-3xl font-medium text-gray-900">Student Profile</h1>
            <p className="text-sm text-gray-500 mt-1">View your journey, achievements, and statistics.</p>
          </header>

          <div className="max-w-4xl pr-6 pb-20 space-y-10">
            
            {/* 1. Profile Identity Section */}
            <section className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8 rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
              <div className="flex items-center gap-6">
                
                {/* Avatar */}
                <div className="relative">
                  <div className="h-24 w-24 rounded-full bg-gray-100 border-2 border-gray-200 flex items-center justify-center text-3xl font-bold text-[#ff6b35] overflow-hidden animate-in fade-in zoom-in duration-300">
                    {userData?.profilePic ? (
                      <img src={userData.profilePic} alt="Profile" className="h-full w-full object-cover" />
                    ) : initials}
                  </div>
                  {userData?.isOrganizer && (
                    <div className="absolute bottom-0 right-0 flex h-7 w-7 items-center justify-center rounded-full border-2 border-white bg-[#ff6b35] text-white">
                      <i className="fi fi-rr-crown text-[10px] mt-0.5"></i>
                    </div>
                  )}
                </div>

                {/* Identity Info */}
                <div>
                  <h2 className="text-2xl font-semibold text-gray-900">
                    {userData?.name || 'User Name'}
                  </h2>
                  <p className="text-sm text-gray-500 font-medium mb-3">IT Student | 3rd Year</p>
                  
                  {/* XP Progress Bar */}
                  <div className="w-full max-w-xs">
                    <div className="flex justify-between text-xs font-semibold text-gray-500 mb-1.5">
                      <span>Hubble Rank</span>
                      <span>{xp} / 8000 XP</span>
                    </div>
                    <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-[#ff6b35] rounded-full transition-all duration-1000 ease-out" 
                        style={{ width: `${xpPercentage}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Stats Grid */}
              <div className="flex gap-4 w-full md:w-auto">
                <QuickStat label="Events Joined" value={userData?.totalRegistrations || 0} icon="fi-rr-calendar-star" />
                <QuickStat label="Check-ins" value={userData?.totalAttended || 0} icon="fi-rr-marker" />
              </div>
            </section>

            {/* 2. Grid Layout for Achievements & Inventory */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              
              {/* Achievements Section */}
              <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm flex flex-col">
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <h3 className="text-base font-semibold text-gray-900">Achievements</h3>
                    <p className="text-xs text-gray-500 mt-1">Badges earned through participation.</p>
                  </div>
                  <span className="text-xs font-semibold text-[#ff6b35] bg-[#ff6b35]/10 px-3 py-1 rounded-full">
                    {userData?.badges?.length || 0}/10 Unlocked
                  </span>
                </div>
                
                <div className="flex justify-around py-4 flex-1">
                  <Badge icon="fi-rr-leaf" title="Pioneer" unlocked={userData?.totalRegistrations >= 1} />
                  <Badge icon="fi-rr-shield-check" title="Active" unlocked={userData?.totalRegistrations >= 5} />
                  <Badge icon="fi-rr-star" title="Leader" unlocked={userData?.isOrganizer} />
                </div>
                
                <button className="mt-6 w-full text-sm font-medium text-[#ff6b35] hover:text-[#e85a25] transition-colors py-2 border-t border-gray-100">
                  View all achievements →
                </button>
              </section>

              {/* Inventory Section */}
              <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm flex flex-col">
                <div className="mb-6">
                  <h3 className="text-base font-semibold text-gray-900">Inventory</h3>
                  <p className="text-xs text-gray-500 mt-1">Tickets, passes, and digital assets.</p>
                </div>
                
                <div className="flex gap-4 flex-wrap flex-1 content-start">
                  <InventoryItem icon="fi-rr-ticket" color="text-blue-600 bg-blue-50 border-blue-100" />
                  <InventoryItem icon="fi-rr-bolt" color="text-amber-600 bg-amber-50 border-amber-100" />
                  <InventoryItem icon="fi-rr-palette" color="text-purple-600 bg-purple-50 border-purple-100" />
                  <div className="h-12 w-12 rounded-xl border-2 border-dashed border-gray-200 flex items-center justify-center text-gray-400 hover:border-gray-300 hover:text-gray-500 transition-colors cursor-pointer">
                    <i className="fi fi-rr-plus text-sm mt-0.5"></i>
                  </div>
                </div>
                
                <button className="mt-6 w-full text-sm font-medium text-[#ff6b35] hover:text-[#e85a25] transition-colors py-2 border-t border-gray-100">
                  Manage inventory →
                </button>
              </section>

            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

/* --- BOUTIQ-STYLE HELPER COMPONENTS --- */

function QuickStat({ label, value, icon }) {
  return (
    <div className="flex-1 md:flex-none flex items-center gap-4 rounded-xl border border-gray-200 bg-gray-50/50 p-4 min-w-[140px]">
      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white border border-gray-200 text-gray-600 shadow-sm">
        <i className={`fi ${icon} text-lg mt-1`}></i>
      </div>
      <div>
        <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">{label}</p>
        <p className="text-xl font-bold text-gray-900 leading-tight">{value}</p>
      </div>
    </div>
  );
}

function Badge({ icon, title, unlocked }) {
  return (
    <div className={`flex flex-col items-center gap-3 transition-all ${unlocked ? 'opacity-100' : 'opacity-40 grayscale'}`}>
      <div className={`flex h-16 w-16 items-center justify-center rounded-full border-2 shadow-sm ${unlocked ? 'border-[#ff6b35]/20 bg-[#ff6b35]/5 text-[#ff6b35]' : 'border-gray-200 bg-gray-50 text-gray-400'}`}>
        <i className={`fi ${icon} text-2xl mt-1`}></i>
      </div>
      <p className="text-xs font-semibold text-gray-700">{title}</p>
    </div>
  );
}

function InventoryItem({ icon, color }) {
  return (
    <div className={`flex h-12 w-12 items-center justify-center rounded-xl border transition-transform hover:-translate-y-1 cursor-pointer shadow-sm ${color}`}>
      <i className={`fi ${icon} text-lg mt-0.5`}></i>
    </div>
  );
}