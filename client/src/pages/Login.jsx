import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import loginImage from '../assets/hello2.jpg';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:3001/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('token', data.token);
        // Optional: you can replace this alert with your cool Toast notification later!
        
        navigate('/events');
      } else {
        alert("Login failed. Please check your credentials.");
      }
    } catch (error) {
      
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
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-[#ff6b35]/10 rounded-full blur-3xl animate-pulse-soft z-0"></div>
      <Decoration className="absolute top-20 left-20 w-10 h-10 animate-float-slow z-0" type="square" />
      <Decoration className="absolute bottom-20 left-32 w-6 h-6 animate-pulse-soft z-0" type="circle" />
      <Decoration className="absolute top-32 right-32 w-8 h-8 animate-float-fast z-0" type="empty-square" />
      <Decoration className="absolute bottom-32 right-20 w-12 h-12 animate-float-slow z-0" type="empty-circle" />

      {/* --- MAIN LOGIN CARD --- */}
      <div className="w-full max-w-5xl grid md:grid-cols-2 bg-white border-4 border-black rounded-[2rem] shadow-[16px_16px_0px_0px_rgba(0,0,0,1)] overflow-hidden relative z-10 group">
        
        {/* LEFT SIDE: BRANDING & IMAGE */}
        <section className="bg-[#ff6b35] p-10 md:p-14 flex flex-col justify-center relative overflow-hidden border-b-4 md:border-b-0 md:border-r-4 border-black">
          
          

          <div className="relative z-10">
            <Link to="/" className="inline-flex items-center gap-2 text-black font-black text-xl mb-8 hover:-translate-x-1 transition-transform">
              <span className="text-2xl">←</span> Back to Home
            </Link>
            
            <h1 className="text-4xl md:text-5xl font-black leading-tight text-black mb-4">
              Continue your <br/> Hubble journey.
            </h1>
            <p className="text-black font-bold text-base mb-10 max-w-sm">
              Sign in to manage events, discover communities, and track your registrations.
            </p>

            {/* Memphis Styled Image Container */}
            <div className="w-full h-56 rounded-2xl border-4 border-black bg-white shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] overflow-hidden group-hover:-translate-y-2 group-hover:rotate-1 transition-all duration-500">
              <img 
                src={loginImage} 
                alt="Campus" 
                className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700" 
              />
            </div>
          </div>
        </section>

        {/* RIGHT SIDE: FORM */}
        <section className="p-10 md:p-14 flex flex-col justify-center bg-white">
          <div className="w-full max-w-md mx-auto">
            <h2 className="text-4xl font-black text-black mb-2">Login</h2>
            <p className="text-sm font-bold text-gray-500 mb-8">
              New to Hubble?{' '}
              <Link to="/signup" className="text-[#ff6b35] underline decoration-2 underline-offset-4 hover:text-black transition-colors">
                Create account
              </Link>
            </p>

            <form onSubmit={handleLogin} className="space-y-5">
              <div className="space-y-1">
                <label className="text-xs font-black uppercase tracking-widest text-black">Email</label>
                <input
                  type="email"
                  required
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@student.in"
                  className="w-full rounded-xl border-4 border-black bg-white px-4 py-3.5 text-sm font-bold text-black outline-none transition-all placeholder-gray-400 focus:-translate-y-1 focus:shadow-[4px_4px_0px_0px_rgba(255,107,53,1)]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-black uppercase tracking-widest text-black">Password</label>
                <input
                  type="password"
                  required
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full rounded-xl border-4 border-black bg-white px-4 py-3.5 text-sm font-bold text-black outline-none transition-all placeholder-gray-400 focus:-translate-y-1 focus:shadow-[4px_4px_0px_0px_rgba(255,107,53,1)]"
                />
              </div>

              <button
                type="submit"
                className="w-full mt-4 rounded-xl border-4 border-black bg-black px-5 py-4 text-sm font-black uppercase tracking-widest text-white shadow-[6px_6px_0px_0px_rgba(255,107,53,1)] transition-all hover:-translate-y-1 hover:shadow-[8px_8px_0px_0px_rgba(255,107,53,1)] active:translate-y-1 active:shadow-none"
              >
                Enter Hub
              </button>
            </form>

            <p className="mt-8 text-xs font-bold text-gray-400 text-center">
              By logging in, you agree to our <a href="#" className="underline hover:text-black">Terms</a> and <a href="#" className="underline hover:text-black">Privacy Policy</a>.
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