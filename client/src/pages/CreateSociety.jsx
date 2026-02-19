import { useState } from 'react';
import Sidebar from '../components/Sidebar';

const CATEGORIES = ["Technical", "Cultural", "Sports", "Literary", "Entrepreneurship", "Social Service", "Other"];

export default function CreateSociety() {
  const [formData, setFormData] = useState({
    name: '', category: 'Technical', description: '',
    collegeName: '', presidentName: '',
    insta: '', mail: '', linkedin: ''
  });
  const [logo, setLogo] = useState(null);
  const [preview, setPreview] = useState(null);

  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    setLogo(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  
  // 1. Validation check
  if (!formData.name || !formData.category || !formData.description) {
    alert("Please fill in all required fields.");
    return;
  }

  const data = new FormData();
  
  // 2. Append all text fields
  Object.keys(formData).forEach(key => {
    data.append(key, formData[key]);
  });
  
  // 3. Append the logo file
  if (logo) {
    data.append('logo', logo);
  }

  try {
    const res = await fetch('http://localhost:3001/api/societies/create', {
      method: 'POST',
      headers: { 
        // IMPORTANT: Do NOT set Content-Type here
        Authorization: `Bearer ${localStorage.getItem('token')}` 
      },
      body: data 
    });

    if (res.ok) {
      alert("Society Registered Successfully!");
      window.location.href = '/my-societies';
    } else {
      const errorData = await res.json();
      alert(`Error: ${errorData.error || "Failed to submit"}`);
    }
  } catch (err) {
    console.error("Submission error:", err);
    alert("Network error. Is the server running?");
  }
};

  return (
    <div className="min-h-screen bg-[#f3efe8] p-4 md:p-6">
      <div className="mx-auto max-w-[1380px] rounded-[28px] border border-black/10 bg-[#f7f3ec] p-3 shadow-lg md:p-4">
        <div className="flex flex-col gap-4 lg:flex-row">
          <Sidebar />
          <main className="flex-1 rounded-2xl bg-[#f9f6ef] p-6 md:p-10 overflow-y-auto">
            <header className="mb-8">
              <h1 className="text-4xl font-black text-[#1a1a1a]">Register Society</h1>
              <p className="text-sm text-black/40">Enter your organization details below</p>
            </header>

            <form onSubmit={handleSubmit} className="max-w-4xl space-y-10">
              {/* Logo Upload */}
              <div className="flex items-center gap-6 bg-white p-6 rounded-[32px] border border-black/5">
                <div className="h-24 w-24 rounded-[32px] bg-[#f7f3ec] border-2 border-dashed border-black/10 grid place-items-center overflow-hidden">
                  {preview ? <img src={preview} className="h-full w-full object-cover" /> : "📸"}
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase text-black/30 mb-2">Society Logo</label>
                  <input type="file" onChange={handleLogoChange} className="text-xs font-bold text-[#ff6b35]" />
                </div>
              </div>

              {/* Basic Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input label="Society Name" value={formData.name} onChange={v => setFormData({...formData, name: v})} />
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase text-black/30 ml-2">Category</label>
                  <select 
                    className="w-full rounded-2xl border border-black/5 bg-white p-4 text-sm outline-none focus:border-[#ff6b35]"
                    value={formData.category}
                    onChange={e => setFormData({...formData, category: e.target.value})}
                  >
                    {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              </div>

              {/* College & President */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input label="College Name" value={formData.collegeName} onChange={v => setFormData({...formData, collegeName: v})} />
                <Input label="Society President" value={formData.presidentName} onChange={v => setFormData({...formData, presidentName: v})} />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase text-black/30 ml-2">Description</label>
                <textarea 
                  className="w-full h-32 rounded-2xl border border-black/5 bg-white p-4 text-sm outline-none focus:border-[#ff6b35]"
                  value={formData.description}
                  onChange={e => setFormData({...formData, description: e.target.value})}
                />
              </div>

              {/* Social Media Links */}
              <div className="space-y-4">
                <h3 className="text-xs font-bold uppercase text-black/30 tracking-widest">Social Media & Contact</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Input label="Instagram URL" value={formData.insta} onChange={v => setFormData({...formData, insta: v})} placeholder="instagram.com/..." />
                  <Input label="Official Mail" value={formData.mail} onChange={v => setFormData({...formData, mail: v})} placeholder="society@college.edu" />
                  <Input label="LinkedIn URL" value={formData.linkedin} onChange={v => setFormData({...formData, linkedin: v})} />
                </div>
              </div>

              <button type="submit" className="w-full py-5 bg-[#161616] text-white rounded-2xl font-bold hover:bg-[#ff6b35] transition shadow-xl">
                Create Society & Join Hub
              </button>
            </form>
          </main>
        </div>
      </div>
    </div>
  );
}

function Input({ label, value, onChange, placeholder }) {
  return (
    <div className="space-y-2">
      <label className="text-[10px] font-bold uppercase text-black/30 ml-2">{label}</label>
      <input 
        className="w-full rounded-2xl border border-black/5 bg-white p-4 text-sm outline-none focus:border-[#ff6b35] transition"
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
      />
    </div>
  );
}