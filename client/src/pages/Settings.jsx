import { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';

const TABS = [
  { id: 'account', label: 'Account', icon: 'fi-rr-user' },
  { id: 'societies', label: 'My Societies', icon: 'fi-rr-bank' },
  { id: 'events', label: 'My Events', icon: 'fi-rr-calendar-star' }
];

export default function Settings() {
  const [user, setUser] = useState(null);
  const [currentTab, setCurrentTab] = useState('account');
  const [editingField, setEditingField] = useState(null); 
  const [loading, setLoading] = useState(false);

  // Data States
  const [formData, setFormData] = useState({ name: '', email: '', phone: '' });
  const [mySocieties, setMySocieties] = useState([]);
  const [organizedEvents, setOrganizedEvents] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const headers = { Authorization: `Bearer ${localStorage.getItem('token')}` };
      
      // 1. User Profile
      const userRes = await fetch('http://localhost:3001/api/users/me/profile', { headers });
      const userData = await userRes.json();
      setUser(userData);
      setFormData({ name: userData.name || '', email: userData.email || '', phone: userData.phone || '' });

      // 2. Societies you OWN
      const socRes = await fetch('http://localhost:3001/api/societies/my', { headers });
      const socData = await socRes.json();
      setMySocieties(Array.isArray(socData) ? socData : []);

      // 3. Events you CREATED
      // We fetch all events and filter by createdBy locally for security
      const eventRes = await fetch('http://localhost:3001/api/events', { headers });
      const eventData = await eventRes.json();
      const filtered = eventData.filter(e => e.createdBy === userData.id);
      setOrganizedEvents(filtered);
    };
    fetchData();
  }, []);

  const handleUpdateSociety = async (id, updatedData) => {
    // Logic to call PUT /api/societies/:id
    console.log("Updating Society:", id, updatedData);
    setEditingField(null);
  };

  return (
    <div className="min-h-screen bg-[#f3efe8] p-4 md:p-6 text-[#1a1a1a]">
      <div className="mx-auto max-w-[1380px] rounded-[28px] border border-black/10 bg-[#f7f3ec] p-3 shadow-lg md:p-4">
        <div className="flex flex-col gap-4 lg:flex-row">
          <Sidebar userRole={user?.role} />

          <main className="flex-1 rounded-2xl bg-[#f9f6ef] p-6 md:p-10 overflow-y-auto">
            <header className="mb-10 flex items-center justify-between">
              <h1 className="text-4xl font-black tracking-tight">Settings</h1>
              <button className="rounded-2xl bg-[#ff6b35] px-8 py-3 text-xs font-black uppercase text-white shadow-lg shadow-[#ff6b35]/20">
                Save All
              </button>
            </header>

            <div className="mb-10 flex gap-8 border-b border-black/5">
              {TABS.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => { setCurrentTab(tab.id); setEditingField(null); }}
                  className={`flex items-center gap-2 pb-4 text-[11px] font-black uppercase tracking-widest transition-all ${
                    currentTab === tab.id ? "border-b-2 border-[#ff6b35] text-[#ff6b35]" : "text-black/30"
                  }`}
                >
                  <i className={`fi ${tab.icon}`}></i> {tab.label}
                </button>
              ))}
            </div>

            <div className="max-w-3xl space-y-6">
              {/* --- ACCOUNT TAB --- */}
              {currentTab === 'account' && (
                <EditableRow 
                  label="Full Name" 
                  value={formData.name} 
                  isEditing={editingField === 'account_name'}
                  onEdit={() => setEditingField(editingField === 'account_name' ? null : 'account_name')}
                  onChange={(val) => setFormData({...formData, name: val})}
                />
              )}

              {/* --- SOCIETIES TAB --- */}
              {currentTab === 'societies' && (
                <div className="space-y-4">
                  {mySocieties.map(soc => (
                    <EditableRow 
                      key={soc.id}
                      label={`Society Name: ${soc.name}`}
                      value={soc.description}
                      isEditing={editingField === `soc_${soc.id}`}
                      onEdit={() => setEditingField(editingField === `soc_${soc.id}` ? null : `soc_${soc.id}`)}
                      onChange={(val) => handleUpdateSociety(soc.id, { description: val })}
                      placeholder="Edit society description..."
                    />
                  ))}
                </div>
              )}

              {/* --- EVENTS TAB --- */}
              {currentTab === 'events' && (
                <div className="space-y-4">
                  {organizedEvents.map(event => (
                    <EditableRow 
                      key={event.id}
                      label={`Event Title: ${event.title}`}
                      value={event.location}
                      isEditing={editingField === `evt_${event.id}`}
                      onEdit={() => setEditingField(editingField === `evt_${event.id}` ? null : `evt_${event.id}`)}
                      onChange={(val) => console.log("Edit Event Location", event.id, val)}
                      placeholder="Edit event location..."
                    />
                  ))}
                </div>
              )}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}

function EditableRow({ label, value, isEditing, onEdit, onChange, placeholder }) {
  return (
    <div className={`flex flex-col gap-4 p-5 rounded-2xl border transition-all ${isEditing ? 'bg-white border-[#ff6b35]/40 shadow-xl' : 'bg-transparent border-black/5'}`}>
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-[10px] font-black uppercase text-black/20 tracking-widest mb-1">{label}</p>
          {!isEditing && <p className="text-sm font-bold text-[#1a1a1a]">{value || "No data provided"}</p>}
        </div>
        <button onClick={onEdit} className={`h-11 w-11 rounded-xl flex items-center justify-center transition-all ${isEditing ? 'bg-[#ff6b35] text-white rotate-90' : 'bg-[#f7f3ec] text-black/40 hover:text-[#ff6b35]'}`}>
          <i className={`fi ${isEditing ? 'fi-rr-cross-small' : 'fi-rr-pencil'} text-lg`}></i>
        </button>
      </div>
      {isEditing && (
        <input 
          autoFocus
          className="w-full rounded-xl border border-black/10 bg-[#f7f3ec]/50 p-4 text-sm font-semibold outline-none focus:border-[#ff6b35]"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
        />
      )}
    </div>
  );
}