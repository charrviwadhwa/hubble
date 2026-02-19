import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import confetti from 'canvas-confetti'; // Ensure this is installed

export default function EventCard({ event, onRefresh, isRegistered = false }) {
  const navigate = useNavigate();
  const [showPopup, setShowPopup] = useState(false);
  const [loading, setLoading] = useState(false);

  const capacity = event.capacity || 100;
  const attendees = event.attendeeCount || 0;
  const ratio = Math.max(0, Math.min(100, Math.round((attendees / capacity) * 100)));
  const isFull = attendees >= capacity;

  const handleApply = async (e) => {
    e.stopPropagation(); 
    if (isRegistered || loading) return;

    setLoading(true);
    try {
      const res = await fetch(`http://localhost:3001/api/events/${event.id}/register`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });

      if (res.ok) {
        // 🎉 Celebration Logic
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#ff6b35', '#161616', '#ffffff']
        });
        setShowPopup(true); // Show the success popup
        onRefresh(); 
      } else {
        const data = await res.json();
        alert(data.message);
      }
    } catch (err) {
      console.error("Registration error:", err);
    } finally {
      setLoading(false);
    }
  };

  const date = new Date(event.startDate || event.date);
  const dateLabel = date.toLocaleDateString('en-GB', {
  day: '2-digit',
  month: '2-digit',
  year: 'numeric'
});
  return (
    <>
      <article className="group flex flex-col rounded-[24px] bg-white p-3 shadow-sm ring-1 ring-black/5 transition-all hover:-translate-y-1 hover:shadow-xl hover:ring-[#ff6b35]/20">
        {/* Banner Section */}
        <div className="relative mb-3 h-36 w-full overflow-hidden rounded-[18px] bg-slate-100">
          {event.banner ? (
            <img 
              src={`http://localhost:3001${event.banner}`} 
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
              alt={event.title}
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-[#f7f3ec]">
              <i className="fi fi-rr-calendar-star text-2xl text-black/10"></i>
            </div>
          )}
          <div className="absolute left-2 top-2 rounded-full bg-white/90 px-2 py-1 text-[9px] font-black uppercase tracking-wider text-black/70 backdrop-blur-sm shadow-sm flex items-center gap-1">
            <i className="fi fi-rr-apps text-[#ff6b35]"></i> {event.eventType || 'General'}
          </div>
        </div>

        <div className="flex flex-1 flex-col px-1">
          <div className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-[#ff6b35]">
            <i className="fi fi-rr-calendar-clock flex items-center"></i>
            <span>{dateLabel}</span>
          </div>

          <h3 className="mt-1 line-clamp-1 text-sm font-black text-[#1a1a1a]">{event.title}</h3>
          
          <div className="mt-2 flex items-center gap-1.5 text-[10px] font-bold text-black/30">
            <i className="fi fi-rr-marker flex items-center"></i>
            <span className="truncate">{event.location || 'MSIT Campus'}</span>
          </div>

          {/* Action Buttons */}
          <div className="mt-auto grid grid-cols-1 gap-2 border-t border-black/[0.03] pt-4">
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
            
            <button 
              onClick={() => navigate(`/events/${event.id}`)} 
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#f7f3ec] py-2.5 text-[11px] font-black uppercase tracking-widest text-black/60 transition-all hover:bg-black/5 hover:text-black"
            >
              <i className="fi fi-rr-eye flex items-center"></i> View Details
            </button>
          </div>
        </div>
      </article>

      {/* --- Success Popup Modal --- */}
      {showPopup && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-sm rounded-[32px] bg-white p-8 text-center shadow-2xl animate-in fade-in zoom-in duration-300">
            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-green-50 text-4xl">
              🎉
            </div>
            <h2 className="mb-2 text-2xl font-black text-[#1a1a1a]">You're In!</h2>
            <p className="mb-8 text-sm text-black/40 leading-relaxed">
              Your spot for <span className="font-bold text-black">{event.title}</span> is secured. See you at MSIT!
            </p>
            <button 
              onClick={() => setShowPopup(false)}
              className="w-full rounded-2xl bg-[#161616] py-4 text-[11px] font-black uppercase tracking-widest text-white transition-all hover:bg-[#ff6b35]"
            >
              Awesome!
            </button>
          </div>
        </div>
      )}
    </>
  );
}