import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import confetti from 'canvas-confetti';
import { triggerHubbleNotif } from '../utils/notify';

export default function EventCard({ event, onRefresh, isRegistered = false }) {
  const navigate = useNavigate();
  const [showPopup, setShowPopup] = useState(false);
  const [loading, setLoading] = useState(false);

  const capacity = event.capacity || 100;
  const attendees = event.attendeeCount || 0;
  const isFull = attendees >= capacity;

  const now = new Date();
  const deadline = event.registrationDeadline ? new Date(event.registrationDeadline) : null;
  const isClosed = deadline && now > deadline;

  const handleApply = async (e) => {
    e.stopPropagation(); 
    
    if (isClosed) {
      
      return;
    }

    // Prevents double-clicks without changing the UI
    if (isRegistered || loading || isFull) return;

    setLoading(true);
    try {
      const res = await fetch(`https://hubble-d9l6.onrender.com/api/events/${event.id}/register`, {
        method: 'POST',
        headers: { 
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });

      if (res.ok) {
        confetti({
          particleCount: 100, spread: 70, origin: { y: 0.6 },
          colors: ['#ff6b35', '#ffffff', '#e85a25']
        });
        setShowPopup(true);
        if (onRefresh) onRefresh(); 

        triggerHubbleNotif(
      "Mission Confirmed!", 
      `You have successfully registered for ${event.title}.`
    );
      } else {
        const data = await res.json();
        
      }
    } catch (err) {
      console.error("Registration error:", err);
    } finally {
      setLoading(false);
    }
    
  };

  const dateLabel = event.startDate 
    ? new Date(event.startDate).toLocaleDateString('en-GB', {
        day: '2-digit', month: 'short', year: 'numeric'
      })
    : "TBA";

  return (
    <>
      <article className="group flex flex-col rounded-2xl bg-white p-3 border border-gray-200 shadow-sm transition-all hover:-translate-y-1 hover:shadow-md hover:border-[#ff6b35]">
        
        {/* Banner Section */}
        <div 
          onClick={() => navigate(`/events/${event.id}`)}
          className="relative mb-4 h-36 w-full overflow-hidden rounded-xl bg-gray-50 cursor-pointer border border-gray-100"
        >
          {event.banner ? (
            <img 
              src={`https://hubble-d9l6.onrender.com${event.banner}`} 
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              alt={event.title}
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-gray-300">
              <i className="fi fi-rr-picture text-2xl"></i>
            </div>
          )}
          
          {/* Event Type Tag */}
          <div className="absolute left-2 top-2 flex items-center gap-1.5 rounded-md bg-white/90 px-2 py-1 text-[10px] font-semibold uppercase tracking-wider text-gray-700 backdrop-blur-sm shadow-sm">
            <i className="fi fi-rr-apps text-[#ff6b35]"></i> 
            {event.eventType || 'General'}
          </div>
        </div>

        <div className="flex flex-1 flex-col px-1">
          {/* Metadata */}
          <div className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-wider text-[#ff6b35] mb-1">
            <i className="fi fi-rr-calendar"></i>
            <span>{dateLabel}</span>
          </div>

          <h3 
            onClick={() => navigate(`/events/${event.id}`)}
            className="line-clamp-1 text-base font-semibold text-gray-900 cursor-pointer hover:text-[#ff6b35] transition-colors"
          >
            {event.title}
          </h3>
          
          <div className="mt-1.5 flex items-center gap-2 text-xs font-medium text-gray-500">
            <i className="fi fi-rr-marker"></i>
            <span className="truncate">{event.location || 'Campus'}</span>
          </div>

          {/* Action Buttons */}
          <div className="mt-6 grid grid-cols-2 gap-2">
            <button 
              onClick={() => navigate(`/events/${event.id}`)} 
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-gray-50 border border-gray-200 py-2.5 text-xs font-semibold text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-900"
            >
              Details
            </button>
            
            <button 
              onClick={handleApply}
              disabled={isRegistered || isFull || isClosed || loading}
              className={`flex w-full items-center justify-center gap-2 rounded-lg py-2.5 text-xs font-semibold transition-all ${
                isRegistered 
                  ? "bg-green-50 text-green-700 border border-green-200 cursor-default" 
                  : (isFull || isClosed)
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200" 
                  : "bg-[#ff6b35] text-white hover:bg-[#e85a25] shadow-sm"
              }`}
            >
              <i className={`fi ${
                isRegistered ? 'fi-rr-check' : 
                (isFull || isClosed) ? 'fi-rr-lock' : 
                'fi-rr-plus'
              } mt-0.5`}></i>
              
              {/* Removed the "Wait..." text here */}
              {isRegistered ? "Applied" : isClosed ? "Closed" : isFull ? "Full" : "Join"}
            </button>
          </div>
        </div>
      </article>

      {/* Success Popup Modal */}
      {showPopup && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-gray-900/40 backdrop-blur-sm p-4">
          <div className="w-full max-w-sm rounded-3xl bg-white p-8 text-center shadow-2xl animate-in zoom-in-95 duration-300 border border-gray-100">
            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-green-50 text-green-600 text-3xl border border-green-100">
              <i className="fi fi-rr-check-circle"></i>
            </div>
            <h2 className="mb-2 text-2xl font-semibold text-gray-900">Spot Secured!</h2>
            <p className="mb-8 text-sm text-gray-500 leading-relaxed">
              You are registered for <span className="font-semibold text-gray-800">{event.title}</span>. See you there!
            </p>
            <button 
              onClick={() => setShowPopup(false)}
              className="w-full rounded-xl bg-gray-900 py-3 text-sm font-medium text-white transition-colors hover:bg-black"
            >
              Awesome!
            </button>
          </div>
        </div>
      )}
    </>
  );
}