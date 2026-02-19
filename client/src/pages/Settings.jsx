import { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';

export default function Settings() {
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({ name: '', email: '', phone: '' });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // 1. Fetching from your specific profile route
    fetch('http://localhost:3001/api/users/me/profile', {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    })
    .then(res => res.json())
    .then(data => {
      setUser(data);
      // Ensure data.email exists in your backend response
      setFormData({ 
        name: data.name || '', 
        email: data.email || '', 
        phone: data.phone || '' 
      });
    })
    .catch(err => console.error("Fetch error:", err));
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('http://localhost:3001/api/users/me/update', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          name: formData.name,
          phone: formData.phone
        }),
      });

      if (response.ok) alert("Profile updated!");
    } catch (error) {
      console.error("Save error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f3efe8] p-4 md:p-6 text-[#1a1a1a]">
      <div className="mx-auto max-w-[1380px] rounded-[28px] border border-black/10 bg-[#f7f3ec] p-3 shadow-lg md:p-4">
        <div className="flex flex-col gap-4 lg:flex-row">
          {/* Ensure Sidebar gets the role for correct links */}
          <Sidebar userRole={user?.role} />

          <main className="flex-1 rounded-2xl bg-[#f9f6ef] p-6 md:p-10">
            <header className="mb-10 flex items-center justify-between">
              <div>
                <h1 className="text-4xl font-black">Settings</h1>
                <p className="text-sm text-black/40 font-medium mt-1">Manage your MSIT Hubble credentials</p>
              </div>
              <button 
                onClick={handleSave}
                disabled={loading}
                className="rounded-2xl bg-[#ff6b35] px-8 py-3 text-sm font-bold text-white shadow-lg shadow-[#ff6b35]/20 hover:scale-105 transition disabled:opacity-50"
              >
                {loading ? 'Saving...' : 'Save Changes'}
              </button>
            </header>

            <div className="max-w-3xl space-y-12">
              <section className="space-y-6">
                <h3 className="text-xl font-bold">Profile Information</h3>

                <div className="grid gap-6">
                  {/* Name Field */}
                  <InputField 
                    label="Full Name" 
                    value={formData.name} 
                    onChange={(e) => setFormData({...formData, name: e.target.value})} 
                  />
                  
                  {/* --- Email Field: Fixed Visibility --- */}
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase text-black/30 ml-2 tracking-widest">Email Address</label>
                    <input 
                      type="text"
                      readOnly 
                      value={formData.email || user?.email || 'Loading...'} 
                      className="w-full rounded-2xl border border-black/5 bg-black/[0.03] p-4 text-sm font-medium text-black/40 cursor-not-allowed outline-none"
                    />
                    <p className="text-[10px] text-black/30 ml-2 italic text-orange-600/60">Primary email is managed by MSIT Admin</p>
                  </div>

                  {/* Phone Field */}
                 
                </div>
              </section>

              <hr className="border-black/5" />

              <section className="space-y-6">
                <h3 className="text-xl font-bold">Security</h3>
                <div className="space-y-4">
                  <ToggleField label="Two-Factor Authentication" description="Extra security for your event tickets" defaultOn={true} />
                  <ToggleField label="Login Notifications" description="Alerts for new logins at MSIT" defaultOn={false} />
                </div>
              </section>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}

// Sub-components (InputField, ToggleField) defined here...
function InputField({ label, value, onChange, placeholder }) {
  return (
    <div className="space-y-2">
      <label className="text-[10px] font-bold uppercase text-black/30 ml-2 tracking-widest">{label}</label>
      <input 
        type="text"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full rounded-2xl border border-black/5 bg-white p-4 text-sm font-medium outline-none focus:border-[#ff6b35] transition"
      />
    </div>
  );
}

function ToggleField({ label, description, defaultOn }) {
  const [isOn, setIsOn] = useState(defaultOn);
  return (
    <div className="flex items-center justify-between p-4 rounded-2xl hover:bg-black/5 transition">
      <div>
        <p className="text-sm font-bold">{label}</p>
        <p className="text-[10px] text-black/40 font-medium">{description}</p>
      </div>
      <button 
        onClick={() => setIsOn(!isOn)}
        className={`h-6 w-11 rounded-full p-1 transition-colors duration-300 ${isOn ? 'bg-[#ff6b35]' : 'bg-black/10'}`}
      >
        <div className={`h-4 w-4 rounded-full bg-white transition-transform duration-300 ${isOn ? 'translate-x-5' : 'translate-x-0'}`} />
      </button>
    </div>
  );
}