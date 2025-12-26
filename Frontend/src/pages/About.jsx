import React from "react";
import { Link } from "react-router-dom";
import { FaUtensils, FaPenNib, FaLayerGroup, FaCode } from "react-icons/fa";

const About = () => {
  return (
    <div className="min-h-screen text-white flex flex-col pt-20">
      {/* Hero Section */}
      <div className="text-center py-16 px-4 sm:px-6 relative overflow-hidden">
        {/* Background Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 bg-indigo-500/20 blur-[120px] rounded-full"></div>
        
        <h1 className="text-4xl sm:text-5xl md:text-7xl font-extrabold mb-6 leading-tight tracking-tight">
          Master the Art of <br />
          <span className="bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent">
            Culinary Creation
          </span>
        </h1>
        <p className="text-base sm:text-lg md:text-xl mb-10 max-w-2xl mx-auto text-gray-400 leading-relaxed">
          Recipe Hub isn’t just a digital cookbook. It’s a community-driven platform where 
          flavors meet technology. Discover, create, and share recipes with food lovers worldwide.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Link
            to="/create-recipe"
            className="px-8 py-3 bg-white text-black hover:bg-gray-200 rounded-full font-bold transition-all active:scale-95 shadow-lg shadow-white/10"
          >
            Start Creating
          </Link>
          <Link
            to="/recipes"
            className="px-8 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full font-bold transition-all"
          >
            Browse Gallery
          </Link>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-6 py-16 w-full">
        <div className="grid gap-8 md:grid-cols-3">
          {[
            {
              title: "Discover Recipes",
              desc: "Explore a curated library of global cuisines filtered by your dietary preferences.",
              icon: <FaUtensils className="text-blue-400" />,
            },
            {
              title: "Create & Share",
              desc: "Our intuitive editor lets you upload high-res images and step-by-step guides effortlessly.",
              icon: <FaPenNib className="text-purple-400" />,
            },
            {
              title: "AI Integration",
              desc: "Leverage modern tech to organize and categorize your pantry like a pro chef.",
              icon: <FaLayerGroup className="text-pink-400" />,
            },
          ].map((feature, idx) => (
            <div
              key={idx}
              className="group p-8 rounded-3xl bg-white/5 border border-white/10 hover:border-white/20 transition-all hover:-translate-y-2"
            >
              <div className="text-3xl mb-4 group-hover:scale-110 transition-transform duration-300">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
              <p className="text-gray-400 text-sm leading-relaxed">{feature.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Meet the Creator Section */}
      <div className="max-w-5xl mx-auto px-6 py-20 w-full">
        <div className="p-8 md:p-12 rounded-[2rem] bg-gradient-to-br from-gray-900 to-black border border-white/10 relative">
          <div className="flex flex-col md:flex-row items-center gap-10">
            <div className="w-32 h-32 md:w-40 md:h-40 rounded-full bg-gradient-to-tr from-blue-500 to-purple-600 p-1">
               <div className="w-full h-full rounded-full bg-black flex items-center justify-center text-4xl font-bold">
                 VS
               </div>
            </div>
            <div className="text-center md:text-left">
              <h2 className="text-sm font-bold text-blue-400 uppercase tracking-widest mb-2">Developed By</h2>
              <h3 className="text-3xl md:text-4xl font-bold mb-4 text-white">Vikas Sharma</h3>
              <p className="text-gray-400 text-sm md:text-base max-w-lg mb-6 leading-relaxed">
                Vikas is a passionate Full-Stack Developer dedicated to building clean, 
                high-performance web applications. Recipe Hub was born out of a desire to 
                simplify kitchen management through elegant code and user-centric design.
              </p>
              <div className="flex justify-center md:justify-start gap-4">
                <span className="flex items-center gap-2 text-xs text-gray-500 border border-white/10 px-3 py-1 rounded-full bg-white/5">
                  <FaCode /> Full-Stack Architect
                </span>
                <span className="flex items-center gap-2 text-xs text-gray-500 border border-white/10 px-3 py-1 rounded-full bg-white/5">
                  React + Node.js
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;