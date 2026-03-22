import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { BookVerseShell, Pill, PrimaryButton, SectionHeading, Surface } from "../components/BookVerseUI";

const seedCommunities = [
  {
    id: 1,
    name: "Velvet Spine Society",
    description: "For readers who love atmospheric fiction, dark academia, and books that feel like candlelight and rain.",
    category: "Atmospheric Fiction",
    admin: "Sarah",
    members: ["Sarah", "John", "Emma", "Mira"],
  },
  {
    id: 2,
    name: "Scholar's Reading Room",
    description: "Thoughtful analysis, annotated discoveries, and long conversations around meaningful texts.",
    category: "Academic",
    admin: "Michael",
    members: ["Michael", "David", "Ali"],
  },
];

const DisplayComm = ({ darkMode, setDarkMode }) => {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [communities, setCommunities] = useState(seedCommunities);
  const [newComm, setNewComm] = useState({ name: "", description: "", category: "" });
  const [error, setError] = useState("");
  const currentUser = "Ali";

  const filtered = communities.filter((community) => community.name.toLowerCase().includes(search.toLowerCase()));

  const handleCreateCommunity = (event) => {
    event.preventDefault();
    setError("");
    if (communities.some((entry) => entry.name.toLowerCase() === newComm.name.toLowerCase())) {
      setError("A community with that name already exists.");
      return;
    }
    const created = { id: communities.length + 1, ...newComm, admin: currentUser, members: [currentUser] };
    setCommunities((prev) => [created, ...prev]);
    setShowModal(false);
    setNewComm({ name: "", description: "", category: "" });
    navigate(`/groups/${created.id}`, { state: created });
  };

  return (
    <BookVerseShell darkMode={darkMode} setDarkMode={setDarkMode} title="BookVerse" subtitle="Reader Groups">
      <Surface className="p-6 sm:p-8">
        <SectionHeading
          eyebrow="Groups"
          title="Join reading circles that feel curated, calm, and alive"
          description="Groups connect readers through atmosphere, themes, and thoughtful discussion rather than loud social clutter."
        />
        <div className="mt-6 flex flex-wrap gap-3">
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search groups by name..."
            className="w-full min-w-0 flex-1 rounded-full border border-slate-900/8 bg-white/75 px-5 py-3 text-sm text-slate-900 outline-none sm:min-w-[18rem]"
          />
          <PrimaryButton onClick={() => setShowModal(true)} className="w-full sm:w-auto">Create Group</PrimaryButton>
        </div>
      </Surface>

      <section className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {filtered.map((community) => (
          <Surface key={community.id} className="p-6">
            <div className="flex items-center justify-between gap-3">
              <Pill>{community.category}</Pill>
              <span className="text-sm text-slate-600">{community.members.length} members</span>
            </div>
            <h2 className="font-display mt-5 text-3xl text-slate-900">{community.name}</h2>
            <p className="mt-4 text-sm leading-7 text-slate-600">{community.description}</p>
            <div className="mt-6 flex items-center justify-between text-sm text-slate-600">
              <span>Host: {community.admin}</span>
              <button
                onClick={() => navigate(`/groups/${community.id}`, { state: community })}
                className="font-semibold text-slate-900"
              >
                View Group
              </button>
            </div>
          </Surface>
        ))}
      </section>

      {showModal ? (
        <div className="fixed inset-0 z-100 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm">
          <Surface className="w-full max-w-xl p-6 sm:p-8">
            <SectionHeading eyebrow="New Group" title="Create a new reading circle" />
            <form onSubmit={handleCreateCommunity} className="mt-6 space-y-4">
              {[
                ["name", "Group Name", "Moonlit Classics Club"],
                ["category", "Category", "Historical Fiction"],
              ].map(([field, label, placeholder]) => (
                <label key={field} className="block">
                  <span className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">{label}</span>
                  <input
                    required
                    value={newComm[field]}
                    onChange={(event) => setNewComm((prev) => ({ ...prev, [field]: event.target.value }))}
                    placeholder={placeholder}
                    className="mt-2 w-full rounded-[1.4rem] border border-slate-900/8 bg-white/75 px-4 py-4 text-slate-900 outline-none"
                  />
                </label>
              ))}
              <label className="block">
                <span className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">Description</span>
                <textarea
                  required
                  rows="4"
                  value={newComm.description}
                  onChange={(event) => setNewComm((prev) => ({ ...prev, description: event.target.value }))}
                  className="mt-2 w-full rounded-[1.4rem] border border-slate-900/8 bg-white/75 px-4 py-4 text-slate-900 outline-none"
                />
              </label>
              {error ? <p className="text-sm font-semibold text-rose-600">{error}</p> : null}
              <div className="flex flex-wrap gap-3">
                <button type="button" onClick={() => setShowModal(false)} className="bookverse-button w-full rounded-full border border-slate-900/10 bg-white/65 px-5 py-3 text-sm font-semibold text-slate-900 sm:w-auto">
                  Cancel
                </button>
                <PrimaryButton className="w-full sm:w-auto">Create Group</PrimaryButton>
              </div>
            </form>
          </Surface>
        </div>
      ) : null}
    </BookVerseShell>
  );
};

export default DisplayComm;
