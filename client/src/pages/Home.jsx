import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function HubbleLandingPage() {
  const navigate = useNavigate();

  // Navigation Handlers
  const handleNavHome = () => window.scrollTo({ top: 0, behavior: 'smooth' });
  const handleNavSocieties = () => navigate('/societies'); // Update path as needed
  const handleNavEvents = () => navigate('/events');       // Update path as needed
  const handleNavAbout = () => {
    // Example: Scroll to a specific section or navigate
    const aboutSection = document.getElementById('about-section');
    if (aboutSection) aboutSection.scrollIntoView({ behavior: 'smooth' });
  };
  
  const handleLogin = () => navigate('/login');
  const handleSignup = () => navigate('/register');
  const handleExploreHub = () => navigate('/dashboard'); 
  const handleRegisterSociety = () => navigate('/create-society');

  return (
    <div className="min-h-screen bg-white font-sans text-gray-900 overflow-x-hidden selection:bg-[#ff6b35] selection:text-white">
      
      {/* --- SUPERCHARGED CUSTOM ANIMATIONS --- */}
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
        @keyframes draw-stroke {
          0% { stroke-dashoffset: 1000; }
          100% { stroke-dashoffset: 0; }
        }
        @keyframes marquee {
          0% { transform: translateX(0%); }
          100% { transform: translateX(-50%); }
        }

        .animate-float-slow { animation: float-slow 6s ease-in-out infinite; }
        .animate-float-fast { animation: float-fast 4s ease-in-out infinite; }
        .animate-pulse-soft { animation: pulse-soft 3s ease-in-out infinite; }
        
        .animate-highlighter {
          stroke-dasharray: 1000;
          stroke-dashoffset: 1000;
          animation: draw-stroke 2s cubic-bezier(0.4, 0, 0.2, 1) forwards;
          animation-iteration-count: infinite;
          animation-direction: alternate;
        }

        .animate-marquee {
          display: inline-block;
          white-space: nowrap;
          animation: marquee 15s linear infinite;
        }

        /* Creative Image Shape Shifting */
        .shape-shift {
          border-radius: 60px 10px 60px 10px;
          transition: all 0.5s ease-in-out;
        }
        .group:hover .shape-shift {
          border-radius: 10px 60px 10px 60px;
        }
      `}} />

      {/* ======================= NAVBAR ======================= */}
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-8 relative z-50">
        {/* Logo */}
        <div 
          onClick={handleNavHome}
          className="text-3xl font-black tracking-tighter text-black flex items-center gap-2 hover:scale-105 transition-transform cursor-pointer"
        >
          <div className="w-5 h-5 bg-[#ff6b35] rounded-full animate-pulse-soft"></div>
          Hubble
        </div>

        {/* Center Links */}
        <div className="hidden md:flex items-center gap-10 text-sm font-bold text-gray-900">
          <button onClick={handleNavHome} className="border-b-4 border-[#ff6b35] pb-1">Home</button>
          <button onClick={handleNavSocieties} className="hover:text-[#ff6b35] hover:-translate-y-1 transition-all pb-1 inline-block">Societies</button>
          <button onClick={handleNavEvents} className="hover:text-[#ff6b35] hover:-translate-y-1 transition-all pb-1 inline-block">Events</button>
          <button onClick={handleNavAbout} className="hover:text-[#ff6b35] hover:-translate-y-1 transition-all pb-1 inline-block">About</button>
        </div>

        {/* Right Auth Buttons */}
        <div className="hidden md:flex items-center gap-4">
          <button onClick={handleLogin} className="text-sm font-bold text-gray-900 hover:text-[#ff6b35] transition-colors">
            Log in
          </button>
          <button onClick={handleSignup} className="rounded-xl bg-[#ff6b35] px-6 py-2.5 text-sm font-bold text-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] border-2 border-black hover:-translate-y-1 hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] active:translate-y-1 active:shadow-none transition-all">
            Sign up
          </button>
        </div>

        {/* Mobile Menu Icon */}
        <button className="md:hidden text-black hover:text-[#ff6b35]">
          <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16"></path></svg>
        </button>
      </nav>

      {/* ======================= HERO SECTION ======================= */}
      <section className="mx-auto max-w-6xl px-6 pt-10 pb-20 text-center relative">
        
        {/* Animated Background Blobs */}
        <div className="absolute top-0 right-10 w-64 h-64 bg-[#ff6b35]/10 rounded-full blur-3xl animate-pulse-soft -z-10"></div>
        
        {/* Hero Headline */}
        <h1 className="text-5xl md:text-6xl lg:text-[64px] font-black leading-[1.1] tracking-tight text-black mb-10 relative z-10">
          Your campus life,{' '}
          <span className="relative inline-block whitespace-nowrap">
            centralized.
            <svg className="absolute w-full h-[20px] -bottom-2 left-0 -z-10 overflow-visible" viewBox="0 0 200 20" preserveAspectRatio="none">
              <path d="M 0 10 Q 25 20 50 10 T 100 10 T 150 10 T 200 10" stroke="#ff6b35" strokeWidth="8" strokeLinecap="round" fill="none" className="animate-highlighter" />
            </svg>
          </span>
          <br className="hidden md:block"/> Discover societies, join missions, and<br className="hidden md:block"/> unlock your{' '}
          <span className="relative inline-block">
            impact.
            <svg className="absolute w-[120%] h-[150%] -top-2 -left-[10%] -z-10 overflow-visible" viewBox="0 0 100 50" preserveAspectRatio="none">
              <ellipse cx="50" cy="25" rx="45" ry="20" stroke="#ff6b35" strokeWidth="4" fill="none" className="animate-highlighter" style={{ animationDelay: '0.5s' }} />
            </svg>
          </span>
        </h1>
        
        {/* Hero Actions */}
        <div className="flex justify-center gap-6 mb-24 relative z-20">
          <button onClick={handleExploreHub} className="rounded-xl bg-black px-10 py-4 text-sm font-bold text-white shadow-[6px_6px_0px_0px_rgba(255,107,53,1)] hover:-translate-y-1 hover:shadow-[8px_8px_0px_0px_rgba(255,107,53,1)] active:translate-y-1 active:shadow-none transition-all">
            Explore Hub
          </button>
          <button onClick={handleRegisterSociety} className="rounded-xl bg-white px-10 py-4 text-sm font-bold text-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] border-4 border-black hover:-translate-y-1 hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] active:translate-y-1 active:shadow-none transition-all">
            Register Society
          </button>
        </div>

        {/* === 3-PART "POLAROID FAN" HERO IMAGES === */}
        <div className="relative w-full max-w-5xl mx-auto h-[350px] md:h-[450px] mt-10 group cursor-pointer" onClick={handleExploreHub}>
          
          <Decoration className="absolute -top-10 left-10 w-8 h-8 animate-float-fast z-0" type="square" />
          <Decoration className="absolute top-1/4 right-0 w-6 h-6 animate-float-slow z-0" type="circle" />

          <div className="flex w-full h-full items-center justify-center relative z-10">
            <div className="absolute left-[10%] md:left-[15%] w-1/3 h-[80%] border-4 border-black bg-white shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] rounded-2xl overflow-hidden -rotate-6 group-hover:rotate-0 group-hover:-translate-x-10 transition-all duration-500 z-10 animate-float-slow">
               <img src="/Diversity.png" alt="Students" className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700" />
            </div>
            <div className="absolute left-1/2 -translate-x-1/2 w-2/5 h-[95%] border-4 border-black bg-white shadow-[12px_12px_0px_0px_rgba(255,107,53,1)] rounded-2xl overflow-hidden z-30 group-hover:-translate-y-6 transition-all duration-500">
               <img src="/Team Brainstorming 3.png" alt="Event" className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-110 transition-all duration-700" />
            </div>
            <div className="absolute right-[10%] md:right-[15%] w-1/3 h-[80%] border-4 border-black bg-white shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] rounded-2xl overflow-hidden rotate-6 group-hover:rotate-0 group-hover:translate-x-10 transition-all duration-500 z-20 animate-float-fast">
               <img src="/People 3.png" alt="Celebrating" className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700" />
            </div>
          </div>
        </div>
      </section>

      {/* ======================= SCROLLING MARQUEE (SVG ICONS) ======================= */}
      <div className="w-full bg-[#ff6b35] border-y-4 border-black py-4 overflow-hidden flex whitespace-nowrap text-black font-black text-xl md:text-2xl uppercase tracking-widest mt-10">
        
        {/* Render the Marquee track twice for endless scrolling */}
        {[1, 2].map((trackIndex) => (
          <div key={trackIndex} className="animate-marquee flex items-center" aria-hidden={trackIndex === 2 ? "true" : "false"}>
            {/* Item 1 */}
            <svg className="w-6 h-6 mx-4 inline-block" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            DISCOVER SOCIETIES
            <span className="mx-4 text-3xl">•</span>
            
            {/* Item 2 */}
            <svg className="w-6 h-6 mx-4 inline-block" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
            </svg>
            JOIN MISSIONS
            <span className="mx-4 text-3xl">•</span>
            
            {/* Item 3 */}
            <svg className="w-6 h-6 mx-4 inline-block" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
            </svg>
            UNLOCK IMPACT
            <span className="mx-4 text-3xl">•</span>
          </div>
        ))}

      </div>

      {/* ======================= GRID FEATURES SECTION ======================= */}
      <section id="about-section" className="mx-auto max-w-6xl px-6 py-20 pb-24 relative z-10 mt-10">
        
        {/* Row 1: Two Column Mini Features */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 mb-32 relative">
          
          <div className="flex flex-col items-start group cursor-crosshair">
            <div className="w-full h-96 mb-8 border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] overflow-hidden shape-shift bg-white relative">
              <img src="/Scrolling on Phone.png" alt="Discover Societies" className="w-full h-full object-cover object-center group-hover:scale-110 transition-transform duration-700"/>
              <div className="absolute top-4 left-4 bg-[#ff6b35] text-black font-black px-4 py-2 border-2 border-black rounded-full rotate-[-5deg] group-hover:rotate-0 transition-transform">
                #1 Explorer
              </div>
            </div>
            <h3 className="text-3xl font-black text-black mb-3 group-hover:text-[#ff6b35] transition-colors">Discover Societies</h3>
            <p className="text-base font-medium text-gray-600 mb-6 leading-relaxed max-w-sm">
              Find your tribe. Explore technical, cultural, and sports societies tailored to your interests and start your journey.
            </p>
            <button onClick={handleNavSocieties} className="border-2 border-black rounded-xl px-6 py-2.5 text-xs font-bold hover:bg-black hover:text-white hover:shadow-[4px_4px_0px_0px_rgba(255,107,53,1)] transition-all">
              Browse All
            </button>
          </div>

          <div className="flex flex-col items-start group cursor-crosshair">
            <div className="w-full h-96 mb-8 border-4 border-black shadow-[8px_8px_0px_0px_rgba(255,107,53,1)] overflow-hidden shape-shift bg-white relative">
              <img src="/Advertising 1.png" alt="Broadcast Missions" className="w-full h-full object-cover object-center group-hover:scale-110 transition-transform duration-700"/>
            </div>
            <h3 className="text-3xl font-black text-black mb-3 group-hover:text-[#ff6b35] transition-colors">Broadcast Missions</h3>
            <p className="text-base font-medium text-gray-600 mb-6 leading-relaxed max-w-sm">
              Society leads can launch events instantly. Reach the entire campus body with a single click.
            </p>
            <button onClick={handleNavEvents} className="bg-[#ff6b35] text-white border-2 border-black rounded-xl px-6 py-2.5 text-xs font-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all">
              View Events
            </button>
          </div>
        </div>

        {/* Row 2: Big Horizontal Feature */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center mb-32 relative group cursor-pointer" onClick={handleExploreHub}>
           <Decoration className="absolute -left-10 top-10 w-8 h-8 animate-float-fast" type="empty-square" />
           
           <div className="h-[400px] w-full rounded-3xl border-4 border-black shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] overflow-hidden group-hover:-translate-y-3 group-hover:shadow-[16px_16px_0px_0px_rgba(255,107,53,1)] transition-all duration-500 bg-white">
             <img src="/Checklist.png" alt="Roster Management" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"/>
           </div>
           <div>
             <h3 className="text-5xl font-black text-black mb-6 leading-tight max-w-sm">
               Effortless Roster <br/>& Attendee Management.
             </h3>
             <p className="text-lg font-medium text-gray-600 mb-8">Ditch the spreadsheets. Scan QR codes, verify students instantly, and manage your missions like a pro.</p>
             <button className="bg-[#ff6b35] text-black border-4 border-black rounded-xl px-8 py-3.5 text-sm font-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all">
               View Dashboard &rarr;
             </button>
           </div>
        </div>

      </section>

      {/* ======================= FOOTER / CTA SECTION ======================= */}
      <section className="mx-auto max-w-5xl px-6 pb-32">
        <div className="bg-[#ff6b35] rounded-[40px] p-10 md:p-16 flex flex-col md:flex-row items-center justify-between shadow-[16px_16px_0px_0px_rgba(0,0,0,1)] border-4 border-black relative overflow-hidden group">
          
          <svg className="absolute -right-20 -bottom-20 w-96 h-96 pointer-events-none opacity-20 animate-pulse-soft" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="40" stroke="black" strokeWidth="4" fill="none" />
            <circle cx="50" cy="50" r="25" stroke="black" strokeWidth="4" fill="none" />
            <circle cx="50" cy="50" r="10" fill="black" />
          </svg>

          <div className="w-full md:w-[55%] relative z-10">
            <h2 className="text-5xl md:text-6xl font-black text-black mb-4">Join the Hub</h2>
            <p className="text-black font-bold mb-10 text-xl max-w-sm">Don't miss out on the latest campus missions. Sign up today.</p>
            
            {/* The Newsletter Form now redirects to Signup as a fun UX pattern */}
            <form 
              onSubmit={(e) => { e.preventDefault(); handleSignup(); }}
              className="flex w-full bg-white rounded-xl p-2 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] border-4 border-black focus-within:-translate-y-1 transition-transform"
            >
              <input 
                type="email" 
                required
                placeholder="Student email address..." 
                className="flex-1 px-4 py-3 text-base text-black outline-none bg-transparent placeholder-gray-500 font-bold"
              />
              <button type="submit" className="bg-black text-white px-8 py-3 rounded-lg text-sm font-black hover:bg-gray-800 active:scale-95 transition-all cursor-pointer">
                Subscribe
              </button>
            </form>
          </div>

          <div 
            onClick={handleSignup}
            className="w-full md:w-[350px] h-64 mt-12 md:mt-0 relative z-10 border-4 border-black bg-white shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] shape-shift group-hover:-translate-y-4 transition-all duration-500 overflow-hidden cursor-pointer"
          >
             <img 
                src="/Team Building 3.png" 
                alt="Join the community" 
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
             />
          </div>

        </div>
      </section>
      
    </div>
  );
}

// --- Helper Component for abstract floating shapes ---
function Decoration({ className, type }) {
  if (type === 'circle') return <div className={`rounded-full bg-[#ff6b35] border-2 border-black ${className}`}></div>;
  if (type === 'square') return <div className={`bg-white border-4 border-black ${className}`}></div>;
  if (type === 'empty-square') return <div className={`border-4 border-[#ff6b35] ${className}`}></div>;
  return null;
}