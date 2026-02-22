import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';

const EVENT_TYPES = ["Workshop", "Hackathon", "Tech Talk", "Cultural Fest", "Seminar", "Other"];

export default function EditEvent() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  
  // UI States
  const [loading, setLoading] = useState(false);
  const [initialLoad, setInitialLoad] = useState(true);
  const [error, setError] = useState("");
  const [isPastEvent, setIsPastEvent] = useState(false); // 🔒 Locks the form if event is over

  // Form States
  const [formData, setFormData] = useState({
    title: '', eventType: 'Workshop', location: '', capacity: 100,
    startDate: '', endDate: '', registrationDeadline: '',
    shortDescription: '', longDescription: ''
  });
  const [banner, setBanner] = useState(null);
  const [preview, setPreview] = useState(null);
  const [existingBanner, setExistingBanner] = useState(null);

  // Helper to format JS Dates for <input type="datetime-local">
  const formatForInput = (dateString) => {
    if (!dateString) return '';
    const d = new Date(dateString);
    // Adjust for local timezone offset
    d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
    return d.toISOString().slice(0, 16);
  };

  useEffect(() => {
    const fetchEventDetails = async () => {
      try {
        const headers = { Authorization: `Bearer ${localStorage.getItem('token')}` };
        
        // 1. Fetch User
        const userRes = await fetch('http://localhost:3001/api/users/me/profile', { headers });
        const userData = await userRes.json();
        setUser(userData);

        // 2. Fetch Event Data
        const eventRes = await fetch(`http://localhost:3001/api/events/${id}`, { headers });
        const data = await eventRes.json();
        
        // Drizzle innerJoin returns { event: {...}, society: {...} }
        const targetEvent = data.event || data;
        const targetSociety = data.society || {};

        // 🔥 THE FIX: Check if you made the event OR if you own the society
        const isCreator = Number(targetEvent.createdBy) === Number(userData.id);
        const isSocietyOwner = Number(targetSociety.ownerId) === Number(userData.id);

        if (targetEvent && (isCreator || isSocietyOwner)) {
          
          const now = new Date();
          const eventConclusion = targetEvent.endDate ? new Date(targetEvent.endDate) : new Date(targetEvent.startDate);
          
          if (eventConclusion < now) {
            setIsPastEvent(true);
            setError("This event has already concluded. Editing is disabled for archived events.");
          }

          setFormData({
            title: targetEvent.title || '',
            eventType: targetEvent.eventType || 'Workshop',
            location: targetEvent.location || '',
            capacity: targetEvent.capacity || 100,
            startDate: formatForInput(targetEvent.startDate),
            endDate: formatForInput(targetEvent.endDate),
            registrationDeadline: formatForInput(targetEvent.registrationDeadline),
            shortDescription: targetEvent.shortDescription || '',
            longDescription: targetEvent.longDescription || ''
          });
          setExistingBanner(targetEvent.banner);
        } else {
          setError("Event not found or you are not authorized to edit it.");
          setIsPastEvent(true); // Lock the form
        }
      } catch (err) {
        console.error("Fetch error:", err);
        setError("Failed to load event details.");
      } finally {
        setInitialLoad(false);
      }
    };

    fetchEventDetails();
  }, [id]);

  const handleBannerChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!['image/jpeg', 'image/jpg', 'image/png', 'image/webp'].includes(file.type)) {
      setError("Only image files (JPG, PNG, WEBP) are allowed!");
      return;
    }

    setError(""); 
    setBanner(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (isPastEvent) return;
    setLoading(true);

    const updateData = new FormData();
    Object.keys(formData).forEach(key => updateData.append(key, formData[key]));
    if (banner) updateData.append('banner', banner);

    try {
      const res = await fetch(`http://localhost:3001/api/events/${id}`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        body: updateData 
      });

      if (res.ok) {
        alert("Event updated successfully!");
        navigate('/settings');
      } else {
        const errData = await res.json();
        setError(errData.error || "Failed to update event.");
      }
    } catch (err) {
      console.error("Update error:", err);
      setError("Network error occurred.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    const confirmed = window.confirm("Are you sure you want to cancel and delete this event? This will remove all student registrations.");
    if (!confirmed) return;

    try {
      const res = await fetch(`http://localhost:3001/api/events/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      if (res.ok) navigate('/settings');
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  if (initialLoad) return <div className="p-10 text-center text-gray-500 font-medium">Loading Event Data...</div>;

  return (
    <div className="min-h-screen bg-[#f1f3f6] p-4 md:p-6 text-[#1a1a1a] font-sans">
      <div className="mx-auto flex max-w-[1400px] gap-6 rounded-2xl bg-white p-4 shadow-sm min-h-[90vh]">
        <div className="w-64 flex-shrink-0 hidden lg:block border-r border-gray-100 pr-4">
           <Sidebar userRole={user?.role} />
        </div>

        <main className="flex-1 overflow-y-auto pt-4 pl-4 md:pl-8">
          
          <button 
            onClick={() => navigate('/settings')}
            className="mb-6 flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-[#ff6b35] transition-colors"
          >
            <i className="fi fi-rr-arrow-left"></i> Back to Settings
          </button>

          <header className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4 pr-6">
            <div>
              <h1 className="text-3xl font-medium text-gray-900">Edit Event</h1>
              <p className="text-sm text-gray-500 mt-1">Update your live or upcoming event schedule.</p>
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
                disabled={loading || isPastEvent}
                className="rounded-full bg-[#ff6b35] px-6 py-2.5 text-sm font-medium text-white shadow-md hover:bg-[#e85a25] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </header>

          {error && (
            <div className={`mb-8 max-w-3xl rounded-xl p-4 text-sm font-medium border ${isPastEvent ? 'bg-amber-50 text-amber-700 border-amber-200' : 'bg-red-50 text-red-600 border-red-100'}`}>
              {isPastEvent ? '🔒 ' : '⚠️ '} {error}
            </div>
          )}

          {/* Form container - Lowers opacity if editing is locked */}
          <div className={`max-w-3xl pr-6 pb-20 space-y-10 transition-opacity ${isPastEvent ? 'opacity-60 pointer-events-none grayscale-[0.2]' : ''}`}>
            
            {/* Banner Section */}
            <section>
              <h3 className="text-base font-semibold text-gray-900 mb-6">Event Banner</h3>
              <div className="flex items-center gap-6">
                <div className="h-32 w-48 rounded-2xl bg-gray-100 border border-gray-200 flex items-center justify-center overflow-hidden">
                  {preview ? (
                    <img src={preview} alt="New Banner" className="h-full w-full object-cover" />
                  ) : existingBanner ? (
                    <img src={`http://localhost:3001${existingBanner}`} alt="Existing Banner" className="h-full w-full object-cover" />
                  ) : (
                    <i className="fi fi-rr-picture text-2xl text-gray-400"></i>
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
                    Upload New Banner
                  </label>
                  <p className="mt-1 text-xs text-gray-500">Recommended: 16:9 Landscape PNG or JPG.</p>
                </div>
              </div>
            </section>

            <hr className="border-gray-200" />

            {/* Core Details Section */}
            <section className="space-y-6">
              <h3 className="text-base font-semibold text-gray-900 mb-2">Core Details</h3>
              <BoutiqInput label="Event Title" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} />
              
              <div className="grid grid-cols-1 md:grid-cols-[150px_1fr] items-center gap-4">
                <label className="text-sm text-gray-700">Event Type</label>
                <select 
                  className="w-full max-w-md rounded-lg border border-gray-300 px-4 py-2.5 text-sm text-gray-900 outline-none focus:border-[#ff6b35] focus:ring-1 focus:ring-[#ff6b35]"
                  value={formData.eventType}
                  onChange={e => setFormData({...formData, eventType: e.target.value})}
                >
                  {EVENT_TYPES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>

              <BoutiqInput label="Location" value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} />
              <BoutiqInput label="Capacity" type="number" value={formData.capacity} onChange={e => setFormData({...formData, capacity: e.target.value})} />
            </section>

            <hr className="border-gray-200" />

            {/* Schedule Section */}
            <section className="space-y-6">
              <h3 className="text-base font-semibold text-gray-900 mb-2">Schedule & Deadlines</h3>
              <BoutiqInput label="Start Time" type="datetime-local" value={formData.startDate} onChange={e => setFormData({...formData, startDate: e.target.value})} />
              <BoutiqInput label="End Time" type="datetime-local" value={formData.endDate} onChange={e => setFormData({...formData, endDate: e.target.value})} />
              <BoutiqInput label="Registration Closes" type="datetime-local" value={formData.registrationDeadline} onChange={e => setFormData({...formData, registrationDeadline: e.target.value})} />
            </section>

            <hr className="border-gray-200" />

            {/* Description Section */}
            <section className="space-y-6">
              <h3 className="text-base font-semibold text-gray-900 mb-2">Descriptions</h3>
              <div className="grid grid-cols-1 md:grid-cols-[150px_1fr] items-start gap-4">
                <label className="text-sm text-gray-700 pt-2">Short Pitch</label>
                <textarea 
                  className="w-full max-w-md h-20 rounded-lg border border-gray-300 px-4 py-3 text-sm text-gray-900 outline-none focus:border-[#ff6b35] focus:ring-1 focus:ring-[#ff6b35] resize-none"
                  value={formData.shortDescription}
                  onChange={e => setFormData({...formData, shortDescription: e.target.value})}
                  placeholder="A quick 1-2 sentence hook..."
                />
              </div>
            </section>

          </div>

          {/* Danger Zone - Remains active even if form is locked */}
          <div className="max-w-3xl pr-6 pb-10">
            <section className="mt-8 rounded-2xl border border-red-100 bg-red-50/50 p-6">
              <h3 className="text-base font-semibold text-red-700 mb-2">Danger Zone</h3>
              <p className="text-sm text-red-600/70 mb-4">Canceling an event will delete it permanently and erase the registration roster.</p>
              <button 
                onClick={handleDelete}
                className="rounded-lg bg-red-600 px-6 py-2.5 text-sm font-medium text-white hover:bg-red-700 transition-colors"
              >
                Delete Event
              </button>
            </section>
          </div>

        </main>
      </div>
    </div>
  );
}

// Reuse the BoutiqInput helper
function BoutiqInput({ label, value, onChange, type = "text", readOnly = false }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-[150px_1fr] items-center gap-4">
      <label className="text-sm text-gray-700">{label}</label>
      <input 
        type={type} 
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