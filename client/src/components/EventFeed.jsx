export default function EventCard({ event, onRefresh, index = 0 }) {
  const capacity = event.capacity || 100;
  const attendees = event.attendeeCount || 0;
  const ratio = Math.max(0, Math.min(100, Math.round((attendees / capacity) * 100)));
  const isFull = attendees >= capacity;

  const cardBackgrounds = [
    'from-[#f7d8c2] via-[#f3c6a7] to-[#efb08a]',
    'from-[#d9d3c5] via-[#c8b9a0] to-[#bda385]',
    'from-[#f2cab7] via-[#ebac8d] to-[#e38f66]',
    'from-[#ddd8cf] via-[#cec4b8] to-[#c0afa0]',
    'from-[#f5dcca] via-[#e9c7a8] to-[#dcae89]',
    'from-[#ead6c3] via-[#dfb894] to-[#c98f64]',
    'from-[#f4d4be] via-[#eebd9b] to-[#e39f74]',
    'from-[#ddd2c6] via-[#ccbca7] to-[#bfa98f]'
  ];

  const handleRegister = async () => {
    const res = await fetch(`http://localhost:3001/api/events/${event.id}/register`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    });

    const data = await res.json();
    if (res.ok) {
      alert('See you there!');
      onRefresh();
    } else {
      alert(data.message);
    }
  };

  const date = new Date(event.date);
  const dateLabel = date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
  const timeLabel = date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit'
  });

  const derivedPrice = (((event.id || index + 1) * 7) % 9 + 2) * 5;

  return (
    <article className="rounded-2xl bg-white p-3 shadow-sm ring-1 ring-black/10 transition hover:-translate-y-0.5 hover:shadow-md">
      <div className={`relative mb-3 h-32 overflow-hidden rounded-xl bg-gradient-to-br ${cardBackgrounds[index % cardBackgrounds.length]}`}>
        <div className="absolute left-2 top-2 rounded-full bg-white/90 px-2 py-1 text-[10px] font-medium text-black/70">
          {event.category || 'General'}
        </div>
        <div className="absolute right-2 top-2 rounded-full bg-[#161616] px-2 py-1 text-[10px] font-semibold text-white">
          Active
        </div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_75%_20%,rgba(255,255,255,0.75),transparent_45%)]" />
      </div>

      <p className="text-[10px] text-black/45">{dateLabel} - {timeLabel}</p>
      <h3 className="mt-1 truncate text-sm font-semibold text-[#1c1c1c]">{event.title}</h3>
      <p className="mt-1 truncate text-xs text-black/55">{event.location || 'Campus Hall'}</p>

      <div className="mt-3 flex items-center justify-between text-[11px] font-semibold text-black/55">
        <span>Capacity</span>
        <span>{ratio}%</span>
      </div>
      <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-[#f1e7d9]">
        <div
          className={`h-full rounded-full ${isFull ? 'bg-rose-500' : 'bg-[#ff6b35]'}`}
          style={{ width: `${ratio}%` }}
        />
      </div>

      <div className="mt-3 flex items-center justify-between">
        <p className="text-lg font-bold text-[#ff6b35]">${derivedPrice}</p>
        <button
          onClick={handleRegister}
          disabled={isFull}
          className={`rounded-full px-3 py-1.5 text-xs font-semibold transition ${
            isFull
              ? 'bg-slate-100 text-slate-400'
              : 'bg-[#161616] text-white hover:bg-black'
          }`}
        >
          {isFull ? 'Sold Out' : 'Join'}
        </button>
      </div>
    </article>
  );
}
