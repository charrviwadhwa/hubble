export default function EventCard({ event, onRefresh }) {
  const isFull = event.capacity && event.attendeeCount >= event.capacity;

  const handleRegister = async () => {
    const res = await fetch(`http://localhost:3001/api/events/${event.id}/register`, {
      method: "POST",
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    });
    const data = await res.json();
    if (res.ok) {
      alert("See you there!");
      onRefresh(); // Refresh counts
    } else {
      alert(data.message);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm hover:shadow-md transition-shadow">
      <div className="relative h-44 mb-4 rounded-xl overflow-hidden bg-gray-100">
        {/* Category Tag */}
        <span className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-[10px] font-bold text-blue-600 uppercase">
          {event.category || "General"}
        </span>
        <div className="w-full h-full flex items-center justify-center text-gray-300 text-4xl">🖼️</div>
      </div>

      <div className="mb-4">
        <p className="text-[10px] text-gray-400 font-medium mb-1 uppercase">
          {new Date(event.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
        </p>
        <h3 className="font-bold text-gray-800 leading-snug truncate">{event.title}</h3>
        <p className="text-xs text-gray-500 flex items-center gap-1 mt-1">📍 {event.location}</p>
      </div>

      {/* Progress Bar for Capacity */}
      <div className="space-y-1.5 mb-5">
        <div className="flex justify-between text-[10px] font-bold text-gray-500">
           <span>{isFull ? "Full" : "Availability"}</span>
           <span>{Math.round((event.attendeeCount / event.capacity) * 100) || 0}%</span>
        </div>
        <div className="w-full bg-gray-100 h-1.5 rounded-full overflow-hidden">
           <div 
             className={`h-full transition-all duration-500 ${isFull ? 'bg-red-500' : 'bg-blue-600'}`}
             style={{ width: `${(event.attendeeCount / event.capacity) * 100}%` }}
           />
        </div>
      </div>

      <div className="flex justify-between items-center pt-2">
        <span className="text-lg font-bold text-blue-600">Free</span>
        <button 
          onClick={handleRegister}
          disabled={isFull}
          className={`px-5 py-2 rounded-xl text-xs font-bold transition-colors ${
            isFull ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-blue-600 text-white hover:bg-blue-700'
          }`}
        >
          {isFull ? "Sold Out" : "Join Event"}
        </button>
      </div>
    </div>
  );
}