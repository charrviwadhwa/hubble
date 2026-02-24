import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import TopBar from '../components/TopBar'; // Integrates the navigation bar
import { triggerHubbleNotif } from '../utils/notify'; // Import the notification utility

const CATEGORIES = ["Technical", "Cultural", "Sports", "Literary", "Entrepreneurship", "Social Service", "Other"];
const EVENT_TYPES = ["Workshop", "Seminar", "Hackathon", "Competition", "Cultural Fest", "Sports Event", "Other"];

export default function CreateEvent() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [mySocieties, setMySocieties] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [banner, setBanner] = useState(null);
  const [preview, setPreview] = useState(null);
  const [formData, setFormData] = useState({
    title: '', 
    societyId: '', 
    category: 'Technical', 
    eventType: 'Workshop',
    shortDescription: '', 
    longDescription: '',
    startDate: '', 
    endDate: '', 
    location: '', 
    registrationDeadline: ''
  });

  useEffect(() => {
    const headers = { Authorization: `Bearer ${localStorage.getItem('token')}` };

    // Fetch User for TopBar and Sidebar
    fetch('http://localhost:3001/api/users/me/profile', { headers })
      .then(res => res.json())
      .then(data => setUser(data))
      .catch(err => console.error("Profile Fetch Error:", err));

    // Fetch societies where the current user is the owner
    fetch("http://localhost:3001/api/societies/my", { headers })
      .then(res => res.json())
      .then(data => {
        setMySocieties(Array.isArray(data) ? data : []);
        if (data.length > 0) setFormData(prev => ({ ...prev, societyId: data[0].id }));
      })
      .catch(err => console.error("Societies Fetch Error:", err));
  }, []);

  const handleBannerChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      setError("Only image files (JPG, PNG, WEBP) are allowed!");
      e.target.value = null;
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setError("This image is too heavy! Please choose a file smaller than 10MB.");
      e.target.value = null;
      return;
    }

    setError("");
    setBanner(file);
    setPreview(URL.createObjectURL(file));
  };


  const [refining, setRefining] = useState(false);

const handleAIRefine = async () => {
  if (!formData.longDescription && !formData.title) {
    setError("Add a title or a draft description first so Gemini has something to work with!");
    return;
  }

  setRefining(true);
  setError(""); 

  try {
    const res = await fetch('http://localhost:3001/api/ai/refine-event', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}` 
      },
      body: JSON.stringify({
        title: formData.title,
        description: formData.longDescription,
        category: formData.category
      })
    });

    const data = await res.json();

    if (res.ok) {
      setFormData(prev => ({ ...prev, longDescription: data.refinedText }));
      triggerHubbleNotif("AI Polished", "Gemini has enhanced your event details!");
    } else {
      setError(data.error || "AI service is currently unavailable.");
    }
  } catch (err) {
    console.error("AI Fetch Error:", err);
    setError("Connection error. Check if your server is running.");
  } finally {
    setRefining(false);
  }
};


  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const data = new FormData();
    Object.keys(formData).forEach(key => data.append(key, formData[key]));
    if (banner) data.append('banner', banner);

    try {
      const res = await fetch('http://localhost:3001/api/events', {
        method: 'POST',
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        body: data 
      });

      const resData = await res.json();

      if (res.ok) {
        triggerHubbleNotif(
    "Mission Broadcasted", 
    "Your event is now live and visible to the entire MSIT student body."
  );
        navigate('/events'); // Redirect to Events feed on success
      } else {
        setError(resData.error || resData.message || "Failed to create event.");
      }
    } catch (err) {
      console.error("Submit Error:", err);
      setError("A network error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f1f3f6]  text-[#1a1a1a] font-sans">
      <div className="mx-auto flex  gap-6 rounded-2xl bg-white p-4 shadow-sm min-h-[90vh]">
        {/* Sidebar Space */}
        <div className="w-64 flex-shrink-0 hidden lg:block border-r border-gray-100 pr-4">
           <Sidebar userRole={user?.role} />
        </div>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto pt-4 pl-4 md:pl-8">
          
          <TopBar user={user} />

          <button 
            onClick={() => navigate(-1)}
            className="mb-6 flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-[#ff6b35] transition-colors"
          >
            <i className="fi fi-rr-arrow-left"></i> Back
          </button>

          <header className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4 pr-6">
            <div>
              <h1 className="text-3xl font-medium text-gray-900">Schedule Event</h1>
              <p className="text-sm text-gray-500 mt-1">Publish a new event to the MSIT Hubble feed.</p>
            </div>
          </header>

          {error && (
            <div className="mb-8 max-w-3xl rounded-xl bg-red-50 p-4 text-sm font-medium text-red-600 border border-red-100">
              <i className="fi fi-rr-triangle-warning mr-2"></i> {error}
            </div>
          )}

          <div className="max-w-3xl pr-6 pb-20">
            <form onSubmit={handleSubmit} className="space-y-10 animate-in fade-in duration-500">
              
              {/* Banner Upload Section */}
              <section>
                <h3 className="text-base font-semibold text-gray-900 mb-6">Event Banner</h3>
                <div className="flex items-center gap-6">
                  <div className="h-32 w-48 rounded-2xl bg-gray-50 border border-gray-200 flex items-center justify-center overflow-hidden">
                    {preview ? (
                      <img src={preview} alt="Banner Preview" className="h-full w-full object-cover" />
                    ) : (
                      <i className="fi fi-rr-picture text-2xl text-gray-300"></i>
                    )}
                  </div>
                  <div>
                    <input 
                      type="file" 
                      id="bannerUpload"
                      accept="image/png, image/jpeg, image/webp" 
                      onChange={handleBannerChange} 
                      className="hidden" 
                    />
                    <label 
                      htmlFor="bannerUpload"
                      className="cursor-pointer text-sm font-medium text-[#ff6b35] hover:text-[#e85a25]"
                    >
                      Upload Banner Image
                    </label>
                    <p className="mt-1 text-xs text-gray-500">Recommended: 16:9 ratio. JPG or PNG. Max 10MB.</p>
                  </div>
                </div>
              </section>

              <hr className="border-gray-200" />

              {/* Basic Information */}
              <section className="space-y-6">
                <h3 className="text-base font-semibold text-gray-900 mb-2">Basic Information</h3>
                
                <BoutiqInput label="Event Title" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} placeholder="e.g. Annual Tech Summit" required />
                
                <BoutiqSelect 
                  label="Hosting Society" 
                  value={formData.societyId} 
                  onChange={e => setFormData({...formData, societyId: e.target.value})}
                  options={mySocieties.map(soc => ({ value: soc.id, label: soc.name }))}
                />
                
                <BoutiqSelect 
                  label="Category" 
                  value={formData.category} 
                  onChange={e => setFormData({...formData, category: e.target.value})}
                  options={CATEGORIES.map(cat => ({ value: cat, label: cat }))}
                />

                <BoutiqSelect 
                  label="Event Type" 
                  value={formData.eventType} 
                  onChange={e => setFormData({...formData, eventType: e.target.value})}
                  options={EVENT_TYPES.map(type => ({ value: type, label: type }))}
                />
              </section>

              <hr className="border-gray-200" />

              {/* Event Description */}
              <section className="space-y-6">
  <h3 className="text-base font-semibold text-gray-900 mb-2">Descriptions</h3>
  
  <BoutiqInput 
    label="Short Hook" 
    value={formData.shortDescription} 
    onChange={e => setFormData({...formData, shortDescription: e.target.value})} 
    placeholder="A one-sentence pitch to grab attention" 
  />
  
  <div className="grid grid-cols-1 md:grid-cols-[150px_1fr] items-start gap-4">
    <label className="text-sm text-gray-700 pt-2">Full Details</label>
    
    <div className="w-full max-w-md space-y-2">
      <textarea 
        className="w-full h-40 rounded-lg border border-gray-300 px-4 py-3 text-sm text-gray-900 outline-none focus:border-[#ff6b35] focus:ring-1 focus:ring-[#ff6b35] resize-none"
        value={formData.longDescription}
        onChange={e => setFormData({...formData, longDescription: e.target.value})}
        placeholder="Provide the complete agenda, prerequisites, or rules..."
      />
      
      {/* ✨ AI REFINE BUTTON */}
      <button 
        type="button"
        onClick={handleAIRefine}
        disabled={refining}
        className="flex items-center gap-2 text-xs font-bold text-[#ff6b35] hover:text-[#e85a25] transition-colors disabled:opacity-50"
      >
        {refining ? (
          <><i className="fi fi-rr-loading animate-spin"></i> AI is polishing...</>
        ) : (
          <><i className="fi fi-rr-magic-wand"></i> Refine with AI</>
        )}
      </button>
    </div>
  </div>
</section>

              <hr className="border-gray-200" />

              {/* Logistics */}
              <section className="space-y-6">
                <h3 className="text-base font-semibold text-gray-900 mb-2">Logistics & Schedule</h3>
                
                <BoutiqInput label="Location" value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} placeholder="Room 402 or Google Meet link" required />
                
                <BoutiqInput type="datetime-local" label="Start Date" value={formData.startDate} onChange={e => setFormData({...formData, startDate: e.target.value})} required />
                
                <BoutiqInput type="datetime-local" label="End Date" value={formData.endDate} onChange={e => setFormData({...formData, endDate: e.target.value})} />
                
                <BoutiqInput type="datetime-local" label="Registration Deadline" value={formData.registrationDeadline} onChange={e => setFormData({...formData, registrationDeadline: e.target.value})} />
              </section>

              <div className="pt-6">
                <button 
                  type="submit" 
                  disabled={loading || mySocieties.length === 0}
                  className="w-full max-w-md ml-0 md:ml-[166px] rounded-xl bg-[#ff6b35] px-6 py-3.5 text-sm font-semibold text-white shadow-md hover:bg-[#e85a25] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-2"
                >
                  {loading ? 'Publishing...' : (
                    <>
                      Publish Event <i className="fi fi-rr-paper-plane text-xs mt-0.5"></i>
                    </>
                  )}
                </button>
                {mySocieties.length === 0 && (
                  <p className="text-xs text-red-500 mt-2 md:ml-[166px]">You must create a Society first before hosting an event.</p>
                )}
              </div>

            </form>
          </div>
        </main>
      </div>
    </div>
  );
}

/* --- BOUTIQ-STYLE HELPER COMPONENTS --- */

function BoutiqInput({ label, value, onChange, placeholder, type = "text", required = false }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-[150px_1fr] items-center gap-4">
      <label className="text-sm text-gray-700">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <input 
        type={type} 
        value={value} 
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        className="w-full max-w-md rounded-lg border border-gray-300 px-4 py-2.5 text-sm text-gray-900 outline-none transition-colors focus:border-[#ff6b35] focus:ring-1 focus:ring-[#ff6b35]"
      />
    </div>
  );
}

function BoutiqSelect({ label, value, onChange, options }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-[150px_1fr] items-center gap-4">
      <label className="text-sm text-gray-700">{label}</label>
      <select 
        value={value} 
        onChange={onChange}
        className="w-full max-w-md rounded-lg border border-gray-300 px-4 py-2.5 text-sm text-gray-900 outline-none transition-colors focus:border-[#ff6b35] focus:ring-1 focus:ring-[#ff6b35] bg-white"
      >
        {options.map(opt => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
    </div>
  );
}