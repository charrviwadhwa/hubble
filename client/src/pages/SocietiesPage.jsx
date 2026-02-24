import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function SocietiesPage() {
  const navigate = useNavigate();

  const handleNavHome = () => navigate('/');
  const handleNavSocieties = () => window.scrollTo({ top: 0, behavior: 'smooth' });
  const handleNavFeatures = () => navigate('/#features-section');
  const handleRegisterSociety = () => navigate('/signup'); // or /create-society depending on your flow
  const handleNavContact = () => navigate('/#contact-section');


  return (
    <div className="min-h-screen bg-[#fdfdfd] font-sans text-gray-900 overflow-x-hidden selection:bg-[#ff6b35] selection:text-white">
      
      {/* --- CUSTOM ANIMATIONS --- */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes float-slow {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-15px) rotate(5deg); }
        }
        @keyframes float-fast {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(-10deg); }
        }
        @keyframes pulse-soft {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.1); opacity: 0.8; }
        }
        .animate-float-slow { animation: float-slow 6s ease-in-out infinite; }
        .animate-float-fast { animation: float-fast 4s ease-in-out infinite; }
        .animate-pulse-soft { animation: pulse-soft 3s ease-in-out infinite; }
      `}} />

      {/* ======================= NAVBAR ======================= */}
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-8 relative z-50">
        {/* Logo */}
        <div onClick={handleNavHome} className="text-3xl font-black tracking-tighter text-black flex items-center gap-2 hover:scale-105 transition-transform cursor-pointer">
          <div className="w-5 h-5 bg-[#ff6b35] rounded-full animate-pulse-soft"></div>
          Hubble
        </div>

        {/* Center Links - Updated for SaaS Flow */}
        <div className="hidden md:flex items-center gap-10 text-sm font-bold text-gray-900">
          <button 
            onClick={handleNavHome} 
            className="hover:text-[#ff6b35] hover:-translate-y-1 transition-all pb-1 inline-block focus:outline-none"
          >
            Home
          </button>
          <button 
            onClick={handleNavFeatures} 
            className="hover:text-[#ff6b35] hover:-translate-y-1 transition-all pb-1 inline-block focus:outline-none"
          >
            Features
          </button>
          <button 
            onClick={handleNavSocieties} 
            className={`hover:text-[#ff6b35] hover:-translate-y-1 transition-all pb-1 inline-block focus:outline-none ${window.location.pathname === '/societies' ? 'border-b-4 border-[#ff6b35]' : ''}`}
          >
            For Societies
          </button>
          <button 
            onClick={handleNavContact} 
            className="hover:text-[#ff6b35] hover:-translate-y-1 transition-all pb-1 inline-block focus:outline-none"
          >
            Contact
          </button>
        </div>

        {/* Right Auth Buttons */}
        <div className="hidden md:flex items-center gap-4">
          <button onClick={() => navigate('/login')} className="text-sm font-bold text-gray-900 hover:text-[#ff6b35] transition-colors focus:outline-none">
            Log in
          </button>
          <button onClick={() => navigate('/signup')} className="rounded-xl bg-[#ff6b35] px-6 py-2.5 text-sm font-bold text-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] border-2 border-black hover:-translate-y-1 hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] active:translate-y-1 active:shadow-none transition-all focus:outline-none">
            Sign up
          </button>
        </div>

        {/* Mobile Menu Icon */}
        <button className="md:hidden text-black hover:text-[#ff6b35] focus:outline-none">
          <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16"></path></svg>
        </button>
      </nav>


      {/* ======================= HERO SECTION ======================= */}
      <section className="mx-auto max-w-4xl px-6 pt-16 pb-20 text-center relative">
        <Decoration className="absolute top-10 left-10 w-8 h-8 animate-float-fast z-0" type="square" />
        <Decoration className="absolute top-32 right-10 w-6 h-6 animate-pulse-soft z-0" type="circle" />
        
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border-4 border-black bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] mb-8 font-black text-xs uppercase tracking-widest text-[#ff6b35]">
          <span className="w-2 h-2 rounded-full bg-[#ff6b35] animate-pulse"></span> For Society Leads
        </div>
        
        <h1 className="text-5xl md:text-7xl font-black leading-[1.1] tracking-tight text-black mb-8 relative z-10">
          Run your society <br/>
          <span className="relative inline-block whitespace-nowrap text-white bg-black px-4 py-1 mt-2 rotate-2 hover:rotate-0 transition-transform">
            like a pro.
          </span>
        </h1>
        <p className="text-lg font-bold text-gray-600 max-w-2xl mx-auto mb-12">
          Ditch the messy spreadsheets and chaotic WhatsApp groups. Hubble gives you a powerful suite of tools to manage your members, host epic missions, and track your impact.
        </p>

        <button onClick={handleRegisterSociety} className="rounded-xl bg-[#ff6b35] px-10 py-4 text-lg font-black uppercase tracking-widest text-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] border-4 border-black hover:-translate-y-1 hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] active:translate-y-1 active:shadow-none transition-all">
          Get Started Free
        </button>
      </section>

      {/* ======================= SCREENSHOT FEATURE 1 ======================= */}
      <section className="mx-auto max-w-6xl px-6 py-20 relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-16 group">
          <div className="w-full lg:w-1/3">
            <div className="w-16 h-16 rounded-xl border-4 border-black bg-white flex items-center justify-center mb-6 shadow-[4px_4px_0px_0px_rgba(255,107,53,1)] group-hover:-translate-y-2 transition-transform">
              <svg className="w-8 h-8 text-black" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
            </div>
            <h3 className="text-4xl font-black text-black mb-4 leading-tight group-hover:text-[#ff6b35] transition-colors">Master your roster.</h3>
            <p className="text-base font-bold text-gray-600 mb-6">
                Effortlessly browse upcoming hackathons and workshops, track your registrations, and build a coding profile that shows off your real campus impact. All in one place.
              </p>
            </div>

            <div className="w-full lg:w-2/3 relative">
              <Decoration className="absolute -top-10 -right-10 w-16 h-16 animate-float-slow z-0" type="empty-circle" />
              
              {/* 💻 BROWSER MOCKUP: Updated to show the new Profile/Events focus */}
              <BrowserMockup 
                url="hubble.in/profile" 
                imageSrc="/image.png" // 💡 Replace with a screenshot of your new Profile page!
                altText="Hubble Student Profile Screenshot"
              />
          </div>
        </div>
      </section>

      {/* ======================= SCREENSHOT FEATURE 2 ======================= */}
      <section className="mx-auto max-w-6xl px-6 py-20 relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-16 group">
          <div className="w-full lg:w-2/3 order-2 lg:order-1 relative">
             <Decoration className="absolute -bottom-10 -left-10 w-12 h-12 animate-float-fast z-0" type="empty-square" />
            {/* 💻 BROWSER MOCKUP 2 */}
            <BrowserMockup 
              url="hubble.in/events/create" 
              imageSrc="/register.png" 
              altText="Event Creation Screenshot"
            />
          </div>
          <div className="w-full lg:w-1/3 order-1 lg:order-2">
            <div className="w-16 h-16 rounded-xl border-4 border-black bg-[#ff6b35] flex items-center justify-center mb-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] group-hover:-translate-y-2 transition-transform">
              <svg className="w-8 h-8 text-black" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" /></svg>
            </div>
            <h3 className="text-4xl font-black text-black mb-4 leading-tight group-hover:text-[#ff6b35] transition-colors">Broadcast missions instantly.</h3>
            <p className="text-base font-bold text-gray-600 mb-6">
              Create and publish events to the entire campus grid. Add custom banners, set capacity limits, and watch student registrations roll in real-time.
            </p>
          </div>
        </div>
      </section>

      {/* ======================= SCREENSHOT FEATURE 3 ======================= */}
      <section className="mx-auto max-w-6xl px-6 py-20 relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-16 group">
          <div className="w-full lg:w-1/3">
            <div className="w-16 h-16 rounded-xl border-4 border-black bg-white flex items-center justify-center mb-6 shadow-[4px_4px_0px_0px_rgba(255,107,53,1)] group-hover:-translate-y-2 transition-transform">
              <svg className="w-8 h-8 text-black" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
            </div>
            <h3 className="text-4xl font-black text-black mb-4 leading-tight group-hover:text-[#ff6b35] transition-colors">Track your impact.</h3>
            <p className="text-base font-bold text-gray-600 mb-6">
              Get deep insights into your society's growth. See which events perform best, reward your top attendees with badges, and expand your campus footprint.
            </p>
          </div>
          <div className="w-full lg:w-2/3 relative">
            <Decoration className="absolute -top-10 right-1/2 w-10 h-10 animate-float-slow z-0" type="circle" />
            {/* 💻 BROWSER MOCKUP 3 */}
            <BrowserMockup 
              url="hubble.in/society" 
              imageSrc="/society.png" 
              altText="Society Analytics Screenshot"
            />
          </div>
        </div>
      </section>

      {/* ======================= BOTTOM CTA ======================= */}
      <section className="mx-auto max-w-4xl px-6 py-32 text-center relative">
        <div className="bg-[#ff6b35] rounded-[40px] p-12 md:p-20 border-4 border-black shadow-[16px_16px_0px_0px_rgba(0,0,0,1)] relative overflow-hidden">
          
          {/* Animated Background Lines inside CTA */}
          <svg className="absolute top-0 right-0 w-full h-full pointer-events-none opacity-20" fill="none" viewBox="0 0 800 300">
             <path d="M 0 50 Q 100 0 200 50 T 400 50 T 600 50 T 800 50" stroke="black" strokeWidth="8" strokeLinecap="round" />
             <path d="M 0 250 Q 100 200 200 250 T 400 250 T 600 250 T 800 250" stroke="black" strokeWidth="8" strokeLinecap="round" />
          </svg>

          <h2 className="text-5xl md:text-6xl font-black text-black mb-6 relative z-10">Ready to level up?</h2>
          <p className="text-xl font-bold text-black/80 mb-10 relative z-10 max-w-lg mx-auto">
            Join the hundreds of student leaders already using Hubble to power their societies.
          </p>
          <button onClick={handleRegisterSociety} className="relative z-10 rounded-xl bg-black px-10 py-5 text-lg font-black uppercase tracking-widest text-white shadow-[6px_6px_0px_0px_rgba(255,107,53,1)] border-4 border-black hover:-translate-y-1 hover:shadow-[10px_10px_0px_0px_rgba(255,107,53,1)] active:translate-y-1 active:shadow-none transition-all">
            Create Society Account
          </button>
        </div>
      </section>

    </div>
  );
}

// ==============================================================================
// --- HELPER COMPONENTS ---
// ==============================================================================

function BrowserMockup({ imageSrc, url, altText }) {
  return (
    <div className="w-full relative z-10 rounded-2xl border-4 border-black bg-white shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] overflow-hidden group-hover:-translate-y-3 group-hover:shadow-[16px_16px_0px_0px_rgba(255,107,53,1)] transition-all duration-500">
      
      {/* Fake Browser Header */}
      <div className="flex items-center gap-3 border-b-4 border-black bg-gray-100 px-4 py-3 relative">
        <div className="flex gap-2">
          <div className="h-3.5 w-3.5 rounded-full border-2 border-black bg-[#ff6b35]"></div>
          <div className="h-3.5 w-3.5 rounded-full border-2 border-black bg-white"></div>
          <div className="h-3.5 w-3.5 rounded-full border-2 border-black bg-black"></div>
        </div>
        <div className="absolute left-1/2 -translate-x-1/2 px-6 py-1 bg-white border-2 border-black rounded-full text-[10px] font-black tracking-widest text-gray-500 hidden sm:block">
          {url}
        </div>
      </div>

      {/* Your Screenshot Goes Here */}
      <div className="relative aspect-[16/10] w-full bg-gray-50 overflow-hidden">
        <img 
          src={imageSrc} 
          alt={altText} 
          className="w-full h-full object-cover object-top border-b border-gray-200 group-hover:scale-105 transition-transform duration-700" 
          onError={(e) => {
            // Fallback placeholder
            e.target.src = "/society.png";
          }}
        />
      </div>
    </div>
  );
}

function Decoration({ className, type }) {
  if (type === 'circle') return <div className={`rounded-full bg-[#ff6b35] border-2 border-black ${className}`}></div>;
  if (type === 'empty-circle') return <div className={`rounded-full border-4 border-black ${className}`}></div>;
  if (type === 'square') return <div className={`bg-white border-4 border-black ${className}`}></div>;
  if (type === 'empty-square') return <div className={`border-4 border-[#ff6b35] ${className}`}></div>;
  return null;
}