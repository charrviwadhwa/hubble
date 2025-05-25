import { useState } from "react";
import { auth } from "../firebase";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";

export default function AuthPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const signup = async () => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    const token = await user.getIdToken();
    console.log("Signup successful", user);


    // Send data to MongoDB via backend
    await fetch("http://localhost:5000/api/users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify({
        email: user.email,
        uid: user.uid,
      }),
    });

    console.log("User stored in MongoDB ✅");
  } catch (err) {
    console.error("Signup error:", err.message);
  }
};


  const login = async () => {
    try {
      const user = await signInWithEmailAndPassword(auth, email, password);
      console.log("✅ Login successful:", user);
    } catch (err) {
      console.error("❌ Login error:", err.message);
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
      <button onClick={signup}>Signup</button>
      <button onClick={login}>Login</button>
    </div>
  );
}
