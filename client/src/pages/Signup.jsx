import { useState } from "react";

import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { FaEnvelope, FaLock } from "react-icons/fa";
import heroImage from "../assets/college.jpg";


export default function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState(""); 
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Create the payload for our custom backend
    const userData = {
      name: name, // Ensure you've added the 'name' state
      email: email,
      password: password,
      role: role === "society" ? "admin" : "student",
    };

    try {
      const response = await fetch("http://localhost:3001/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
      });

      const data = await response.json();

      if (response.ok) {
        alert("Signup successful! Please login.");
        navigate('/login');
      } else {
        alert(data.message || "Signup failed");
      }
    } catch (err) {
      alert("Server is down. Check if your Node.js app is running on 3001.");
    }
  };

//   return (
//     <form onSubmit={handleSubmit}>
//       <input type="email" onChange={(e) => setEmail(e.target.value)} required />
//       <input type="password" onChange={(e) => setPassword(e.target.value)} required />
//       <select onChange={(e) => setRole(e.target.value)}>
//         <option value="" disabled>Select Role</option>
//         <option value="student">Student</option>
//         <option value="society-admin">Society Admin</option>
//       </select>
//       <button type="submit">Sign Up</button>
//     </form>
//   );
// }





  return (
    <div className="min-h-screen flex">
      {/* Left: Illustration & Message */}
     <div className="relative w-full md:w-1/2 h-[350px] md:h-auto">
        <img
          src={heroImage}
          alt="Campus illustration"
          className="w-full h-full object-cover"
        />

        {/* Text over the image */}
        {/* <div className="absolute inset-0 bg-black/30 flex flex-col justify-center items-center text-center text-white px-4">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">
            Join the Campus Community
          </h1>
          <p className="text-sm md:text-base max-w-md">
            Be a part of all events and society buzz around you!
          </p>
        </div>
      </div> */}
       <div className="absolute inset-0 bg-black/40" />

  {/* Text over the overlay */}
  <div className="absolute inset-0 flex flex-col justify-center items-center text-center text-white px-4 z-10">
    <h1 className="text-3xl md:text-4xl font-bold mb-2 drop-shadow-lg">
      Join the Campus Community
    </h1>
    <p className="text-sm md:text-base max-w-md drop-shadow-md">
      Be a part of all events and society buzz around you!
    </p>
  </div>
</div>

      {/* Right: Signup Form */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-10 bg-white">
        <div className="w-full max-w-md">
          <h2 className="text-2xl font-bold mb-4">Sign Up to Hubble</h2>
          <p className="text-sm text-gray-500 mb-6">
            Already have an account? <a href="/login" className="text-blue-600 font-semibold">Sign In</a>
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              placeholder="Full Name"
              onChange={(e) => setName(e.target.value)}
              className="w-full border px-4 py-2 rounded-md focus:outline-none"
            />
            <input
              type="email"
              placeholder="Email"
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border px-4 py-2 rounded-md focus:outline-none"
            />
            <input
              type="password"
              placeholder="Password"
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border px-4 py-2 rounded-md focus:outline-none"
            />

            {/* Role Buttons */}
            <div className="flex justify-between gap-2">
              <button
                type="button"
                onClick={() => setRole("student")}
                className={`flex-1 border rounded-md py-2 font-medium ${
                  role === "student" ? "bg-blue-100 border-blue-500 text-blue-700" : "bg-white"
                }`}
              >
                Student
              </button>
              <button
                type="button"
                onClick={() => setRole("society")}
                className={`flex-1 border rounded-md py-2 font-medium ${
                  role === "society" ? "bg-blue-100 border-blue-500 text-blue-700" : "bg-white"
                }`}
              >
                Society
              </button>
            </div>

            <button
              type="submit"
              className="w-full bg-yellow-400 hover:bg-yellow-500 text-white font-semibold py-2 rounded-md"
            >
              Sign Up
            </button>
          </form>

          <p className="text-xs text-center mt-6 text-gray-500">
            By signing up, you agree to our <a href="#" className="text-blue-500">Terms of Use</a> and <a href="#" className="text-blue-500">Privacy Policy</a>.
          </p>
        </div>
      </div>
    </div>
  );
}
