import { useState } from "react";
import { login } from "../services/authService";
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import loginImage from "../assets/college.jpg";


export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await login(email, password);
      const token = await userCredential.user.getIdToken();
      navigate('/dashboard');
      alert("Login successful");
    } catch (err) {
      alert(err.message);
    }
  };

//   return (
//     <form onSubmit={handleLogin}>
//       <input type="email" onChange={(e) => setEmail(e.target.value)} required />
//       <input type="password" onChange={(e) => setPassword(e.target.value)} required />
//       <button type="submit">Login</button>
//     </form>
//   );
// }




  return (
     <div className="min-h-screen flex">
      {/* LEFT SECTION: Image + Overlay Text */}
      <div className="relative w-full md:w-1/2 h-[350px] md:h-auto">
        <img
          src={loginImage}
          alt="Campus"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/40" />
        <div className="absolute inset-0 flex flex-col justify-center items-center text-white px-6 text-center z-10">
          <h2 className="text-3xl md:text-4xl font-bold mb-3 drop-shadow-lg">
            Welcome Back!
          </h2>
          <p className="text-md md:text-lg drop-shadow-md max-w-md">
            Dive back into your campus community – connect, explore, and engage.
          </p>
        </div>
      </div>

      {/* RIGHT SECTION: Login Form */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-10 bg-white">
        <div className="w-full max-w-md">
        <h1 className="text-3xl font-bold mb-6">Login to Hubble</h1>
        <p className="text-sm text-gray-500 mb-4">
          Don’t have an account?{" "}
          <Link to="/signup" className="text-blue-600 font-semibold hover:underline">
            Sign Up
          </Link>
        </p>

        <form onSubmit={handleLogin} className="space-y-4">
          <input
            type="email"
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none "
          />
          <input
            type="password"
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none "
          />
          <button
            type="submit"
            className="w-full bg-yellow-400 hover:bg-yellow-500 text-black font-semibold py-2 rounded-md transition"
          >
            Login
          </button>
        </form>

        <p className="text-xs text-center text-gray-400 mt-6">
          By logging in, you agree to our{" "}
          <span className="underline cursor-pointer">Terms of Use</span> and{" "}
          <span className="underline cursor-pointer">Privacy Policy</span>.
        </p>
      </div>
      </div>
    </div>
  );
}