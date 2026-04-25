
import { useLocation, useNavigate, Link, useParams } from "react-router-dom";
import { useState, useEffect, useMemo } from "react";
import api from "../api/client";
import { motion as M, AnimatePresence } from "framer-motion";
import CustomAlert from "./CustomAlert";

const CommunityDetail = ({ darkMode }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { id } = useParams();

  const stored = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem("user") || "null");
    } catch {
      return null;
    }
  }, []);
  const currentUserId = stored?._id ?? stored?.id;
  const currentUserName = stored?.full_name ?? stored?.name ?? stored?.username ?? "";

  const [community, setCommunity] = useState(location.state || null);
  const [loading, setLoading] = useState(!location.state);
  const [error, setError] = useState("");
  const [banner, setBanner] = useState("");
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [alertPayload, setAlertPayload] = useState({ show: false, title: "", message: "", type: "success" });

  useEffect(() => {
    let cancel = false;
    (async () => {
      setLoading(true);
      setError("");
      try {
        const { data } = await api.get(`/api/communities/${id}`);
        const c = data.community ?? data;
        if (cancel) return;
        const membersRaw = c.members ?? c.memberList ?? [];
        const members = Array.isArray(membersRaw)
          ? membersRaw.map((m) =>
              typeof m === "string"
                ? { id: m, name: m, isAdmin: false }
                : {
                    id: m._id ?? m.id ?? m.userId,
                    name: m.name ?? m.full_name ?? m.username ?? "Member",
                    isAdmin: m.role === "admin" || m.isAdmin,
                  }
            )
          : [];
        setCommunity({
          id: c._id ?? c.id ?? id,
          name: c.name,
          description: c.description ?? "",
          category: c.category ?? "",
          admin: c.admin?.name ?? c.adminName ?? c.createdBy ?? "",
          adminId: c.admin?._id ?? c.adminId ?? c.creatorId,
          members,
        });
      } catch (e) {
        if (!cancel) {
          setError(e.response?.data?.message || e.response?.data?.error || "Community not found.");
          if (!location.state) setCommunity(null);
        }
      } finally {
        if (!cancel) setLoading(false);
      }
    })();
    return () => { cancel = true; };
    // Intentionally omit location.state: seed from state is only for first paint; id drives API.
  }, [id]); // eslint-disable-line react-hooks/exhaustive-deps

  if (loading && !community) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${darkMode ? 'bg-[#0A0F1F] text-white' : 'bg-[#F8F9FC]'}`}>
        <p className="font-semibold animate-pulse">Loading…</p>
      </div>
    );
  }

  if (!community) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${darkMode ? 'bg-[#0A0F1F] text-white' : 'bg-[#F8F9FC]'}`}>
        <h2 className="text-2xl font-bold">{error || "Community not found."}</h2>
      </div>
    );
  }

  const isAdmin =
    (community.adminId && currentUserId && String(community.adminId) === String(currentUserId)) ||
    (community.admin && currentUserName && community.admin === currentUserName);

  const isMember = community.members?.some(
    (m) =>
      String(m.id) === String(currentUserId) ||
      m.name === currentUserName
  );

  const requireLogin = () => navigate("/login", { state: { from: `/groups/${id}` } });

  const handleJoin = async () => {
    if (!localStorage.getItem("token")) return requireLogin();
    try {
      await api.post("/api/communities/join", { communityId: community.id });
      setBanner("Joined community.");
      const { data } = await api.get(`/api/communities/${id}`);
      const c = data.community ?? data;
      const membersRaw = c.members ?? c.memberList ?? [];
      const members = Array.isArray(membersRaw)
        ? membersRaw.map((m) =>
            typeof m === "string"
              ? { id: m, name: m, isAdmin: false }
              : {
                  id: m._id ?? m.id ?? m.userId,
                  name: m.name ?? m.full_name ?? m.username ?? "Member",
                  isAdmin: m.role === "admin" || m.isAdmin,
                }
          )
        : [];
      setCommunity((prev) => ({ ...prev, members }));
    } catch (e) {
      setBanner(e.response?.data?.message || e.response?.data?.error || "Could not join.");
    }
  };

  const handleLeave = async () => {
    if (!localStorage.getItem("token")) return requireLogin();
    try {
      await api.post("/api/communities/leave", { communityId: community.id });
      setBanner("Left community.");
      const { data } = await api.get(`/api/communities/${id}`);
      const c = data.community ?? data;
      const membersRaw = c.members ?? c.memberList ?? [];
      const members = Array.isArray(membersRaw)
        ? membersRaw.map((m) =>
            typeof m === "string"
              ? { id: m, name: m, isAdmin: false }
              : {
                  id: m._id ?? m.id ?? m.userId,
                  name: m.name ?? m.full_name ?? m.username ?? "Member",
                  isAdmin: m.role === "admin" || m.isAdmin,
                }
          )
        : [];
      setCommunity((prev) => ({ ...prev, members }));
    } catch (e) {
      setBanner(e.response?.data?.message || e.response?.data?.error || "Could not leave.");
    }
  };

  const removeMember = async (member) => {
    try {
      await api.delete("/api/communities/member", {
        data: { communityId: community.id, memberId: member.id },
      });
      setCommunity({
        ...community,
        members: community.members.filter((m) => m.id !== member.id),
      });
      setBanner("Member removed.");
    } catch (e) {
      setBanner(e.response?.data?.message || e.response?.data?.error || "Could not remove member.");
    }
  };

  const showAlert = (title, message, type = "success") => {
    setAlertPayload({ show: true, title, message, type });
};

   const handleDeleteCommunity = async () => {
    if (!localStorage.getItem("token")) return requireLogin();
    setShowConfirmModal(true);
};

const confirmDelete = async () => {
    setShowConfirmModal(false);
    try {
        await api.delete(`/api/communities/${community.id}`);
        showAlert("Community Deleted", "Community deleted successfully. Redirecting...", "success");
        setTimeout(() => {
            navigate("/groups");
        }, 1500);
    } catch (e) {
        showAlert("Delete Failed", e.response?.data?.message || e.response?.data?.error || "Could not delete community.", "error");
    }
};

  return (
    <div className={`min-h-screen transition-colors duration-500 ${
      darkMode ? 'bg-[#0A0F1F] text-[#F0F4FA]' : 'bg-[#F8F9FC] text-[#1F2937]'
    }`}>
      
      <nav className={`fixed top-0 left-0 right-0 z-[100] backdrop-blur-md border-b transition-all duration-300 ${
        darkMode 
          ? 'bg-[#1E2740]/80 border-[#2D3748]' 
          : 'bg-white/90 border-[#E2E8F0] shadow-sm'
      }`}>
        <div className="max-w-7xl mx-auto px-8 h-20 flex items-center justify-between">
          <div className="flex items-center space-x-10">
            <span className={`font-serif italic font-black text-2xl tracking-tighter ${darkMode ? 'text-[#5F7DB0]' : 'text-[#2C3E68]'}`}>
              BiblioTech
            </span>
            <div className="hidden md:flex space-x-6 font-bold text-sm">
              <Link to="/" className="hover:opacity-70 transition">Home</Link>
              <Link to="/groups" className="opacity-50 hover:opacity-100 transition">All Communities</Link>
            </div>
          </div>

          <div className="flex items-center space-x-6">
          
          </div>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto pt-32 pb-20 px-6">
        {banner && <p className="text-sm font-semibold text-center mb-6 text-[#5F7DB0]">{banner}</p>}
        
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
                {(community.admin || "?")[0]}
              </div>
              <div>
                <p className="text-xs uppercase tracking-widest font-black opacity-40">Founded by</p>
                <p className="font-bold">{community.admin} {isAdmin && "(You)"}</p>
              </div>
            </div>
          </div>
<div className="space-y-4">
  {!isMember ? (
    <button
      type="button"
      onClick={handleJoin}
      className={`w-full py-5 rounded-2xl font-black text-lg text-white shadow-2xl transition-all hover:-translate-y-1 active:scale-95 ${
        darkMode ? 'bg-[#5F7DB0]' : 'bg-[#2C3E68]'
      }`}
    >
      Join this Hub
    </button>
  ) : (
    <button
      type="button"
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
  type="button"
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

  {isAdmin && (
    <button
        type="button"
        onClick={handleDeleteCommunity}
        className={`w-full py-5 rounded-2xl font-black text-lg transition-all hover:shadow-xl active:scale-95 border-2 ${
            darkMode 
                ? 'border-red-500/50 text-red-400 hover:bg-red-500 hover:text-white' 
                : 'border-red-500/50 text-red-600 hover:bg-red-500 hover:text-white'
        }`}
    >
        🗑️ Delete Community
    </button>
)}
</div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          <div className={`lg:col-span-2 rounded-[2.5rem] p-10 border transition-all ${
            darkMode ? 'bg-[#1E2740] border-[#2D3748]' : 'bg-white border-[#E2E8F0] shadow-xl shadow-blue-900/5'
          }`}>
            <div className="flex justify-between items-center mb-10">
              <h2 className="text-3xl font-black">Members List</h2>
              <span className="text-sm font-bold opacity-40 uppercase tracking-widest">
                {community.members?.length ?? 0} total
              </span>
            </div>

            <div className="divide-y divide-gray-500/10">
              {(community.members || []).map((member) => (
                <div
                  key={member.id || member.name}
                  className="flex justify-between items-center py-5 group transition-all"
                >
                  <div className="flex items-center space-x-4">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold transition-transform group-hover:scale-110 ${
                      darkMode ? 'bg-[#0A0F1F] text-[#5F7DB0]' : 'bg-gray-100 text-[#2C3E68]'
                    }`}>
                      {member.name[0]}
                    </div>
                    <div>
                      <span className="font-bold text-lg">{member.name}</span>
                      {member.name === community.admin && (
                        <span className="ml-3 text-[10px] px-2 py-0.5 rounded-md bg-yellow-400 text-black font-black uppercase tracking-tighter">
                          Host
                        </span>
                      )}
                    </div>
                  </div>

                  {isAdmin && member.name !== community.admin && member.id && (
                    <button
                      type="button"
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
     {/* Confirmation Modal */}
<AnimatePresence>
    {showConfirmModal && (
        <>
            <M.div
                className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[200]"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setShowConfirmModal(false)}
            />
            <M.div
                className="fixed inset-0 z-[200] flex items-center justify-center px-4"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
            >
                <div className={`w-full max-w-md rounded-3xl overflow-hidden shadow-2xl ${
                    darkMode ? 'bg-[#1E2740]' : 'bg-white'
                }`}>
                    <div className="p-6 text-center">
                        <div className="text-5xl mb-4">⚠️</div>
                        <h2 className="text-2xl font-bold mb-2">Delete Community?</h2>
                        <p className="mb-6 opacity-70">
                            Are you sure? This action cannot be undone and will delete all discussions and member data.
                        </p>
                        <div className="flex gap-3">
                            <button
                                onClick={() => setShowConfirmModal(false)}
                                className="flex-1 py-3 rounded-xl font-semibold border border-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={confirmDelete}
                                className="flex-1 py-3 rounded-xl font-semibold text-white bg-red-500 hover:bg-red-600 transition"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            </M.div>
        </>
    )}
</AnimatePresence>

{/* Custom Alert */}
<CustomAlert
    show={alertPayload.show}
    onClose={() => setAlertPayload(prev => ({ ...prev, show: false }))}
    title={alertPayload.title}
    message={alertPayload.message}
    type={alertPayload.type}
/>





    </div>
  );
};

export default CommunityDetail;
