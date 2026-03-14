import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import defaultimage from "../assets/default-book-cover.jpg";

const BookDetail = ({ darkMode }) => {
  const location = useLocation();
  const book = location.state?.book;
  
  const [showRateModal, setShowRateModal] = useState(false);
  const [userRating, setUserRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);

  // Expanded fallback data with new attributes
  const data = book || {
    id: 1,
    title: "The Midnight Library",
    author: "Matt Haig",
    rating: 4.82,
    description: "Between life and death there is a library, and within that library, the shelves go on forever. Every book provides a chance to try another life you could have lived.",
    copiesleft: 5,
    publisher: "Penguin Books",
    placeOfPublish: "London, UK",
    language: "English",
    ISBN: "978-0525559474",
    genre: "Fantasy",
    type: "Hardcover",
    pages: 304,
    publicationDate: "August 13, 2020"
  };

  // Mock data for "More work by the author"
  const moreBooks = [
    { id: 101, title: "How to Stop Time", year: 2017 },
    { id: 102, title: "The Humans", year: 2013 },
    { id: 103, title: "Notes on a Nervous Planet", year: 2018 },
    { id: 104, title: "The Comfort Book", year: 2021 },
  ];

  const roundedRating = Number(data.rating).toFixed(1);

  return (
    <div className={`min-h-screen transition-colors duration-500 ${
      darkMode ? 'bg-[#0A0F1F] text-[#F0F4FA]' : 'bg-[#F8F9FC] text-[#1F2937]'
    }`}>
      
      {/* --- NAVIGATION BAR --- */}
      <nav className={`fixed top-0 left-0 right-0 z-[100] backdrop-blur-md border-b transition-all duration-300 ${
        darkMode 
          ? 'bg-[#1E2740]/80 border-[#2D3748]' 
          : 'bg-[#2C3E68]/90 border-[#E2E8F0] text-white shadow-lg'
      }`}>
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-8">
            <Link to="/" className="font-bold tracking-tight hover:opacity-70 transition-opacity">Home</Link>
            <div className="hidden md:flex items-center space-x-2">
              <span className="text-xs uppercase tracking-widest font-bold opacity-60">Genre:</span>
              <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                darkMode ? 'bg-[#5F7DB0]/20 text-[#5F7DB0]' : 'bg-white/20 text-white'
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
>
  💬
</Link>
            <div className={`h-8 w-[1px] ${darkMode ? 'bg-gray-700' : 'bg-white/20'}`}></div>
           
          </div>
        </div>
      </nav>

      {/* --- BACKGROUND GLOW --- */}
      <div className={`fixed top-0 left-0 w-full h-[500px] opacity-10 pointer-events-none blur-[120px] transition-colors ${
        darkMode ? 'bg-[#5F7DB0]' : 'bg-[#2C3E68]'
      }`} />

      <main className="relative pt-32 pb-20 px-4 md:px-10 max-w-7xl mx-auto space-y-20">
        
        {/* MAIN DETAIL SECTION */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          
          {/* LEFT COLUMN: Cover & Actions */}
          <div className="lg:col-span-4 space-y-8">
            <div className={`group relative rounded-[2rem] overflow-hidden shadow-2xl border-8 transition-all duration-500 hover:rotate-1 ${
              darkMode ? 'border-[#1E2740]' : 'border-white'
            }`}>
              <img src={data.coverUrl || defaultimage} alt={data.title} className="w-full h-auto object-cover" />
            </div>

            <div className="flex flex-col gap-4">
              <button className={`py-4 rounded-2xl font-black text-lg shadow-xl transition-all active:scale-95 ${
                darkMode ? 'bg-[#5F7DB0] hover:bg-[#4A6A9E]' : 'bg-[#2C3E68] hover:bg-[#1F2F4F]'
              } text-white`}>
                📖 Borrow Now
              </button>
               <button className={`py-4 rounded-2xl font-black text-lg shadow-xl transition-all active:scale-95 ${
                darkMode ? 'bg-[#6c6f74] hover:bg-[#3c4047]' : 'bg-[#d41b1b] hover:bg-[#a62323]'
              } text-white`}>
                📖 Buy Now
              </button>
              
              {/* Library Action Buttons */}
              <div className="grid grid-cols-2 gap-3 mt-4">
                <ShelfBtn icon="✓" text="Read" darkMode={darkMode} />
                <ShelfBtn icon="📖" text="Reading" darkMode={darkMode} />
                <ShelfBtn icon="🔖" text="Want to Read" darkMode={darkMode} />
                <ShelfBtn icon="❤" text="Favorite" darkMode={darkMode} />
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
              darkMode ? 'bg-[#1E2740] border-[#2D3748]' : 'bg-white border-[#E2E8F0] shadow-xl shadow-blue-900/5'
            }`}>
              <h2 className="text-xs uppercase tracking-widest font-black mb-4 text-[#5F7DB0]">Synopsis</h2>
              <p className="text-lg leading-relaxed opacity-90">{data.description}</p>
            </div>

            {/* EXPANDED STATS GRID */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <StatCard label="Publisher" value={data.publisher} icon="🏢" darkMode={darkMode} />
              <StatCard label="Date" value={data.publicationDate} icon="📅" darkMode={darkMode} />
              <StatCard label="Location" value={data.placeOfPublish} icon="📍" darkMode={darkMode} />
              <StatCard label="ISBN" value={data.ISBN} icon="🔢" darkMode={darkMode} />
              <StatCard label="Language" value={data.language} icon="🌐" darkMode={darkMode} />
              <StatCard label="Type" value={data.type} icon="📚" darkMode={darkMode} />
              <StatCard label="Pages" value={data.pages} icon="📄" darkMode={darkMode} />
              <StatCard 
                label="Stock" 
                value={`${data.copiesleft} Left`} 
                icon="📦" 
                color={data.copiesleft > 0 ? 'text-emerald-500' : 'text-red-500'} 
                darkMode={darkMode} 
              />
            </div>

            {/* RATING AREA */}
            <div className={`p-8 rounded-[2rem] border-2 border-dashed transition-all flex flex-col md:flex-row items-center justify-between gap-6 ${
              darkMode ? 'border-[#5F7DB0]/30 bg-[#5F7DB0]/5' : 'border-[#2C3E68]/10 bg-[#2C3E68]/5'
            }`}>
              <div className="text-center md:text-left">
                <h3 className="text-2xl font-black">Your Review</h3>
                <p className="opacity-60">Help others discover this book</p>
              </div>
              <div className="flex flex-col items-center gap-3">
                <button 
                  onClick={() => setShowRateModal(true)}
                  className={`px-8 py-3 rounded-xl font-bold text-white shadow-lg transition-all active:scale-95 ${
                    darkMode ? 'bg-[#5F7DB0]' : 'bg-[#2C3E68]'
                  }`}
                >
                  {userRating > 0 ? 'Update Rating' : 'Rate Book'}
                </button>
                {userRating > 0 && (
                  <div className="flex text-yellow-500 text-2xl">
                    {[...Array(5)].map((_, i) => <span key={i}>{i < userRating ? '★' : '☆'}</span>)}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* MORE BOOKS BY AUTHOR SECTION */}
        <section className="pt-10 border-t border-gray-500/20">
          <h2 className="text-3xl font-black mb-8">More Work by {data.author}</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {moreBooks.map((book) => (
              <div 
                key={book.id} 
                className={`p-6 rounded-3xl border transition-all hover:-translate-y-2 cursor-pointer ${
                  darkMode ? 'bg-[#1E2740] border-[#2D3748] hover:bg-[#25304d]' : 'bg-white border-[#E2E8F0] hover:shadow-xl'
                }`}
              >
                <div className="aspect-[3/4] bg-gray-500/20 rounded-xl mb-4 flex items-center justify-center text-4xl opacity-50">📖</div>
                <h3 className="font-bold truncate">{book.title}</h3>
                <p className="text-sm opacity-60">{book.year}</p>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* RATING MODAL */}
      {showRateModal && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className={`w-full max-w-sm p-10 rounded-[2.5rem] text-center border ${
            darkMode ? 'bg-[#1E2740] border-[#2D3748]' : 'bg-white border-[#E2E8F0]'
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
                  <span className={(hoverRating || userRating) >= star ? 'text-yellow-500' : 'text-gray-300'}>★</span>
                </button>
              ))}
            </div>
            <button onClick={() => setShowRateModal(false)} className="text-sm font-bold opacity-50">Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
};

// Sub-components for better organization
const StatCard = ({ label, value, icon, color, darkMode }) => (
  <div className={`p-4 rounded-2xl border transition-all ${
    darkMode ? 'bg-[#1E2740] border-[#2D3748]' : 'bg-gray-50 border-[#E2E8F0]'
  }`}>
    <div className="flex items-center space-x-2 mb-1">
      <span className="text-lg">{icon}</span>
      <p className="text-[10px] uppercase tracking-widest font-black opacity-40">{label}</p>
    </div>
    <p className={`font-bold text-sm truncate ${color || (darkMode ? 'text-white' : 'text-[#1F2937]')}`}>{value}</p>
  </div>
);

const ShelfBtn = ({ icon, text, darkMode }) => (
  <button className={`flex items-center justify-center space-x-2 px-4 py-2.5 rounded-xl text-xs font-bold border transition-all hover:scale-105 active:scale-95 ${
    darkMode 
      ? 'border-[#2D3748] bg-[#1E2740] text-[#A0AEC0] hover:text-white' 
      : 'border-[#E2E8F0] bg-white text-[#4A5568] hover:bg-gray-50'
  }`}>
    <span>{icon}</span>
    <span>{text}</span>
  </button>
);

export default BookDetail;