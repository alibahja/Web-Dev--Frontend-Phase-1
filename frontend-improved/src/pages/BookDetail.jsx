import { useState, useEffect, useCallback } from "react";
import { Link, useLocation, useParams, useNavigate } from "react-router-dom";
import { motion as M, AnimatePresence } from "framer-motion";
import defaultimage from "../assets/default-book-cover.jpg";
import CustomAlert from "./CustomAlert";
import api from "../api/client";
import { extractList, normalizeBook } from "../api/normalize";

const BookSplash = ({ darkMode, title, author, onDone }) => {
  const [phase, setPhase] = useState("closed");
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const t1 = setTimeout(() => setPhase("opening"), 350);
    const t2 = setTimeout(() => setPhase("open"), 1500);
    const t3 = setTimeout(() => setPhase("leaving"), 2200);
    const t4 = setTimeout(() => {
      setVisible(false);
      onDone();
    }, 2750);

    return () => [t1, t2, t3, t4].forEach(clearTimeout);
  }, [onDone]);

  if (!visible) return null;

  const bg = darkMode ? "#0A0F1F" : "#F8F9FC";
  const coverBg = darkMode ? "#1E2740" : "#2C3E68";
  const coverBorder = darkMode ? "#5F7DB0" : "#4A6A9E";
  const spineCol = darkMode ? "#162035" : "#1F2F4F";
  const pageCol = darkMode ? "#e8dcc8" : "#f5efe6";
  const textMain = darkMode ? "#F0F4FA" : "#ffffff";
  const textSub = darkMode ? "#7BA3D4" : "rgba(255,255,255,0.75)";

  const flipAngle = phase === "closed" ? 0 : -180;

  return (
    <AnimatePresence>
      {visible && (
        <M.div
          initial={{ opacity: 1 }}
          animate={{ opacity: phase === "leaving" ? 0 : 1 }}
          transition={{ duration: 0.35, ease: "easeInOut" }}
          className="fixed inset-0 z-[9999] overflow-hidden flex"
          style={{ background: bg }}
        >
          <div
            className="w-1/2 h-full"
            style={{
              background: `linear-gradient(90deg, ${pageCol} 0%, #ede0cc 100%)`,
              opacity: phase === "closed" ? 0 : 1,
              transition: "opacity 0.3s ease 0.25s",
            }}
          />

          <div className="w-1/2 h-full relative">
            <div
              className="absolute left-0 top-0 h-full w-[6px]"
              style={{
                background: spineCol,
                boxShadow: "inset -2px 0 6px rgba(0,0,0,0.4)",
                zIndex: 5,
              }}
            />

            <div
              className="absolute inset-0"
              style={{
                transform: `rotateY(${flipAngle}deg)`,
                transformOrigin: "left center",
                transformStyle: "preserve-3d",
                transition: "transform 0.85s cubic-bezier(0.4,0,0.2,1)",
              }}
            >
              <div
                className="absolute inset-0 flex flex-col items-center justify-center gap-6 p-12"
                style={{
                  backfaceVisibility: "hidden",
                  background: `linear-gradient(145deg, ${coverBg} 0%, ${
                    darkMode ? "#162035" : "#1a2a4a"
                  } 100%)`,
                  borderLeft: `2px solid ${coverBorder}`,
                  boxShadow: "-12px 0 30px rgba(0,0,0,0.5)",
                }}
              >
                <div
                  className="text-2xl font-bold text-center"
                  style={{
                    color: textMain,
                    fontFamily: "Georgia, serif",
                  }}
                >
                  {title}
                </div>

                <div
                  className="text-sm uppercase tracking-[4px]"
                  style={{
                    color: textSub,
                    fontFamily: "Georgia, serif",
                  }}
                >
                  {author}
                </div>
              </div>

              <div
                className="absolute inset-0 flex items-center justify-center p-12"
                style={{
                  transform: "rotateY(180deg)",
                  backfaceVisibility: "hidden",
                  background: "linear-gradient(160deg, #f5efe6 0%, #ede0cc 100%)",
                }}
              >
                <p className="text-center italic text-[#4a3020] max-w-md text-lg leading-relaxed">
                  &quot;Between every life and another, there is always a story waiting.&quot;
                </p>
              </div>
            </div>

            <M.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{
                opacity: phase === "opening" || phase === "open" || phase === "leaving" ? 1 : 0,
                scale: phase === "opening" || phase === "open" || phase === "leaving" ? 1 : 0.95,
              }}
              transition={{ duration: 0.8 }}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center"
            >
              <p className="text-xl font-bold">{title}</p>
              <p className="text-xs uppercase tracking-[3px] opacity-70 mt-1">
                by {author}
              </p>
            </M.div>
          </div>
        </M.div>
      )}
    </AnimatePresence>
  );
};

const BookDetail = ({ darkMode }) => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const initialBook = location.state?.book;
  const isRandom = location.state?.isRandom || false;

  const [data, setData] = useState(() =>
    initialBook && String(initialBook.id) === String(id) ? normalizeBook(initialBook) : null
  );
  const [loading, setLoading] = useState(() => !(initialBook && String(initialBook.id) === String(id)));
  const [loadError, setLoadError] = useState("");
  const [moreBooks, setMoreBooks] = useState([]);

  const [showAlert, setShowAlert] = useState(false);
  const [alertPayload, setAlertPayload] = useState({ title: "", message: "", type: "success" });

  const showMessage = (title, message, type = "success") => {
    setAlertPayload({ title, message, type });
    setShowAlert(true);
  };

  const [showSplash, setShowSplash] = useState(true);
  const [showDiceAnimation, setShowDiceAnimation] = useState(isRandom);
  const [showRateModal, setShowRateModal] = useState(false);
  const [userRating, setUserRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [actionLoading, setActionLoading] = useState(false);
  const [bookStatus, setBookStatus] = useState({
    isBorrowed: false,
    isCompleted: false,
    isReading: false,
    isWishlist: false,
    isFavorite: false,
    isPurchased: false
});

  const token = () => localStorage.getItem("token");
  const requireLogin = () => {
    navigate("/login", { state: { from: `/book/${id}` } });
  };
  useEffect(() => {
    if (token() && data?.id) {
        const fetchStatus = async () => {
            try {
                const { data: statusData } = await api.get(`/api/profile/book/${data.id}/status`);
                setBookStatus(statusData);
            } catch (err) {
                console.error('Failed to fetch book status:', err);
            }
        };
        fetchStatus();
    }
}, [data?.id]);
  const loadBook = useCallback(async () => {
    setLoading(true);
    setLoadError("");
    try {
      const { data: body } = await api.get(`/api/books/${id}`);
      const raw = body.book ?? body;
      const book = normalizeBook(raw);
      setData(book);
      setUserRating(Number(raw.userRating ?? raw.myRating ?? raw.ratingUser ?? 0) || 0);

      if (book?.author) {
        try {
          const s = await api.get(`/api/books/search?q=${encodeURIComponent(book.author)}`);
          const list = extractList(s.data)
            .map(normalizeBook)
            .filter((b) => b && String(b.id) !== String(id))
            .slice(0, 4);
          setMoreBooks(list);
        } catch {
          setMoreBooks([]);
        }
      }
    } catch (e) {
      setLoadError(e.response?.data?.message || e.response?.data?.error || "Could not load this book.");
      setData(null);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  useEffect(() => {
    if (isRandom) {
      const timer = setTimeout(() => setShowDiceAnimation(false), 1400);
      return () => clearTimeout(timer);
    }
  }, [isRandom]);

  useEffect(() => {
    loadBook();
  }, [loadBook]);

 const handleBorrow = async () => {
    if (!data) return;
    if (!token()) return requireLogin();
    if (bookStatus.isBorrowed) {
        showMessage("Already borrowed", "You have already borrowed this book.", "info");
        return;
    }
    setActionLoading(true);
    try {
        await api.post("/api/profile/borrow", { bookId: data.id, daysToBorrow: 14 });
        setBookStatus(prev => ({ ...prev, isBorrowed: true }));
        showMessage("Book borrowed", "You have successfully borrowed this book. Enjoy reading 📚", "success");
    } catch (e) {
        showMessage("Borrow failed", e.response?.data?.message || e.response?.data?.error || "Could not borrow.", "error");
    } finally {
        setActionLoading(false);
    }
};

  const handleBuy = async () => {
    if (!data) return;
    if (!token()) return requireLogin();
    setActionLoading(true);
    try {
      await api.post("/api/profile/collection", {
        bookId: data.id,
        status: "purchased",
        purchaseDate: new Date().toISOString().slice(0, 10),
      });
      showMessage("Added to library", "Purchase recorded on your profile.", "success");
    } catch (e) {
      showMessage("Purchase failed", e.response?.data?.message || e.response?.data?.error || "Could not complete purchase.", "error");
    } finally {
      setActionLoading(false);
    }
  };

  const toggleShelf = async (status, displayStatus) => {
    if (!data) return;
    if (!token()) return requireLogin();
    setActionLoading(true);
    try {
        const isActive = bookStatus[displayStatus];
        
        if (isActive) {
            // Remove from collection
            await api.delete("/api/profile/collection", { 
                data: { bookId: data.id, status: status } 
            });
            setBookStatus(prev => ({ ...prev, [displayStatus]: false }));
            showMessage("Removed", `Book removed from ${status} list.`, "success");
        } else {
            // Add to collection
            await api.post("/api/profile/collection", { bookId: data.id, status });
            setBookStatus(prev => ({ ...prev, [displayStatus]: true }));
            showMessage("Added", `Book added to ${status} list.`, "success");
        }
    } catch (e) {
        showMessage("Update failed", e.response?.data?.message || "Could not update shelf.", "error");
    } finally {
        setActionLoading(false);
    }
};

  const submitRating = async (star) => {
    if (!data) return;
    if (!token()) return requireLogin();
    try {
      await api.post("/api/profile/rating", { bookId: data.id, rating: star });
      setUserRating(star);
      setShowRateModal(false);
      showMessage("Thanks!", "Your rating has been saved.", "success");
    } catch (e) {
      showMessage("Rating failed", e.response?.data?.message || e.response?.data?.error || "Could not save rating.", "error");
    }
  };

  if (loading && !data) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${darkMode ? "bg-[#0A0F1F] text-white" : "bg-[#F8F9FC]"}`}>
        <p className="font-semibold animate-pulse">Loading book…</p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className={`min-h-screen flex flex-col items-center justify-center gap-4 px-6 ${darkMode ? "bg-[#0A0F1F] text-white" : "bg-[#F8F9FC]"}`}>
        <p className="text-center font-semibold">{loadError || "Book not found."}</p>
        <Link to="/" className="text-[#5F7DB0] font-bold underline">
          Back home
        </Link>
      </div>
    );
  }

  const roundedRating = Number(data.rating || 0).toFixed(1);

  return (
    <div className={`min-h-screen transition-colors duration-500 ${
      darkMode ? "bg-[#0A0F1F] text-[#F0F4FA]" : "bg-[#F8F9FC] text-[#1F2937]"
    }`}>

      {showSplash && (
        <BookSplash
          darkMode={darkMode}
          title={data.title}
          author={data.author}
          onDone={() => setShowSplash(false)}
        />
      )}

      <nav className={`fixed top-0 left-0 right-0 z-[100] backdrop-blur-md border-b transition-all duration-300 ${
        darkMode
          ? "bg-[#1E2740]/80 border-[#2D3748]"
          : "bg-[#2C3E68]/90 border-[#E2E8F0] text-white shadow-lg"
      }`}>
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-8">
            <Link to="/" className="font-bold tracking-tight hover:opacity-70 transition-opacity">Home</Link>
            <div className="hidden md:flex items-center space-x-2">
              <span className="text-xs uppercase tracking-widest font-bold opacity-60">Genre:</span>
              <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                darkMode ? "bg-[#5F7DB0]/20 text-[#5F7DB0]" : "bg-white/20 text-white"
              }`}>
                {data.genre || "—"}
              </span>
            </div>
          </div>
          <div className="flex items-center space-x-6">
            <Link
              to={`/comments/book/${data.id}`}
              state={{ type: "book", data }}
              className="text-2xl hover:scale-110 transition-transform"
            >💬</Link>
            <div className={`h-8 w-[1px] ${darkMode ? "bg-gray-700" : "bg-white/20"}`} />
          </div>
        </div>
      </nav>

      <div className={`fixed top-0 left-0 w-full h-[500px] opacity-10 pointer-events-none blur-[120px] transition-colors ${
        darkMode ? "bg-[#5F7DB0]" : "bg-[#2C3E68]"
      }`} />

      <M.main
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
        className="relative pt-32 pb-20 px-4 md:px-10 max-w-7xl mx-auto space-y-20"
      >
        <AnimatePresence>
          {showDiceAnimation && (
            <M.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed top-0 left-0 w-screen h-screen z-[999] flex items-center justify-center bg-black/40 backdrop-blur-sm"
            >
              <M.div
                initial={{ scale: 0.7, rotate: 0 }}
                animate={{ scale: [0.7, 1.15, 1], rotate: [0, 180, 360, 540] }}
                exit={{ scale: 0.8, opacity: 0 }}
                transition={{ duration: 1.1, ease: "easeInOut" }}
                className={`w-24 h-24 rounded-3xl shadow-2xl flex items-center justify-center text-4xl font-bold border-4 ${
                  darkMode
                    ? "bg-[#1E2740] border-[#5F7DB0] text-white"
                    : "bg-white border-[#2C3E68] text-[#1F2937]"
                }`}
              >🎲</M.div>
            </M.div>
          )}
        </AnimatePresence>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">

          <div className="lg:col-span-4 space-y-8">
            <div className={`group relative rounded-[2rem] overflow-hidden shadow-2xl border-8 transition-all duration-500 hover:rotate-1 ${
              darkMode ? "border-[#1E2740]" : "border-white"
            }`}>
              <img src={data.coverUrl || defaultimage} alt={data.title} className="w-full h-auto object-cover" />
            </div>
            <div className="flex flex-col gap-4">
                      <button
                              type="button"
                             disabled={actionLoading || bookStatus.isBorrowed}
                             onClick={handleBorrow}
                            className={`py-4 rounded-2xl font-black text-lg shadow-xl transition-all active:scale-95 ${
                             bookStatus.isBorrowed 
                                 ? "bg-green-600 cursor-not-allowed"
                            : darkMode ? "bg-[#5F7DB0] hover:bg-[#4A6A9E]" : "bg-[#2C3E68] hover:bg-[#1F2F4F]"
                               } text-white`}
                              >
                          {bookStatus.isBorrowed ? "✓ Borrowed" : "📖 Borrow Now"}
                </button>
              <button
                type="button"
                disabled={actionLoading}
                onClick={handleBuy}
                className={`py-4 rounded-2xl font-black text-lg shadow-xl transition-all active:scale-95 ${
                darkMode ? "bg-[#6c6f74] hover:bg-[#3c4047]" : "bg-[#d41b1b] hover:bg-[#a62323]"
              } text-white`}>
                📖 Buy Now
              </button>
              <div className="grid grid-cols-2 gap-3 mt-4">
    <ShelfBtn 
        icon="✓" 
        text="Read" 
        darkMode={darkMode} 
        disabled={actionLoading} 
        active={bookStatus.isCompleted}
        onClick={() => toggleShelf("completed", "isCompleted")} 
    />
    <ShelfBtn 
        icon="📖" 
        text="Reading" 
        darkMode={darkMode} 
        disabled={actionLoading} 
        active={bookStatus.isReading}
        onClick={() => toggleShelf("reading", "isReading")} 
    />
    <ShelfBtn 
        icon="🔖" 
        text="Want to Read" 
        darkMode={darkMode} 
        disabled={actionLoading} 
        active={bookStatus.isWishlist}
        onClick={() => toggleShelf("wishlist", "isWishlist")} 
    />
    <ShelfBtn 
        icon="❤" 
        text="Favorite" 
        darkMode={darkMode} 
        disabled={actionLoading} 
        active={bookStatus.isFavorite}
        onClick={() => toggleShelf("favorite", "isFavorite")} 
    />
</div>
            </div>
          </div>

          <div className="lg:col-span-8 space-y-10">
            <section>
              <h1 className="text-5xl md:text-7xl font-black mb-4 tracking-tighter leading-tight">
                {data.title}
              </h1>
              <div className="flex items-center space-x-6">
                <p className="text-2xl opacity-80">
                  by <span className="font-bold underline decoration-[#5F7DB0] underline-offset-4">{data.author}</span>
                </p>
                <div className="bg-yellow-500/10 text-yellow-500 px-4 py-1.5 rounded-xl flex items-center font-black">
                  <span className="mr-2">★</span> {roundedRating}
                </div>
              </div>
            </section>

            <div className={`p-8 rounded-[2rem] border transition-all ${
              darkMode ? "bg-[#1E2740] border-[#2D3748]" : "bg-white border-[#E2E8F0] shadow-xl shadow-blue-900/5"
            }`}>
              <h2 className="text-xs uppercase tracking-widest font-black mb-4 text-[#5F7DB0]">Synopsis</h2>
              <p className="text-lg leading-relaxed opacity-90">{data.description || "No description available."}</p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <StatCard label="Publisher"  value={data.publisher || "—"}       icon="🏢" darkMode={darkMode} />
              <StatCard label="Date"       value={data.publicationDate || "—"} icon="📅" darkMode={darkMode} />
              <StatCard label="Location"   value={data.placeOfPublish || "—"}  icon="📍" darkMode={darkMode} />
              <StatCard label="ISBN"       value={data.ISBN || "—"}            icon="🔢" darkMode={darkMode} />
              <StatCard label="Language"   value={data.language || "—"}        icon="🌐" darkMode={darkMode} />
              <StatCard label="Type"       value={data.type || "—"}            icon="📚" darkMode={darkMode} />
              <StatCard label="Pages"      value={data.pages ?? "—"}           icon="📄" darkMode={darkMode} />
              <StatCard
                label="Stock"
                value={`${data.copiesleft ?? "—"} Left`}
                icon="📦"
                color={Number(data.copiesleft) > 0 ? "text-emerald-500" : "text-red-500"}
                darkMode={darkMode}
              />
            </div>

            <div className={`p-8 rounded-[2rem] border-2 border-dashed transition-all flex flex-col md:flex-row items-center justify-between gap-6 ${
              darkMode ? "border-[#5F7DB0]/30 bg-[#5F7DB0]/5" : "border-[#2C3E68]/10 bg-[#2C3E68]/5"
            }`}>
              <div className="text-center md:text-left">
                <h3 className="text-2xl font-black">Your Review</h3>
                <p className="opacity-60">Help others discover this book</p>
              </div>
              <div className="flex flex-col items-center gap-3">
                <button
                  type="button"
                  onClick={() => {
                    if (!token()) requireLogin();
                    else setShowRateModal(true);
                  }}
                  className={`px-8 py-3 rounded-xl font-bold text-white shadow-lg transition-all active:scale-95 ${
                    darkMode ? "bg-[#5F7DB0]" : "bg-[#2C3E68]"
                  }`}
                >
                  {userRating > 0 ? "Update Rating" : "Rate Book"}
                </button>
                {userRating > 0 && (
                  <div className="flex text-yellow-500 text-2xl">
                    {[...Array(5)].map((_, i) => <span key={i}>{i < userRating ? "★" : "☆"}</span>)}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <section className="pt-10 border-t border-gray-500/20">
          <h2 className="text-3xl font-black mb-8">More Work by {data.author}</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {moreBooks.map((b) => (
              <Link key={b.id} to={`/book/${b.id}`} state={{ book: b }}>
              <div
                className={`p-6 rounded-3xl border transition-all hover:-translate-y-2 cursor-pointer ${
                  darkMode ? "bg-[#1E2740] border-[#2D3748] hover:bg-[#25304d]" : "bg-white border-[#E2E8F0] hover:shadow-xl"
                }`}
              >
                <div className="aspect-[3/4] bg-gray-500/20 rounded-xl mb-4 flex items-center justify-center text-4xl opacity-50 overflow-hidden">
                  {b.coverUrl ? <img src={b.coverUrl} alt="" className="w-full h-full object-cover" /> : "📖"}
                </div>
                <h3 className="font-bold truncate">{b.title}</h3>
                <p className="text-sm opacity-60">{b.year ?? "—"}</p>
              </div>
              </Link>
            ))}
          </div>
        </section>
      </M.main>

      {showRateModal && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className={`w-full max-w-sm p-10 rounded-[2.5rem] text-center border ${
            darkMode ? "bg-[#1E2740] border-[#2D3748]" : "bg-white border-[#E2E8F0]"
          }`}>
            <h2 className="text-2xl font-black mb-6">Rate this Book</h2>
            <div className="flex justify-center space-x-2 mb-8">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  onClick={() => submitRating(star)}
                  className="text-4xl transition-transform hover:scale-125"
                >
                  <span className={(hoverRating || userRating) >= star ? "text-yellow-500" : "text-gray-300"}>★</span>
                </button>
              ))}
            </div>
            <button type="button" onClick={() => setShowRateModal(false)} className="text-sm font-bold opacity-50">Cancel</button>
          </div>
        </div>
      )}
      <CustomAlert
  show={showAlert}
  onClose={() => setShowAlert(false)}
  title={alertPayload.title}
  message={alertPayload.message}
  type={alertPayload.type}
/>
    </div>
  );
};

const StatCard = ({ label, value, icon, color, darkMode }) => (
  <div className={`p-4 rounded-2xl border transition-all ${
    darkMode ? "bg-[#1E2740] border-[#2D3748]" : "bg-gray-50 border-[#E2E8F0]"
  }`}>
    <div className="flex items-center space-x-2 mb-1">
      <span className="text-lg">{icon}</span>
      <p className="text-[10px] uppercase tracking-widest font-black opacity-40">{label}</p>
    </div>
    <p className={`font-bold text-sm truncate ${color || (darkMode ? "text-white" : "text-[#1F2937]")}`}>{value}</p>
  </div>
);

const ShelfBtn = ({ icon, text, darkMode, onClick, disabled, active }) => (
    <button
        type="button"
        disabled={disabled}
        onClick={onClick}
        className={`flex items-center justify-center space-x-2 px-4 py-2.5 rounded-xl text-xs font-bold border transition-all hover:scale-105 active:scale-95 disabled:opacity-50 ${
            active
                ? darkMode 
                    ? "bg-[#5F7DB0] border-[#5F7DB0] text-white" 
                    : "bg-[#2C3E68] border-[#2C3E68] text-white"
                : darkMode
                    ? "border-[#2D3748] bg-[#1E2740] text-[#A0AEC0] hover:text-white"
                    : "border-[#E2E8F0] bg-white text-[#4A5568] hover:bg-gray-50"
        }`}
    >
        <span>{icon}</span>
        <span>{text}</span>
    </button>
);

export default BookDetail;

