// EventDescription.jsx
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import confetti from 'canvas-confetti';

export default function EventDescription() {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [timeLeft, setTimeLeft] = useState("");
  const [isRegistered, setIsRegistered] = useState(false);
const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const res = await fetch(`http://localhost:3001/api/events/${id}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        const json = await res.json();
        setData(json);
      } catch (err) {
        console.error("Fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchDetails();
  }, [id]);

  // ⏱️ Countdown Logic (Placed here so it has access to data)
  useEffect(() => {
    if (!data?.event?.registrationDeadline) return;

    const timer = setInterval(() => {
      const now = new Date().getTime();
      const deadline = new Date(data.event.registrationDeadline).getTime();
      const distance = deadline - now;

      if (distance < 0) {
        setTimeLeft("Registration Closed");
        clearInterval(timer);
        return;
      }

      const d = Math.floor(distance / (1000 * 60 * 60 * 24));
      const h = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const m = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const s = Math.floor((distance % (1000 * 60)) / 1000);
      setTimeLeft(`${d}d:${h}h:${m}m:${s}s`);
    }, 1000);

    return () => clearInterval(timer);
  }, [data]);

  // Inside EventDescription component
  // Inside EventDescription.jsx
useEffect(() => {
  const checkRegistration = async () => {
    try {
      const res = await fetch('http://localhost:3001/api/events/my-registrations', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      const registeredEvents = await res.json();
      // If this specific event ID is in the user's list
      const alreadyJoined = registeredEvents.some(reg => reg.id === Number(id));
      setIsRegistered(alreadyJoined);
    } catch (err) {
      console.error(err);
    }
  };

  if (id) checkRegistration();
}, [id]);


const handleApply = async () => {
  try {
    const res = await fetch(`http://localhost:3001/api/events/${id}/register`, {
      method: 'POST',
      headers: { 
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json'
      }
    });

    const data = await res.json();

    if (res.ok) {
      setIsRegistered(true); // Change button text to "Applied"
      setShowPopup(true);    // Show the success modal
      
      // Optional: Add the confetti celebration we discussed!
      if (typeof confetti === 'function') {
        confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 } });
      }
    } else {
      alert(data.message || "Registration failed");
    }
  } catch (err) {
    console.error("Apply Error:", err);
  }
};

  // 🛡️ Safety Check: This prevents the "Initialization" error
  if (loading) return <div className="p-20 text-center font-black text-[#ff6b35] animate-pulse">LOADING HUB...</div>;
  if (!data || !data.event) return <div className="p-20 text-center font-bold">Event not found.</div>;

  // Now it is safe to define these variables
  const { event, society } = data;
  const capacity = event.capacity || 100;
  const attendees = event.attendeeCount || 0;
  const isFull = attendees >= capacity;

  return (
    <div className="min-h-screen bg-[#f3efe8] p-4 md:p-6">
      <div className="mx-auto max-w-[1380px] rounded-[28px] border border-black/10 bg-[#f7f3ec] p-3 shadow-lg md:p-4">
        <div className="flex flex-col gap-4 lg:flex-row">
          <Sidebar />
          <main className="flex-1 flex flex-col lg:flex-row gap-6 p-4">
            
            {/* LEFT SIDE: Content */}
            <div className="flex-[2] space-y-6">
              <div className="overflow-hidden rounded-[32px] border border-black/5 bg-white shadow-sm">
                <img src={`http://localhost:3001${event.banner}`} className="w-full h-80 object-cover" alt="Banner" />
                <div className="p-8">
                  <h1 className="text-4xl font-black text-[#1a1a1a] mb-2">{event.title}</h1>
                  <p className="text-lg font-bold text-[#ff6b35] mb-6">{event.shortDescription}</p>
                  <div className="text-black/60 leading-relaxed whitespace-pre-wrap">{event.longDescription}</div>
                </div>
              </div>
            </div>

            {/* RIGHT SIDE: Information Block (Neatened Up) */}
            <div className="flex-1">
              <div className="sticky top-6 rounded-[32px] bg-white p-6 border border-black/5 shadow-md">
                <div className="flex gap-2 mb-8 justify-start">
                  <SocialIcon link={society.instaLink} icon="fi-brands-instagram" />
                  <SocialIcon link={society.linkedinLink} icon="fi-brands-linkedin" />
                  <SocialIcon link={`mailto:${society.mailLink}`} icon="fi-rr-envelope" />
                </div>
                {/* Society Header */}
                <div className="flex items-center gap-4 mb-6 pb-6 border-b border-black/5">
                  <div className="h-12 w-12 rounded-2xl bg-[#f7f3ec] grid place-items-center overflow-hidden border border-black/5">
                    {society.logo ? <img src={`http://localhost:3001${society.logo}`} className="h-full w-full object-cover" /> : "🏛️"}
                  </div>
                  <div className="flex-1">
                    <p className="text-[10px] font-black text-black/20 uppercase tracking-widest">Organized by</p>
                    <h3 className="font-black text-sm text-[#1a1a1a]">{society.name}</h3>
                  </div>
                </div>

                {/* Event Metadata Blocks */}
                <div className="grid grid-cols-1 gap-4 mb-6">
                  <DetailRow icon="fi-rr-calendar" label="Runs From" value={new Date(event.startDate).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  })} />
                  <DetailRow icon="fi-rr-marker" label="Location" value={event.location} />
                </div>

                {/* ⏱️ Reverse Clock Block */}
                {/* 🔥 REVERSE CLOCK: Orange Theme */}
                <div className="mb-6 rounded-2xl bg-[#ff6b35]/5 p-4 border border-[#ff6b35]/10 text-center">
                  <p className="text-[10px] font-black text-[#ff6b35]/60 uppercase tracking-widest mb-1">
                    Applications Close In
                  </p>
                  <p className="font-mono text-xl font-black text-[#ff6b35] tracking-tighter ">
                    {timeLeft || "--:--:--:--"}
                  </p>
                </div>

               
                

                {/* --- Sidebar Action Block --- */}
<div className="space-y-4">
  <button 
  onClick={handleApply}
  disabled={isRegistered || isFull}
  className={`flex w-full items-center justify-center gap-2 rounded-xl py-2.5 text-[11px] font-black uppercase tracking-widest transition-all ${
    isRegistered 
      ? "bg-[#059669]/10 text-[#059669] border border-[#059669]/20 cursor-default" // 🟢 Muted Emerald Theme
      : isFull 
      ? "bg-black/5 text-black/20 cursor-not-allowed"
      : "bg-[#161616] text-white hover:bg-[#ff6b35]"
  }`}
>
  <i className={`fi ${isRegistered ? 'fi-rr-badge-check' : 'fi-rr-rocket-lunch'} flex items-center`}></i>
  {isRegistered ? "Applied" : isFull ? "Event Full" : "Apply Now"}
</button>
</div>

{/* --- Success Popup Modal --- */}
{showPopup && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
    <div className="w-full max-w-sm rounded-[32px] bg-white p-8 text-center shadow-2xl animate-in fade-in zoom-in duration-300">
      <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-green-100 text-4xl">
        🎉
      </div>
      <h2 className="mb-2 text-2xl font-black text-[#1a1a1a]">You're In!</h2>
      <p className="mb-8 text-sm text-black/40 leading-relaxed">
        Your spot for <span className="font-bold text-black">{event.title}</span> has been secured. Check your dashboard for updates.
      </p>
      <button 
        onClick={() => setShowPopup(false)}
        className="w-full rounded-2xl bg-[#161616] py-4 text-xs font-black uppercase tracking-widest text-white transition-all hover:bg-[#ff6b35]"
      >
        Awesome, Thanks!
      </button>
    </div>
  </div>
)}
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}

// 1. DetailRow: Used for Event Metadata (Venue, Date, etc.)
function DetailRow({ icon, label, value }) {
  return (
    <div className="flex flex-col">
      <p className="text-[10px] font-black text-black/20 uppercase tracking-widest mb-1.5">
        {label}
      </p>
      <div className="flex items-center gap-2.5 font-bold text-sm text-[#1a1a1a]">
        {/* 'fi' class ensures it uses the FlatIcon library */}
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#f7f3ec] text-[#ff6b35]">
          <i className={`fi ${icon} flex items-center`}></i>
        </div>
        <span className="truncate">{value || "To be announced"}</span>
      </div>
    </div>
  );
}

// 2. SocialIcon: Used for the Society Social Media Links
function SocialIcon({ link, icon }) {
  if (!link) return null;

  let formattedLink = link;
  if (link.includes('@') && !link.startsWith('mailto:')) {
    formattedLink = `mailto:${link}`;
  } 
  // Otherwise, ensure it's an absolute URL for websites
  else if (!link.startsWith('http') && !link.startsWith('mailto:')) {
    formattedLink = `https://${link}`;
  }
  const handleClick = (e) => {
    e.stopPropagation(); // Prevents internal navigation triggers
  };

  return (
    <a 
      href={formattedLink} // Use the formatted absolute link
      target="_blank" 
      rel="noreferrer"
      onClick={handleClick}
      className="flex h-11 w-11 items-center justify-center rounded-xl border border-black/5 bg-[#f7f3ec] text-black/40 transition-all hover:text-[#ff6b35] hover:bg-white shadow-sm"
    >
      <i className={`fi ${icon} text-lg flex items-center`}></i>
    </a>
  );
}