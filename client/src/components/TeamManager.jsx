import { useState, useEffect } from 'react';
import { triggerHubbleNotif } from '../utils/notify'; 

export default function TeamManager({ societyId }) {
  const [team, setTeam] = useState([]);
  const [newEmail, setNewEmail] = useState('');
  const [loading, setLoading] = useState(false);

  // 1. Fetch the team when the component loads
  const fetchTeam = async () => {
    try {
      const res = await fetch(`http://localhost:3001/api/societies/${societyId}/managers`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      if (res.ok) {
        const data = await res.json();
        setTeam(data);
      }
    } catch (err) {
      console.error("Fetch team error:", err);
    }
  };

  useEffect(() => {
    if (societyId) fetchTeam();
  }, [societyId]);

  // 2. Add a new Co-founder by Email
  const handleAddMember = async () => {
    if (!newEmail.trim()) return;

    setLoading(true);
    try {
      const res = await fetch(`http://localhost:3001/api/societies/${societyId}/managers`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}` 
        },
        body: JSON.stringify({ email: newEmail })
      });
      
      const data = await res.json();
      
      if (res.ok) {
        setNewEmail(''); // Clear the input box
        fetchTeam();     // Refresh the team list
        triggerHubbleNotif("Team Updated", `${data.user.name} is now a co-founder!`);
      } else {
        
      }
    } catch (err) {
      console.error("Add member error:", err);
      
    } finally {
      setLoading(false);
    }
  };

  // 3. Remove a Co-founder
  const handleRemoveMember = async (userId) => {
    // Confirm before deleting
    if (!window.confirm("Are you sure you want to remove this co-founder's access to the society?")) return;
    
    try {
      const res = await fetch(`http://localhost:3001/api/societies/${societyId}/managers/${userId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      
      if (res.ok) {
        fetchTeam(); // Refresh the team list
        triggerHubbleNotif("Team Updated", "Co-founder access revoked.");
      } else {
        const data = await res.json();
        
      }
    } catch (err) {
      console.error("Remove member error:", err);
    }
  };

  return (
    <section className="space-y-6 animate-in fade-in duration-300">
      <div>
        <h3 className="text-base font-semibold text-gray-900 mb-1">Core Team (Co-founders)</h3>
        <p className="text-sm text-gray-500 mb-6">Add students who can edit this hub, manage events, and view attendee lists.</p>
      </div>
      
      {/* Add New Member Input Area */}
      <div className="flex flex-col md:flex-row gap-3 max-w-2xl">
        <div className="flex-1 relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
            <i className="fi fi-rr-envelope"></i>
          </div>
          <input 
            type="email" 
            placeholder="Student's Email..." 
            value={newEmail}
            onChange={(e) => setNewEmail(e.target.value)}
            className="w-full rounded-lg border border-gray-300 pl-10 pr-4 py-2.5 text-sm text-gray-900 outline-none transition-colors focus:border-[#ff6b35] focus:ring-1 focus:ring-[#ff6b35]"
          />
        </div>
        <button 
          onClick={handleAddMember}
          disabled={loading || !newEmail}
          className="flex items-center justify-center gap-2 rounded-lg bg-[#ff6b35] px-6 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-[#e85a25] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? <i className="fi fi-rr-loading animate-spin"></i> : <i className="fi fi-rr-user-add"></i>}
          {loading ? 'Adding...' : 'Add Member'}
        </button>
      </div>

      {/* Team Roster List */}
      <div className="max-w-2xl rounded-xl border border-gray-200 bg-white overflow-hidden shadow-sm">
        <ul className="divide-y divide-gray-100">
          {team.map(member => (
            <li key={member.id} className="flex items-center justify-between p-4 hover:bg-gray-50/50 transition-colors">
              <div className="flex items-center gap-4">
                <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center text-[#ff6b35] text-lg font-bold border border-gray-200">
                  {member.name[0].toUpperCase()}
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                    {member.name} 
                    {/* The Founder Badge */}
                    {member.isOwner && (
                      <span className="text-[9px] bg-orange-50 text-[#ff6b35] px-1.5 py-0.5 rounded border border-orange-100 uppercase font-black tracking-tight">
                        Founder
                      </span>
                    )}
                  </p>
                  <p className="text-xs text-gray-500 font-mono mt-0.5">{member.email}</p>
                </div>
              </div>
              
              {/* Only show the Remove button if they are NOT the main owner */}
              {!member.isOwner && (
                <button 
                  onClick={() => handleRemoveMember(member.id)}
                  className="flex items-center justify-center h-8 w-8 rounded-md text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                  title="Remove Co-founder"
                >
                  <i className="fi fi-rr-trash"></i>
                </button>
              )}
            </li>
          ))}

          {/* Empty/Loading State */}
          {team.length === 0 && (
            <li className="p-6 text-center text-sm text-gray-500 italic">
              Loading team data...
            </li>
          )}
        </ul>
      </div>
    </section>
  );
}