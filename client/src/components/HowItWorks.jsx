import React from "react";
import { motion } from "framer-motion";
import { Users, CalendarCheck, Sparkles, HeartHandshake } from "lucide-react";
import img1 from "../assets/events.png";
import img2 from "../assets/routeing.png";
import img3 from "../assets/calender.png";
import img4 from "../assets/friends.png";

const features = [
  {
    icon: <Users className="w-6 h-6 text-blue-600" />,
    title: "One Platform for All Societies",
    description:
      "Manage, publish, and showcase your events without juggling multiple tools. Hubble brings it all together.",
    image: img1,
  },
  {
    icon: <CalendarCheck className="w-6 h-6 text-yellow-600" />,
    title: "Discover What Matters to You",
    description:
      "Find events tailored to your interests and never miss out on what's happening around campus.",
    image: img2,
  },
  {
    icon: <Sparkles className="w-6 h-6 text-purple-600" />,
    title: "Real-Time Engagement",
    description:
      "Interact with events as they unfold, RSVP instantly, and sync your calendar effortlessly.",
    image: img3,
  },
  {
    icon: <HeartHandshake className="w-6 h-6 text-pink-600" />,
    title: "Make Campus Life Unforgettable",
    description:
      "Join vibrant communities, meet new people, and turn every event into a memory.",
    image: img4,
  },
];

export default function HowItWorks() {
  return (
    <section className="relative py-5 px-6 md:px-12 bg-gradient-to-r from-yellow-50/90 to-blue-50/90 overflow-hidden">
      {/* Grid background behind content */}
      <div className="absolute inset-0 z-0 bg-[length:40px_40px] bg-[linear-gradient(to_right,#d4d4d8_1px,transparent_1px),linear-gradient(to_bottom,#d4d4d8_1px,transparent_1px)] opacity-20 pointer-events-none" />
     <motion.h2
            initial={{ y: -30, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="text-4xl text-center font-bold bg-gradient-to-r from-yellow-700 via-gray-600 to-blue-600 text-transparent bg-clip-text"
          >
            Why Hubble Works
          </motion.h2>
    
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="mt-4 text-center max-w-xl mx-auto text-gray-700"
          >
            Everything societies and students need to build vibrant, connected campus experiences.
          </motion.p>
      {/* Foreground content */}
      <div className="relative z-10 max-w-7xl mx-auto space-y-20">
        {features.map((item, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className={`flex flex-col md:flex-row items-center gap-12 ${
              index % 2 === 1 ? "md:flex-row-reverse" : ""
            }`}
          >
            {/* IMAGE */}
            <div className="md:w-1/2 flex justify-center">
              <img
                src={item.image}
                alt={item.title}
                className="w-[400px] md:w-[500px] object-contain"
              />
            </div>

            {/* TEXT BOX */}
            <div className="md:w-1/2">
              <div className="bg-white rounded-[40px] shadow-xl px-8 py-6 md:px-10 md:py-8">
                <div className="flex items-center gap-4 mb-4">
                  <div className="bg-gray-100 p-0 rounded-full shadow">
                    {item.icon}
                  </div>
                  <h3 className="text-xl md:text-2xl font-semibold text-gray-900">
                    {item.title}
                  </h3>
                </div>
                <p className="text-gray-600 text-base md:text-lg leading-relaxed">
                  {item.description}
                </p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
