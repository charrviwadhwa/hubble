import { useState } from "react";
import { signup } from "../services/authService";

export default function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState(""); 

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await signup(email, password);
      const token = await userCredential.user.getIdToken();

      
      await fetch("http://localhost:5000/api/auth/save-user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ email, role }),
      });

      alert("Signup successful");
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="email" onChange={(e) => setEmail(e.target.value)} required />
      <input type="password" onChange={(e) => setPassword(e.target.value)} required />
      <select onChange={(e) => setRole(e.target.value)}>
        <option value="student">Student</option>
        <option value="society-admin">Society Admin</option>
      </select>
      <button type="submit">Sign Up</button>
    </form>
  );
}
