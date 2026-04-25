import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import BookCard from './BookCard.jsx';

const BookSection = ({ title, books, darkMode, loading }) => {
  const scrollRef = useRef(null);

  const scroll = (direction) => {
    const { current } = scrollRef;
    if (!current) return;

    if (direction === 'left') {
      current.scrollBy({ left: -300, behavior: 'smooth' });
    } else {
      current.scrollBy({ left: 300, behavior: 'smooth' });
    }
  };

  const slugMap = {
    'Best Sellers': 'best-sellers',
    'Popular Books': 'popular-books',
    'Recent Books': 'new-releases',
  };
  const slug = slugMap[title] || title.toLowerCase().replace(/\s+/g, '-');

  return (
    <section className="py-12 w-full px-4 md:px-10">
      <Link to={`/search?type=collection&q=${slug}`} className="group inline-block mb-8">
        <h2 className={`text-3xl font-bold mb-8 ${darkMode ? 'text-white' : 'text-[#1F2937]'}`}>
          {title}
        </h2>
      </Link>

      <div className="relative group">
        <button
          type="button"
          onClick={() => scroll('left')}
          className="absolute left-[-20px] top-1/2 -translate-y-1/2 z-10 bg-black/50 text-white p-3 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
        >
          &larr;
        </button>

        <div
          ref={scrollRef}
          className="flex space-x-6 overflow-x-auto scrollbar-hide scroll-smooth pb-4"
        >
          {loading ? (
            <p className={`text-sm font-medium px-2 ${darkMode ? 'text-[#A0AEC0]' : 'text-[#4A5568]'}`}>
              Loading books…
            </p>
          ) : books.length === 0 ? (
            <p className={`text-sm font-medium px-2 ${darkMode ? 'text-[#A0AEC0]' : 'text-[#4A5568]'}`}>
              No books in this collection yet.
            </p>
          ) : (
            books.map((book) => (
              <BookCard key={book.id} book={book} darkMode={darkMode} />
            ))
          )}
        </div>

        <button
          type="button"
          onClick={() => scroll('right')}
          className="absolute right-[-20px] top-1/2 -translate-y-1/2 z-10 bg-black/50 text-white p-3 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
        >
          &rarr;
        </button>
      </div>
    </section>
  );
};
export default BookSection;
