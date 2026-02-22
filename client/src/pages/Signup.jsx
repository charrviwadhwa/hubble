import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import heroImage from '../assets/hello4.jpg'; // Make sure this path matches your project

export default function Signup() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState(''); // 'student' or 'society'
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!role) {
      alert("Please select a role (Student or Society)");
      return;
    }

    const userData = {
      name,
      email,
      password,
      role: role === 'society' ? 'admin' : 'student',
    };

    try {
      const response = await fetch('http://localhost:3001/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
      });

      const data = await response.json();

      if (response.ok) {
        alert('Signup successful! Please login.');
        navigate('/login');
      } else {
        alert(data.message || 'Signup failed');
      }
    } catch {
      alert('Server is down. Check if your Node.js app is running on 3001.');
    }
  };

  return (
    <div className="min-h-screen bg-white font-sans text-gray-900 flex items-center justify-center p-6 relative overflow-hidden selection:bg-[#ff6b35] selection:text-white">
      
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

      {/* --- BACKGROUND DECORATIONS --- */}
      <div className="absolute top-[-10%] right-[-10%] w-96 h-96 bg-[#ff6b35]/10 rounded-full blur-3xl animate-pulse-soft z-0"></div>
      <Decoration className="absolute top-20 right-20 w-10 h-10 animate-float-slow z-0" type="square" />
      <Decoration className="absolute bottom-20 right-32 w-6 h-6 animate-pulse-soft z-0" type="circle" />
      <Decoration className="absolute top-32 left-32 w-8 h-8 animate-float-fast z-0" type="empty-square" />
      <Decoration className="absolute bottom-32 left-20 w-12 h-12 animate-float-slow z-0" type="empty-circle" />

      {/* --- MAIN SIGNUP CARD --- */}
      <div className="w-full max-w-5xl grid md:grid-cols-2 bg-white border-4 border-black rounded-[2rem] shadow-[16px_16px_0px_0px_rgba(0,0,0,1)] overflow-hidden relative z-10 group">
        
        {/* LEFT SIDE: BRANDING & IMAGE */}
        <section className="bg-[#ff6b35] p-10 md:p-14 flex flex-col justify-center relative overflow-hidden border-b-4 md:border-b-0 md:border-r-4 border-black">
          
          

          <div className="relative z-10">
            <Link to="/" className="inline-flex items-center gap-2 text-black font-black text-xl mb-8 hover:-translate-x-1 transition-transform">
              <span className="text-2xl">←</span> Back to Home
            </Link>
            
            <h1 className="text-4xl md:text-5xl font-black leading-tight text-black mb-4">
              Build your <br/> campus network.
            </h1>
            <p className="text-black font-bold text-base mb-10 max-w-sm">
              Create your account to discover events, connect with societies, and grow your student footprint.
            </p>

            {/* Memphis Styled Image Container */}
            <div className="w-full h-56 rounded-2xl border-4 border-black bg-white shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] overflow-hidden group-hover:-translate-y-2 group-hover:rotate-1 transition-all duration-500">
              <img 
                src={heroImage} 
                alt="Campus" 
                className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700" 
              />
            </div>
          </div>
        </section>

        {/* RIGHT SIDE: FORM */}
        <section className="p-8 md:p-12 flex flex-col justify-center bg-white">
          <div className="w-full max-w-md mx-auto">
            <h2 className="text-4xl font-black text-black mb-2">Sign Up</h2>
            <p className="text-sm font-bold text-gray-500 mb-6">
              Already have an account?{' '}
              <Link to="/login" className="text-[#ff6b35] underline decoration-2 underline-offset-4 hover:text-black transition-colors">
                Sign in
              </Link>
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              
              <div className="space-y-1">
                <label className="text-xs font-black uppercase tracking-widest text-black">Full Name</label>
                <input
                  type="text"
                  required
                  onChange={(e) => setName(e.target.value)}
                  placeholder="John Doe"
                  className="w-full rounded-xl border-4 border-black bg-white px-4 py-3 text-sm font-bold text-black outline-none transition-all placeholder-gray-400 focus:-translate-y-1 focus:shadow-[4px_4px_0px_0px_rgba(255,107,53,1)]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-black uppercase tracking-widest text-black">Email</label>
                <input
                  type="email"
                  required
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@student.msit.in"
                  className="w-full rounded-xl border-4 border-black bg-white px-4 py-3 text-sm font-bold text-black outline-none transition-all placeholder-gray-400 focus:-translate-y-1 focus:shadow-[4px_4px_0px_0px_rgba(255,107,53,1)]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-black uppercase tracking-widest text-black">Password</label>
                <input
                  type="password"
                  required
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full rounded-xl border-4 border-black bg-white px-4 py-3 text-sm font-bold text-black outline-none transition-all placeholder-gray-400 focus:-translate-y-1 focus:shadow-[4px_4px_0px_0px_rgba(255,107,53,1)]"
                />
              </div>

              {/* CHUNKY ROLE SELECTOR */}
              <div className="pt-2">
                <label className="text-xs font-black uppercase tracking-widest text-black mb-2 block">I am a...</label>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={() => setRole('student')}
                    className={`rounded-xl border-4 border-black px-4 py-3 text-sm font-black uppercase tracking-widest transition-all ${
                      role === 'student'
                        ? 'bg-black text-[#ff6b35] translate-y-1 shadow-none'
                        : 'bg-white text-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]'
                    }`}
                  >
                    Student
                  </button>
                  <button
                    type="button"
                    onClick={() => setRole('society')}
                    className={`rounded-xl border-4 border-black px-4 py-3 text-sm font-black uppercase tracking-widest transition-all ${
                      role === 'society'
                        ? 'bg-black text-[#ff6b35] translate-y-1 shadow-none'
                        : 'bg-white text-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]'
                    }`}
                  >
                    Society
                  </button>
                </div>
              </div>

              {/* SUBMIT BUTTON */}
              <button
                type="submit"
                className="w-full mt-4 rounded-xl border-4 border-black bg-[#ff6b35] px-5 py-4 text-sm font-black uppercase tracking-widest text-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all hover:-translate-y-1 hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] active:translate-y-1 active:shadow-none"
              >
                Create Account
              </button>
            </form>

            <p className="mt-6 text-xs font-bold text-gray-400 text-center">
              By signing up, you agree to our <a href="#" className="underline hover:text-black">Terms</a> and <a href="#" className="underline hover:text-black">Privacy Policy</a>.
            </p>
          </div>
        </section>

      </div>
    </div>
  );
}

// --- Helper Component for abstract floating shapes ---
function Decoration({ className, type }) {
  if (type === 'circle') return <div className={`rounded-full bg-[#ff6b35] border-2 border-black ${className}`}></div>;
  if (type === 'empty-circle') return <div className={`rounded-full border-4 border-[#1a1a1a] ${className}`}></div>;
  if (type === 'square') return <div className={`bg-white border-4 border-black ${className}`}></div>;
  if (type === 'empty-square') return <div className={`border-4 border-[#ff6b35] ${className}`}></div>;
  return null;
}