import {  useState } from "react";
import { useLocation } from "react-router-dom";
import { Link } from "react-router-dom";
import default_image from "../assets/default-book-cover.jpg";

// Mock Data for testing

const BookCard = ({ book, darkMode }) => {

  return (
    <Link 
      to={`/book/${book.id}`} 
      state={{ book }} // This sends the data to the next page
      
    >
    
    <div className={`flex flex-col group rounded-xl transition-all duration-300 ${
      darkMode ? 'bg-[#1E2740] text-white hover:bg-[#25304d]' : 'bg-white shadow-sm hover:shadow-md text-gray-800'
    } p-3 border ${darkMode ? 'border-[#2D3748]' : 'border-[#E2E8F0]'}`}>
      
      {/* Cover Image Container */}
      <div className="relative aspect-[3/4] overflow-hidden rounded-lg mb-3 bg-gray-200">
        <img 
          src={book.coverUrl || default_image}
          alt={book.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          onError={(e) => e.target.src = default_image}
        />
        {/* Hover Overlay for Quick Actions (Optional) */}
        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center" />
      </div>

      {/* Book Details */}
      <div className="flex-1">
        <h3 className="font-bold truncate text-sm sm:text-base mb-1">{book.title}</h3>
        <p className="text-xs opacity-70 mb-2 italic">By {book.author}</p>
        
        <div className="flex items-center mb-2 text-yellow-500 text-xs">
          {Array.from({ length: 5 }, (_, i) => (
            <span key={i}>{i < Math.floor(book.rating || 0) ? '★' : '☆'}</span>
          ))}
          <span className="ml-1 opacity-70">({book.year})</span>
        </div>
      </div>
    </div>
    </Link>
   
    
  );
};

const DisplayBooks = ({ darkMode ,setDarkMode}) => {
  const location= useLocation();
  const queryParams = new URLSearchParams(location.search);
  const searchTerm= queryParams.get("q")?.toLowerCase() || "";
  const filterType= queryParams.get("type");
  const [sortBy, setSortBy] = useState("year");
  const [currentPage, setCurrentPage] = useState(1);
  const booksPerPage = 12; // 3 rows of 4 books

  const MOCK_BOOKS = Array.from({ length: 25 }, (_, i) => ({
  id: i,
  title: `Book Title ${i + 1}`,
  author: "Author Name",
  year: 2010 + (i % 15),
  genre: i%2===0 ? "history" : "romance",
  tags : i%3===0 ? ["best-sellers"]: ["popular-books"],
  // eslint-disable-next-line react-hooks/purity
  copies: Math.floor(Math.random() * 10),
  // eslint-disable-next-line react-hooks/purity
  rating: 3 + Math.random() * 2,
  // eslint-disable-next-line react-hooks/purity
  price: 10 + Math.random() * 50,
  coverUrl: null, // Will use default_image

}));
   
   const filteredBooks= MOCK_BOOKS.filter(book =>{
    if(filterType === "collection"){
   return book.tags.some(tag => tag.includes(searchTerm));
    }
    if(filterType === "genre"){
      return book.genre.includes(searchTerm);
    }
    return(
    book.title.toLowerCase().includes(searchTerm) ||
    book.author.toLowerCase().includes(searchTerm) ||
    (book.genre && book.genre.toLowerCase().includes(searchTerm))
    );
});

  // Sorting Logic
  const sortedBooks = [...filteredBooks].sort((a, b) => {
    if (sortBy === "year") return b.year - a.year;
    if (sortBy === "copies") return b.copies - a.copies;
    return 0;
  });

  // Pagination Logic
  const indexOfLastBook = currentPage * booksPerPage;
  const indexOfFirstBook = indexOfLastBook - booksPerPage;
  const currentBooks = sortedBooks.slice(indexOfFirstBook, indexOfLastBook);
  const totalPages = Math.ceil(sortedBooks.length / booksPerPage);

  return (
    <div className={`min-h-screen pt-8 pb-12 px-4 sm:px-8 lg:px-16 transition-colors duration-300 ${darkMode ? 'bg-[#0A0F1F]' : 'bg-[#F8F9FC]'}`}>
      <div className="mb-6 flex items-center justify-between">
         <Link to="/" className={`px-4 py-2 rounded-xl text-sm font-semibold shadow-md transition-transform active:scale-95 
                  ${darkMode ? 'bg-[#5F7DB0] hover:bg-[#4A6A9E]' : 'bg-[#2C3E68] hover:bg-[#1F2F4F]'} text-white`}>
                  Home
                </Link>
          <button 
  onClick={() => setDarkMode(!darkMode)} 
  className={`p-2 rounded-full transition-all duration-300 hover:rotate-12 ${darkMode ? 'bg-yellow-500/10' : 'bg-indigo-500/10'}`}>
  {darkMode ? '☀️' : '🌙'}
</button>      
      </div>
      {/* TOP SECTION: Search Info & Sorting */}
      <div className={`mb-8 p-6 rounded-2xl border ${darkMode ? 'bg-[#1E2740] border-[#2D3748]' : 'bg-white border-[#E2E8F0] shadow-sm'}`}>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-[#1F2937]'}`}>
              {filterType === 'collection' ? `Exploring ${searchTerm.replace('-', ' ')}` : 
       searchTerm ? `Results for "${searchTerm}"` : "All Books"}
              </h1>
            <p className={`text-sm mt-1 ${darkMode ? 'text-[#A0AEC0]' : 'text-[#4A5568]'}`}>
              Showing <span className="font-semibold">{indexOfFirstBook + 1}-{Math.min(indexOfLastBook, sortedBooks.length)}</span> of {sortedBooks.length} books found
            </p>
          </div>

          <div className="flex items-center space-x-4">
            <span className={`text-sm font-medium ${darkMode ? 'text-[#A0AEC0]' : 'text-[#4A5568]'}`}>Sort by:</span>
            <select 
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className={`px-4 py-2 rounded-lg border outline-none transition-all ${
                darkMode 
                  ? 'bg-[#0A0F1F] border-[#2D3748] text-white focus:border-[#5F7DB0]' 
                  : 'bg-[#F1F5F9] border-[#E2E8F0] text-black focus:border-[#2C3E68]'
              }`}
            >
              <option value="year">Release Year</option>
              <option value="copies">Available Copies</option>
            </select>
          </div>
        </div>
      </div>

      {/* BOOKS GRID SECTION */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {currentBooks.map((book) => (
          <BookCard key={book.id} book={book} darkMode={darkMode} />
        ))}
      </div>

      {/* BOTTOM NAVIGATION (Arrows) */}
      {totalPages > 1 && (
        <div className="mt-12 flex items-center justify-center space-x-6">
          <button 
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className={`p-3 rounded-full border transition-all ${
              currentPage === 1 
              ? 'opacity-30 cursor-not-allowed' 
              : darkMode ? 'bg-[#1E2740] border-[#2D3748] hover:bg-[#2D3748]' : 'bg-white border-[#E2E8F0] hover:bg-gray-100'
            }`}
          >
            <span className={darkMode ? 'text-white' : 'text-black'}>← Previous</span>
          </button>

          <div className={`text-sm font-medium ${darkMode ? 'text-[#A0AEC0]' : 'text-[#4A5568]'}`}>
            Page {currentPage} of {totalPages}
          </div>

          <button 
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className={`p-3 rounded-full border transition-all ${
              currentPage === totalPages 
              ? 'opacity-30 cursor-not-allowed' 
              : darkMode ? 'bg-[#1E2740] border-[#2D3748] hover:bg-[#2D3748]' : 'bg-white border-[#E2E8F0] hover:bg-gray-100'
            }`}
          >
            <span className={darkMode ? 'text-white' : 'text-black'}>Next →</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default DisplayBooks;