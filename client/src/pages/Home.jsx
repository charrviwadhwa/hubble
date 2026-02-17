import React from "react";
import Navbar from "../components/Navbar";
import { motion } from "framer-motion";

import img1 from "../assets/hello2.jpg";
import img2 from "../assets/hello3.jpg";
import img3 from "../assets/hello4.jpg";
import Features from "../components/Features";

export default function Home() {
  return (
    <div className="relative bg-[#fefaf5] overflow-hidden">
      {/* Top yellow arc (SVG for smoother curve) */}
      <div className="absolute inset-x-0 top-0 -z-10">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1440 320"
          className="w-full h-56"
        >
          <path
            fill="#facc15"
            d="M0,224L48,192C96,160,192,96,288,85.3C384,75,480,117,576,128C672,139,768,117,864,117.3C960,117,1056,139,1152,165.3C1248,192,1344,224,1392,240L1440,256L1440,0L1392,0C1344,0,1248,0,1152,0C1056,0,960,0,864,0C768,0,672,0,576,0C480,0,384,0,288,0C192,0,96,0,48,0L0,0Z"
          />
        </svg>
      </div>

      <Navbar />

      {/* Hero Section */}
      <div className="relative text-center px-6 pt-28 pb-24">
        {/* Background grid with perspective */}
        <div className="absolute inset-0 -z-10 flex items-end justify-center opacity-30">
          <div className="w-full h-[500px] bg-[linear-gradient(to_right,rgba(0,0,0,0.08)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,0,0,0.08)_1px,transparent_1px)] [background-size:50px_50px] transform perspective-[1200px] rotateX-45 origin-top" />
        </div>

        {/* Tiny doodle details */}
        {/* Sparkles (left side) */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="absolute left-16 top-32 w-8 h-8 text-black opacity-70"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 2v4m0 12v4m10-10h-4M6 12H2m15.364-7.364l-2.828 2.828M7.464 16.536l-2.828 2.828M16.536 16.536l2.828 2.828M7.464 7.464L4.636 4.636"
          />
        </svg>

        {/* Curved arrow (right side) */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="absolute right-20 top-40 w-16 h-16 text-black"
          fill="none"
          viewBox="0 0 100 100"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M10 80 C 40 10, 70 10, 90 80" />
        </svg>

        {/* Badge */}
        <motion.span
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-block bg-white px-4 py-1 rounded-full shadow text-sm font-medium mb-6"
        >
          ⭐ Over 1k happy users
        </motion.span>

        {/* Heading */}
        <motion.h1
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="text-5xl md:text-6xl font-extrabold text-gray-900 mb-4 leading-tight"
        >
          Regulate your mood <br /> with our videos
        </motion.h1>

        {/* Subtext */}
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="text-lg text-gray-600 max-w-2xl mx-auto mb-10"
        >
          Our pre-recorded sessions contain all the essentials to help you fix
          your mood in a few sessions.
        </motion.p>

        {/* Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.6 }}
          className="flex justify-center gap-4 mb-16"
        >
          <button className="bg-black text-white px-6 py-3 rounded-xl hover:bg-gray-800 flex items-center gap-2">
            ▶ Play Video
          </button>
          <button className="bg-white border border-gray-300 px-6 py-3 rounded-xl hover:bg-gray-100">
            Learn More
          </button>
        </motion.div>

        {/* Floating Cards */}
        <div className="flex justify-center gap-6 relative">
          <motion.img
            src={img1}
            alt="Card 1"
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.6 }}
            className="w-56 h-72 md:w-60 md:h-80 rounded-3xl shadow-lg object-cover"
          />
          <motion.img
            src={img2}
            alt="Card 2"
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 1, duration: 0.6 }}
            className="w-56 h-72 md:w-60 md:h-80 rounded-3xl shadow-lg object-cover"
          />
          <motion.img
            src={img3}
            alt="Card 3"
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 1.2, duration: 0.6 }}
            className="w-56 h-72 md:w-60 md:h-80 rounded-3xl shadow-lg object-cover"
          />
        </div>
      </div>

      {/* Features Section */}
      <Features />
    </div>
  );
}
