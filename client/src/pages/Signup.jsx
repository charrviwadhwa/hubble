import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import heroImage from '../assets/hello4.jpg';

const headingFont = { fontFamily: 'Playfair, serif' };

export default function Signup() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

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
    <div className="min-h-screen bg-[#f3efe8] p-4 md:p-8">
      <div className="mx-auto grid max-w-[1120px] overflow-hidden rounded-[30px] border border-black/10 bg-[#f7f3ec] shadow-[0_12px_30px_rgba(0,0,0,0.08)] md:grid-cols-2">
        <section className="anim-rise relative bg-[#161616] p-8 text-white md:p-10">
          <p className="inline-flex rounded-full border border-white/30 px-3 py-1 text-xs tracking-wide text-white/80">Join Hubble</p>
          <h1 className="mt-5 text-5xl leading-[1.02] md:text-6xl" style={headingFont}>
            Build your
            <br />
            campus network.
          </h1>
          <p className="mt-4 max-w-sm text-sm text-white/70">
            Create your account to discover events, connect with societies, and grow your student footprint.
          </p>

          <div className="anim-float mt-8 overflow-hidden rounded-3xl border border-white/20 bg-white/10">
            <img src={heroImage} alt="Campus" className="h-[280px] w-full object-cover opacity-90" />
          </div>
        </section>

        <section className="anim-fade flex items-center p-6 md:p-10">
          <div className="w-full">
            <h2 className="text-4xl text-[#121212]" style={headingFont}>Sign Up</h2>
            <p className="mt-2 text-sm text-black/60">
              Already have an account?{' '}
              <Link to="/login" className="font-semibold text-[#ff6b35] hover:underline">
                Sign in
              </Link>
            </p>

            <form onSubmit={handleSubmit} className="mt-7 space-y-4">
              <input
                type="text"
                required
                placeholder="Full name"
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-2xl border border-black/15 bg-white px-4 py-3 text-sm outline-none transition focus:border-black"
              />
              <input
                type="email"
                required
                placeholder="Email address"
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-2xl border border-black/15 bg-white px-4 py-3 text-sm outline-none transition focus:border-black"
              />
              <input
                type="password"
                required
                placeholder="Password"
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-2xl border border-black/15 bg-white px-4 py-3 text-sm outline-none transition focus:border-black"
              />

              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setRole('student')}
                  className={`rounded-2xl border px-4 py-2 text-sm font-medium transition ${
                    role === 'student'
                      ? 'border-[#ff6b35] bg-[#ff6b35] text-white'
                      : 'border-black/15 bg-white text-black/70'
                  }`}
                >
                  Student
                </button>
                <button
                  type="button"
                  onClick={() => setRole('society')}
                  className={`rounded-2xl border px-4 py-2 text-sm font-medium transition ${
                    role === 'society'
                      ? 'border-[#ff6b35] bg-[#ff6b35] text-white'
                      : 'border-black/15 bg-white text-black/70'
                  }`}
                >
                  Society
                </button>
              </div>

              <button
                type="submit"
                className="w-full rounded-full bg-[#ff6b35] px-5 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-[#ff5720]"
              >
                Create account
              </button>
            </form>

            <p className="mt-6 text-xs text-black/50">
              By signing up, you agree to our Terms and Privacy Policy.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
