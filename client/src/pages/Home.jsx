import React from "react";
import Navbar from "../components/Navbar";
import { motion } from "framer-motion";
import HowItWorks from "../components/HowItWorks";
import img1 from "../assets/events.png";
import img2 from "../assets/routeing.png";
import img3 from "../assets/friends.png";

export default function Home() {
  return (
    <div className="relative bg-[#fefaf5]">
      {/* Top yellow arc */}
      <div className="absolute inset-x-0 top-0 h-64 bg-yellow-400 rounded-b-[50%] -z-10" />

      <Navbar />

      {/* Hero Section */}
      <div className="relative text-center px-6 pt-32 pb-24 overflow-hidden">
        {/* Grid floor effect */}
        <div className="absolute inset-0 -z-10 flex items-end justify-center opacity-30">
          <div className="w-full h-[400px] bg-[radial-gradient(circle_at_center,rgba(0,0,0,0.2)_1px,transparent_1px)] [background-size:40px_40px]" />
        </div>

        {/* Badge */}
        <motion.span
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-block bg-white px-4 py-1 rounded-full shadow text-sm font-medium mb-6"
        >
          🎓 Over 1k happy users
        </motion.span>

        {/* Heading */}
        <motion.h1
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="text-6xl font-extrabold text-gray-900 mb-4"
        >
          Regulate your mood <br /> with our videos
        </motion.h1>

        {/* Subtext */}
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="text-lg text-gray-600 max-w-xl mx-auto mb-8"
        >
          Our pre-recorded sessions contain all the essentials to help you fix your mood in a few sessions.
        </motion.p>

        {/* Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.6 }}
          className="flex justify-center gap-4 mb-16"
        >
          <button className="bg-black text-white px-6 py-3 rounded-xl hover:bg-gray-800 flex items-center gap-2">
            ▶️ Play Video
          </button>
          <button className="bg-white border border-gray-300 px-6 py-3 rounded-xl hover:bg-gray-100">
            Learn More
          </button>
        </motion.div>

        {/* Floating Cards */}
        <div className="flex justify-center gap-6 mt-12">
          <motion.img
            src={img1}
            alt="Card 1"
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.6 }}
            className="w-60 h-80 rounded-3xl shadow-lg object-cover"
          />
          <motion.img
            src={img2}
            alt="Card 2"
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 1, duration: 0.6 }}
            className="w-60 h-80 rounded-3xl shadow-lg object-cover"
          />
          <motion.img
            src={img3}
            alt="Card 3"
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 1.2, duration: 0.6 }}
            className="w-60 h-80 rounded-3xl shadow-lg object-cover"
          />
        </div>
      </div>

      {/* Features Section */}
      <HowItWorks />
    </div>
  );
}
