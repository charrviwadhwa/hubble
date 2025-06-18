import React from "react";

export default function Home() {
  return (
    <div className="relative min-h-screen bg-white text-gray-800 overflow-hidden">
      {/* Gradient Background */}
      <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-gradient-to-br from-yellow-300 to-yellow-500 opacity-30 rounded-full blur-3xl z-0"></div>
      <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-gradient-to-tr from-blue-300 to-blue-500 opacity-30 rounded-full blur-3xl z-0"></div>

      {/* Content Wrapper */}
      <div className="relative z-10 flex flex-col min-h-screen">
        {/* Navbar */}
        <header className="px-6 md:px-20 py-4 flex justify-between items-center">
          <div className="text-2xl font-bold text-blue-700">Hubble</div>
          <div className="space-x-4">
            <button className="text-blue-700 font-medium hover:underline">Login</button>
            <button className="bg-yellow-400 text-black px-4 py-2 rounded hover:bg-yellow-500">Sign Up</button>
          </div>
        </header>

        {/* Hero Section */}
        <main className="flex-grow flex items-center justify-center px-6 md:px-20">
          <div className="max-w-6xl w-full flex flex-col md:flex-row items-center justify-between">
            <div className="md:w-1/2 mb-12 md:mb-0">
              <h1 className="text-4xl md:text-5xl font-bold mb-4 text-blue-900">
                Energize Campus Life
              </h1>
              <p className="text-lg md:text-xl mb-6">
                Discover, register, and engage with all college society events in one place.
              </p>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Search events..."
                  className="border border-gray-300 px-4 py-2 rounded w-full max-w-sm"
                />
                <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                  Search
                </button>
              </div>
            </div>
            <div className="md:w-1/2">
              <img
                src="https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.usatoday.com%2Fstory%2Fsponsor-story%2Fus-census-bureau%2F2020%2F03%2F05%2Fcollege-towns-rely-accurate-tally-both-and-off-campus-students%2F4962193002%2F&psig=AOvVaw2WtPaFl4zeVhE_CsWxCbwF&ust=1750325512416000&source=images&cd=vfe&opi=89978449&ved=0CBQQjRxqFwoTCMjDq-XU-o0DFQAAAAAdAAAAABAU"
                className="rounded-xl shadow-lg"
              />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
