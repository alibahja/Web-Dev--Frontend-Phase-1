import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FiSearch, FiArrowLeft, FiLayers, FiChevronRight } from "react-icons/fi";

// --- Advanced Game Card ---
const GameCard = ({ game, darkMode }) => {
  const navigate = useNavigate();
  return (
    <div
      onClick={() => navigate(`/games/${game.title}`)}
      className={`group relative w-full h-80 rounded-[2rem] overflow-hidden cursor-pointer transition-all duration-500 hover:scale-[1.02] border-2 ${
        darkMode 
          ? "bg-[#1E2740]/60 border-white/5 hover:border-[#5F7DB0]/50 shadow-2xl shadow-black/40" 
          : "bg-white border-gray-100 shadow-xl hover:shadow-2xl"
      }`}
    >
      {/* Dynamic Background Image with Overlay */}
      <div
        className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 group-hover:scale-110"
        style={{ backgroundImage: `url(${game.image})` }}
      >
        <div className={`absolute inset-0 bg-gradient-to-t ${
          darkMode ? "from-[#0A0F1F] via-[#0A0F1F]/70 to-transparent" : "from-black/80 via-black/20 to-transparent"
        }`} />
      </div>

      {/* Content Overlay */}
      <div className="relative h-full flex flex-col justify-end p-6 z-10">
        <div className="mb-2">
            <span className="px-3 py-1 text-[10px] uppercase tracking-widest font-bold bg-[#5F7DB0] text-white rounded-full">
                {game.title.split(' ')[0]}
            </span>
        </div>
        <h3 className="text-2xl font-bold text-white mb-2 leading-tight group-hover:text-[#5F7DB0] transition-colors">
            {game.title}
        </h3>
        <p className="text-sm text-gray-300 line-clamp-2 mb-4 opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300">
            {game.description}
        </p>

        <div className="flex items-center text-[#5F7DB0] font-semibold text-sm">
          <span>Explore Roadmap</span>
          <FiChevronRight className="ml-1 group-hover:ml-2 transition-all" />
        </div>
      </div>
    </div>
  );
};

// --- Main Page ---
const AllGames = ({ darkMode }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [visibleGames, setVisibleGames] = useState([]);
  const navigate = useNavigate();

  const games = [
    { title: "Master Web Development", description: "Deep dive into HTML, CSS, JavaScript, and the React Ecosystem.", image: "https://images.unsplash.com/photo-1587620962725-abab7fe55159?auto=format&fit=crop&q=80&w=800" },
    { title: "Data Scientist", description: "Master Python, Statistics, and Machine Learning algorithms.", image: "https://images.unsplash.com/photo-1551288049-bbda4833effb?auto=format&fit=crop&q=80&w=800" },
    { title: "History Explorer", description: "A journey through Ancient civilizations to Modern geopolitical shifts.", image: "https://images.unsplash.com/photo-1461360370896-922624d12aa1?auto=format&fit=crop&q=80&w=800" },
    { title: "Fitness & Nutrition", description: "Science-based approach to training, metabolic health, and recovery.", image: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&q=80&w=800" },
    { title: "AI Engineer Path", description: "Neural Networks, LLMs, and Scalable AI System Architecture.", image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=800" },
  ];

  useEffect(() => {
    const filtered = games.filter((game) =>
      game.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setVisibleGames(filtered);
  }, [searchQuery]);

  return (
    <div className={`min-h-screen w-full transition-colors duration-500 overflow-x-hidden ${
      darkMode ? "bg-[#0A0F1F] text-[#F0F4FA]" : "bg-[#F3F5F9] text-slate-900"
    }`}>
      
      {/* ADVANCED HERO SECTION */}
      <div className="relative h-[50vh] flex items-center justify-center overflow-hidden">
        {/* Animated Background Mesh - Using Home Theme Colors */}
        <div className={`absolute inset-0 opacity-20 ${darkMode ? 'bg-[#0A0F1F]' : 'bg-blue-100'}`}>
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[60%] rounded-full bg-[#5F7DB0] blur-[120px] animate-pulse" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[60%] rounded-full bg-indigo-900/40 blur-[120px] animate-pulse delay-700" />
        </div>

        <button
            onClick={() => navigate(-1)}
            className={`absolute top-8 left-8 z-30 p-3 rounded-2xl backdrop-blur-xl border transition-all ${
                darkMode ? "bg-[#1E2740]/40 border-white/10 hover:bg-white/10" : "bg-black/5 border-black/10 hover:bg-black/10"
            }`}
        >
            <FiArrowLeft size={20} />
        </button>

        <div className="relative z-10 text-center px-6">
          <div className="flex justify-center mb-6">
            <div className="px-4 py-1 rounded-full border border-[#5F7DB0]/30 bg-[#5F7DB0]/10 text-[#5F7DB0] text-xs font-bold tracking-widest uppercase">
                Interactive Learning
            </div>
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-r from-[#5F7DB0] via-white to-[#5F7DB0]">
            Game Library
          </h1>
          <p className={`max-w-2xl mx-auto text-lg md:text-xl font-light leading-relaxed ${darkMode ? 'text-gray-400' : 'text-slate-600'}`}>
            Select an industry-standard path and begin your journey. 
            Curated roadmaps designed for mastery.
          </p>
        </div>
      </div>

      {/* FLOATING SEARCH BOX */}
      <div className="max-w-3xl mx-auto px-6 -mt-12 mb-20 relative z-20">
        <div className={`relative flex items-center p-2 rounded-[2rem] border backdrop-blur-2xl shadow-2xl transition-all duration-300 focus-within:ring-2 focus-within:ring-[#5F7DB0]/50 ${
          darkMode ? "bg-[#1E2740]/90 border-white/10 text-white" : "bg-white/90 border-gray-200"
        }`}>
          <div className="pl-6 text-[#5F7DB0]">
            <FiSearch size={24} />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search for a skill or roadmap..."
            className="w-full px-4 py-4 bg-transparent outline-none text-lg font-medium placeholder:text-gray-500"
          />
        </div>
      </div>

      {/* GAMES GRID */}
      <div className="max-w-7xl mx-auto px-8 pb-32">
        <div className="flex items-center justify-between mb-10">
            <div className="flex items-center gap-2">
                <FiLayers className="text-[#5F7DB0]" />
                <h2 className="text-xl font-bold tracking-tight">Available Roadmaps</h2>
            </div>
            <div className="text-sm font-mono opacity-50">{visibleGames.length} Results</div>
        </div>

        {visibleGames.length === 0 ? (
          <div className="py-20 text-center border-2 border-dashed border-white/10 rounded-3xl">
            <p className="text-2xl font-light opacity-40">No matching paths found.</p>
          </div>
        ) : (
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {visibleGames.map((game, index) => (
              <div
                key={index}
                className="animate-fade-in-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <GameCard game={game} darkMode={darkMode} />
              </div>
            ))}
          </div>
        )}
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-up {
          animation: fade-in-up 0.6s ease forwards;
        }
      `}} />
    </div>
  );
};

export default AllGames;