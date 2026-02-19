import { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';

export default function Profile() {
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    fetch('http://localhost:3001/api/users/me/profile', {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    })
    .then(res => res.json())
    .then(data => setUserData(data))
    .catch(err => console.error("Profile Fetch Error:", err));
  }, []);

  // Use optional chaining (?.) so the app doesn't crash if userData is null
  const initials = userData?.name 
    ? userData.name.split(' ').map(p => p[0]).join('').slice(0, 2).toUpperCase() 
    : 'HB';

  return (
    <div className="min-h-screen bg-[#f3efe8] p-4 md:p-6">
      <div className="mx-auto max-w-[1380px] rounded-[28px] border border-black/10 bg-[#f7f3ec] p-3 shadow-lg md:p-4">
        <div className="flex flex-col gap-4 lg:flex-row">
          <Sidebar />

          <main className="flex-1 rounded-2xl bg-[#f9f6ef] p-6 md:p-10 overflow-y-auto">
            {/* 1. Profile Header */}
            <div className="relative mb-10 flex flex-col items-center gap-6 text-center md:flex-row md:text-left">
              <div className="relative">
                <div className="h-28 w-28 rounded-[40px] bg-white border-4 border-white shadow-xl grid place-items-center text-4xl overflow-hidden font-bold text-[#ff6b35]">
                  {userData ? initials : "👤"}
                </div>
                <div className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full bg-orange-500 border-4 border-[#f9f6ef] flex items-center justify-center text-xs">🔥</div>
              </div>
              
              <div className="flex-1">
                {/* Optional Chaining prevents the white screen crash */}
                <h1 className="text-4xl font-black text-[#1a1a1a]">{userData?.name || 'Loading...'}</h1>
                <p className="text-black/40 font-medium">IT Student @ MSIT | 3rd Year</p>
                
                <div className="mt-4 max-w-xs">
                  <div className="flex justify-between text-[10px] font-bold uppercase text-black/30 mb-1">
                    <span>Student Rank</span>
                    <span>{userData?.xp || 0} / 8000 XP</span>
                  </div>
                  <div className="h-2 w-full bg-black/5 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-orange-400 rounded-full transition-all duration-1000" 
                      style={{ width: `${Math.min(((userData?.xp || 0) / 8000) * 100, 100)}%` }}
                    ></div>
                  </div>
                </div>
              </div>

              <div className="flex gap-4">
                <QuickStat label="Events Joined" value={userData?.totalRegistrations || 0} icon="🚩" />
                <QuickStat label="Check-ins" value={userData?.totalAttended || 0} icon="📍" />
              </div>
            </div>

            {/* 2. Achievements Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="rounded-[40px] bg-white p-8 shadow-sm border border-black/5">
                <div className="flex justify-between items-center mb-8">
                  <h3 className="text-xl font-bold">Achievements</h3>
                  <span className="text-xs font-bold text-black/20">
                    {userData?.badges?.length || 0}/10
                  </span>
                </div>
                
                <div className="flex justify-around">
                  <Badge icon="🌱" title="Pioneer" unlocked={userData?.totalRegistrations >= 1} />
                  <Badge icon="🥈" title="Active" unlocked={userData?.totalRegistrations >= 5} />
                  <Badge icon="👑" title="Leader" unlocked={userData?.isOrganizer} />
                </div>
                
                <button className="w-full mt-8 py-3 text-xs font-bold text-black/30 border-t border-black/5">View all</button>
              </div>

              <div className="rounded-[40px] bg-white p-8 shadow-sm border border-black/5">
                <h3 className="text-xl font-bold mb-8">Inventory</h3>
                <div className="flex gap-4 flex-wrap">
                  <InventoryItem icon="🎫" color="bg-blue-50" />
                  <InventoryItem icon="⚡" color="bg-yellow-50" />
                  <InventoryItem icon="🎨" color="bg-purple-50" />
                  <div className="h-14 w-14 rounded-2xl border-2 border-dashed border-black/5 grid place-items-center text-black/10 text-xl">+</div>
                </div>
                <button className="w-full mt-8 py-3 text-xs font-bold text-black/30 border-t border-black/5">View all</button>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}

// Keep your Helper Components (QuickStat, Badge, InventoryItem) the same as before

function QuickStat({ label, value, icon }) {
  return (
    <div className="rounded-3xl bg-white p-4 text-center border border-black/5 shadow-sm min-w-[100px]">
      <div className="text-lg mb-1">{icon}</div>
      <p className="text-xl font-black">{value}</p>
      <p className="text-[9px] font-bold uppercase text-black/30 tracking-wider">{label}</p>
    </div>
  );
}

function Badge({ icon, title, unlocked }) {
  return (
    <div className={`text-center ${unlocked ? 'opacity-100' : 'opacity-20 grayscale'}`}>
      <div className="h-20 w-20 rounded-full bg-[#f7f3ec] border-4 border-white shadow-lg flex items-center justify-center text-3xl mb-3">
        {icon}
      </div>
      <p className="text-xs font-bold text-gray-700">{title}</p>
    </div>
  );
}

function InventoryItem({ icon, color }) {
  return (
    <div className={`h-14 w-14 ${color} rounded-2xl flex items-center justify-center text-xl shadow-sm border border-black/5 transition hover:scale-110 cursor-pointer`}>
      {icon}
    </div>
  );
}