import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import TopBar from '../components/TopBar'; 
import confetti from 'canvas-confetti';

export default function EventDescription() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [data, setData] = useState({}); // Default to empty object
  const [timeLeft, setTimeLeft] = useState("");
  const [isRegistered, setIsRegistered] = useState(false);
  const [showPopup, setShowPopup] = useState(false);

  const event = data?.event || {};
  const society = data?.society || {};

  const now = new Date();
  const deadline = event.registrationDeadline ? new Date(event.registrationDeadline) : null;
  const isClosed = deadline && now > deadline;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const headers = { Authorization: `Bearer ${localStorage.getItem('token')}` };
        
        // Fetch User
        const userRes = await fetch('https://hubble-d9l6.onrender.com/api/users/me/profile', { headers });
        setUser(await userRes.json());

        // Fetch Event Details
        const eventRes = await fetch(`https://hubble-d9l6.onrender.com/api/events/${id}`, { headers });
        if (eventRes.ok) {
          const eventData = await eventRes.json();
          setData(eventData);
        }

        // Check Registration
        const regRes = await fetch('https://hubble-d9l6.onrender.com/api/events/my-registrations', { headers });
        const regData = await regRes.json();
        setIsRegistered(regData.some(reg => reg.id === Number(id)));

      } catch (err) {
        console.error("Fetch error:", err);
      }
    };
    fetchData();
  }, [id]);

  // ⏱️ Countdown Logic
  useEffect(() => {
    if (!event.registrationDeadline) return;

    const timer = setInterval(() => {
      const distance = new Date(event.registrationDeadline).getTime() - new Date().getTime();

      if (distance < 0) {
        setTimeLeft("Registration Closed");
        clearInterval(timer);
        return;
      }

      const d = Math.floor(distance / (1000 * 60 * 60 * 24));
      const h = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const m = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const s = Math.floor((distance % (1000 * 60)) / 1000);
      setTimeLeft(`${d}d ${h}h ${m}m ${s}s`);
    }, 1000);

    return () => clearInterval(timer);
  }, [event.registrationDeadline]);

  const handleApply = async (e) => {
    e.stopPropagation(); 
    
    if (isClosed) {
     
      return;
    }

    try {
      const res = await fetch(`https://hubble-d9l6.onrender.com/api/events/${id}/register`, {
        method: 'POST',
        headers: { 
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });

      const resData = await res.json();

      if (res.ok) {
        setIsRegistered(true); 
        setShowPopup(true);    
        
        if (typeof confetti === 'function') {
          confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 }, colors: ['#ff6b35', '#ffffff', '#e85a25'] });
        }
      } else {
        triggerHubbleNotif("Registration Failed", resData.message || "Failed to register for the event.");
      }
    } catch (err) {
      console.error("Apply Error:", err);
      triggerHubbleNotif("Network Error", "Failed to register due to network issues.");
    }
  };

  const capacity = event.capacity || 100;
  const attendees = event.attendeeCount || 0;
  const isFull = attendees >= capacity;

  return (
    <div className="min-h-screen bg-[#f1f3f6] text-[#1a1a1a] font-sans">
      <div className="mx-auto flex gap-6 rounded-2xl bg-white p-4 shadow-sm min-h-[90vh]">
        {/* Sidebar */}
        <div className="w-64 flex-shrink-0 hidden lg:block border-r border-gray-100 pr-4">
           <Sidebar userRole={user?.role} />
        </div>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto pt-4 pl-4 md:pl-8 pr-6 pb-20">
          
          <TopBar user={user} />

          <button 
            onClick={() => navigate('/events')}
            className="mb-6 flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-[#ff6b35] transition-colors"
          >
            <i className="fi fi-rr-arrow-left"></i> Back to Events
          </button>

          {/* Render skeleton structure immediately. Content fills in when data arrives. */}
          <div className="flex flex-col xl:flex-row gap-8 animate-in fade-in duration-500">
            
            {/* LEFT SIDE: Content */}
            <div className="flex-[2] space-y-8">
              <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
                
                {/* Banner Image */}
                <div className="h-64 sm:h-80 w-full bg-gray-50">
                  {event.banner ? (
                    <img src={`https://hubble-d9l6.onrender.com${event.banner}`} className="w-full h-full object-cover" alt="Event Banner" />
                  ) : (
                    <div className="h-full w-full flex items-center justify-center text-gray-300">
                      <i className="fi fi-rr-picture text-4xl"></i>
                    </div>
                  )}
                </div>
                
                {/* Event Details */}
                <div className="p-8">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="px-3 py-1 rounded-full bg-gray-100 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      {event.eventType || 'Event'}
                    </span>
                    {isClosed && <span className="px-3 py-1 rounded-full bg-red-50 text-xs font-semibold text-red-600 uppercase tracking-wider border border-red-100">Closed</span>}
                  </div>
                  
                  <h1 className="text-3xl sm:text-4xl font-semibold text-gray-900 mb-3">
                    {event.title || 'Loading Event...'}
                  </h1>
                  <p className="text-lg font-medium text-[#ff6b35] mb-8">
                    {event.shortDescription || ''}
                  </p>
                  
                  <div className="prose prose-sm sm:prose-base max-w-none text-gray-600 whitespace-pre-wrap leading-relaxed">
                    {event.longDescription || ""}
                  </div>
                </div>
              </div>
            </div>

            {/* RIGHT SIDE: Information Block */}
            <div className="flex-1">
              <div className="sticky top-6 rounded-2xl bg-white p-6 border border-gray-200 shadow-sm space-y-8">
                
                {/* Organized By */}
                <div>
                  <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">Organized By</h3>
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center overflow-hidden text-[#ff6b35] font-bold">
                      {society.logo ? (
                        <img src={`https://hubble-d9l6.onrender.com${society.logo}`} className="h-full w-full object-cover" alt="logo" />
                      ) : (
                        society.name ? society.name[0].toUpperCase() : 'H'
                      )}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">{society.name || 'Society Details'}</h3>
                      <div className="flex gap-2 mt-1">
                        <SocialIcon link={society.instaLink} icon="fi-brands-instagram" />
                        <SocialIcon link={society.linkedinLink} icon="fi-brands-linkedin" />
                        <SocialIcon link={`mailto:${society.mailLink}`} icon="fi-rr-envelope" />
                      </div>
                    </div>
                  </div>
                </div>

                <hr className="border-gray-100" />

                {/* Event Metadata */}
                <div className="space-y-4">
                  <DetailRow 
                    icon="fi-rr-calendar" 
                    label="Date & Time" 
                    value={event.startDate ? new Date(event.startDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : ''} 
                  />
                  <DetailRow icon="fi-rr-marker" label="Location" value={event.location || ''} />
                  <DetailRow icon="fi-rr-users" label="Capacity" value={event.id ? `${attendees} / ${capacity} Joined` : ''} />
                </div>

                {/* Registration Deadline Countdown */}
                {timeLeft && !isClosed && (
                  <div className="rounded-xl bg-amber-50/50 p-4 border border-amber-100 text-center">
                    <p className="text-[10px] font-semibold text-amber-600 uppercase tracking-widest mb-1">
                      Registration Closes In
                    </p>
                    <p className="font-mono text-lg font-bold text-amber-700 tracking-tight">
                      {timeLeft}
                    </p>
                  </div>
                )}

                {/* Call to Action Button */}
                <button 
                  onClick={handleApply}
                  disabled={isRegistered || isFull || isClosed || !event.id}
                  className={`flex w-full items-center justify-center gap-2 rounded-xl py-3.5 text-sm font-semibold transition-all shadow-sm ${
                    isRegistered 
                      ? "bg-green-50 text-green-700 border border-green-200 cursor-default" 
                      : (isFull || isClosed || !event.id)
                      ? "bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200" 
                      : "bg-[#ff6b35] text-white hover:bg-[#e85a25] shadow-md"
                  }`}
                >
                  <i className={`fi ${
                    isRegistered ? 'fi-rr-badge-check' : 
                    (isFull || isClosed || !event.id) ? 'fi-rr-lock' : 
                    'fi-rr-paper-plane'
                  } text-base mt-0.5`}></i>
                  {isRegistered ? "Applied Successfully" : isFull ? "Event is Full" : isClosed ? "Registration Closed" : "Apply Now"}
                </button>

              </div>
            </div>
          </div>

          {/* --- Success Popup Modal --- */}
          {showPopup && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center bg-gray-900/40 backdrop-blur-sm p-4">
              <div className="w-full max-w-sm rounded-3xl bg-white p-8 text-center shadow-2xl animate-in zoom-in-95 duration-300 border border-gray-100">
                <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-green-50 text-green-600 text-3xl border border-green-100">
                  <i className="fi fi-rr-check-circle"></i>
                </div>
                <h2 className="mb-2 text-2xl font-semibold text-gray-900">You're In!</h2>
                <p className="mb-8 text-sm text-gray-500 leading-relaxed">
                  Your spot for <span className="font-semibold text-gray-800">{event.title}</span> has been secured. Check your dashboard for updates.
                </p>
                <button 
                  onClick={() => setShowPopup(false)}
                  className="w-full rounded-xl bg-gray-900 py-3 text-sm font-medium text-white transition-colors hover:bg-black"
                >
                  Awesome, Thanks!
                </button>
              </div>
            </div>
          )}

        </main>
      </div>
    </div>
  );
}

/* --- BOUTIQ-STYLE HELPER COMPONENTS --- */

function DetailRow({ icon, label, value }) {
  return (
    <div className="flex items-start gap-3">
      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gray-50 border border-gray-100 text-gray-400 shrink-0">
        <i className={`fi ${icon} text-sm mt-0.5`}></i>
      </div>
      <div>
        <p className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider mb-0.5">
          {label}
        </p>
        <p className="font-medium text-sm text-gray-900 h-5">
          {value || <span className="text-gray-300">...</span>}
        </p>
      </div>
    </div>
  );
}

function SocialIcon({ link, icon }) {
  if (!link) return null;

  let formattedLink = link;
  if (link.includes('@') && !link.startsWith('mailto:')) {
    formattedLink = `mailto:${link}`;
  } else if (!link.startsWith('http') && !link.startsWith('mailto:')) {
    formattedLink = `https://${link}`;
  }

  return (
    <a 
      href={formattedLink} 
      target="_blank" 
      rel="noreferrer"
      onClick={(e) => e.stopPropagation()}
      className="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-400 transition-colors hover:text-[#ff6b35] hover:border-[#ff6b35]/30 hover:bg-orange-50/30"
    >
      <i className={`fi ${icon} text-sm mt-0.5`}></i>
    </a>
  );
}