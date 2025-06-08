import { useState } from "react";
import { signup } from "../services/authService";
import { Link } from 'react-router-dom';
import { FaEnvelope, FaLock } from "react-icons/fa";



export default function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState(""); 

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await signup(email, password);
      const user = userCredential.user;
      const token = await userCredential.user.getIdToken();

      
      await fetch("http://localhost:5000/api/save-user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
        email: user.email,
        uid: user.uid,
        userType:role,
      }),
    });

      alert("Signup successful");
    } catch (err) {
      alert(err.message);
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
    <div className="min-h-screen bg-[#f8f6f4] flex items-center justify-center">
      <div className="bg-white rounded-xl shadow-lg p-10 w-full max-w-md relative">
        <h2 className="text-2xl font-semibold text-gray-800 mb-1">Let's <span className="font-bold">Start Learning</span></h2>
        <p className="text-sm text-gray-500 mb-6">Please login or sign up to continue</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex items-center border rounded-lg px-3 py-2 bg-gray-100">
            <FaEnvelope className="text-gray-400 mr-2" />
            <input type="email" placeholder="Your Email" className="bg-transparent w-full outline-none" onChange={e => setEmail(e.target.value)} required />
          </div>

          <div className="flex items-center border rounded-lg px-3 py-2 bg-gray-100">
            <FaLock className="text-gray-400 mr-2" />
            <input type="password" placeholder="Your Password" className="bg-transparent w-full outline-none" onChange={e => setPassword(e.target.value)} required />
          </div>

           <div className="border rounded-lg px-3 py-2 bg-gray-100">
            <select onChange={(e) => setRole(e.target.value)} value={role} required className="w-full bg-transparent outline-none">
              <option value="" disabled>Select Role</option>
              <option value="student">Student</option>
              <option value="society-admin">Society Admin</option>
            </select>
          </div>

          <button type="submit" className="w-full bg-orange-500 text-white py-2 rounded-lg font-semibold hover:bg-orange-600">Sign Up</button>

          <button type="button" className="w-full flex items-center justify-center border py-2 rounded-lg hover:bg-gray-100">
            <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google logo" className="w-5 h-5 mr-2" />
            Google
          </button>

          <p className="text-sm text-center mt-4">Already have an account? <Link to="/login" className="text-orange-500 font-medium">Login</Link></p>
        </form>
      </div>
    </div>
  );
}
