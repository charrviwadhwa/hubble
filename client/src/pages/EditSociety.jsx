import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import TopBar from '../components/TopBar';
import TeamManager from '../components/TeamManager'; 
import { triggerHubbleNotif } from '../utils/notify';

const CATEGORIES = ["Technical", "Cultural", "Sports", "Literary", "Entrepreneurship", "Social Service", "Other"];

export default function EditSociety() {
  const { id } = useParams(); // Gets the society ID from the URL
  const navigate = useNavigate();
  
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [logoPreview, setLogoPreview] = useState(null);
  const [logoFile, setLogoFile] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    category: 'Technical',
    description: '',
    collegeName: ' ',
    presidentName: '',
    insta: '',
    mail: '',
    linkedin: ''
  });

  // 1. Fetch User and Society Data on Load
  useEffect(() => {
    const fetchData = async () => {
      const headers = { Authorization: `Bearer ${localStorage.getItem('token')}` };
      
      try {
        // Fetch User Profile for TopBar/Sidebar
        const userRes = await fetch('http://localhost:3001/api/users/me/profile', { headers });
        setUser(await userRes.json());

        // Fetch Society Data
        const socRes = await fetch('http://localhost:3001/api/societies/my', { headers });
        const socData = await socRes.json();
        
        // Find the specific society we are trying to edit
        const currentSociety = socData.find(s => Number(s.id) === Number(id));
        
        if (!currentSociety) {
          setError("Society not found or you don't have permission to edit it.");
          return;
        }

        // Populate the form
        setFormData({
          name: currentSociety.name || '',
          category: currentSociety.category || 'Technical',
          description: currentSociety.description || '',
          collegeName: currentSociety.collegeName || ' ',
          presidentName: currentSociety.presidentName || '',
          insta: currentSociety.instaLink || '',
          mail: currentSociety.mailLink || '',
          linkedin: currentSociety.linkedinLink || ''
        });
        
        if (currentSociety.logo) {
          setLogoPreview(`http://localhost:3001${currentSociety.logo}`);
        }

      } catch (err) {
        console.error("Fetch Error:", err);
        setError("Failed to load society data.");
      }
    };

    fetchData();
  }, [id]);

  // 2. Handle Logo Upload Preview
  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      setError("Logo file is too large! Max limit is 10MB.");
      return;
    }

    setLogoFile(file);
    setLogoPreview(URL.createObjectURL(file));
  };

  // 3. Handle Form Submit (Update Details)
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const submitData = new FormData();
    Object.keys(formData).forEach(key => submitData.append(key, formData[key]));
    if (logoFile) submitData.append('logo', logoFile);

    try {
      const res = await fetch(`http://localhost:3001/api/societies/${id}`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        body: submitData
      });

      const data = await res.json();

      if (res.ok) {
        triggerHubbleNotif("Hub Updated", "Society details have been saved successfully.");
      } else {
        setError(data.error || "Failed to update society.");
      }
    } catch (err) {
      console.error(err);
      setError("Network error occurred.");
    } finally {
      setLoading(false);
    }
  };

  // 4. Handle Delete Society
  const handleDelete = async () => {
    const confirmName = prompt(`Type "${formData.name}" to confirm deletion. This action cannot be undone and will delete all events.`);
    
    if (confirmName !== formData.name) {
      
      return;
    }

    try {
      const res = await fetch(`http://localhost:3001/api/societies/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });

      if (res.ok) {
        triggerHubbleNotif("Society Deleted", "The hub and all its data have been removed.");
        navigate('/settings'); // Redirect back to settings
      } else {
        const data = await res.json();
        triggerHubbleNotif("Delete Failed", data.error || "Failed to delete society.");
      }
    } catch (err) {
      triggerHubbleNotif("Network Error", "Failed to delete society due to network issues.");
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
          <TopBar user={user} />

          <button 
            onClick={() => navigate(-1)}
            className="mb-6 flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-[#ff6b35] transition-colors"
          >
            <i className="fi fi-rr-arrow-left"></i> Back to Settings
          </button>

          <header className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4 pr-6">
            <div>
              <h1 className="text-3xl font-medium text-gray-900">Edit Society</h1>
              <p className="text-sm text-gray-500 mt-1">Update your hub's profile and manage your core team.</p>
            </div>
            <button 
              onClick={handleSubmit}
              disabled={loading}
              className="rounded-full bg-[#ff6b35] px-6 py-2.5 text-sm font-medium text-white shadow-md hover:bg-[#e85a25] transition-colors flex items-center gap-2 disabled:opacity-50"
            >
              {loading ? <i className="fi fi-rr-loading animate-spin"></i> : <i className="fi fi-rr-disk"></i>}
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
          </header>

          {error && (
            <div className="mb-8 max-w-3xl rounded-xl bg-red-50 p-4 text-sm font-medium text-red-600 border border-red-100">
              <i className="fi fi-rr-triangle-warning mr-2"></i> {error}
            </div>
          )}

          <div className="max-w-3xl pr-6 pb-20 space-y-12 animate-in fade-in duration-500">
            
            {/* 1. Identity Form */}
            <form id="edit-society-form" onSubmit={handleSubmit} className="space-y-8">
              
              <section>
                <h3 className="text-base font-semibold text-gray-900 mb-6">Brand Identity</h3>
                <div className="flex items-center gap-6">
                  <div className="h-24 w-24 rounded-2xl bg-gray-50 border border-gray-200 flex items-center justify-center overflow-hidden text-[#ff6b35] text-3xl font-bold shadow-sm">
                    {logoPreview ? (
                      <img src={logoPreview} alt="Logo Preview" className="h-full w-full object-cover" />
                    ) : (
                      formData.name ? formData.name[0].toUpperCase() : <i className="fi fi-rr-picture text-gray-300 text-2xl"></i>
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
                      className="cursor-pointer inline-block rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-[#ff6b35] transition-colors shadow-sm"
                    >
                      Change Logo
                    </label>
                    <p className="mt-2 text-xs text-gray-500">Square ratio recommended. Max 10MB.</p>
                  </div>
                </div>
              </section>

              <hr className="border-gray-100" />

              <section className="space-y-6">
                <h3 className="text-base font-semibold text-gray-900 mb-2">Basic Details</h3>
                <BoutiqInput label="Society Name" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required />
                <BoutiqSelect 
                  label="Category" 
                  value={formData.category} 
                  onChange={e => setFormData({...formData, category: e.target.value})}
                  options={CATEGORIES.map(cat => ({ value: cat, label: cat }))}
                />
                <BoutiqInput label="President/Lead Name" value={formData.presidentName} onChange={e => setFormData({...formData, presidentName: e.target.value})} />
                
                <div className="grid grid-cols-1 md:grid-cols-[150px_1fr] items-start gap-4">
                  <label className="text-sm text-gray-700 pt-2">Description</label>
                  <textarea 
                    className="w-full max-w-md h-24 rounded-lg border border-gray-300 px-4 py-3 text-sm text-gray-900 outline-none focus:border-[#ff6b35] focus:ring-1 focus:ring-[#ff6b35] resize-none"
                    value={formData.description}
                    onChange={e => setFormData({...formData, description: e.target.value})}
                    placeholder="What does your society do?"
                  />
                </div>
              </section>

              <hr className="border-gray-100" />

              <section className="space-y-6">
                <h3 className="text-base font-semibold text-gray-900 mb-2">Social Links</h3>
                <BoutiqInput label="Instagram" placeholder="instagram.com/yourhub" value={formData.insta} onChange={e => setFormData({...formData, insta: e.target.value})} />
                <BoutiqInput label="LinkedIn" placeholder="linkedin.com/company/yourhub" value={formData.linkedin} onChange={e => setFormData({...formData, linkedin: e.target.value})} />
                <BoutiqInput label="Email Address" type="email" placeholder="contact@hubble.in" value={formData.mail} onChange={e => setFormData({...formData, mail: e.target.value})} />
              </section>

            </form>

            <hr className="border-gray-200" />

            {/* 2. TEAM MANAGEMENT COMPONENT */}
            <TeamManager societyId={id} />

            <hr className="border-gray-200 border-dashed" />

            {/* 3. DANGER ZONE */}
            <section className="rounded-2xl border border-red-100 bg-red-50/30 p-6">
              <h3 className="text-base font-semibold text-red-600 mb-1">Danger Zone</h3>
              <p className="text-sm text-red-500/80 mb-6">Deleting this society will permanently remove all its events, registrations, and team data.</p>
              
              <button 
                onClick={handleDelete}
                className="rounded-lg bg-red-100 px-4 py-2 text-sm font-bold text-red-600 hover:bg-red-200 hover:text-red-700 transition-colors"
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
        className="w-full max-w-md rounded-lg border border-gray-300 px-4 py-2.5 text-sm text-gray-900 outline-none transition-colors focus:border-[#ff6b35] focus:ring-1 focus:ring-[#ff6b35] bg-white"
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