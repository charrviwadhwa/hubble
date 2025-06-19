// src/components/Navbar.jsx
import React from 'react';
import { Link } from 'react-router-dom';
export default function Navbar() {
  return(
  <nav className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 w-[95%] md:w-[90%] lg:w-[80%] bg-white rounded-2xl shadow-md px-6 py-3 flex justify-between items-center">
      {/* Logo */}
      <div className="flex items-center space-x-2">
        <div className="bg-gradient-to-r from-blue-500 to-yellow-400 text-white font-bold px-2 py-1 rounded-lg">H</div>
        <span className="font-bold text-xl text-blue-900">Hubble</span>
      </div>

      {/* Links */}
      <ul className="hidden md:flex gap-6 text-gray-700 font-medium">
        <li><a href="#features" className="hover:text-blue-600">Features</a></li>
        <li><a href="#students" className="hover:text-blue-600">For Students</a></li>
        <li><a href="#societies" className="hover:text-blue-600">For Societies</a></li>
      </ul>

      {/* Buttons */}
      <div className="flex gap-3">
       <Link to="/Login">
          <button className="border border-gray-300 rounded-md px-4 py-1 hover:bg-gray-100 font-medium">Sign In</button>
        </Link>

        <Link to="/Signup">
          <button className="bg-black text-white rounded-md px-4 py-1 font-medium hover:bg-gray-800">Get Started</button>
        </Link>
      </div>
    </nav>
  );
}
