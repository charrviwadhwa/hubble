import { useState } from "react";
import { login } from "../services/authService";
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';


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
    <div className="min-h-screen bg-[#f8f6f4] flex items-center justify-center">
      <div className="bg-white rounded-xl shadow-lg p-10 w-full max-w-md">
        <h2 className="text-2xl font-semibold text-gray-800 mb-1">Welcome Back</h2>
        <p className="text-sm text-gray-500 mb-6">Please login to continue</p>

        <form onSubmit={handleLogin} className="space-y-4">
          <input
            type="email"
            placeholder="Your Email"
            className="w-full border rounded-lg px-3 py-2 bg-gray-100 outline-none"
            onChange={e => setEmail(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Your Password"
            className="w-full border rounded-lg px-3 py-2 bg-gray-100 outline-none"
            onChange={e => setPassword(e.target.value)}
            required
          />

          <button type="submit" className="w-full bg-orange-500 text-white py-2 rounded-lg font-semibold hover:bg-orange-600">
            Login
          </button>

          <p className="text-sm text-center mt-4">
            Don't have an account? <Link to="/signup" className="text-orange-500 font-medium">Sign up</Link>
          </p>
        </form>
      </div>
    </div>
  );
}