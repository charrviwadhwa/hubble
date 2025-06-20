import React from "react";
import { motion } from "framer-motion";
import img1 from "../assets/events.png";
import img2 from "../assets/routeing.png";
import img3 from "../assets/calender.png";
import img4 from "../assets/friends.png";

const features = [
  {
    title: "One Platform for All Societies",
    description: "Manage, publish, and showcase your events without juggling multiple tools. Hubble brings it all together.",
    image: img1,
  },
  {
    title: "Discover What Matters to You",
    description: "Find events tailored to your interests and never miss out on what's happening around campus.",
    image: img2,
  },
  {
    title: "Real-Time Engagement",
    description: "Interact with events as they unfold, RSVP instantly, and sync your calendar effortlessly.",
    image: img3,
  },
  {
    title: "Make Campus Life Unforgettable",
    description: "Join vibrant communities, meet new people, and turn every event into a memory.",
    image: img4,
  },
];

export default function FeaturesAbsurd() {
  return (
    <div className="px-6 font-serifDisplay md:px-12 py-24 max-w-7xl mx-auto">
      {features.map((item, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className={`flex flex-col md:flex-row items-center mb-24 ${
            index % 2 === 1 ? "md:flex-row-reverse" : ""
          }`}
        >
          <img
            src={item.image}
            alt={item.title}
            className="w-72 h-72 object-contain mx-auto md:mx-0"
          />
          <div className="md:w-1/2 mt-8 md:mt-0 md:px-12 text-center md:text-left">
            <h3 className="text-3xl font-serifDisplay mb-4 text-gray-800">
              {item.title}
            </h3>
            <p className="text-gray-600 leading-relaxed">{item.description}</p>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
