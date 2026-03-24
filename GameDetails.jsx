import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { 
  FiArrowLeft, 
  FiUsers, 
  FiClock, 
  FiBarChart, 
  FiBookOpen, 
  FiCheckCircle, 
  FiPlus, 
  FiMinus 
} from "react-icons/fi";
import hero from "../assets/hero.png";

const GameDetails = ({ darkMode }) => {
  const navigate = useNavigate();
  const { id } = useParams();

  // Dummy data
  const game = {
    title: "Master Web Development",
    description:
      "Follow a structured roadmap from beginner to advanced and become a professional web developer. This journey takes you through HTML, CSS, JavaScript, and modern frameworks like React.",
    members: 1240,
    difficulty: "Intermediate",
    duration: "3 - 6 Months",
    topics: ["HTML5", "Tailwind CSS", "JavaScript ES6+", "React & Redux", "Node.js"],
    image: hero,
  };

  const [joined, setJoined] = useState(false);
  const [members, setMembers] = useState(game.members);

  const handleToggleJoin = () => {
    setMembers((prev) => (joined ? prev - 1 : prev + 1));
    setJoined(!joined);
  };

  return (
    <div className={`min-h-screen transition-colors duration-500 pb-20 ${
      darkMode ? "bg-[#050810] text-gray-100" : "bg-[#F3F5F9] text-slate-900"
    }`}>
      
      {/* 1. IMMERSIVE HERO SECTION */}
      <div className="relative h-[60vh] w-full overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-fixed bg-center scale-105 transition-transform duration-1000"
          style={{ backgroundImage: `url(${game.image})` }}
        >
          {/* Advanced Gradient Overlays */}
          <div className={`absolute inset-0 ${
            darkMode 
              ? "bg-gradient-to-b from-black/20 via-[#050810]/60 to-[#050810]" 
              : "bg-gradient-to-b from-black/30 via-transparent to-[#F3F5F9]"
          }`} />
        </div>

        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="absolute top-8 left-8 z-30 p-3 rounded-2xl backdrop-blur-xl border border-white/20 bg-white/10 hover:bg-white/20 transition-all text-white"
        >
          <FiArrowLeft size={24} />
        </button>

        {/* Hero Content */}
        <div className="relative z-10 h-full max-w-7xl mx-auto px-6 flex flex-col justify-center items-start">
          <div className="animate-fade-in-up">
            <span className="px-4 py-1.5 rounded-full bg-blue-600 text-white text-xs font-bold tracking-[0.2em] uppercase mb-4 inline-block shadow-lg shadow-blue-600/30">
              Path Overview
            </span>
            <h1 className="text-5xl md:text-7xl font-extrabold text-white mb-6 leading-tight drop-shadow-2xl">
              {game.title}
            </h1>
          </div>
        </div>
      </div>

      {/* 2. FLOATING INFO PANEL (The "Advanced" Look) */}
      <div className="max-w-7xl mx-auto px-6 -mt-32 relative z-20">
        <div className={`grid lg:grid-cols-3 gap-8`}>
          
          {/* Main Content Area */}
          <div className={`lg:col-span-2 p-8 md:p-12 rounded-[2.5rem] backdrop-blur-2xl border shadow-2xl transition-all ${
            darkMode 
              ? "bg-[#161B2D]/80 border-white/10" 
              : "bg-white/90 border-gray-100"
          }`}>
            <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
               About this Journey
            </h2>
            <p className={`text-lg leading-relaxed mb-8 opacity-80 ${darkMode ? 'text-gray-300' : 'text-slate-600'}`}>
              {game.description}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
              <StatCard icon={<FiUsers />} label="Learners" value={members.toLocaleString()} darkMode={darkMode} />
              <StatCard icon={<FiBarChart />} label="Level" value={game.difficulty} darkMode={darkMode} />
              <StatCard icon={<FiClock />} label="Time" value={game.duration} darkMode={darkMode} />
            </div>

            <h3 className="text-xl font-bold mb-4">Core Competencies</h3>
            <div className="flex flex-wrap gap-3">
              {game.topics.map((topic, i) => (
                <div key={i} className={`px-4 py-2 rounded-xl text-sm font-medium border ${
                  darkMode ? "bg-white/5 border-white/10" : "bg-gray-50 border-gray-200"
                }`}>
                  {topic}
                </div>
              ))}
            </div>
          </div>

          {/* Action Sidebar */}
          <div className="space-y-6">
            {/* Join Card */}
            <div className={`p-8 rounded-[2.5rem] border shadow-xl ${
              darkMode ? "bg-[#1E2740] border-white/5" : "bg-white border-gray-100"
            }`}>
              <h3 className="text-xl font-bold mb-4">Ready to Start?</h3>
              <p className="text-sm opacity-70 mb-8">Join thousands of others tracking their progress in this path.</p>
              
              <button
                onClick={handleToggleJoin}
                className={`w-full py-4 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all duration-300 ${
                  joined 
                    ? "bg-red-500/10 text-red-500 border border-red-500/20 hover:bg-red-500 hover:text-white" 
                    : "bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-600/30"
                }`}
              >
                {joined ? <><FiMinus /> Leave Path</> : <><FiPlus /> Join Path</>}
              </button>

              <button
                onClick={() => navigate(`/roadmap/${id}`)}
                className={`w-full mt-4 py-4 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all border ${
                  darkMode ? "bg-white/5 border-white/10 hover:bg-white/10" : "bg-slate-100 border-slate-200 hover:bg-slate-200"
                }`}
              >
                <FiBookOpen /> Open Roadmap
              </button>
            </div>

            {/* Quick Progress Card (Advanced Placeholder) */}
            <div className={`p-8 rounded-[2.5rem] border overflow-hidden relative ${
              darkMode ? "bg-gradient-to-br from-indigo-900/40 to-purple-900/40 border-white/5" : "bg-blue-50 border-blue-100"
            }`}>
                <div className="relative z-10">
                    <h3 className="font-bold flex items-center gap-2">
                        <FiCheckCircle className="text-blue-500" /> Professional Certification
                    </h3>
                    <p className="text-xs opacity-70 mt-2 italic">Earn a badge upon completion of all modules.</p>
                </div>
                <div className="absolute -right-4 -bottom-4 opacity-10">
                    <FiCheckCircle size={100} />
                </div>
            </div>
          </div>

        </div>
      </div>
      
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-up {
          animation: fade-in-up 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `}} />
    </div>
  );
};

// Sub-component for clean code
const StatCard = ({ icon, label, value, darkMode }) => (
  <div className={`p-5 rounded-2xl border flex items-center gap-4 ${
    darkMode ? "bg-white/5 border-white/10" : "bg-slate-50 border-slate-200"
  }`}>
    <div className="text-blue-500 text-2xl bg-blue-500/10 p-3 rounded-xl">
      {icon}
    </div>
    <div>
      <p className="text-[10px] uppercase tracking-wider font-bold opacity-50">{label}</p>
      <p className="font-bold">{value}</p>
    </div>
  </div>
);

export default GameDetails;