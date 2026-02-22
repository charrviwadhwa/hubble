import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import { triggerHubbleNotif } from '../utils/notify'; // Added your notif helper

const CATEGORIES = ["Technical", "Cultural", "Sports", "Literary", "Entrepreneurship", "Social Service", "Other"];

export default function EditSociety() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    name: '', category: 'Technical', description: '',
    collegeName: '', presidentName: '',
    insta: '', mail: '', linkedin: ''
  });
  const [logo, setLogo] = useState(null);
  const [preview, setPreview] = useState(null);
  const [existingLogo, setExistingLogo] = useState(null);

  useEffect(() => {
    const fetchSocietyDetails = async () => {
      try {
        const headers = { Authorization: `Bearer ${localStorage.getItem('token')}` };
        const userRes = await fetch('http://localhost:3001/api/users/me/profile', { headers });
        setUser(await userRes.json());

        const socRes = await fetch('http://localhost:3001/api/societies/my', { headers });
        const socData = await socRes.json();
        const targetSociety = socData.find(s => Number(s.id) === Number(id));
        
        if (targetSociety) {
          setFormData({
            name: targetSociety.name || '',
            category: targetSociety.category || 'Technical',
            description: targetSociety.description || '',
            collegeName: targetSociety.collegeName || '',
            presidentName: targetSociety.presidentName || '',
            insta: targetSociety.instaLink || '',
            mail: targetSociety.mailLink || '',
            linkedin: targetSociety.linkedinLink || ''
          });
          setExistingLogo(targetSociety.logo);
        }
      } catch (err) {
        console.error("Fetch error:", err);
      }
    };
    fetchSocietyDetails();
  }, [id]);

  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setLogo(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);

    const updateData = new FormData();
    Object.keys(formData).forEach(key => updateData.append(key, formData[key]));
    if (logo) updateData.append('logo', logo);

    try {
      const res = await fetch(`http://localhost:3001/api/societies/${id}`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        body: updateData 
      });

      if (res.ok) {
        // 🔔 Trigger your new notification system
        triggerHubbleNotif("Society Updated", `${formData.name} parameters have been reconfigured.`);
        navigate('/settings');
      } else {
        setError("Failed to update society.");
      }
    } catch (err) {
      setError("Network error occurred.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Permanent delete?")) return;
    try {
      const res = await fetch(`http://localhost:3001/api/societies/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      if (res.ok) {
        triggerHubbleNotif("Society Deleted", "Organization removed from MSIT grid.");
        navigate('/settings');
      }
    } catch (err) { console.error(err); }
  };

  return (
    <div className="min-h-screen bg-[#f1f3f6] text-[#1a1a1a] font-sans">
      <div className="mx-auto flex gap-6 rounded-2xl bg-white p-4 shadow-sm min-h-[90vh]">
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
              <h1 className="text-3xl font-medium text-gray-900">Edit Society</h1>
              <p className="text-sm text-gray-500 mt-1">Update your organization's details.</p>
            </div>
            <div className="flex gap-3">
              <button onClick={() => navigate('/settings')} className="rounded-full bg-gray-100 px-6 py-2.5 text-sm font-medium">Cancel</button>
              <button 
                onClick={handleSave}
                disabled={loading}
                className="rounded-full bg-[#ff6b35] px-6 py-2.5 text-sm font-medium text-white shadow-md disabled:opacity-50"
              >
                {loading ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </header>

          {error && <div className="mb-8 max-w-3xl rounded-xl bg-red-50 p-4 text-sm text-red-600 border border-red-100">{error}</div>}

          <div className="max-w-3xl pr-6 pb-20 space-y-10">
            {/* Logo Section */}
            <section>
              <h3 className="text-base font-semibold text-gray-900 mb-6">Society Logo</h3>
              <div className="flex items-center gap-6">
                <div className="h-24 w-24 rounded-2xl bg-gray-100 border border-gray-200 flex items-center justify-center overflow-hidden shadow-inner">
                  {preview ? (
                    <img src={preview} alt="Preview" className="h-full w-full object-cover" />
                  ) : existingLogo ? (
                    <img src={`http://localhost:3001${existingLogo}`} alt="Current" className="h-full w-full object-cover" />
                  ) : (
                    <i className="fi fi-rr-picture text-2xl text-gray-400"></i>
                  )}
                </div>
                <div>
                  <input type="file" id="logoUpload" accept="image/*" onChange={handleLogoChange} className="hidden" />
                  <label htmlFor="logoUpload" className="cursor-pointer text-sm font-medium text-[#ff6b35] hover:underline">Upload New Logo</label>
                  <p className="mt-1 text-xs text-gray-500">Square PNG or JPG. Max 10MB.</p>
                </div>
              </div>
            </section>

            <hr className="border-gray-200" />

            <section className="space-y-6">
              <h3 className="text-base font-semibold text-gray-900">Basic Information</h3>
              <BoutiqInput label="Society Name" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
              
              <div className="grid grid-cols-1 md:grid-cols-[150px_1fr] items-center gap-4">
                <label className="text-sm text-gray-700">Category</label>
                <select 
                  className="w-full max-w-md rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none focus:border-[#ff6b35]"
                  value={formData.category}
                  onChange={e => setFormData({...formData, category: e.target.value})}
                >
                  {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-[150px_1fr] items-start gap-4">
                <label className="text-sm text-gray-700 pt-2">Description</label>
                <textarea 
                  className="w-full max-w-md h-32 rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none focus:border-[#ff6b35] resize-none"
                  value={formData.description}
                  onChange={e => setFormData({...formData, description: e.target.value})}
                />
              </div>
            </section>

            <hr className="border-gray-200" />

            <section className="space-y-6">
              <h3 className="text-base font-semibold text-gray-900">Socials & Admin</h3>
              <BoutiqInput label="College" value={formData.collegeName} onChange={e => setFormData({...formData, collegeName: e.target.value})} />
              <BoutiqInput label="President" value={formData.presidentName} onChange={e => setFormData({...formData, presidentName: e.target.value})} />
              <BoutiqInput label="Official Mail" value={formData.mail} onChange={e => setFormData({...formData, mail: e.target.value})} />
              <BoutiqInput label="Instagram" value={formData.insta} onChange={e => setFormData({...formData, insta: e.target.value})} />
              <BoutiqInput label="LinkedIn" value={formData.linkedin} onChange={e => setFormData({...formData, linkedin: e.target.value})} />
            </section>

            <section className="mt-16 rounded-2xl border border-red-100 bg-red-50/50 p-6">
              <h3 className="text-base font-semibold text-red-700">Danger Zone</h3>
              <p className="text-sm text-red-600/70 mb-4">Deleting this society will wipe all associated missions from the hub.</p>
              <button onClick={handleDelete} className="rounded-lg bg-red-600 px-6 py-2.5 text-sm font-medium text-white hover:bg-red-700">Delete Society</button>
            </section>
          </div>
        </main>
      </div>
    </div>
  );
}

function BoutiqInput({ label, value, onChange }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-[150px_1fr] items-center gap-4">
      <label className="text-sm text-gray-700">{label}</label>
      <input 
        type="text" 
        value={value} 
        onChange={onChange}
        className="w-full max-w-md rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none focus:border-[#ff6b35] focus:ring-1 focus:ring-[#ff6b35]"
      />
    </div>
  );
}