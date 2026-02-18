import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import loginImage from '../assets/college.jpg';

const headingFont = { fontFamily: 'Playfair, serif' };

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
        alert('Login successful');
        navigate('/dashboard');
      } else {
        alert(data.message || 'Invalid credentials');
      }
    } catch (error) {
      alert('Connection error');
    }
  };

  return (
    <div className="min-h-screen bg-[#f3efe8] p-4 md:p-8">
      <div className="mx-auto grid max-w-[1120px] overflow-hidden rounded-[30px] border border-black/10 bg-[#f7f3ec] shadow-[0_12px_30px_rgba(0,0,0,0.08)] md:grid-cols-2">
        <section className="anim-rise relative bg-[#161616] p-8 text-white md:p-10">
          <p className="inline-flex rounded-full border border-white/30 px-3 py-1 text-xs tracking-wide text-white/80">Welcome Back</p>
          <h1 className="mt-5 text-5xl leading-[1.02] md:text-6xl" style={headingFont}>
            Continue your
            <br />
            Hubble journey.
          </h1>
          <p className="mt-4 max-w-sm text-sm text-white/70">
            Sign in to manage events, discover communities, and track your registrations.
          </p>

          <div className="anim-float mt-8 overflow-hidden rounded-3xl border border-white/20 bg-white/10">
            <img src={loginImage} alt="Campus" className="h-[280px] w-full object-cover opacity-90" />
          </div>
        </section>

        <section className="anim-fade flex items-center p-6 md:p-10">
          <div className="w-full">
            <h2 className="text-4xl text-[#121212]" style={headingFont}>Login</h2>
            <p className="mt-2 text-sm text-black/60">
              New to Hubble?{' '}
              <Link to="/signup" className="font-semibold text-[#ff6b35] hover:underline">
                Create account
              </Link>
            </p>

            <form onSubmit={handleLogin} className="mt-7 space-y-4">
              <input
                type="email"
                required
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email address"
                className="w-full rounded-2xl border border-black/15 bg-white px-4 py-3 text-sm outline-none transition focus:border-black"
              />
              <input
                type="password"
                required
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                className="w-full rounded-2xl border border-black/15 bg-white px-4 py-3 text-sm outline-none transition focus:border-black"
              />
              <button
                type="submit"
                className="w-full rounded-full bg-[#ff6b35] px-5 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-[#ff5720]"
              >
                Login
              </button>
            </form>

            <p className="mt-6 text-xs text-black/50">
              By logging in, you agree to our Terms and Privacy Policy.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
