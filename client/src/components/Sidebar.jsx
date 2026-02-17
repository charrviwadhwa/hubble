import { Link } from 'react-router-dom';

export default function Sidebar({ userRole }) {
  return (
    <div className="w-64 h-screen bg-white border-r flex flex-col p-6">
      <h1 className="text-2xl font-bold text-blue-600 mb-10">Hubble</h1>
      
      <nav className="flex-1 space-y-4">
        {/* --- Shared Links --- */}
        <Link to="/dashboard" className="flex items-center space-x-2 text-gray-700 hover:text-blue-600">
          <span>🏠</span> <span>Dashboard</span>
        </Link>
        
        <Link to="/events" className="flex items-center space-x-2 text-gray-700 hover:text-blue-600">
          <span>📅</span> <span>All Events</span>
        </Link>

        {/* --- Admin/Society Only Links --- */}
        {userRole === 'admin' && (
          <>
            <Link to="/create-event" className="flex items-center space-x-2 text-gray-700 hover:text-blue-600">
              <span>➕</span> <span>Create Event</span>
            </Link>
            <Link to="/my-societies" className="flex items-center space-x-2 text-gray-700 hover:text-blue-600">
              <span>🏛️</span> <span>My Society</span>
            </Link>
          </>
        )}

        {/* --- Student Only Links --- */}
        {userRole === 'student' && (
          <Link to="/my-registrations" className="flex items-center space-x-2 text-gray-700 hover:text-blue-600">
            <span>🎟️</span> <span>My Tickets</span>
          </Link>
        )}

        <Link to="/profile" className="flex items-center space-x-2 text-gray-700 hover:text-blue-600">
          <span>👤</span> <span>Profile</span>
        </Link>
      </nav>

      <button 
        onClick={() => { localStorage.clear(); window.location.href='/login'; }}
        className="mt-auto text-red-500 font-semibold flex items-center space-x-2"
      >
        <span>🚪</span> <span>Logout</span>
      </button>
    </div>
  );
}