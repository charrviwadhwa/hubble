import { useState } from "react";
import { auth } from "../firebase";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "firebase/auth";

export default function AuthPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  
  const [role, setRole] = useState(""); 
  const signup = async () => {
    if (!role) {
    alert("Please select a role");
    return;
  }
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    const token = await user.getIdToken();
    console.log("Signup successful", user);

    await fetch("http://localhost:5000/api/saveuser", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        //"Authorization": `Bearer ${token}`
      },
      body: JSON.stringify({
        email: user.email,
        uid: user.uid,
        userType:role,
      }),
    });

    console.log("User stored in MongoDB ");
  } catch (err) {
    console.error("Signup error:", err.message);
  }
};

  const login = async () => {
    try {
      const user = await signInWithEmailAndPassword(auth, email, password);
      console.log("Login successful:", user);
    } catch (err) {
      console.error("Login error:", err.message);
    }
  };

  const logout = async () => {
  try {
    await signOut(auth);
    console.log("User logged out");
    
    setEmail("");
    setPassword("");
    setRole("");
  } catch (err) {
    console.error("Logout error:", err.message);
  }
};


  return (
    <div>
      <input
        type="email"
        placeholder="Email"
        onChange={(e) => setEmail(e.target.value)}
      /><br />
      <input
        type="password"
        placeholder="Password"
        onChange={(e) => setPassword(e.target.value)}
      /><br />

       <select value={role} onChange={(e) => setRole(e.target.value)}>
        <option value="" disabled>Select Role</option>
        <option value="student">Student</option>
        <option value="society-admin">Society Admin</option>
      </select>
      <button onClick={signup}>Signup</button>
      <button onClick={login}>Login</button>
      <button onClick={logout}>Logout</button>
    </div>
  );
}
