import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase";
import { Link, useNavigate } from "react-router-dom";
import { logout } from "../services/authService";

export default function NavBar() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login");
    } catch (error) {
      alert("Logout failed: " + error.message);
    }
  };

  return (
    <nav style={{ padding: "1rem", borderBottom: "1px solid #ddd" }}>
      <Link to="/" style={{ marginRight: "1rem" }}>Home</Link>

      {!user && (
        <>
          <Link to="/signup" style={{ marginRight: "1rem" }}>
            Sign Up
          </Link>
          <Link to="/login" style={{ marginRight: "1rem" }}>
            Login
          </Link>
        </>
      )}

      {user && (
        <>
          <Link to="/dashboard" style={{ marginRight: "1rem" }}>
            Dashboard
          </Link>
          <button onClick={handleLogout}>Logout</button>
        </>
      )}
    </nav>
  );
}
