import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import defaultimage from "../assets/default-book-cover.jpg";
import CustomAlert from "./CustomAlert";

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

  // colors
  const bg = darkMode ? "#0A0F1F" : "#F8F9FC";
  const coverBg = darkMode ? "#1E2740" : "#2C3E68";
  const coverBorder = darkMode ? "#5F7DB0" : "#4A6A9E";
  const spineCol = darkMode ? "#162035" : "#1F2F4F";
  const pageCol = darkMode ? "#e8dcc8" : "#f5efe6";
  const gold = darkMode ? "#7BA3D4" : "#ffffff";
  const textMain = darkMode ? "#F0F4FA" : "#ffffff";
  const textSub = darkMode ? "#7BA3D4" : "rgba(255,255,255,0.75)";

  const flipAngle = phase === "closed" ? 0 : -180;

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 1 }}
          animate={{ opacity: phase === "leaving" ? 0 : 1 }}
          transition={{ duration: 0.35, ease: "easeInOut" }}
          className="fixed inset-0 z-[9999] overflow-hidden flex"
          style={{ background: bg }}
        >
          {/* LEFT SIDE (pages) */}
          <div
            className="w-1/2 h-full"
            style={{
              background: `linear-gradient(90deg, ${pageCol} 0%, #ede0cc 100%)`,
              opacity: phase === "closed" ? 0 : 1,
              transition: "opacity 0.3s ease 0.25s",
            }}
          >
          </div>

          {/* RIGHT SIDE */}
          <div className="w-1/2 h-full relative">
            {/* SPINE */}
            <div
              className="absolute left-0 top-0 h-full w-[6px]"
              style={{
                background: spineCol,
                boxShadow: "inset -2px 0 6px rgba(0,0,0,0.4)",
                zIndex: 5,
              }}
            />

            {/* COVER */}
            <div
              className="absolute inset-0"
              style={{
                transform: `rotateY(${flipAngle}deg)`,
                transformOrigin: "left center",
                transformStyle: "preserve-3d",
                transition:
                  "transform 0.85s cubic-bezier(0.4,0,0.2,1)",
              }}
            >
              {/* FRONT */}
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

              {/* INSIDE */}
              <div
                className="absolute inset-0 flex items-center justify-center p-12"
                style={{
                  transform: "rotateY(180deg)",
                  backfaceVisibility: "hidden",
                  background:
                    "linear-gradient(160deg, #f5efe6 0%, #ede0cc 100%)",
                }}
              >
                <p className="text-center italic text-[#4a3020] max-w-md text-lg leading-relaxed">
                  "Between every life and another, there is always a story waiting."
                </p>
              </div>
            </div>

            {/* TITLE — CENTER OF RIGHT SIDE */}
            <motion.div
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
            </motion.div>
          </div>

          
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const BookDetail = ({ darkMode }) => {
  const [showAlert, setShowAlert] = useState(false);
  const location = useLocation();
  const book = location.state?.book;
  const isRandom = location.state?.isRandom || false;

  const [showSplash, setShowSplash]               = useState(true);
  const [showDiceAnimation, setShowDiceAnimation]  = useState(isRandom);
  const [showRateModal, setShowRateModal]           = useState(false);
  const [userRating, setUserRating]                 = useState(0);
  const [hoverRating, setHoverRating]               = useState(0);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  useEffect(() => {
    if (isRandom) {
      const timer = setTimeout(() => setShowDiceAnimation(false), 1400);
      return () => clearTimeout(timer);
    }
  }, [isRandom]);

  const data = book || {
    id: 1,
    title: "The Midnight Library",
    author: "Matt Haig",
    rating: 4.82,
    description:
      "Between life and death there is a library, and within that library, the shelves go on forever. Every book provides a chance to try another life you could have lived.",
    copiesleft: 5,
    publisher: "Penguin Books",
    placeOfPublish: "London, UK",
    language: "English",
    ISBN: "978-0525559474",
    genre: "Fantasy",
    type: "Hardcover",
    pages: 304,
    publicationDate: "August 13, 2020",
  };

  const moreBooks = [
    { id: 101, title: "How to Stop Time",          year: 2017 },
    { id: 102, title: "The Humans",                year: 2013 },
    { id: 103, title: "Notes on a Nervous Planet", year: 2018 },
    { id: 104, title: "The Comfort Book",          year: 2021 },
  ];

  const roundedRating = Number(data.rating).toFixed(1);

  return (
    <div className={`min-h-screen transition-colors duration-500 ${
      darkMode ? "bg-[#0A0F1F] text-[#F0F4FA]" : "bg-[#F8F9FC] text-[#1F2937]"
    }`}>

      {/* ── BOOK OPENING SPLASH ── renders on top, removes itself after ~2.75s */}
      {showSplash && (
        <BookSplash
          darkMode={darkMode}
          title={data.title}
          author={data.author}
          onDone={() => setShowSplash(false)}
        />
      )}

      {/* --- NAVIGATION BAR --- */}
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
                {data.genre}
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

      {/* --- BACKGROUND GLOW --- */}
      <div className={`fixed top-0 left-0 w-full h-[500px] opacity-10 pointer-events-none blur-[120px] transition-colors ${
        darkMode ? "bg-[#5F7DB0]" : "bg-[#2C3E68]"
      }`} />

      <motion.main
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
        className="relative pt-32 pb-20 px-4 md:px-10 max-w-7xl mx-auto space-y-20"
      >
        <AnimatePresence>
          {showDiceAnimation && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed top-0 left-0 w-screen h-screen z-[999] flex items-center justify-center bg-black/40 backdrop-blur-sm"
            >
              <motion.div
                initial={{ scale: 0.7, rotate: 0 }}
                animate={{ scale: [0.7, 1.15, 1], rotate: [0, 180, 360, 540] }}
                exit={{ scale: 0.8, opacity: 0 }}
                transition={{ duration: 1.1, ease: "easeInOut" }}
                className={`w-24 h-24 rounded-3xl shadow-2xl flex items-center justify-center text-4xl font-bold border-4 ${
                  darkMode
                    ? "bg-[#1E2740] border-[#5F7DB0] text-white"
                    : "bg-white border-[#2C3E68] text-[#1F2937]"
                }`}
              >🎲</motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* MAIN DETAIL SECTION */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">

          {/* LEFT COLUMN: Cover & Actions */}
          <div className="lg:col-span-4 space-y-8">
            <div className={`group relative rounded-[2rem] overflow-hidden shadow-2xl border-8 transition-all duration-500 hover:rotate-1 ${
              darkMode ? "border-[#1E2740]" : "border-white"
            }`}>
              <img src={data.coverUrl || defaultimage} alt={data.title} className="w-full h-auto object-cover" />
            </div>
            <div className="flex flex-col gap-4">
             <button
  onClick={() => setShowAlert(true)}
  className={`py-4 rounded-2xl font-black text-lg shadow-xl transition-all active:scale-95 ${
    darkMode ? "bg-[#5F7DB0] hover:bg-[#4A6A9E]" : "bg-[#2C3E68] hover:bg-[#1F2F4F]"
  } text-white`}
>
  📖 Borrow Now
</button>
              <button className={`py-4 rounded-2xl font-black text-lg shadow-xl transition-all active:scale-95 ${
                darkMode ? "bg-[#6c6f74] hover:bg-[#3c4047]" : "bg-[#d41b1b] hover:bg-[#a62323]"
              } text-white`}>
                📖 Buy Now
              </button>
              <div className="grid grid-cols-2 gap-3 mt-4">
                <ShelfBtn icon="✓"  text="Read"         darkMode={darkMode} />
                <ShelfBtn icon="📖" text="Reading"      darkMode={darkMode} />
                <ShelfBtn icon="🔖" text="Want to Read" darkMode={darkMode} />
                <ShelfBtn icon="❤"  text="Favorite"     darkMode={darkMode} />
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: Info */}
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
              <p className="text-lg leading-relaxed opacity-90">{data.description}</p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <StatCard label="Publisher"  value={data.publisher}       icon="🏢" darkMode={darkMode} />
              <StatCard label="Date"       value={data.publicationDate} icon="📅" darkMode={darkMode} />
              <StatCard label="Location"   value={data.placeOfPublish}  icon="📍" darkMode={darkMode} />
              <StatCard label="ISBN"       value={data.ISBN}            icon="🔢" darkMode={darkMode} />
              <StatCard label="Language"   value={data.language}        icon="🌐" darkMode={darkMode} />
              <StatCard label="Type"       value={data.type}            icon="📚" darkMode={darkMode} />
              <StatCard label="Pages"      value={data.pages}           icon="📄" darkMode={darkMode} />
              <StatCard
                label="Stock"
                value={`${data.copiesleft} Left`}
                icon="📦"
                color={data.copiesleft > 0 ? "text-emerald-500" : "text-red-500"}
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
                  onClick={() => setShowRateModal(true)}
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

        {/* MORE BOOKS BY AUTHOR */}
        <section className="pt-10 border-t border-gray-500/20">
          <h2 className="text-3xl font-black mb-8">More Work by {data.author}</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {moreBooks.map((b) => (
              <div
                key={b.id}
                className={`p-6 rounded-3xl border transition-all hover:-translate-y-2 cursor-pointer ${
                  darkMode ? "bg-[#1E2740] border-[#2D3748] hover:bg-[#25304d]" : "bg-white border-[#E2E8F0] hover:shadow-xl"
                }`}
              >
                <div className="aspect-[3/4] bg-gray-500/20 rounded-xl mb-4 flex items-center justify-center text-4xl opacity-50">📖</div>
                <h3 className="font-bold truncate">{b.title}</h3>
                <p className="text-sm opacity-60">{b.year}</p>
              </div>
            ))}
          </div>
        </section>
      </motion.main>

      {/* RATING MODAL */}
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
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  onClick={() => { setUserRating(star); setShowRateModal(false); }}
                  className="text-4xl transition-transform hover:scale-125"
                >
                  <span className={(hoverRating || userRating) >= star ? "text-yellow-500" : "text-gray-300"}>★</span>
                </button>
              ))}
            </div>
            <button onClick={() => setShowRateModal(false)} className="text-sm font-bold opacity-50">Cancel</button>
          </div>
        </div>
      )}
      <CustomAlert
  show={showAlert}
  onClose={() => setShowAlert(false)}
  title="Book Borrowed!"
  message="You have successfully borrowed this book. Enjoy reading 📚"
  type="success"
/>
    </div>
  );
};

/* ── Sub-components (unchanged) ── */
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

const ShelfBtn = ({ icon, text, darkMode }) => (
  <button className={`flex items-center justify-center space-x-2 px-4 py-2.5 rounded-xl text-xs font-bold border transition-all hover:scale-105 active:scale-95 ${
    darkMode
      ? "border-[#2D3748] bg-[#1E2740] text-[#A0AEC0] hover:text-white"
      : "border-[#E2E8F0] bg-white text-[#4A5568] hover:bg-gray-50"
  }`}>
    <span>{icon}</span>
    <span>{text}</span>
  </button>
);

export default BookDetail;
