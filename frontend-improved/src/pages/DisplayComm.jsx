
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/client";
import { extractList } from "../api/normalize";

const DisplayComm = ({ darkMode }) => {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [newComm, setNewComm] = useState({ name: "", description: "", category: "" });
  const [error, setError] = useState("");
  const [communities, setCommunities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [banner, setBanner] = useState("");

  const load = () => {
    setLoading(true);
    api
      .get("/api/communities")
      .then((res) => {
        const list = extractList(res.data).map((c) => ({
          id: c._id ?? c.id,
          name: c.name,
          description: c.description ?? "",
          category: c.category ?? "",
          admin: c.admin?.name ?? c.adminName ?? c.createdBy ?? c.admin ?? "",
          members: c.memberCount ?? c.members?.length ?? c.members ?? 0,
        }));
        setCommunities(list);
      })
      .catch(() => setCommunities([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, []);

  const filtered = communities.filter((comm) =>
    comm.name.toLowerCase().includes(search.toLowerCase())
  );

  const openCreate = () => {
    if (!localStorage.getItem("token")) {
      navigate("/login", { state: { from: "/groups" } });
      return;
    }
    setShowModal(true);
  };

  const handleCreateCommunity = async (e) => {
    e.preventDefault();
    setError("");
    if (!localStorage.getItem("token")) {
      navigate("/login", { state: { from: "/groups" } });
      return;
    }
    setSubmitting(true);
    try {
      const { data } = await api.post("/api/communities", {
        name: newComm.name.trim(),
        description: newComm.description.trim(),
        category: newComm.category.trim(),
      });
      const created = data.community ?? data;
      const id = created._id ?? created.id;
      setShowModal(false);
      setNewComm({ name: "", description: "", category: "" });
      setBanner("Community created.");
      load();
      if (id) navigate(`/groups/${id}`);
    } catch (err) {
      setError(err.response?.data?.message || err.response?.data?.error || "Could not create community.");
    } finally {
      setSubmitting(false);
    }
  };

  const requireLogin = () => navigate("/login");

  return (
    <div className={`min-h-screen transition-colors duration-500 ${darkMode ? 'bg-[#0A0F1F] text-[#F0F4FA]' : 'bg-[#F8F9FC] text-[#1F2937]'}`}>
      
      <nav className={`flex justify-between items-center px-8 py-4 border-b sticky top-0 z-50 transition-colors ${
        darkMode ? 'bg-[#1E2740] border-[#2D3748]' : 'bg-white border-[#E2E8F0] shadow-sm'
      }`}>
        <span className={`font-serif italic font-bold text-xl tracking-tight ${darkMode ? 'text-[#5F7DB0]' : 'text-[#2C3E68]'}`}>
          BiblioTech
        </span>

        <div className="flex items-center gap-6">
          <button type="button" onClick={() => navigate("/")} className="hover:opacity-70 transition">Home</button>
          <span className={`font-semibold ${darkMode ? 'text-[#5F7DB0]' : 'text-[#2C3E68]'}`}>Groups</span>
          <button type="button" onClick={() => navigate('/profile')} className="hover:opacity-70 transition">
  Profile
</button>
          
        </div>
      </nav>

      <section className="text-center py-16 px-6">
        <h2 className="text-5xl font-black mb-4 tracking-tight">Explore Communities</h2>
        <p className={`mb-10 text-lg max-w-2xl mx-auto ${darkMode ? 'text-[#A0AEC0]' : 'text-[#4A5568]'}`}>
          Join discussions, share opinions, and connect with fellow readers in specialized book clubs.
        </p>

        {banner && <p className="text-emerald-500 font-semibold mb-4">{banner}</p>}

        <div className="flex justify-center gap-4 flex-wrap">
          <input
            type="text"
            placeholder="Search by name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className={`w-80 px-5 py-3 rounded-xl outline-none transition shadow-sm border ${
              darkMode ? 'bg-[#1E2740] border-[#2D3748] focus:ring-[#5F7DB0]' : 'bg-white border-[#E2E8F0] focus:ring-[#2C3E68]'
            } focus:ring-2`}
          />

          <button 
            type="button"
            onClick={openCreate}
            className={`px-8 py-3 rounded-xl text-white font-bold transition shadow-lg active:scale-95 ${
              darkMode ? 'bg-[#5F7DB0] hover:bg-[#4A6A9E]' : 'bg-[#2C3E68] hover:bg-[#1F2F4F]'
            }`}
          >
            + Create Community
          </button>
        </div>
      </section>

      <section className="px-10 pb-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
        {loading && <p className="col-span-full text-center opacity-70">Loading communities…</p>}
        {!loading && filtered.map((comm) => (
          <div
            key={comm.id}
            className={`rounded-3xl p-8 shadow-md hover:shadow-2xl hover:-translate-y-2 transition duration-300 flex flex-col justify-between border ${
              darkMode ? 'bg-[#1E2740] border-[#2D3748]' : 'bg-white border-[#E2E8F0]'
            }`}
          >
            <div>
              <div className="flex justify-between items-start mb-4">
                <span className={`text-[10px] uppercase tracking-widest font-black px-3 py-1 rounded-lg ${
                  darkMode ? 'bg-[#0A0F1F] text-[#5F7DB0]' : 'bg-[#F8F9FC] text-[#2C3E68]'
                }`}>
                  {comm.category || "General"}
                </span>
                <span className="text-sm font-bold opacity-60">👥 {comm.members}</span>
              </div>
              <h3 className="text-2xl font-bold mb-3">{comm.name}</h3>
              <p className={`leading-relaxed mb-6 ${darkMode ? 'text-[#A0AEC0]' : 'text-[#4A5568]'}`}>
                {comm.description}
              </p>
            </div>

            <button
              type="button"
              onClick={() => {
                 if (!localStorage.getItem("token")) return requireLogin();
                navigate(`/groups/${comm.id}`)
              }}
              className={`w-full py-3 rounded-xl border-2 font-bold transition-all ${
                darkMode 
                ? 'border-[#5F7DB0] text-[#5F7DB0] hover:bg-[#5F7DB0] hover:text-white' 
                : 'border-[#2C3E68] text-[#2C3E68] hover:bg-[#2C3E68] hover:text-white'
              }`}
            >
              View Hub
            </button>
          </div>
        ))}
      </section>

{showModal && (
  <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm transition-opacity duration-300 animate-[fadeIn_0.2s_ease-out]">
    <div className={`w-full max-w-md rounded-[2.5rem] p-10 shadow-2xl border transition-all duration-300 transform animate-[zoomIn_0.3s_ease-out] ${
      darkMode ? 'bg-[#1E2740] border-[#2D3748]' : 'bg-white border-[#E2E8F0]'
    }`}>
      <h2 className={`text-3xl font-black mb-2 ${darkMode ? 'text-[#5F7DB0]' : 'text-[#2C3E68]'}`}>New Community</h2>
      <p className="text-sm opacity-60 mb-8">Set up a new space for readers to gather.</p>
      
      <form onSubmit={handleCreateCommunity} className="space-y-5">
        <ModalInput label="Community Name" value={newComm.name} placeholder="e.g. Sci-Fi Pioneers" darkMode={darkMode} onChange={(v) => setNewComm({...newComm, name: v})} />
        <ModalInput label="Genre / Category" value={newComm.category} placeholder="e.g. Science Fiction" darkMode={darkMode} onChange={(v) => setNewComm({...newComm, category: v})} />
        
        <div>
          <label className="text-xs font-black uppercase tracking-widest opacity-50 block mb-2">Description</label>
          <textarea
            required rows="3"
            value={newComm.description}
            onChange={(e) => setNewComm({...newComm, description: e.target.value})}
            className={`w-full px-4 py-3 rounded-xl border outline-none transition resize-none ${
              darkMode ? 'bg-[#0A0F1F] border-[#2D3748] focus:ring-[#5F7DB0]' : 'bg-gray-50 border-gray-200 focus:ring-[#2C3E68]'
            } focus:ring-2`}
          />
        </div>

        {error && <p className="text-red-500 text-sm font-bold text-center animate-bounce">{error}</p>}

        <div className="flex gap-4 pt-4">
          <button type="button" onClick={() => setShowModal(false)} className="flex-1 py-3 font-bold opacity-50 hover:opacity-100">Cancel</button>
          <button type="submit" disabled={submitting} className={`flex-1 py-3 rounded-xl text-white font-bold shadow-lg hover:-translate-y-1 active:scale-95 transition-all disabled:opacity-50 ${
            darkMode ? 'bg-[#5F7DB0]' : 'bg-[#2C3E68]'
          }`}>{submitting ? "…" : "Create"}</button>
        </div>
      </form>
    </div>
  </div>
)}
    </div>
  );
};

const ModalInput = ({ label, value, placeholder, darkMode, onChange }) => (
  <div>
    <label className="text-xs font-black uppercase tracking-widest opacity-50 block mb-2">{label}</label>
    <input
      required type="text"
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={`w-full px-4 py-3 rounded-xl border outline-none transition ${
        darkMode ? 'bg-[#0A0F1F] border-[#2D3748] focus:ring-[#5F7DB0]' : 'bg-gray-50 border-gray-200 focus:ring-[#2C3E68]'
      } focus:ring-2`}
    />
  </div>
);

export default DisplayComm;
