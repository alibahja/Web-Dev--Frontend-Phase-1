
import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FaCrown, FaBookOpen, FaCalendarAlt,
  FaFileAlt, FaHeart, FaTrophy, FaClock, FaHistory, FaUndo, FaChartLine, FaStar, FaBookmark, FaHourglassHalf,
  FaLightbulb, FaInfoCircle, FaArrowRight
} from "react-icons/fa";
import defaultimage from "../assets/default-book-cover.jpg";
import api from "../api/client";
import { extractList, normalizeBook } from "../api/normalize";
import hero from "../assets/hero.png";

const Profile = ({ darkMode}) => {
  const [profile, setProfile] = useState(null);
  const [borrowedBooks, setBorrowedBooks] = useState([]);
  const [favorite, setFavorite] = useState([]);
  const [completed, setCompleted] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [reading, setReading] = useState([]);
  const [purchased, setPurchased] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [banner, setBanner] = useState({ type: "", text: "" });
  const [completedGames, setCompletedGames] = useState([]);
  const [currentGames, setCurrentGames] = useState([]);
  const [profilePicture, setProfilePicture] = useState(null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);

  // Calculate next rank goal
  const booksRead = completed.length;
  const nextRankGoal = booksRead < 5 ? 5 : booksRead < 10 ? 10 : booksRead < 20 ? 20 : booksRead < 50 ? 50 : null;
  const booksToNextRank = nextRankGoal ? nextRankGoal - booksRead : 0;

  useEffect(() => {
    let cancel = false;
    (async () => {
      setLoading(true);
      setError("");
      try {
        const [pr, br, fav, rd, wl, comp, pur, completedGamesRes, currentGamesRes] = await Promise.all([
          api.get("/api/profile/profile"),
          api.get("/api/profile/borrowed"),
          api.get("/api/profile/books/favorite").catch(() => ({ data: [] })),
          api.get("/api/profile/books/reading").catch(() => ({ data: [] })),
          api.get("/api/profile/books/wishlist").catch(() => ({ data: [] })),
          api.get("/api/profile/books/completed").catch(() => ({ data: [] })),
          api.get("/api/profile/books/purchased").catch(() => ({ data: [] })),
          api.get("/api/profile/games/completed").catch(() => ({ data: [] })),
         api.get("/api/profile/games/current").catch(() => ({ data: [] })),
        ]);
        if (cancel) return;
        const p = pr.data?.profile || pr.data?.user || pr.data;
        setProfile(p);
       if (p?.profile_picture) {
    setProfilePicture(p.profile_picture);
} else {
    setProfilePicture(null);
}
const bList = (br.data?.borrowedBooks || []).map((row) => ({
    id: row.id,
    title: row.title,
    author: row.author,
    coverUrl: row.coverUrl,
    price: row.price,
    rating: row.rating || 0,
    borrowDate: row.borrowDate || "",
    dueDate: row.dueDate || "",
}));
setBorrowedBooks(bList);
        setFavorite(extractList(fav.data).map((x) => normalizeBook(x.book ?? x)).filter(Boolean));
        setReading(extractList(rd.data).map((x) => normalizeBook(x.book ?? x)).filter(Boolean));
        setWishlist(extractList(wl.data).map((x) => normalizeBook(x.book ?? x)).filter(Boolean));
        setCompleted(extractList(comp.data).map((x) => normalizeBook(x.book ?? x)).filter(Boolean));
        setPurchased(
          extractList(pur.data).map((x) => {
            const book = normalizeBook(x.book ?? x);
            return {
              ...book,
              purchaseDate: x.purchaseDate ?? x.purchasedAt ?? "",
            };
          })
        );
        setCompletedGames(completedGamesRes.data?.games || []);
        setCurrentGames(currentGamesRes.data?.games || []);
      } catch (e) {
        if (!cancel) setError(e.response?.data?.message || e.response?.data?.error || "Could not load profile.");
      } finally {
        if (!cancel) setLoading(false);
      }
    })();
    return () => { cancel = true; };
  }, []);

  const userName = profile?.full_name ?? profile?.name ?? profile?.username ?? "Reader";
  const initials = userName
    .split(" ")
    .map((s) => s[0])
    .join("")
    .slice(0, 2)
    .toUpperCase() || "R";
  const joined = profile?.createdAt
    ? new Date(profile.createdAt).toLocaleDateString(undefined, { month: "short", year: "numeric" })
    : profile?.joined ?? "—";
  const rank = profile?.rank ?? (booksRead >= 50 ? "Scholar" : booksRead >= 25 ? "Book Master" : booksRead >= 10 ? "Book Lover" : booksRead >= 5 ? "Avid Reader" : "New Reader");

  const handleReturn = async (bookId) => {
    try {
      await api.post("/api/profile/return", { bookId });
      setBorrowedBooks((prev) => prev.filter((book) => String(book.id) !== String(bookId)));
      setBanner({ type: "ok", text: "Book returned successfully!" });
      setTimeout(() => setBanner({ type: "", text: "" }), 3000);
    } catch (e) {
      setBanner({ type: "err", text: e.response?.data?.message || e.response?.data?.error || "Return failed." });
      setTimeout(() => setBanner({ type: "", text: "" }), 3000);
    }
  };

const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    if (!file.type.startsWith('image/')) {
        setBanner({ type: "err", text: "Please upload an image file." });
        setTimeout(() => setBanner({ type: "", text: "" }), 3000);
        return;
    }
    if (file.size > 5 * 1024 * 1024) {
        setBanner({ type: "err", text: "Image must be less than 5MB." });
        setTimeout(() => setBanner({ type: "", text: "" }), 3000);
        return;
    }
    const formData = new FormData();
    formData.append('profilePicture', file);
    
    setUploading(true);
    try {
        const { data } = await api.post('/api/auth/profile-picture', formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
        setProfilePicture(data.profilePicture);
        setBanner({ type: "ok", text: "Profile picture updated!" });
        setTimeout(() => setBanner({ type: "", text: "" }), 3000);
    } catch (err) {
        setBanner({ type: "err", text: err.response?.data?.message || "Upload failed." });
        setTimeout(() => setBanner({ type: "", text: "" }), 3000);
    } finally {
        setUploading(false);
    }
};

  return (
    <div className={`min-h-screen transition-all duration-500 pb-12 ${
      darkMode ? 'bg-[#0A0F1F] text-[#F0F4FA]' : 'bg-[#F8F9FC] text-[#1F2937]'
    }`}>
      
      <nav className={`fixed top-0 w-full z-50 backdrop-blur-xl border-b ${
        darkMode ? 'bg-[#111827]/80 border-[#2D3748]' : 'bg-white/80 border-[#E2E8F0]'
      }`}>
        <div className="max-w-7xl mx-auto px-8 h-16 flex items-center justify-between">
          
          <Link to="/" className={`px-4 py-2 rounded-lg text-sm font-semibold shadow-md transition-transform hover:scale-105 
          ${darkMode ? 'bg-[#5F7DB0] hover:bg-[#4A6A9E]' : 'bg-[#2C3E68] hover:bg-[#1F2F4F]'} text-white`}>
            Home
          </Link>

          <span className={`font-serif italic font-black text-xl tracking-tight ${darkMode ? 'text-[#5F7DB0]' : 'text-[#2C3E68]'}`}>
            BiblioTech
          </span>

        </div>
      </nav>

      <main className="max-w-7xl mx-auto pt-24 px-6">

        {loading && (
          <div className="flex items-center justify-center py-20">
            <div className="animate-pulse text-center">
              <div className="w-16 h-16 rounded-full bg-[#5F7DB0]/20 mx-auto mb-4"></div>
              <p className={`font-semibold ${darkMode ? "text-[#A0AEC0]" : "text-[#4A5568]"}`}>Loading your profile...</p>
            </div>
          </div>
        )}
        {error && !loading && (
          <div className="text-center py-20">
            <p className="text-red-500 font-semibold">{error}</p>
            <Link to="/" className="text-[#5F7DB0] underline mt-2 inline-block">Return Home</Link>
          </div>
        )}
        {banner.text && (
          <div className={`fixed top-20 left-1/2 -translate-x-1/2 z-50 px-6 py-3 rounded-xl shadow-lg transition-all duration-300 ${
            banner.type === "ok" ? "bg-emerald-500 text-white" : "bg-red-500 text-white"
          }`}>
            {banner.text}
          </div>
        )}

        {!loading && !error && (
        <>
        <div className={`p-8 rounded-3xl border shadow-xl mb-8 backdrop-blur-sm ${
          darkMode ? 'bg-[#1E2740]/80 border-[#2D3748]' : 'bg-white border-[#E2E8F0]'
        }`}>
          <div className="flex flex-col md:flex-row items-center gap-6">

            <div className="relative">
              <div className={`w-28 h-28 rounded-2xl flex items-center justify-center text-3xl font-black text-white shadow-lg overflow-hidden ${
                  darkMode ? 'bg-gradient-to-br from-[#5F7DB0] to-[#3E5A8E]' : 'bg-gradient-to-br from-[#2C3E68] to-[#1F2F4F]'
              }`}>
                {profilePicture ? (
                    <img src={`http://localhost:3000${profilePicture}`} alt="Profile" className="w-full h-full object-cover" key={profilePicture} />
                ) : (
                    initials
                )}
              </div>
              
              <button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading}
                  className={`absolute -bottom-2 -right-2 p-2 rounded-full shadow-lg transition-all hover:scale-110 ${
                      darkMode ? 'bg-[#5F7DB0] text-white' : 'bg-[#2C3E68] text-white'
                  }`}
              >
                  {uploading ? '⏳' : '📷'}
              </button>
              
              <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleImageUpload}
                  accept="image/jpeg,image/png,image/gif,image/webp"
                  className="hidden"
              />
            </div>

            <div className="text-center md:text-left flex-1">
              <h2 className="text-3xl font-black mb-2 tracking-tight">{userName}</h2>

              <div className="flex flex-wrap gap-4 justify-center md:justify-start font-semibold opacity-70 text-sm mb-4">
                <span><FaCalendarAlt className="inline mr-1"/> Joined {joined}</span>
                <span><FaBookOpen className="inline mr-1"/> {booksRead} books read</span>
                <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase text-white ${
                  darkMode ? 'bg-[#5F7DB0]' : 'bg-[#2C3E68]'
                }`}>
                  <FaCrown className="inline mr-1"/> {rank}
                </span>
              </div>

              {/* Next Rank Progress Bar */}
              {nextRankGoal && (
                <div className="max-w-md mx-auto md:mx-0">
                  <div className="flex justify-between text-xs opacity-60 mb-1">
                    <span>Progress to next rank</span>
                    <span>{booksRead}/{nextRankGoal} books</span>
                  </div>
                  <div className="h-2 bg-gray-600/30 rounded-full overflow-hidden">
                    <div className="h-full bg-[#5F7DB0] rounded-full transition-all" style={{ width: `${(booksRead / nextRankGoal) * 100}%` }} />
                  </div>
                  <p className="text-xs opacity-50 mt-1">{booksToNextRank} more books to reach next rank!</p>
                </div>
              )}
            </div>

          </div>
        </div>

        {/* Reading Analysis Section */}
        <section className="mb-10">
          <div className="flex items-center gap-3 mb-4 px-1">
            <FaChartLine className="text-[#5F7DB0] text-xl" />
            <h2 className="text-xl font-black uppercase tracking-wider">Reading Analysis</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className={`p-6 rounded-2xl border transition hover:scale-[1.02] ${
              darkMode ? 'bg-[#1E2740] border-[#2D3748]' : 'bg-white border-[#E2E8F0] shadow-sm'
            }`}>
              <div className="flex items-center justify-between mb-2">
                <FaBookOpen className="text-emerald-500 text-xl"/>
                <span className="text-xs opacity-50 font-semibold uppercase">This Month</span>
              </div>
              <p className="text-3xl font-black">{profile?.stats?.monthly ?? "—"}</p>
              <p className="text-xs opacity-60 mt-1">Books Read</p>
            </div>

            <div className={`p-6 rounded-2xl border transition hover:scale-[1.02] ${
              darkMode ? 'bg-[#1E2740] border-[#2D3748]' : 'bg-white border-[#E2E8F0] shadow-sm'
            }`}>
              <div className="flex items-center justify-between mb-2">
                <FaFileAlt className="text-blue-400 text-xl"/>
                <span className="text-xs opacity-50 font-semibold uppercase">This Year</span>
              </div>
              <p className="text-3xl font-black">{profile?.stats?.pagesYear ?? "—"}</p>
              <p className="text-xs opacity-60 mt-1">Pages Read</p>
            </div>

            <div className={`p-6 rounded-2xl border transition hover:scale-[1.02] ${
              darkMode ? 'bg-[#1E2740] border-[#2D3748]' : 'bg-white border-[#E2E8F0] shadow-sm'
            }`}>
              <div className="flex items-center justify-between mb-2">
                <FaHeart className="text-pink-500 text-xl"/>
                <span className="text-xs opacity-50 font-semibold uppercase">Favorite</span>
              </div>
              <p className="text-2xl font-black truncate">{profile?.stats?.favGenre ?? "—"}</p>
              <p className="text-xs opacity-60 mt-1">Genre</p>
            </div>

            <div className={`p-6 rounded-2xl border transition hover:scale-[1.02] ${
              darkMode ? 'bg-[#1E2740] border-[#2D3748]' : 'bg-white border-[#E2E8F0] shadow-sm'
            }`}>
              <div className="flex items-center justify-between mb-2">
                <FaStar className="text-yellow-500 text-xl"/>
                <span className="text-xs opacity-50 font-semibold uppercase">Reading Streak</span>
              </div>
              <p className="text-3xl font-black">{Math.floor(booksRead / 2) || 0}</p>
              <p className="text-xs opacity-60 mt-1">Days Active</p>
            </div>
          </div>
        </section>

        {/* Quick Stats Info Box */}
        <div className={`mb-8 p-4 rounded-xl border ${darkMode ? 'bg-[#1E2740]/50 border-[#2D3748]' : 'bg-blue-50 border-blue-100'}`}>
          <div className="flex items-center gap-2 mb-2">
            <FaLightbulb className="text-yellow-500" />
            <span className="text-sm font-semibold">Did you know?</span>
          </div>
          <p className="text-xs opacity-70">
            Reading just 20 minutes a day can help you finish over 30 books in a year! 
            Keep up the great work! 📚
          </p>
        </div>

        {/* Completed Games Section */}
        <GameSection 
          title="Finished Games" 
          icon={<FaTrophy className="text-yellow-500" />} 
          games={completedGames} 
          darkMode={darkMode} 
          isCompleted={true}
        />

        {/* Current Games Section */}
        <GameSection 
          title="Current Games Enrolled" 
          icon={<FaHourglassHalf className="text-blue-400" />} 
          games={currentGames} 
          darkMode={darkMode} 
          isCompleted={false}
        />

        {/* Reading Collections */}
        <BookSection title="Favorite Books" icon={<FaStar className="text-yellow-500" />} books={favorite} darkMode={darkMode} />
        <BookSection title="Books Read" icon={<FaBookOpen className="text-emerald-500" />} books={completed} darkMode={darkMode} />
        <BookSection title="Wish to Read" icon={<FaBookmark className="text-blue-400" />} books={wishlist} darkMode={darkMode} />
        <BookSection title="Currently Reading" icon={<FaHourglassHalf className="text-orange-400" />} books={reading} darkMode={darkMode} isReading={true} />
        <BookSection 
          title="Borrowed Books" 
          icon={<FaHistory className="text-[#5F7DB0]" />} 
          books={borrowedBooks} 
          darkMode={darkMode} 
          isBorrowed={true} 
          onReturn={handleReturn} 
        />
        <BookSection title="Purchased Library" icon={<FaTrophy className="text-purple-500" />} books={purchased} darkMode={darkMode} isBought={true} />

        {/* Reading Tip Footer */}
        <div className={`mt-12 p-6 rounded-2xl border-t flex items-center justify-between flex-wrap gap-4 ${
          darkMode ? 'border-white/5' : 'border-black/5'
        }`}>
          <div className="flex items-center gap-3">
            <FaTrophy className="text-yellow-500 text-xl" />
            <div>
              <p className="font-bold text-sm uppercase tracking-[0.2em]">Reading Excellence</p>
              <p className="text-xs opacity-50">Keep reading to unlock more achievements</p>
            </div>
          </div>
          <Link to="/all-games" className={`text-sm font-semibold flex items-center gap-1 hover:gap-2 transition-all ${
            darkMode ? 'text-[#5F7DB0]' : 'text-[#2C3E68]'
          }`}>
            Explore Games <FaArrowRight className="text-xs" />
          </Link>
        </div>
        </>
        )}

      </main>
    </div>
  );
};

// GameCard component
const GameCard = ({ game, darkMode, isCompleted = false, progress = null }) => {
    const navigate = useNavigate();
    const img = game.image || hero;
    
    return (
        <div
            onClick={() => navigate(`/games/${game.id}`)}
            className={`group flex-shrink-0 w-64 p-4 rounded-xl cursor-pointer transition-all duration-300 hover:-translate-y-2 ${
                darkMode
                    ? 'bg-[#1E2740] text-white hover:bg-[#25304d]'
                    : 'bg-white shadow-md text-gray-800 hover:shadow-xl'
            }`}
        >
            <div className="h-48 overflow-hidden rounded-lg mb-4 bg-gray-200 relative">
                <img
                    src={img}
                    alt={game.title}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                {isCompleted && (
                    <div className="absolute top-2 right-2 bg-green-500 text-white text-[10px] font-black px-2 py-1 rounded-full">
                        ✓ Completed
                    </div>
                )}
                {progress !== null && progress > 0 && (
                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-600">
                        <div className="h-full bg-blue-500 rounded-full transition-all" style={{ width: `${progress}%` }} />
                    </div>
                )}
            </div>
            <h3 className="font-bold truncate text-lg">{game.title}</h3>
            <p className="text-xs opacity-70 line-clamp-2 mb-2">{game.description}</p>
            <div className="flex items-center justify-between">
                <span className="text-xs opacity-50">{game.difficulty}</span>
                {isCompleted && game.completedAt && (
                    <span className="text-[10px] opacity-50">
                        Completed: {new Date(game.completedAt).toLocaleDateString()}
                    </span>
                )}
                {progress !== null && (
                    <span className="text-xs font-semibold text-blue-500">{progress}%</span>
                )}
            </div>
        </div>
    );
};

// GameSection component
const GameSection = ({ title, icon, games, darkMode, isCompleted = false }) => {
    const scrollRef = useRef(null);
    
    return (
        <section className="py-8">
            <div className="flex items-center gap-2 mb-4">
                <span className="text-lg">{icon}</span>
                <h2 className="text-lg font-black uppercase tracking-wide">{title}</h2>
            </div>
            <div ref={scrollRef} className="flex space-x-4 overflow-x-auto scrollbar-hide pb-3">
                {games.length > 0 ? (
                    games.map((game) => (
                        <GameCard
                            key={game.id}
                            game={game}
                            darkMode={darkMode}
                            isCompleted={isCompleted}
                            progress={!isCompleted ? game.progress : null}
                        />
                    ))
                ) : (
                    <div className={`w-full py-6 text-center rounded-xl border-2 border-dashed ${
                        darkMode ? 'border-white/10 opacity-30' : 'border-black/10'
                    }`}>
                        <p className="text-xs font-bold uppercase opacity-50">No games here</p>
                        <Link to="/all-games" className="text-xs text-[#5F7DB0] mt-2 inline-block">Explore Games →</Link>
                    </div>
                )}
            </div>
        </section>
    );
};

// BookCard component
const BookCard = ({ book, darkMode, isBorrowed, isBought, isReading, onReturn }) => (
  <div className={`flex-shrink-0 w-56 p-3 rounded-xl transition-all duration-300 hover:-translate-y-1 ${
    darkMode
      ? 'bg-[#1E2740] border border-[#2D3748]'
      : 'bg-white shadow-lg'
  }`}>

    <div className="h-64 overflow-hidden rounded-lg mb-3 bg-gray-200 relative">
      <img src={book.coverUrl || defaultimage} className="w-full h-full object-cover" alt={book.title} />

      {isReading && (
        <div className="absolute top-2 right-2 bg-[#5F7DB0] text-white text-[9px] font-black px-2 py-1 rounded-full animate-pulse">
          ACTIVE
        </div>
      )}

    </div>

    <h3 className="font-bold truncate text-sm">{book.title}</h3>

    {isBorrowed ? (
      <div className="mt-2 space-y-1">
        <div className="text-[10px] opacity-60"><FaHistory className="inline mr-1"/> {book.borrowDate || "—"}</div>
        <div className="text-[10px] text-red-400 font-semibold"><FaClock className="inline mr-1"/> {book.dueDate || "—"}</div>
        <button 
          type="button"
          onClick={() => onReturn(book.id)}
          className="w-full mt-2 py-2 rounded-lg border border-red-400 text-red-400 text-[10px] font-bold hover:bg-red-500 hover:text-white transition"
        >
          <FaUndo className="inline mr-1"/> Return
        </button>
      </div>
    ) : (
      <div className="mt-2">
        {isBought && <p className="text-[9px] opacity-40 mb-1">Purchased {book.purchaseDate || "—"}</p>}
        <p className="text-lg font-black text-[#5F7DB0]">${(book.price || 0).toFixed(2)}</p>
      </div>
    )}
  </div>
);

// BookSection component
const BookSection = ({ title, icon, books, darkMode, isBorrowed, isBought, isReading, onReturn }) => {
  const scrollRef = useRef(null);
  
  return (
    <section className="py-8">
      <div className="flex items-center gap-2 mb-4">
        <span className="text-lg">{icon}</span>
        <h2 className="text-lg font-black uppercase tracking-wide">{title} {books.length > 0 && `(${books.length})`}</h2>
      </div>
      <div ref={scrollRef} className="flex space-x-4 overflow-x-auto scrollbar-hide pb-3">
        {books.length > 0 ? (
          books.map((book) => (
            <BookCard
              key={book.id}
              book={book}
              darkMode={darkMode}
              isBorrowed={isBorrowed}
              isBought={isBought}
              isReading={isReading}
              onReturn={onReturn}
            />
          ))
        ) : (
          <div className={`w-full py-6 text-center rounded-xl border-2 border-dashed ${
            darkMode ? 'border-white/10 opacity-30' : 'border-black/10'
          }`}>
            <p className="text-xs font-bold uppercase opacity-50">No books here</p>
            <Link to="/search" className="text-xs text-[#5F7DB0] mt-2 inline-block">Discover Books →</Link>
          </div>
        )}
      </div>
    </section>
  );
};

export default Profile;
