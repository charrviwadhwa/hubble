import React from "react";
import { motion } from "framer-motion";
import { Lightbulb, Users, CalendarCheck, Sparkles } from "lucide-react";

const features = [
  {
    icon: <Users className="w-6 h-6 text-blue-600" />,
    title: "Society Management",
    description:
      "Create and manage your society profiles, events, and announcements with intuitive tools tailored for student communities.",
  },
  {
    icon: <CalendarCheck className="w-6 h-6 text-yellow-600" />,
    title: "Smart Event Discovery",
    description:
      "Students can easily browse, register, and sync upcoming events with personalized recommendations and reminders.",
  },
  {
    icon: <Sparkles className="w-6 h-6 text-purple-600" />,
    title: "Boost Campus Culture",
    description:
      "Empower vibrant campus life by bringing all societies and their happenings into one immersive space.",
  },
  {
    icon: <Lightbulb className="w-6 h-6 text-green-600" />,
    title: "Insights & Engagement",
    description:
      "Track engagement, get event insights, and understand what clicks with students – helping societies grow smarter.",
  },
];

export default function Features() {
  return (
    <section id="features" className="mt-32 pb-20 px-6">
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto mt-16">
        {features.map((feature, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.2 }}
            viewport={{ once: true }}
            className="bg-white rounded-2xl shadow-md p-6 hover:shadow-lg transition"
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="p-2 bg-gray-100 rounded-full">{feature.icon}</div>
              <h3 className="text-xl font-semibold">{feature.title}</h3>
            </div>
            <p className="text-gray-600">{feature.description}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
