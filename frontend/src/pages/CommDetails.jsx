import { useLocation, useNavigate, Link } from "react-router-dom";
import { useState } from "react";

const CommunityDetail = ({ darkMode, setDarkMode }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const currentUser = "Ali"; // simulate logged in user

  // Fallback data structure if location.state is missing
  const [community, setCommunity] = useState(location.state || {
    id: 0,
    name: "General Readers",
    description: "Welcome to the central hub for all book lovers.",
    category: "General",
    admin: "System",
    members: ["Ali", "Sara", "John"]
  });

  if (!community) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${darkMode ? 'bg-[#0A0F1F] text-white' : 'bg-[#F8F9FC]'}`}>
        <h2 className="text-2xl font-bold">Community not found.</h2>
      </div>
    );
  }

  const isAdmin = community.admin === currentUser;
  const isMember = community.members.includes(currentUser);

  const handleJoin = () => {
    if (!isMember) {
      setCommunity({
        ...community,
        members: [...community.members, currentUser]
      });
    }
  };
 const handleLeave = () => {
  if (isMember) {
    // Note: Usually, you'd prevent an Admin from leaving without transferring ownership
    // but for now, we'll allow it.
    setCommunity({
      ...community,
      members: community.members.filter((m) => m !== currentUser)
    });
  }
};

  const removeMember = (member) => {
    setCommunity({
      ...community,
      members: community.members.filter((m) => m !== member)
    });
  };

  return (
    <div className={`min-h-screen transition-colors duration-500 ${
      darkMode ? 'bg-[#0A0F1F] text-[#F0F4FA]' : 'bg-[#F8F9FC] text-[#1F2937]'
    }`}>
      
      {/* --- NAVIGATION BAR --- */}
      <nav className={`fixed top-0 left-0 right-0 z-[100] backdrop-blur-md border-b transition-all duration-300 ${
        darkMode 
          ? 'bg-[#1E2740]/80 border-[#2D3748]' 
          : 'bg-white/90 border-[#E2E8F0] shadow-sm'
      }`}>
        <div className="max-w-7xl mx-auto px-8 h-20 flex items-center justify-between">
          <div className="flex items-center space-x-10">
            <span className={`font-serif italic font-black text-2xl tracking-tighter ${darkMode ? 'text-[#5F7DB0]' : 'text-[#2C3E68]'}`}>
              Library
            </span>
            <div className="hidden md:flex space-x-6 font-bold text-sm">
              <Link to="/" className="hover:opacity-70 transition">Home</Link>
              <Link to="/groups" className="opacity-50 hover:opacity-100 transition">All Communities</Link>
            </div>
          </div>

          <div className="flex items-center space-x-6">
            <button
              onClick={() => setDarkMode(!darkMode)}
              className={`p-2.5 rounded-full transition-all hover:rotate-12 ${
                darkMode ? 'bg-[#5F7DB0]/20 text-yellow-400' : 'bg-[#2C3E68]/10 text-gray-600'
              }`}
            >
              {darkMode ? "☀️" : "🌙"}
            </button>
          </div>
        </div>
      </nav>

      {/* --- MAIN CONTENT --- */}
      <main className="max-w-6xl mx-auto pt-32 pb-20 px-6">
        
        {/* HERO SECTION */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-end mb-16">
          <div className="lg:col-span-2 space-y-6">
            <span className={`inline-block text-xs uppercase tracking-[0.2em] font-black px-4 py-1.5 rounded-full ${
              darkMode ? 'bg-[#5F7DB0]/20 text-[#5F7DB0]' : 'bg-[#2C3E68]/10 text-[#2C3E68]'
            }`}>
              {community.category}
            </span>

            <h1 className="text-5xl md:text-7xl font-black tracking-tight leading-tight">
              {community.name}
            </h1>

            <p className={`text-xl leading-relaxed max-w-2xl font-medium ${
              darkMode ? 'text-[#A0AEC0]' : 'text-[#4A5568]'
            }`}>
              {community.description}
            </p>

            <div className="flex items-center space-x-4 pt-4">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-white ${
                darkMode ? 'bg-[#5F7DB0]' : 'bg-[#2C3E68]'
              }`}>
                {community.admin[0]}
              </div>
              <div>
                <p className="text-xs uppercase tracking-widest font-black opacity-40">Founded by</p>
                <p className="font-bold">{community.admin} {isAdmin && "(You)"}</p>
              </div>
            </div>
          </div>
{/* ACTION CARDS */}
<div className="space-y-4">
  {!isMember ? (
    <button
      onClick={handleJoin}
      className={`w-full py-5 rounded-2xl font-black text-lg text-white shadow-2xl transition-all hover:-translate-y-1 active:scale-95 ${
        darkMode ? 'bg-[#5F7DB0]' : 'bg-[#2C3E68]'
      }`}
    >
      Join this Hub
    </button>
  ) : (
    <button
      onClick={handleLeave}
      className={`w-full py-5 rounded-2xl font-black text-center border-2 border-dashed transition-all duration-300 group hover:border-red-500 hover:text-red-500 hover:bg-red-500/5 ${
        darkMode 
          ? 'border-[#5F7DB0]/40 text-[#5F7DB0]' 
          : 'border-[#2C3E68]/40 text-[#2C3E68]'
      }`}
    >
      <span className="group-hover:hidden">✓ Joined</span>
      <span className="hidden group-hover:inline">Leave Community</span>
    </button>
  )}

  <button
  onClick={() => navigate(`/comments/groups/${community.id}`, { 
    state: { type: "community", data: community } 
  })}
  className={`w-full py-5 rounded-2xl border-2 font-black text-lg transition-all hover:shadow-xl active:scale-95 ${
    darkMode 
      ? 'border-[#5F7DB0] text-[#5F7DB0] hover:bg-[#5F7DB0] hover:text-white' 
      : 'border-[#2C3E68] text-[#2C3E68] hover:bg-[#2C3E68] hover:text-white'
  }`}
>
    Discussion Board
  </button>
</div>
        </div>

        {/* DASHBOARD GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* MEMBERS LIST */}
          <div className={`lg:col-span-2 rounded-[2.5rem] p-10 border transition-all ${
            darkMode ? 'bg-[#1E2740] border-[#2D3748]' : 'bg-white border-[#E2E8F0] shadow-xl shadow-blue-900/5'
          }`}>
            <div className="flex justify-between items-center mb-10">
              <h2 className="text-3xl font-black">Members List</h2>
              <span className="text-sm font-bold opacity-40 uppercase tracking-widest">
                {community.members.length} total
              </span>
            </div>

            <div className="divide-y divide-gray-500/10">
              {community.members.map((member, index) => (
                <div
                  key={index}
                  className="flex justify-between items-center py-5 group transition-all"
                >
                  <div className="flex items-center space-x-4">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold transition-transform group-hover:scale-110 ${
                      darkMode ? 'bg-[#0A0F1F] text-[#5F7DB0]' : 'bg-gray-100 text-[#2C3E68]'
                    }`}>
                      {member[0]}
                    </div>
                    <div>
                      <span className="font-bold text-lg">{member}</span>
                      {member === community.admin && (
                        <span className="ml-3 text-[10px] px-2 py-0.5 rounded-md bg-yellow-400 text-black font-black uppercase tracking-tighter">
                          Host
                        </span>
                      )}
                    </div>
                  </div>

                  {isAdmin && member !== community.admin && (
                    <button
                      onClick={() => removeMember(member)}
                      className="text-xs font-black uppercase tracking-widest text-red-500 opacity-0 group-hover:opacity-100 transition-opacity hover:underline"
                    >
                      Remove
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* SIDEBAR WIDGETS */}
          <div className="space-y-8">
            <div className={`p-8 rounded-[2.5rem] border ${
              darkMode ? 'bg-[#1E2740] border-[#2D3748]' : 'bg-white border-[#E2E8F0]'
            }`}>
              <h3 className="text-sm font-black uppercase tracking-widest mb-6 opacity-40 text-[#5F7DB0]">Hub Rules</h3>
              <ul className="space-y-4 text-sm font-medium">
                <li className="flex items-start space-x-3">
                  <span className="text-[#5F7DB0]">01.</span>
                  <span>Be respectful to all members.</span>
                </li>
                <li className="flex items-start space-x-3">
                  <span className="text-[#5F7DB0]">02.</span>
                  <span>No spoilers without tags.</span>
                </li>
                <li className="flex items-start space-x-3">
                  <span className="text-[#5F7DB0]">03.</span>
                  <span>Stay on topic (Mostly).</span>
                </li>
              </ul>
            </div>

            <div className={`p-8 rounded-[2.5rem] border text-center transition-all hover:scale-[1.02] ${
              darkMode ? 'bg-gradient-to-br from-[#1E2740] to-[#5F7DB0]/20 border-[#2D3748]' : 'bg-gradient-to-br from-white to-[#2C3E68]/5 border-[#E2E8F0]'
            }`}>
              <p className="text-4xl mb-2">📢</p>
              <h4 className="font-black mb-2">Want to lead?</h4>
              <p className="text-xs opacity-60 leading-relaxed">Contact system admins to request additional moderator permissions.</p>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
};

export default CommunityDetail;