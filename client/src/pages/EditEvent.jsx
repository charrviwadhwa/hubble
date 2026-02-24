import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/TopBar'; // Or whatever your top bar is named
import { triggerHubbleNotif } from '../utils/notify'; 

export default function EditEvent() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    title: '',
    location: '',
    startDate: '',
    endDate: '',
    capacity: '',
    description: ''
  });
  
  const [banner, setBanner] = useState(null);
  const [preview, setPreview] = useState(null);
  const [existingBanner, setExistingBanner] = useState(null);

  useEffect(() => {
    const fetchEventDetails = async () => {
      try {
        const headers = { Authorization: `Bearer ${localStorage.getItem('token')}` };
        
        // Fetch User (for Sidebar/Navbar)
        fetch('https://hubble-d9l6.onrender.com/api/users/me/profile', { headers })
          .then(res => res.json())
          .then(data => setUser(data))
          .catch(err => console.error(err));

        // Fetch Event Data
        // Note: Replace with your actual specific event fetch route if you have one, 
        // e.g., `/api/events/${id}`. Here we fetch all and filter for safety.
        const eventRes = await fetch('https://hubble-d9l6.onrender.com/api/events', { headers });
        const eventData = await eventRes.json();
        const targetEvent = eventData.find(e => Number(e.id) === Number(id));
        
        if (targetEvent) {
          // Format dates for datetime-local input (YYYY-MM-DDThh:mm)
          const formatToLocalDatetime = (isoString) => {
            if (!isoString) return '';
            const date = new Date(isoString);
            // Quick offset fix to keep local time in the input
            const offset = date.getTimezoneOffset() * 60000;
            return new Date(date.getTime() - offset).toISOString().slice(0, 16);
          };

          setFormData({
            title: targetEvent.title || '',
            location: targetEvent.location || '',
            startDate: formatToLocalDatetime(targetEvent.startDate),
            endDate: formatToLocalDatetime(targetEvent.endDate),
            capacity: targetEvent.capacity || '',
            description: targetEvent.description || ''
          });
          setExistingBanner(targetEvent.banner);
        }
      } catch (err) {
        console.error("Fetch error:", err);
      }
    };
    fetchEventDetails();
  }, [id]);

  const [isGenerating, setIsGenerating] = useState(false);

// 2. Add the function to call your backend:
const handleGenerateAI = async () => {
  if (!formData.description || formData.description.length < 5) {
    return;
  }

  setIsGenerating(true);
  try {
    const res = await fetch('https://hubble-d9l6.onrender.com/api/ai/generate-description', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify({ prompt: formData.description }),
    });

    const data = await res.json();

    if (res.ok) {
      // Update the description field with the AI-generated text
      setFormData({ ...formData, description: data.description });
      triggerHubbleNotif("AI Draft Ready", "We've polished your mission details.");
    } else {
      
    }
  } catch (err) {
    console.error("AI Generation Error:", err);
   
  } finally {
    setIsGenerating(false);
  }
};
  const handleBannerChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      setError("Banner file is too large! Max limit is 10MB.");
      return;
    }

    setError("");
    setBanner(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");

    const updateData = new FormData();
    Object.keys(formData).forEach(key => updateData.append(key, formData[key]));
    if (banner) updateData.append('banner', banner);

    try {
      const res = await fetch(`https://hubble-d9l6.onrender.com/api/events/${id}`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        body: updateData 
      });

      if (res.ok) {
        triggerHubbleNotif("Event Updated", `"${formData.title}" parameters have been successfully synchronized.`);
        navigate('/settings');
      } else {
        const errData = await res.json();
        setError(errData.message || "Failed to update event.");
      }
    } catch (err) {
      setError("Network error occurred.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to cancel and delete this event permanently?")) return;
    try {
      const res = await fetch(`https://hubble-d9l6.onrender.com/api/events/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      if (res.ok) {
        triggerHubbleNotif("Event Cancelled", "The mission has been successfully scrubbed from the grid.");
        navigate('/settings');
      }
    } catch (err) { 
      console.error("Delete error:", err); 
    }
  };

  return (
    <div className="min-h-screen bg-[#f1f3f6] text-[#1a1a1a] font-sans">
      <div className="mx-auto flex gap-6 rounded-2xl bg-white p-4 shadow-sm min-h-[90vh]">
        
        {/* Sidebar */}
        <div className="w-64 flex-shrink-0 hidden lg:block border-r border-gray-100 pr-4">
           <Sidebar userRole={user?.role} />
        </div>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto pt-4 pl-4 md:pl-8 pr-2">
          <Navbar user={user} />

          <button 
            onClick={() => navigate('/settings')}
            className="mb-6 flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-[#ff6b35] transition-colors w-fit"
          >
            <i className="fi fi-rr-arrow-left"></i> Back to Settings
          </button>

          <header className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4 pr-6">
            <div>
              <h1 className="text-3xl font-medium text-gray-900 tracking-tight">Edit Event</h1>
              <p className="text-sm text-gray-500 mt-1">Refine your mission parameters and logistics.</p>
            </div>
            <div className="flex gap-3">
              <button 
                onClick={() => navigate('/settings')} 
                className="rounded-full bg-gray-100 px-6 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={handleSave}
                disabled={saving}
                className="rounded-full bg-[#ff6b35] px-6 py-2.5 text-sm font-medium text-white shadow-md hover:bg-[#e85a25] disabled:opacity-50 transition-colors"
              >
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </header>

          {error && <div className="mb-8 max-w-3xl rounded-xl bg-red-50 p-4 text-sm font-medium text-red-600 border border-red-100">⚠️ {error}</div>}

          <div className="max-w-3xl pr-6 pb-20 space-y-10">
            
            {/* Banner Section */}
            <section>
              <h3 className="text-base font-semibold text-gray-900 mb-4">Event Banner</h3>
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
                <div className="h-32 w-full sm:w-56 rounded-2xl bg-gray-50 border border-gray-200 flex items-center justify-center overflow-hidden shadow-inner relative">
                  {preview ? (
                    <img src={preview} alt="Preview" className="h-full w-full object-cover" />
                  ) : existingBanner ? (
                    <img src={`https://hubble-d9l6.onrender.com${existingBanner}`} alt="Current" className="h-full w-full object-cover" />
                  ) : (
                    <div className="flex flex-col items-center text-gray-400">
                      <i className="fi fi-rr-picture text-2xl mb-1"></i>
                      <span className="text-[10px] uppercase tracking-widest font-bold">No Banner</span>
                    </div>
                  )}
                </div>
                <div>
                  <input type="file" id="bannerUpload" accept="image/*" onChange={handleBannerChange} className="hidden" />
                  <label htmlFor="bannerUpload" className="inline-block cursor-pointer rounded-lg bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200 hover:text-black transition-colors">
                    Upload New Banner
                  </label>
                  <p className="mt-2 text-xs text-gray-500">16:9 Landscape recommended. Max 10MB.</p>
                </div>
              </div>
            </section>

            <hr className="border-gray-100" />

            {/* Basic Info Section */}
            <section className="space-y-6">
              <h3 className="text-base font-semibold text-gray-900">Mission Details</h3>
              <BoutiqInput label="Event Title" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} placeholder="e.g. Annual Tech Symposium" />
              <BoutiqInput label="Location / Venue" value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} placeholder="e.g. Main Auditorium" />
              
              <div className="grid grid-cols-1 md:grid-cols-[150px_1fr] items-start gap-4">
  <div className="pt-2">
    <label className="text-sm text-gray-700 font-medium">Description</label>
  </div>
  <div className="w-full max-w-md">
    <div className="flex justify-end mb-2">
      <button 
        type="button"
        onClick={handleGenerateAI}
        disabled={isGenerating}
        className={`flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-lg border-2 transition-all ${
          isGenerating 
          ? 'bg-gray-100 border-gray-300 text-gray-400 cursor-wait' 
          : 'bg-orange-50 border-[#ff6b35] text-[#ff6b35] hover:bg-[#ff6b35] hover:text-white shadow-[2px_2px_0px_0px_rgba(255,107,53,0.3)]'
        }`}
      >
        <svg className={`w-3 h-3 ${isGenerating ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
        {isGenerating ? 'Crafting...' : 'AI Refine'}
      </button>
    </div>
    <textarea 
      className="w-full h-48 rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 outline-none focus:border-[#ff6b35] focus:ring-1 focus:ring-[#ff6b35] resize-none transition-all shadow-sm"
      value={formData.description}
      onChange={e => setFormData({...formData, description: e.target.value})}
      placeholder="Type a brief idea here, then click AI Refine..."
    />
    <p className="mt-2 text-[10px] text-gray-400 font-medium italic">
      Tip: Type a simple sentence like "hackathon with prizes" and let AI do the rest.
    </p>
  </div>
</div>
            </section>

            <hr className="border-gray-100" />

            {/* Logistics Section */}
            <section className="space-y-6">
              <h3 className="text-base font-semibold text-gray-900">Logistics & Timing</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-[150px_1fr] items-center gap-4">
                <label className="text-sm text-gray-700 font-medium">Start Date & Time</label>
                <input 
                  type="datetime-local" 
                  value={formData.startDate}
                  onChange={e => setFormData({...formData, startDate: e.target.value})}
                  className="w-full max-w-md rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-900 outline-none focus:border-[#ff6b35] focus:ring-1 focus:ring-[#ff6b35] transition-all"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-[150px_1fr] items-center gap-4">
                <label className="text-sm text-gray-700 font-medium">End Date & Time</label>
                <input 
                  type="datetime-local" 
                  value={formData.endDate}
                  onChange={e => setFormData({...formData, endDate: e.target.value})}
                  className="w-full max-w-md rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-900 outline-none focus:border-[#ff6b35] focus:ring-1 focus:ring-[#ff6b35] transition-all"
                />
              </div>

              <BoutiqInput type="number" label="Max Capacity" value={formData.capacity} onChange={e => setFormData({...formData, capacity: e.target.value})} placeholder="Leave blank for unlimited" />
            </section>

            {/* Danger Zone */}
            <section className="mt-16 rounded-2xl border border-red-100 bg-red-50/50 p-6 sm:p-8">
              <h3 className="text-base font-semibold text-red-700">Cancel Event</h3>
              <p className="text-sm text-red-600/80 mb-5 max-w-xl">
                Cancelling this event is irreversible. All registered students will lose their tickets, and the event will be wiped from the hub.
              </p>
              <button 
                onClick={handleDelete} 
                className="rounded-lg bg-red-600 px-6 py-2.5 text-sm font-medium text-white hover:bg-red-700 transition-colors shadow-sm"
              >
                Delete Event Permanently
              </button>
            </section>

          </div>
        </main>
      </div>
    </div>
  );
}

// --- BOUTIQ COMPONENT HELPERS ---

function BoutiqInput({ label, value, onChange, type = "text", placeholder = "", readOnly = false }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-[150px_1fr] items-center gap-4">
      <label className="text-sm text-gray-700 font-medium">{label}</label>
      <input 
        type={type} 
        value={value} 
        onChange={onChange}
        readOnly={readOnly}
        placeholder={placeholder}
        className={`w-full max-w-md rounded-lg border px-4 py-2.5 text-sm text-gray-900 outline-none transition-colors ${
          readOnly 
            ? 'bg-gray-50 border-gray-200 text-gray-500 cursor-not-allowed' 
            : 'bg-white border-gray-200 focus:border-[#ff6b35] focus:ring-1 focus:ring-[#ff6b35]'
        }`}
      />
    </div>
  );
}