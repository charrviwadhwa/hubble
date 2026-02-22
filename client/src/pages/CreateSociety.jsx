import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import TopBar from '../components/TopBar'; // Integrates the navigation bar
import { triggerHubbleNotif } from '../utils/notify'; 
const CATEGORIES = ["Technical", "Cultural", "Sports", "Literary", "Entrepreneurship", "Social Service", "Other"];

export default function CreateSociety() {
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

  // Fetch User for Sidebar and TopBar
  useEffect(() => {
    fetch('http://localhost:3001/api/users/me/profile', {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    })
    .then(res => res.json())
    .then(data => setUser(data))
    .catch(err => console.error("Profile Fetch Error:", err));
  }, []);

  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      setError("Only image files (JPG, PNG, WEBP) are allowed!");
      setLogo(null);
      setPreview(null);
      e.target.value = null; 
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setError("File is too large! Max limit is 10MB.");
      setLogo(null);
      setPreview(null);
      e.target.value = null;
      return;
    }

    setError(""); 
    setLogo(file);
    setPreview(URL.createObjectURL(file));
  };

  const removeLogo = () => {
    setLogo(null);
    setPreview(null);
    setError("");
    document.getElementById('logoInput').value = ""; // Reset file input
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    
    if (!formData.name || !formData.category || !formData.description) {
      setError("Please fill in all required fields (Name, Category, Description).");
      return;
    }

    setLoading(true);
    const data = new FormData();
    Object.keys(formData).forEach(key => data.append(key, formData[key]));
    if (logo) data.append('logo', logo);

    try {
      const res = await fetch('http://localhost:3001/api/societies/create', {
        method: 'POST',
        headers: { 
          // Do NOT set Content-Type, browser sets it automatically with FormData boundaries
          Authorization: `Bearer ${localStorage.getItem('token')}` 
        },
        body: data 
      });

      if (res.ok) {
        triggerHubbleNotif(
      "Hub Activated", 
      "Your society has been registered successfully! Start hosting events now."
    );
    
        navigate('/my-societies');
      } else {
        const errorData = await res.json();
        setError(`Error: ${errorData.error || "Failed to submit"}`);
      }
    } catch (err) {
      console.error("Submission error:", err);
      setError("Network error. Is the server running?");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f1f3f6]  text-[#1a1a1a] font-sans">
      <div className="mx-auto flex  gap-6 rounded-2xl bg-white p-4 shadow-sm min-h-[90vh]">
        {/* Sidebar */}
        <div className="w-64 flex-shrink-0 hidden lg:block border-r border-gray-100 pr-4">
           <Sidebar userRole={user?.role} />
        </div>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto pt-4 pl-4 md:pl-8">
          
          <TopBar user={user} />

          <button 
            onClick={() => navigate('/my-societies')}
            className="mb-6 flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-[#ff6b35] transition-colors"
          >
            <i className="fi fi-rr-arrow-left"></i> Back to Hubs
          </button>

          <header className="mb-8">
            <h1 className="text-3xl font-medium text-gray-900">Register Society</h1>
            <p className="text-sm text-gray-500 mt-1">Setup your organization's presence on MSIT Hubble.</p>
          </header>

          {error && (
            <div className="mb-8 max-w-3xl rounded-xl bg-red-50 p-4 text-sm font-medium text-red-600 border border-red-100 flex items-center gap-2">
              <i className="fi fi-rr-triangle-warning"></i> {error}
            </div>
          )}

          <div className="max-w-3xl pr-6 pb-20">
            <form onSubmit={handleSubmit} className="space-y-10 animate-in fade-in duration-500">
              
              {/* Logo Upload Section */}
              <section>
                <h3 className="text-base font-semibold text-gray-900 mb-6">Society Identity</h3>
                <div className="flex items-center gap-6">
                  <div className="h-24 w-24 rounded-2xl bg-gray-50 border border-gray-200 flex items-center justify-center overflow-hidden">
                    {preview ? (
                      <img src={preview} alt="Logo Preview" className="h-full w-full object-cover" />
                    ) : (
                      <i className="fi fi-rr-camera text-2xl text-gray-300"></i>
                    )}
                  </div>
                  <div>
                    <input 
                      id="logoInput"
                      type="file" 
                      accept="image/png, image/jpeg, image/webp"
                      onChange={handleLogoChange} 
                      className="hidden" 
                    />
                    <div className="flex items-center gap-3">
                      <label 
                        htmlFor="logoInput"
                        className="cursor-pointer text-sm font-medium text-[#ff6b35] hover:text-[#e85a25]"
                      >
                        Upload Logo
                      </label>
                      {preview && (
                        <button 
                          type="button" 
                          onClick={removeLogo} 
                          className="text-sm font-medium text-gray-400 hover:text-red-500 transition-colors"
                        >
                          Remove
                        </button>
                      )}
                    </div>
                    <p className="mt-1 text-xs text-gray-500">Recommended: Square format (1:1), PNG or JPG.</p>
                  </div>
                </div>
              </section>

              <hr className="border-gray-200" />

              {/* Basic Information */}
              <section className="space-y-6">
                <h3 className="text-base font-semibold text-gray-900 mb-2">Basic Information</h3>
                
                <BoutiqInput label="Society Name" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="e.g. Prakriti" required />
                
                <div className="grid grid-cols-1 md:grid-cols-[150px_1fr] items-center gap-4">
                  <label className="text-sm text-gray-700">Category</label>
                  <select 
                    value={formData.category} 
                    onChange={e => setFormData({...formData, category: e.target.value})}
                    className="w-full max-w-md rounded-lg border border-gray-300 px-4 py-2.5 text-sm text-gray-900 outline-none transition-colors focus:border-[#ff6b35] focus:ring-1 focus:ring-[#ff6b35] bg-white"
                  >
                    {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-[150px_1fr] items-start gap-4">
                  <label className="text-sm text-gray-700 pt-2">Description <span className="text-red-500">*</span></label>
                  <textarea 
                    value={formData.description}
                    onChange={e => setFormData({...formData, description: e.target.value})}
                    placeholder="What is your society about? What do you do?"
                    required
                    className="w-full max-w-md h-32 rounded-lg border border-gray-300 px-4 py-3 text-sm text-gray-900 outline-none transition-colors focus:border-[#ff6b35] focus:ring-1 focus:ring-[#ff6b35] resize-none"
                  />
                </div>
              </section>

              <hr className="border-gray-200" />

              {/* College & Administration */}
              <section className="space-y-6">
                <h3 className="text-base font-semibold text-gray-900 mb-2">Administration</h3>
                <BoutiqInput label="College Name" value={formData.collegeName} onChange={e => setFormData({...formData, collegeName: e.target.value})} placeholder="e.g. MSIT" />
                <BoutiqInput label="President Name" value={formData.presidentName} onChange={e => setFormData({...formData, presidentName: e.target.value})} placeholder="Current Lead / President" />
              </section>

              <hr className="border-gray-200" />

              {/* Social Media Links */}
              <section className="space-y-6">
                <h3 className="text-base font-semibold text-gray-900 mb-2">Social & Contact Links</h3>
                <BoutiqInput label="Instagram URL" value={formData.insta} onChange={e => setFormData({...formData, insta: e.target.value})} placeholder="instagram.com/..." />
                <BoutiqInput label="Official Mail" value={formData.mail} onChange={e => setFormData({...formData, mail: e.target.value})} placeholder="society@msit.in" type="email" />
                <BoutiqInput label="LinkedIn URL" value={formData.linkedin} onChange={e => setFormData({...formData, linkedin: e.target.value})} placeholder="linkedin.com/company/..." />
              </section>

              <div className="pt-6">
                <button 
                  type="submit" 
                  disabled={loading}
                  className="w-full max-w-md ml-0 md:ml-[166px] rounded-xl bg-[#ff6b35] px-6 py-3.5 text-sm font-semibold text-white shadow-md hover:bg-[#e85a25] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-2"
                >
                  {loading ? 'Registering...' : (
                    <>
                      Register Society <i className="fi fi-rr-bank text-xs mt-0.5"></i>
                    </>
                  )}
                </button>
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