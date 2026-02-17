import React from "react";
import img1 from "../assets/events.png";
import img2 from "../assets/routeing.png";
import img3 from "../assets/calender.png";
import img4 from "../assets/friends.png";

export default function Features() {
  const features = [
    {
      title: "Discover Events",
      desc: "Find events by date, society, or category. Explore campus like never before.",
      link: "More about discovery →",
      img: img1,
      size: "col-span-2", // full-width
    },
    {
      title: "One-Click Registration",
      desc: "Register instantly for events without long forms.",
      link: "More about registration →",
      img: img2,
      size: "col-span-1", // left half
    },
    {
      title: "Smart Notifications",
      desc: "Stay updated with reminders and event changes in real time.",
      link: "More about notifications →",
      img: img3,
      size: "col-span-1", // right half
    },
    {
      title: "Collaboration Hub",
      desc: "Host joint events with other societies seamlessly.",
      link: "More about collaboration →",
      img: img4,
      size: "col-span-1", // left half
    },
    {
      title: "Event Insights",
      desc: "Get reports on attendance, engagement, and feedback.",
      link: "More about insights →",
      img: img1,
      size: "col-span-1", // right half
    },
    {
      title: "Campus-Wide Access",
      desc: "One platform for every society on campus.",
      link: "More about campus access →",
      img: img2,
      size: "col-span-1", // CTA style card
    },
  ];

  return (
    <section className="bg-[#f9f8f6] py-20">
      <div className="max-w-6xl mx-auto px-6">
        {/* Heading */}
        <h2 className="text-5xl font-extrabold text-center text-[#111111] mb-6">
          It’s not magic. <br /> It’s Hubble.
        </h2>
        <p className="text-lg text-gray-500 text-center mb-16 max-w-2xl mx-auto">
          Here’s how Hubble makes discovering and managing events effortless and fun.
        </p>

        {/* Grid */}
        <div className="grid md:grid-cols-2 gap-6 auto-rows-fr">
          {features.map((f, i) => (
            <div
              key={i}
              className={`bg-[#fdfdfc] rounded-xl p-10 flex flex-col justify-between transition ${f.size}`}
            >
              <div>
                <img
                  src={f.img}
                  alt={f.title}
                  className="h-48 w-auto mb-8 object-contain"
                />
                <h3 className="text-2xl font-bold text-[#111111] mb-3">
                  {f.title}
                </h3>
                <p className="text-gray-600 mb-4">{f.desc}</p>
              </div>
              <a
                href="#"
                className="text-gray-700 font-medium hover:underline"
              >
                {f.link}
              </a>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-16">
          <button className="bg-black text-[#d4ff1e] px-8 py-4 rounded-full text-lg font-semibold hover:bg-gray-900 transition">
            ▶️ Play demo
          </button>
        </div>
      </div>
    </section>
  );
}
