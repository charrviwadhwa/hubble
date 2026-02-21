import { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';

// Categories for general classification
const CATEGORIES = ["Technical", "Cultural", "Sports", "Literary", "Entrepreneurship", "Social Service", "Other"];

// Specific Event Types for Hubble
const EVENT_TYPES = ["Workshop", "Seminar", "Hackathon", "Competition", "Cultural Fest", "Sports Event", "Other"];

export default function CreateEvent() {
  const [mySocieties, setMySocieties] = useState([]);
  const [banner, setBanner] = useState(null);
  const [preview, setPreview] = useState(null);
  const [formData, setFormData] = useState({
    title: '', 
    societyId: '', 
    category: 'Technical', 
    eventType: 'Workshop', // New field
    shortDescription: '', 
    longDescription: '',
    startDate: '', 
    endDate: '', 
    location: '', 
    registrationDeadline: ''
  });

  useEffect(() => {
    // Fetch societies where the current user is the owner
    fetch("http://localhost:3001/api/societies/my", {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    })
    .then(res => res.json())
    .then(data => {
      setMySocieties(data);
      if (data.length > 0) setFormData(prev => ({ ...prev, societyId: data[0].id }));
    });
  }, []);

  const handleBannerChange = (e) => {
  const file = e.target.files[0];
  
  // Check if file is > 10MB
  if (file.size > 10 * 1024 * 1024) {
    alert("This image is too heavy! Please choose a file smaller than 10MB.");
    e.target.value = null; // Clear the input
    return;
  }

  setBanner(file);
  setPreview(URL.createObjectURL(file));
};

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    Object.keys(formData).forEach(key => data.append(key, formData[key]));
    if (banner) data.append('banner', banner);

    const res = await fetch('http://localhost:3001/api/events', {
      method: 'POST',
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      body: data 
    });

    if (res.ok) {
      alert("Event Published! 🚀");
      window.location.href = '/my-societies';
    }
    if (!res.ok) {
    // This is where you show the red error message to the MSIT user
    alert(result.error || result.message); 
    return;
  }
  };

  return (
    <div className="min-h-screen bg-[#f3efe8] p-4 md:p-6 text-[#1a1a1a]">
      <div className="mx-auto max-w-[1380px] rounded-[28px] border border-black/10 bg-[#f7f3ec] p-3 shadow-lg md:p-4">
        <div className="flex flex-col gap-4 lg:flex-row">
          <Sidebar />

          <main className="flex-1 rounded-2xl bg-[#f9f6ef] p-6 md:p-10 overflow-y-auto">
            <header className="mb-10">
              <h1 className="text-4xl font-black">Schedule Event</h1>
              <p className="text-sm text-black/40">Launch your next MSIT organization event</p>
            </header>

            <form onSubmit={handleSubmit} className="max-w-4xl space-y-8">
              {/* Banner Upload Section */}
              <div 
                className="relative h-48 w-full rounded-[32px] border-2 border-dashed border-black/10 bg-white grid place-items-center overflow-hidden cursor-pointer"
                onClick={() => document.getElementById('bannerInput').click()}
              >
                {preview ? <img src={preview} className="h-full w-full object-cover" /> : <p className="text-[10px] font-bold text-black/20">Click to upload event banner</p>}
                <input id="bannerInput" type="file" hidden onChange={handleBannerChange} />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input label="Event Title" value={formData.title} onChange={v => setFormData({...formData, title: v})} />
                
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase text-black/30 ml-2">Hosting Society</label>
                  <select 
                    className="w-full rounded-2xl border border-black/5 bg-white p-4 text-sm outline-none focus:border-[#ff6b35]"
                    value={formData.societyId}
                    onChange={e => setFormData({...formData, societyId: e.target.value})}
                  >
                    {mySocieties.map(soc => <option key={soc.id} value={soc.id}>{soc.name}</option>)}
                  </select>
                </div>
              </div>

              {/* Two Dropdowns: Category and Event Type */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase text-black/30 ml-2">Category</label>
                  <select 
                    className="w-full rounded-2xl border border-black/5 bg-white p-4 text-sm outline-none focus:border-[#ff6b35]"
                    value={formData.category}
                    onChange={e => setFormData({...formData, category: e.target.value})}
                  >
                    {CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase text-black/30 ml-2">Event Type</label>
                  <select 
                    className="w-full rounded-2xl border border-black/5 bg-white p-4 text-sm outline-none focus:border-[#ff6b35]"
                    value={formData.eventType}
                    onChange={e => setFormData({...formData, eventType: e.target.value})}
                  >
                    {EVENT_TYPES.map(type => <option key={type} value={type}>{type}</option>)}
                  </select>
                </div>
              </div>

              {/* Description Fields */}
              <Input label="Short Hook" value={formData.shortDescription} onChange={v => setFormData({...formData, shortDescription: v})} placeholder="One sentence to grab attention" />
              
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase text-black/30 ml-2">Long Description</label>
                <textarea 
                  className="w-full h-32 rounded-2xl border border-black/5 bg-white p-4 text-sm outline-none focus:border-[#ff6b35]"
                  value={formData.longDescription}
                  onChange={e => setFormData({...formData, longDescription: e.target.value})}
                />
              </div>

              {/* Dates and Location */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input label="Location (Room No. or Online Link)" value={formData.location} onChange={v => setFormData({...formData, location: v})} />
                <DateTime label="Registration Deadline" value={formData.registrationDeadline} onChange={v => setFormData({...formData, registrationDeadline: v})} />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <DateTime label="Start Date & Time" value={formData.startDate} onChange={v => setFormData({...formData, startDate: v})} />
                <DateTime label="End Date (Optional)" value={formData.endDate} onChange={v => setFormData({...formData, endDate: v})} />
              </div>

              <button type="submit" className="w-full py-5 bg-[#161616] text-white rounded-3xl font-bold hover:bg-[#ff6b35] transition shadow-xl">
                Blast Event 🚀
              </button>
            </form>
          </main>
        </div>
      </div>
    </div>
  );
}

// Helper Inputs
function Input({ label, value, onChange, placeholder }) {
  return (
    <div className="space-y-2">
      <label className="text-[10px] font-bold uppercase text-black/30 ml-2">{label}</label>
      <input className="w-full rounded-2xl border border-black/5 bg-white p-4 text-sm outline-none focus:border-[#ff6b35]" value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} />
    </div>
  );
}

function DateTime({ label, value, onChange }) {
  return (
    <div className="space-y-2">
      <label className="text-[10px] font-bold uppercase text-black/30 ml-2">{label}</label>
      <input type="datetime-local" className="w-full rounded-2xl border border-black/5 bg-white p-4 text-xs outline-none focus:border-[#ff6b35]" value={value} onChange={e => onChange(e.target.value)} />
    </div>
  );
}