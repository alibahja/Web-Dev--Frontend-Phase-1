import React, { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import api from "../api/client";
import { extractList, normalizeBook } from "../api/normalize";
import { 
  FaChartBar, FaBook, FaUsers, FaComments, 
  FaUsersCog, FaGamepad, FaPlus, FaTrash, FaEdit 
} from "react-icons/fa";

const tabs = [
  { id: "dash", label: "Dashboard", icon: <FaChartBar /> },
  { id: "books", label: "Books", icon: <FaBook /> },
  { id: "users", label: "Users", icon: <FaUsers /> },
  { id: "comments", label: "Comments", icon: <FaComments /> },
  { id: "communities", label: "Communities", icon: <FaUsersCog /> },
  { id: "games", label: "Games", icon: <FaGamepad /> },
];

const emptyBook = { 
  title: "", author: "", genre: "", description: "", 
  isbn: "", price: "", total_copies: 5, year: "", 
  publisher: "", pages: "", language: "",
  tags: "", cover_url: ""
};
const emptyComm = { name: "", description: "", category: "General" };

function Admin() {
  const [tab, setTab] = useState("dash");
  const [stats, setStats] = useState(null);
  const [books, setBooks] = useState([]);
  const [users, setUsers] = useState([]);
  const [comments, setComments] = useState([]);
  const [communities, setCommunities] = useState([]);
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  // Modals
  const [showBookModal, setShowBookModal] = useState(false);
  const [showCommModal, setShowCommModal] = useState(false);
 const [showGameModal, setShowGameModal] = useState(false);

  
  const [bookForm, setBookForm] = useState({ 
  title: "", author: "", genre: "", description: "", 
  isbn: "", price: "", total_copies: 5, year: "", 
  publisher: "", pages: "", language: "", 
  tags: "", cover_url: "" 
});
  const [commForm, setCommForm] = useState(emptyComm);
  const [gameForm, setGameForm] = useState({ title: "", description: "", difficulty: "Beginner", duration: "", image_url: "",
    steps: [{ level: "", title: "", books: [] }] // Add steps array
   });
   const [gameSteps, setGameSteps] = useState([{ level: "", title: "", books: [] }]);
const [availableBooks, setAvailableBooks] = useState([]);
useEffect(() => {
  const fetchBooks = async () => {
    try {
      const res = await api.get("/api/books");
      setAvailableBooks(res.data.books || []);
    } catch (err) {
      console.error("Failed to fetch books");
    }
  };
  fetchBooks();
}, []);
const addStep = () => {
  setGameSteps([...gameSteps, { level: "", title: "", books: [] }]);
};

const removeStep = (index) => {
  const newSteps = gameSteps.filter((_, i) => i !== index);
  setGameSteps(newSteps);
};

const updateStep = (index, field, value) => {
  const newSteps = [...gameSteps];
  newSteps[index][field] = value;
  setGameSteps(newSteps);
};

const addBookToStep = (stepIndex, bookId) => {
  const book = availableBooks.find(b => b.id === parseInt(bookId));
  if (book && !gameSteps[stepIndex].books.find(b => b.id === book.id)) {
    const newSteps = [...gameSteps];
    newSteps[stepIndex].books.push(book);
    setGameSteps(newSteps);
  }
};

const removeBookFromStep = (stepIndex, bookId) => {
  const newSteps = [...gameSteps];
  newSteps[stepIndex].books = newSteps[stepIndex].books.filter(b => b.id !== bookId);
  setGameSteps(newSteps);
};

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      switch (tab) {
        case "dash":
          const sRes = await api.get("/api/admin/stats");
          setStats(sRes.data.stats);
          break;
        case "books":
          const bRes = await api.get("/api/admin/books");
          const bList = extractList(bRes.data.books || bRes.data);
          setBooks(bList.map(normalizeBook));
          break;
        case "users":
          const uRes = await api.get("/api/admin/users");
          setUsers(uRes.data.users);
          break;
        case "comments":
          const cRes = await api.get("/api/admin/comments");
          setComments(cRes.data.comments || []);
          break;
        case "communities":
          const comRes = await api.get("/api/admin/communities");
          setCommunities(comRes.data.communities || []);
          break;
        case "games":
          const gRes = await api.get("/api/admin/games");
          setGames(gRes.data.games);
          break;
        default:
          break;
      }
    } catch (err) {
      setError("Failed to load data for this section.");
    } finally {
      setLoading(false);
    }
  }, [tab]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const handleDelete = async (endpoint, id, updateState) => {
    if (!window.confirm("Are you sure?")) return;
    try {
      await api.delete(`${endpoint}/${id}`);
      updateState((prev) => prev.filter((item) => item.id !== id));
      setMessage("Deleted successfully");
      setTimeout(() => setMessage(""), 3000);
    } catch (err) { setError("Delete failed"); }
  };

const handleCreateBook = async (e) => {
  e.preventDefault();
  try {
    await api.post("/api/admin/books", bookForm);
    setShowBookModal(false);
    setBookForm(emptyBook);
    fetchData();
    setMessage("Book added!");
  } catch (err) { 
    setError("Failed to add book"); 
  }
};

  const handleCreateComm = async (e) => {
    e.preventDefault();
    try {
      await api.post("/api/communities", commForm);
      setShowCommModal(false);
      setCommForm(emptyComm);
      fetchData();
      setMessage("Community created!");
    } catch (err) { setError("Failed to create community"); }
  };
 const handleCreateGame = async (e) => {
  e.preventDefault();
  try {
    // First create the game
    const gameRes = await api.post("/api/admin/games", {
      title: gameForm.title,
      description: gameForm.description,
      difficulty: gameForm.difficulty,
      duration: gameForm.duration,
      image_url: gameForm.image_url
    });
    
    const gameId = gameRes.data.gameId;
    
    // Then create each step
    for (let i = 0; i < gameSteps.length; i++) {
      const step = gameSteps[i];
      const stepRes = await api.post("/api/admin/game-steps", {
        gameId,
        level: step.level,
        title: step.title,
        step_order: i + 1
      });
      
      const stepId = stepRes.data.stepId;
      
      // Add books to step
      for (let j = 0; j < step.books.length; j++) {
        await api.post("/api/admin/step-books", {
          stepId,
          bookId: step.books[j].id,
          book_order: j + 1
        });
      }
    }
    
    setShowGameModal(false);
    setGameForm({ title: "", description: "", difficulty: "Beginner", duration: "", image_url: "" });
    setGameSteps([{ level: "", title: "", books: [] }]);
    fetchData();
    setMessage("Game created successfully!");
  } catch (err) {
    setError("Failed to create game");
    console.error(err);
  }
};

  return (
    <div className="min-h-screen bg-[#0F172A] text-white p-6">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-black uppercase tracking-tighter">Admin Control</h1>
          <p className="text-slate-400 text-sm">System management & analytics</p>
        </div>
         {/* Add Home Button */}
  <Link 
    to="/" 
    className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm transition-all flex items-center gap-2"
  >
    🏠 Back to Home
  </Link>
        {message && <div className="bg-green-500/20 text-green-400 px-4 py-2 rounded-lg border border-green-500/30">{message}</div>}
      </div>

      <div className="flex flex-wrap gap-2 mb-8 bg-slate-900/50 p-1 rounded-xl w-fit">
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-lg transition-all font-bold text-sm ${
              tab === t.id ? "bg-blue-600 text-white shadow-lg" : "hover:bg-white/5 text-slate-400"
            }`}
          >
            {t.icon} {t.label}
          </button>
        ))}
      </div>

      <div className="bg-slate-900/30 rounded-2xl border border-white/5 p-6 min-h-[400px]">
        {loading ? (
          <div className="flex items-center justify-center h-64 animate-pulse text-slate-500">Loading data...</div>
        ) : (
          <>
            {tab === "dash" && stats && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  { label: "Total Books", val: stats.totalBooks, color: "text-blue-400" },
                  { label: "Active Users", val: stats.totalUsers, color: "text-purple-400" },
                  { label: "Books Borrowed", val: stats.borrowedBooks, color: "text-green-400" },
                  { label: "Overdue Items", val: stats.overdue, color: "text-red-400" },
                ].map((s, i) => (
                  <div key={i} className="bg-white/5 p-6 rounded-2xl border border-white/5">
                    <p className="text-slate-400 text-sm font-bold uppercase">{s.label}</p>
                    <p className={`text-4xl font-black mt-2 ${s.color}`}>{s.val}</p>
                  </div>
                ))}
              </div>
            )}

            {tab === "books" && (
  <div>
    <button onClick={() => setShowBookModal(true)} className="mb-6 bg-blue-600 hover:bg-blue-500 px-4 py-2 rounded-lg flex items-center gap-2 font-bold text-sm">
      <FaPlus /> Add New Book
    </button>
    <div className="overflow-x-auto rounded-xl border border-white/5">
      <table className="w-full text-left">
        <thead className="bg-white/5 text-slate-400 text-xs uppercase font-black">
          <tr>
            <th className="px-4 py-3">ID</th>
            <th className="px-4 py-3">Title</th>
            <th className="px-4 py-3">Author</th>
            <th className="px-4 py-3">Genre</th>
            <th className="px-4 py-3">Copies</th>
            <th className="px-4 py-3">Price</th>
            <th className="px-4 py-3">Year</th>
            <th className="px-4 py-3 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-white/5">
          {books.map((b) => (
            <tr key={b.id} className="hover:bg-white/5">
              <td className="px-4 py-3">{b.id}</td>
              <td className="px-4 py-3 font-medium">{b.title}</td>
              <td className="px-4 py-3">{b.author}</td>
              <td className="px-4 py-3">{b.genre || '-'}</td>
              <td className="px-4 py-3">{b.available_copies}/{b.total_copies}</td>
              <td className="px-4 py-3">${b.price}</td>
              <td className="px-4 py-3">{b.year || '-'}</td>
              <td className="px-4 py-3 text-right">
                <button onClick={() => handleDelete("/api/admin/books", b.id, setBooks)} className="text-red-400 p-2 hover:bg-red-400/10 rounded-lg"><FaTrash /></button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
)}

            {tab === "communities" && (
              <div>
                <button onClick={() => setShowCommModal(true)} className="mb-6 bg-green-600 hover:bg-green-500 px-4 py-2 rounded-lg flex items-center gap-2 font-bold text-sm">
                  <FaPlus /> Create Community
                </button>
                <div className="grid gap-4">
                  {communities.map((c) => (
                    <div key={c.id} className="p-4 bg-white/5 rounded-xl border border-white/5">
                      <h3 className="font-bold text-lg">{c.name}</h3>
                      <p className="text-slate-400 text-sm mb-2">{c.description}</p>
                      <div className="flex justify-between items-center">
                         <span className="text-xs font-black uppercase px-2 py-1 bg-blue-500/20 text-blue-400 rounded">Admin: {c.admin_name}</span>
                         <button onClick={() => handleDelete("/api/admin/communities", c.id, setCommunities)} className="text-red-400 hover:bg-red-400/10 p-2 rounded-lg"><FaTrash /></button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

           {tab === "comments" && (
  <div className="overflow-x-auto rounded-xl border border-white/5">
    <table className="w-full text-left">
      <thead className="bg-white/5 text-slate-400 text-xs uppercase font-black">
        <tr>
          <th className="px-6 py-4">User</th>
          <th className="px-6 py-4">Comment</th>
          <th className="px-6 py-4">Location</th>
          <th className="px-6 py-4">Date</th>
          <th className="px-6 py-4 text-right">Action</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-white/5">
        {comments.map((c) => (
          <tr key={c.id} className="hover:bg-white/5">
            <td className="px-6 py-4 font-bold">{c.user_name}</td>
            <td className="px-6 py-4 italic text-slate-300 max-w-md truncate">"{c.content}"</td>
            <td className="px-6 py-4">
              <span className="text-blue-400 text-xs font-bold">
                {c.target || (c.book_title ? `Book: ${c.book_title}` : c.community_name ? `Community: ${c.community_name}` : '-')}
              </span>
            </td>
            <td className="px-6 py-4 text-slate-400 text-xs">{new Date(c.created_at).toLocaleDateString()}</td>
            <td className="px-6 py-4 text-right">
              <button onClick={() => handleDelete("/api/admin/comments", c.id, setComments)} className="text-red-400 p-2 hover:bg-red-400/10 rounded-lg"><FaTrash /></button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
)}
 {tab === "games" && (
  <div>
    <button onClick={() => setShowGameModal(true)} className="mb-6 bg-purple-600 hover:bg-purple-500 px-4 py-2 rounded-lg flex items-center gap-2 font-bold text-sm">
      <FaPlus /> Create New Game
    </button>
    <div className="grid gap-4">
      {games.map((g) => (
        <div key={g.id} className="p-4 bg-white/5 rounded-xl border border-white/5 flex justify-between items-center">
          <div>
            <h3 className="font-bold">{g.title}</h3>
            <p className="text-sm text-slate-400">{g.description?.substring(0, 100)}...</p>
            <div className="flex gap-2 mt-1">
              <span className="text-xs px-2 py-0.5 bg-blue-500/20 text-blue-400 rounded">{g.difficulty}</span>
              <span className="text-xs text-slate-400">{g.duration}</span>
            </div>
          </div>
          <button onClick={() => handleDelete("/api/admin/games", g.id, setGames)} className="text-red-400 p-2 hover:bg-red-400/10 rounded-lg"><FaTrash /></button>
        </div>
      ))}
    </div>
  </div>
)}
           {tab === "users" && (
  <div className="overflow-x-auto rounded-xl border border-white/5">
    <table className="w-full text-left">
      <thead className="bg-white/5 text-slate-400 text-xs uppercase font-black">
        <tr>
          <th className="px-6 py-4">Name</th>
          <th className="px-6 py-4">Email</th>
          <th className="px-6 py-4">Role</th>
          <th className="px-6 py-4 text-right">Actions</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-white/5">
        {users.map((u) => {
          const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
          const isSelf = currentUser.id === u.id;
          const isAdmin = u.role === 'admin';
          
          return (
            <tr key={u.id} className="hover:bg-white/5">
              <td className="px-6 py-4 font-bold">{u.full_name || u.name}</td>
              <td className="px-6 py-4 text-slate-400">{u.email}</td>
              <td className="px-6 py-4">
                <span className={`px-2 py-1 rounded text-[10px] font-black uppercase ${u.role === 'admin' ? 'bg-red-500/20 text-red-400' : 'bg-blue-500/20 text-blue-400'}`}>{u.role}</span>
              </td>
              <td className="px-6 py-4 text-right">
                {!isSelf && !isAdmin && (
                  <button onClick={() => handleDelete("/api/admin/users", u.id, setUsers)} className="text-red-400 hover:underline">Remove</button>
                )}
                {isSelf && <span className="text-slate-500 text-xs">Current account</span>}
                {!isSelf && isAdmin && <span className="text-yellow-500 text-xs">Admin</span>}
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  </div>
)}
          </>
        )}
      </div>

      {showBookModal && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
    <form onSubmit={handleCreateBook} className="bg-slate-900 border border-white/10 w-full max-w-2xl rounded-2xl p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
      <h3 className="text-lg font-bold mb-6">Add New Book</h3>
      <div className="grid grid-cols-2 gap-4">
        <input className="rounded-lg px-4 py-2 bg-white/5 border border-white/10" placeholder="Title" value={bookForm.title} onChange={e => setBookForm({...bookForm, title: e.target.value})} required />
        <input className="rounded-lg px-4 py-2 bg-white/5 border border-white/10" placeholder="Author" value={bookForm.author} onChange={e => setBookForm({...bookForm, author: e.target.value})} required />
        <input className="rounded-lg px-4 py-2 bg-white/5 border border-white/10" placeholder="Genre" value={bookForm.genre} onChange={e => setBookForm({...bookForm, genre: e.target.value})} />
        <input className="rounded-lg px-4 py-2 bg-white/5 border border-white/10" placeholder="ISBN" value={bookForm.isbn} onChange={e => setBookForm({...bookForm, isbn: e.target.value})} />
        <input type="number" className="rounded-lg px-4 py-2 bg-white/5 border border-white/10" placeholder="Total Copies" value={bookForm.total_copies} onChange={e => setBookForm({...bookForm, total_copies: e.target.value})} />
        <input type="number" step="0.01" className="rounded-lg px-4 py-2 bg-white/5 border border-white/10" placeholder="Price" value={bookForm.price} onChange={e => setBookForm({...bookForm, price: e.target.value})} />
        <input type="number" className="rounded-lg px-4 py-2 bg-white/5 border border-white/10" placeholder="Year" value={bookForm.year} onChange={e => setBookForm({...bookForm, year: e.target.value})} />
        <input className="rounded-lg px-4 py-2 bg-white/5 border border-white/10" placeholder="Publisher" value={bookForm.publisher} onChange={e => setBookForm({...bookForm, publisher: e.target.value})} />
        <input type="number" className="rounded-lg px-4 py-2 bg-white/5 border border-white/10" placeholder="Pages" value={bookForm.pages} onChange={e => setBookForm({...bookForm, pages: e.target.value})} />
        <input className="rounded-lg px-4 py-2 bg-white/5 border border-white/10" placeholder="Language" value={bookForm.language} onChange={e => setBookForm({...bookForm, language: e.target.value})} />
        <textarea className="col-span-2 rounded-lg px-4 py-2 bg-white/5 border border-white/10" placeholder="Description" rows={3} value={bookForm.description} onChange={e => setBookForm({...bookForm, description: e.target.value})} />
          {/* Tags Field - Full width */}
  <div className="col-span-2">
    <select className="w-full rounded-lg px-4 py-2 bg-white/5 border border-white/10" value={bookForm.tags} onChange={e => setBookForm({...bookForm, tags: e.target.value})}>
      <option value="">Select Collection (Optional)</option>
      <option value="best-seller">best-seller</option>
      <option value="popular">popular</option>
      <option value="new-release">new-release</option>
    </select>
    <p className="text-xs text-slate-500 mt-1">Leave empty for regular books</p>
  </div>
   {/* Cover URL Field - Full width */}
  <div className="col-span-2">
    <input className="w-full rounded-lg px-4 py-2 bg-white/5 border border-white/10" placeholder="Cover Image URL (optional)" value={bookForm.cover_url} onChange={e => setBookForm({...bookForm, cover_url: e.target.value})} />
    {bookForm.cover_url && (
      <div className="mt-2">
        <img src={bookForm.cover_url} alt="Preview" className="h-20 w-auto rounded border border-white/10" />
      </div>
    )}
  </div>
      </div>
      <div className="flex gap-3 mt-8">
        <button type="button" className="flex-1 py-3 rounded-lg bg-white/5 font-bold" onClick={() => setShowBookModal(false)}>Cancel</button>
        <button type="submit" className="flex-1 py-3 rounded-lg bg-blue-600 hover:bg-blue-500 font-bold">Save Book</button>
      </div>
    </form>
  </div>
)}

      {/* Community Creation Modal */}
      {showCommModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <form onSubmit={handleCreateComm} className="bg-slate-900 border border-white/10 w-full max-w-md rounded-2xl p-6 shadow-2xl">
            <h3 className="text-lg font-bold mb-6">Create Community</h3>
            <div className="space-y-4">
              <input className="w-full rounded-lg px-4 py-2 bg-white/5 border border-white/10" placeholder="Name" value={commForm.name} onChange={e => setCommForm({...commForm, name: e.target.value})} required />
              <textarea className="w-full rounded-lg px-4 py-2 bg-white/5 border border-white/10" placeholder="Description" rows={3} value={commForm.description} onChange={e => setCommForm({...commForm, description: e.target.value})} />
            </div>
            <div className="flex gap-3 mt-8">
              <button type="button" className="flex-1 py-3 rounded-lg bg-white/5 font-bold" onClick={() => setShowCommModal(false)}>Cancel</button>
              <button type="submit" className="flex-1 py-3 rounded-lg bg-green-600 hover:bg-green-500 font-bold">Create</button>
            </div>
          </form>
        </div>
      )}

      {showGameModal && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
    <form onSubmit={handleCreateGame} className="bg-slate-900 border border-white/10 w-full max-w-4xl rounded-2xl p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
      <h3 className="text-lg font-bold mb-6">Create New Game with Roadmap</h3>
      
      {/* Basic Game Info */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <input className="rounded-lg px-4 py-2 bg-white/5 border border-white/10" placeholder="Title" value={gameForm.title} onChange={e => setGameForm({...gameForm, title: e.target.value})} required />
        <select className="rounded-lg px-4 py-2 bg-white/5 border border-white/10" value={gameForm.difficulty} onChange={e => setGameForm({...gameForm, difficulty: e.target.value})}>
          <option value="Beginner">Beginner</option>
          <option value="Intermediate">Intermediate</option>
          <option value="Advanced">Advanced</option>
        </select>
        <input className="rounded-lg px-4 py-2 bg-white/5 border border-white/10" placeholder="Duration (e.g., 3-6 Months)" value={gameForm.duration} onChange={e => setGameForm({...gameForm, duration: e.target.value})} />
        <input className="rounded-lg px-4 py-2 bg-white/5 border border-white/10" placeholder="Image URL" value={gameForm.image_url} onChange={e => setGameForm({...gameForm, image_url: e.target.value})} />
        <textarea className="col-span-2 rounded-lg px-4 py-2 bg-white/5 border border-white/10" placeholder="Description" rows={3} value={gameForm.description} onChange={e => setGameForm({...gameForm, description: e.target.value})} required />
      </div>
      
      {/* Steps Section */}
      <div className="mb-4">
        <div className="flex justify-between items-center mb-4">
          <h4 className="font-bold text-blue-400">Learning Steps (Roadmap)</h4>
          <button type="button" onClick={addStep} className="px-3 py-1 bg-blue-600 rounded-lg text-sm">+ Add Step</button>
        </div>
        
        {gameSteps.map((step, idx) => (
          <div key={idx} className="bg-white/5 p-4 rounded-lg mb-4 border border-white/10">
            <div className="flex justify-between items-center mb-3">
              <h5 className="font-semibold">Step {idx + 1}</h5>
              {gameSteps.length > 1 && (
                <button type="button" onClick={() => removeStep(idx)} className="text-red-400 text-sm">Remove</button>
              )}
            </div>
            
            <div className="grid grid-cols-2 gap-3 mb-3">
              <input className="rounded-lg px-3 py-2 bg-white/5 border border-white/10 text-sm" placeholder="Level (e.g., Beginner)" value={step.level} onChange={e => updateStep(idx, 'level', e.target.value)} required />
              <input className="rounded-lg px-3 py-2 bg-white/5 border border-white/10 text-sm" placeholder="Step Title (e.g., JavaScript Basics)" value={step.title} onChange={e => updateStep(idx, 'title', e.target.value)} required />
            </div>
            
            {/* Books for this step */}
            <div className="mt-3">
              <label className="text-xs text-slate-400 block mb-2">Books for this step:</label>
              <div className="flex gap-2 mb-2">
                <select className="flex-1 rounded-lg px-3 py-2 bg-white/5 border border-white/10 text-sm" onChange={e => addBookToStep(idx, e.target.value)} value="">
                  <option value="">Select a book...</option>
                  {availableBooks.filter(b => !step.books.find(sb => sb.id === b.id)).map(b => (
                    <option key={b.id} value={b.id}>{b.title} by {b.author}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-1">
                {step.books.map((book, bookIdx) => (
                  <div key={book.id} className="flex justify-between items-center bg-white/10 px-3 py-2 rounded-lg">
                    <span className="text-sm">{book.title} by {book.author}</span>
                    <button type="button" onClick={() => removeBookFromStep(idx, book.id)} className="text-red-400 text-xs">Remove</button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="flex gap-3 mt-8">
        <button type="button" className="flex-1 py-3 rounded-lg bg-white/5 font-bold" onClick={() => setShowGameModal(false)}>Cancel</button>
        <button type="submit" className="flex-1 py-3 rounded-lg bg-purple-600 hover:bg-purple-500 font-bold">Create Game</button>
      </div>
    </form>
  </div>
)}
    </div>
  );
}

export default Admin;
