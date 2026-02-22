import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';

const CATEGORIES = ["Technical", "Cultural", "Sports", "Literary", "Entrepreneurship", "Social Service", "Other"];

export default function EditSociety() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  
  // UI States
  const [loading, setLoading] = useState(false);
  const [initialLoad, setInitialLoad] = useState(true);
  const [error, setError] = useState("");

  // Form States
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
        
        // Fetch User (for Sidebar)
        const userRes = await fetch('http://localhost:3001/api/users/me/profile', { headers });
        setUser(await userRes.json());

        // Fetch Society Data
        // Note: You can reuse your /api/societies/my route and filter, or create a specific GET route
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
        } else {
          setError("Society not found or unauthorized.");
        }
      } catch (err) {
        console.error("Fetch error:", err);
        setError("Failed to load society details.");
      } finally {
        setInitialLoad(false);
      }
    };

    fetchSocietyDetails();
  }, [id]);

  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      setError("Only image files (JPG, PNG, WEBP) are allowed!");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setError("File is too large! Max limit is 10MB.");
      return;
    }

    setError(""); 
    setLogo(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Use FormData to handle both text and the optional new logo
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
        alert("Society updated successfully!");
        navigate('/settings');
      } else {
        const errData = await res.json();
        setError(errData.error || "Failed to update society.");
      }
    } catch (err) {
      console.error("Update error:", err);
      setError("Network error occurred.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    const confirmed = window.confirm("Are you sure you want to delete this society? This action is permanent and will remove all associated events.");
    if (!confirmed) return;

    try {
      const res = await fetch(`http://localhost:3001/api/societies/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      if (res.ok) {
        navigate('/settings');
      }
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  if (initialLoad) return <div className="p-10 text-center">Loading Hub Data...</div>;

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
              <h1 className="text-3xl font-medium text-gray-900">Edit Society</h1>
              <p className="text-sm text-gray-500 mt-1">Update your organization's details and profile.</p>
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
                disabled={loading}
                className="rounded-full bg-[#ff6b35] px-6 py-2.5 text-sm font-medium text-white shadow-md hover:bg-[#e85a25] transition-colors disabled:opacity-50"
              >
                {loading ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </header>

          {error && (
            <div className="mb-8 max-w-3xl rounded-xl bg-red-50 p-4 text-sm font-medium text-red-600 border border-red-100">
              ⚠️ {error}
            </div>
          )}

          <div className="max-w-3xl pr-6 pb-20 space-y-10">
            
            {/* Logo Section */}
            <section>
              <h3 className="text-base font-semibold text-gray-900 mb-6">Society Logo</h3>
              <div className="flex items-center gap-6">
                <div className="h-24 w-24 rounded-2xl bg-gray-100 border border-gray-200 flex items-center justify-center overflow-hidden">
                  {preview ? (
                    <img src={preview} alt="New Logo" className="h-full w-full object-cover" />
                  ) : existingLogo ? (
                    <img src={`http://localhost:3001${existingLogo}`} alt="Existing Logo" className="h-full w-full object-cover" />
                  ) : (
                    <i className="fi fi-rr-picture text-2xl text-gray-400"></i>
                  )}
                </div>
                <div>
                  <input 
                    type="file" 
                    id="logoUpload"
                    accept="image/png, image/jpeg, image/webp" 
                    onChange={handleLogoChange} 
                    className="hidden" 
                  />
                  <label 
                    htmlFor="logoUpload"
                    className="cursor-pointer text-sm font-medium text-[#ff6b35] hover:text-[#e85a25]"
                  >
                    Upload New Logo
                  </label>
                  <p className="mt-1 text-xs text-gray-500">Recommended: Square PNG or JPG. Max 10MB.</p>
                </div>
              </div>
            </section>

            <hr className="border-gray-200" />

            {/* Basic Info Section */}
            <section className="space-y-6">
              <h3 className="text-base font-semibold text-gray-900 mb-2">Basic Information</h3>
              <BoutiqInput label="Society Name" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
              
              <div className="grid grid-cols-1 md:grid-cols-[150px_1fr] items-center gap-4">
                <label className="text-sm text-gray-700">Category</label>
                <select 
                  className="w-full max-w-md rounded-lg border border-gray-300 px-4 py-2.5 text-sm text-gray-900 outline-none focus:border-[#ff6b35] focus:ring-1 focus:ring-[#ff6b35]"
                  value={formData.category}
                  onChange={e => setFormData({...formData, category: e.target.value})}
                >
                  {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-[150px_1fr] items-start gap-4">
                <label className="text-sm text-gray-700 pt-2">Description</label>
                <textarea 
                  className="w-full max-w-md h-32 rounded-lg border border-gray-300 px-4 py-3 text-sm text-gray-900 outline-none focus:border-[#ff6b35] focus:ring-1 focus:ring-[#ff6b35] resize-none"
                  value={formData.description}
                  onChange={e => setFormData({...formData, description: e.target.value})}
                />
              </div>
            </section>

            <hr className="border-gray-200" />

            {/* Administration & Socials */}
            <section className="space-y-6">
              <h3 className="text-base font-semibold text-gray-900 mb-2">Administration & Contact</h3>
              <BoutiqInput label="College Name" value={formData.collegeName} onChange={e => setFormData({...formData, collegeName: e.target.value})} />
              <BoutiqInput label="President Name" value={formData.presidentName} onChange={e => setFormData({...formData, presidentName: e.target.value})} />
              <BoutiqInput label="Official Email" value={formData.mail} onChange={e => setFormData({...formData, mail: e.target.value})} />
              <BoutiqInput label="Instagram URL" value={formData.insta} onChange={e => setFormData({...formData, insta: e.target.value})} />
              <BoutiqInput label="LinkedIn URL" value={formData.linkedin} onChange={e => setFormData({...formData, linkedin: e.target.value})} />
            </section>

            {/* Danger Zone */}
            <section className="mt-16 rounded-2xl border border-red-100 bg-red-50/50 p-6">
              <h3 className="text-base font-semibold text-red-700 mb-2">Danger Zone</h3>
              <p className="text-sm text-red-600/70 mb-4">Once you delete a society, there is no going back. All events and registrations linked to this society at MSIT will be permanently wiped.</p>
              <button 
                onClick={handleDelete}
                className="rounded-lg bg-red-600 px-6 py-2.5 text-sm font-medium text-white hover:bg-red-700 transition-colors"
              >
                Delete Society
              </button>
            </section>

          </div>
        </main>
      </div>
    </div>
  );
}

// Reuse the BoutiqInput helper
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