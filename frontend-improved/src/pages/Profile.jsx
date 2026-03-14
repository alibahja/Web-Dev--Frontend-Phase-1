import React, { useState, useRef } from "react";
import { Link } from "react-router-dom";
import { 
  FaCrown, FaBookOpen, FaCalendarAlt, FaCalendarCheck, 
  FaFileAlt, FaHeart, FaTrophy, FaClock, FaHistory, FaUndo, FaChartLine, FaStar, FaBookmark, FaHourglassHalf 
} from "react-icons/fa";
import defaultimage from "../assets/default-book-cover.jpg";

const Profile = ({ darkMode}) => {

  const [borrowedBooks, setBorrowedBooks] = useState([
    { id: 9, title: "The Martian", borrowDate: "2026-03-01", dueDate: "2026-03-15", rating: 4.5, price: 0 },
    { id: 10, title: "Educated", borrowDate: "2026-03-05", dueDate: "2026-03-19", rating: 4.8, price: 0 }
  ]);

  const user = {
    name: "Alex Johnson",
    initials: "AJ",
    joined: "Mar 2025",
    booksRead: 25,
    rank: "Book Lover",
    stats: { monthly: 3, pagesYear: "1,240", favGenre: "Fantasy" }
  };

 ;

  const handleReturn = (bookId) => {
    setBorrowedBooks(prev => prev.filter(book => book.id !== bookId));
  };

  return (
    <div className={`min-h-screen transition-all duration-500 pb-12 ${
      darkMode ? 'bg-[#0A0F1F] text-[#F0F4FA]' : 'bg-[#F8F9FC] text-[#1F2937]'
    }`}>
      
      {/* NAVBAR */}
      <nav className={`fixed top-0 w-full z-50 backdrop-blur-xl border-b ${
        darkMode ? 'bg-[#111827]/80 border-[#2D3748]' : 'bg-white/80 border-[#E2E8F0]'
      }`}>
        <div className="max-w-7xl mx-auto px-8 h-16 flex items-center justify-between">
          
          <Link to="/" className={`px-4 py-2 rounded-lg text-sm font-semibold shadow-md transition-transform hover:scale-105 
          ${darkMode ? 'bg-[#5F7DB0] hover:bg-[#4A6A9E]' : 'bg-[#2C3E68] hover:bg-[#1F2F4F]'} text-white`}>
            Home
          </Link>

          <span className={`font-serif italic font-black text-xl tracking-tight ${darkMode ? 'text-[#5F7DB0]' : 'text-[#2C3E68]'}`}>
            Library
          </span>

         

        </div>
      </nav>

      <main className="max-w-7xl mx-auto pt-24 px-6">

        {/* PROFILE HEADER */}
        <div className={`p-8 rounded-3xl border shadow-xl mb-8 backdrop-blur-sm ${
          darkMode ? 'bg-[#1E2740]/80 border-[#2D3748]' : 'bg-white border-[#E2E8F0]'
        }`}>
          <div className="flex flex-col md:flex-row items-center gap-6">

            <div className={`w-28 h-28 rounded-2xl flex items-center justify-center text-3xl font-black text-white shadow-lg ${
              darkMode ? 'bg-gradient-to-br from-[#5F7DB0] to-[#3E5A8E]' : 'bg-gradient-to-br from-[#2C3E68] to-[#1F2F4F]'
            }`}>
              {user.initials}
            </div>

            <div className="text-center md:text-left flex-1">
              <h2 className="text-3xl font-black mb-2 tracking-tight">{user.name}</h2>

              <div className="flex flex-wrap gap-4 justify-center md:justify-start font-semibold opacity-70 text-xs">

                <span>
                  <FaCalendarAlt className="inline mr-1"/> Joined {user.joined}
                </span>

                <span>
                  <FaBookOpen className="inline mr-1"/> {user.booksRead} Read
                </span>

                <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase text-white ${
                  darkMode ? 'bg-[#5F7DB0]' : 'bg-[#2C3E68]'
                }`}>
                  <FaCrown className="inline mr-1"/> {user.rank}
                </span>

              </div>
            </div>

          </div>
        </div>

       {/* READING ANALYSIS */}
<section className="mb-10">

  <div className="flex items-center gap-3 mb-4 px-1">
    <FaChartLine className="text-[#5F7DB0] text-xl" />
    <h2 className="text-xl font-black uppercase tracking-wider">
      Reading Analysis
    </h2>
  </div>

  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

    {/* Books this month */}
    <div className={`p-6 rounded-2xl border transition hover:scale-[1.02] ${
      darkMode 
      ? 'bg-[#1E2740] border-[#2D3748]' 
      : 'bg-white border-[#E2E8F0] shadow-sm'
    }`}>
      
      <div className="flex items-center justify-between mb-2">
        <FaBookOpen className="text-emerald-500 text-xl"/>
        <span className="text-xs opacity-50 font-semibold uppercase">
          This Month
        </span>
      </div>

      <p className="text-3xl font-black">
        {user.stats.monthly}
      </p>

      <p className="text-xs opacity-60 mt-1">
        Books Read
      </p>

    </div>


    {/* Pages this year */}
    <div className={`p-6 rounded-2xl border transition hover:scale-[1.02] ${
      darkMode 
      ? 'bg-[#1E2740] border-[#2D3748]' 
      : 'bg-white border-[#E2E8F0] shadow-sm'
    }`}>
      
      <div className="flex items-center justify-between mb-2">
        <FaFileAlt className="text-blue-400 text-xl"/>
        <span className="text-xs opacity-50 font-semibold uppercase">
          This Year
        </span>
      </div>

      <p className="text-3xl font-black">
        {user.stats.pagesYear}
      </p>

      <p className="text-xs opacity-60 mt-1">
        Pages Read
      </p>

    </div>


    {/* Favorite Genre */}
    <div className={`p-6 rounded-2xl border transition hover:scale-[1.02] ${
      darkMode 
      ? 'bg-[#1E2740] border-[#2D3748]' 
      : 'bg-white border-[#E2E8F0] shadow-sm'
    }`}>
      
      <div className="flex items-center justify-between mb-2">
        <FaHeart className="text-pink-500 text-xl"/>
        <span className="text-xs opacity-50 font-semibold uppercase">
          Favorite
        </span>
      </div>

      <p className="text-2xl font-black">
        {user.stats.favGenre}
      </p>

      <p className="text-xs opacity-60 mt-1">
        Genre
      </p>

    </div>

  </div>

</section>

        <BookSection title="Favorite Books" icon={<FaStar className="text-yellow-500" />} books={[{id: 1, title: "The Hobbit", rating: 5, price: 15.99}, {id: 2, title: "1984", rating: 4.5, price: 12.50}]} darkMode={darkMode} />

        <BookSection title="Books Read" icon={<FaBookOpen className="text-emerald-500" />} books={[{id: 4, title: "Mistborn", rating: 5, price: 10.00}]} darkMode={darkMode} />

        <BookSection title="Wish to Read" icon={<FaBookmark className="text-blue-400" />} books={[{id: 6, title: "The Silent Patient", rating: 0, price: 14.00}]} darkMode={darkMode} />

        <BookSection title="Currently Reading" icon={<FaHourglassHalf className="text-orange-400" />} books={[{id: 8, title: "The Way of Kings", rating: 4.9, price: 25.00}]} darkMode={darkMode} isReading={true} />

        <BookSection 
          title="Borrowed Books" 
          icon={<FaHistory className="text-[#5F7DB0]" />} 
          books={borrowedBooks} 
          darkMode={darkMode} 
          isBorrowed={true} 
          onReturn={handleReturn} 
        />

        <BookSection title="Purchased Library" icon={<FaTrophy className="text-purple-500" />} books={[{id: 11, title: "Atomic Habits", purchaseDate: "2026-02-14", price: 16.50}]} darkMode={darkMode} isBought={true} />

        <div className={`mt-12 p-6 rounded-2xl border-t flex items-center justify-center gap-3 ${
          darkMode ? 'border-white/5 opacity-40' : 'border-black/5'
        }`}>
          <FaTrophy className="text-yellow-500" />
          <p className="font-bold text-xs uppercase tracking-[0.3em]">
            Library · Excellence in Reading
          </p>
        </div>

      </main>
    </div>
  );
};

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

        <div className="text-[10px] opacity-60">
          <FaHistory className="inline mr-1"/> {book.borrowDate}
        </div>

        <div className="text-[10px] text-red-400 font-semibold">
          <FaClock className="inline mr-1"/> {book.dueDate}
        </div>

        <button 
          onClick={() => onReturn(book.id)}
          className="w-full mt-2 py-2 rounded-lg border border-red-400 text-red-400 text-[10px] font-bold hover:bg-red-500 hover:text-white transition"
        >
          <FaUndo className="inline mr-1"/> Return
        </button>

      </div>
    ) : (
      <div className="mt-2">

        {isBought && (
          <p className="text-[9px] opacity-40 mb-1">
            Purchased {book.purchaseDate}
          </p>
        )}

        <p className="text-lg font-black text-[#5F7DB0]">
          ${(book.price || 0).toFixed(2)}
        </p>

      </div>
    )}
  </div>
);

const BookSection = ({ title, icon, books, darkMode, isBorrowed, isBought, isReading, onReturn }) => {
  const scrollRef = useRef(null);
  
  return (
    <section className="py-8">

      <div className="flex items-center gap-2 mb-4">
        <span className="text-lg">{icon}</span>
        <h2 className="text-lg font-black uppercase tracking-wide">{title}</h2>
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
            <p className="text-xs font-bold uppercase opacity-50">
              No books here
            </p>
          </div>
        )}

      </div>

    </section>
  );
};

export default Profile;