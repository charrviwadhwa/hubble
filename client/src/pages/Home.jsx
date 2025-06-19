import React from "react";
import Navbar from "../components/Navbar";
import { motion } from "framer-motion";

export default function Home() {
  return (
    <div>
      {/* Grid Background */}
      <div className="absolute inset-0 z-0 bg-[length:40px_40px] bg-[linear-gradient(to_right,#000000_1px,transparent_1px),linear-gradient(to_bottom,#000000_1px,transparent_1px)] opacity-50 pointer-events-none" />

      <div className="relative z-10 min-h-screen bg-gradient-to-r from-yellow-50/90 to-blue-50/90">
        <Navbar />

        <div className="pt-32 text-center px-6">
          {/* Tag */}
          <motion.span
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-block bg-white px-4 py-1 rounded-full shadow text-sm font-medium mb-6"
          >
            🎓 The Future of University Event Management
          </motion.span>

          {/* Heading */}
          <motion.h1
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="text-5xl font-bold bg-gradient-to-r from-yellow-700 via-gray-600 to-blue-600 text-transparent bg-clip-text"
          >
            Connect. Discover. <br /> Experience.
          </motion.h1>

          {/* Paragraph */}
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="mt-6 text-gray-700 max-w-2xl mx-auto"
          >
            Hubble is the centralized platform that streamlines event management and participation across university societies.
            Discover events, connect with communities, and enhance your campus experience.
          </motion.p>

          {/* Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
            className="mt-8 flex justify-center gap-4"
          >
            <button className="bg-black text-white px-6 py-2 rounded-md hover:bg-gray-800">
              Start Exploring Events
            </button>
            <button className="bg-white border border-gray-300 px-6 py-2 rounded-md hover:bg-gray-100">
              Create Your Society
            </button>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
