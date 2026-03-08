import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import defaultimage from '../assets/default-book-cover.jpg';
import hero from '../assets/hero.png';


// --- Sub-Component: Book Card ---
const BookCard = ({ book, darkMode }) => {
  const defaultCover = defaultimage;
  return (
    <Link to={`/book/${book.id}`}>
    <div className={`flex-shrink-0 w-64 p-4 rounded-xl transition-all duration-300 ${
      darkMode ? 'bg-[#1E2740] text-white' : 'bg-white shadow-md text-gray-800'
    }`}>
      <div className="h-80 overflow-hidden rounded-lg mb-4 bg-gray-200">
        <img 
          src={book.coverUrl || defaultCover} 
          alt={book.title}
          className="w-full h-full object-cover"
          onError={(e) => e.target.src = defaultCover}
        />
      </div>
      <h3 className="font-bold truncate text-lg">{book.title}</h3>
      <div className="flex items-center my-2 text-yellow-500">
        {Array.from({ length: 5 }, (_, i) => (
          <span key={i}>{i < Math.floor(book.rating || 0) ? '★' : '☆'}</span>
        ))}
        <span className="ml-2 text-sm opacity-70">({(book.rating || 0).toFixed(1)})</span>
      </div>
      <p className="text-xl font-semibold text-[#5F7DB0]">${(book.price || 0).toFixed(2)}</p>
    </div>
    </Link>
  );
};

// --- Sub-Component: Book Section with Slider ---
const BookSection = ({ title, books, darkMode}) => {
  const scrollRef = useRef(null);

  const scroll = (direction) => {
    const { current } = scrollRef;
    if (direction === 'left') {
      current.scrollBy({ left: -300, behavior: 'smooth' });
    } else {
      current.scrollBy({ left: 300, behavior: 'smooth' });
    }
  };
  const filterValue= title.toLowerCase().replace(' ','-');

  return (
    <section className="py-12 w-full px-4 md:px-10">
      <Link to={`/search?type=collection&q=${filterValue}`} className="group inline-block mb-8">
      <h2 className={`text-3xl font-bold mb-8 ${darkMode ? 'text-white' : 'text-[#1F2937]'}`}>{title}</h2>
      </Link>
      <div className="relative group">
        <button 
          onClick={() => scroll('left')}
          className="absolute left-[-20px] top-1/2 -translate-y-1/2 z-10 bg-black/50 text-white p-3 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
        >
          &larr;
        </button>
        
        <div 
          ref={scrollRef}
          className="flex space-x-6 overflow-x-auto scrollbar-hide scroll-smooth pb-4"
        >
          {books.map((book, index) => (
            <BookCard key={index} book={book} darkMode={darkMode} />
          ))}
        </div>

        <button 
          onClick={() => scroll('right')}
          className="absolute right-[-20px] top-1/2 -translate-y-1/2 z-10 bg-black/50 text-white p-3 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
        >
          &rarr;
        </button>
      </div>
    </section>
  );
};

// --- Main Home Component ---
const Home = ({darkMode,setDarkMode}) => {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  
  const [counts, setCounts] = useState({ books: 0, users: 0, borrows: 0 });
  const statsRef = useRef(null);
  const [hasAnimated, setHasAnimated] = useState(false);
  const targets = { books: 15420, users: 8432, borrows: 35678 };
  const [searchQuery, setSearchQuery] = useState('');
  
  const handleSearch = (e) => {
      e.preventDefault();
      if(searchQuery.trim()){
        navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
      }

  }


  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !hasAnimated) {
        startCounter();
        setHasAnimated(true);
      }
    }, { threshold: 0.2 });
    if (statsRef.current) observer.observe(statsRef.current);
    return () => observer.disconnect();
  }, [hasAnimated]);

  const startCounter = () => {
    const duration = 2000;
    const steps = 60;
    const interval = duration / steps;
    let currentStep = 0;
    const timer = setInterval(() => {
      currentStep++;
      const progress = 1 - Math.pow(1 - (currentStep / steps), 3);
      setCounts({
        books: Math.floor(targets.books * progress),
        users: Math.floor(targets.users * progress),
        borrows: Math.floor(targets.borrows * progress),
      });
      if (currentStep >= steps) clearInterval(timer);
    }, interval);
  };

  const handleRandomBook = () => console.log('Random book clicked');
  const handleExploreClick = () => console.log('Explore clicked');

  const dummyBooks = Array(10).fill({
    title: "Library Book Title",
    price: 19.99,
    rating: 4.5
  });

  return (
    <div className={`w-full min-h-screen transition-colors duration-300 ${darkMode ? 'bg-[#0A0F1F] text-[#F0F4FA]' : 'bg-[#F8F9FC] text-[#1F2937]'}`}>
      
      {/* Navbar */}
<nav className={`fixed top-0 w-full z-50 transition-colors duration-300 border-b ${darkMode ? 'bg-[#1E2740] border-[#2D3748]' : 'bg-white border-[#E2E8F0]'}`}>
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div className="flex items-center justify-between h-16 gap-4">
      
      {/* Updated Logo Styling */}
      <div className="flex-shrink-0">
        <div className={`px-4 py-1.5 rounded-xl border flex items-center justify-center 
          ${darkMode 
            ? 'bg-[#2D3748] border-[#4A5568] text-[#F0F4FA]' 
            : 'bg-[#F1F5F9] border-[#E2E8F0] text-[#2C3E68]'} 
          shadow-sm transition-all duration-300`}>
          <span className="font-serif italic font-bold text-xl tracking-tight">
            Library
          </span>
        </div>
      </div>

      {/* Navigation Links (Polished) */}
      <div className="hidden md:flex items-center">
        <Link to="/profile" className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${darkMode ? 'text-[#A0AEC0] hover:text-[#F0F4FA] hover:bg-[#2D3748]' : 'text-[#4A5568] hover:text-[#1F2937] hover:bg-[#F8F9FC]'}`}>
          My Profile
        </Link>
      </div>

      {/* Search Bar (Centered & Polished) */}
      <form onSubmit={handleSearch} className="flex-1 max-w-md lg:max-w-2xl mx-2">
        <div className="relative group">
          <input 
            type="text" 
            value={searchQuery}
            onChange={(e)=> setSearchQuery(e.target.value)}
            placeholder="Search books, authors..." 
            className={`w-full pl-4 pr-10 py-2 rounded-xl border outline-none transition-all duration-200
              ${darkMode 
                ? 'bg-[#0A0F1F] border-[#2D3748] text-[#F0F4FA] focus:border-[#5F7DB0] focus:ring-1 focus:ring-[#5F7DB0]' 
                : 'bg-[#F8F9FC] border-[#E2E8F0] text-black focus:border-[#2C3E68] focus:ring-1 focus:ring-[#2C3E68]'} `} 
          />
          <button type="submit" className="absolute right-3 top-2.5 opacity-60 group-focus-within:opacity-100 transition-opacity">
            🔍
          </button>
        </div>
      </form>

      {/* Action Buttons */}
      <div className="flex items-center space-x-2 sm:space-x-3">
        <Link to="/login" className={`hidden sm:block text-sm font-medium ${darkMode ? 'text-[#A0AEC0] hover:text-white' : 'text-[#4A5568] hover:text-black'}`}>
          Login
        </Link>
        
        <Link to="/register" className={`px-4 py-2 rounded-xl text-sm font-semibold shadow-md transition-transform active:scale-95 
          ${darkMode ? 'bg-[#5F7DB0] hover:bg-[#4A6A9E]' : 'bg-[#2C3E68] hover:bg-[#1F2F4F]'} text-white`}>
          Register
        </Link>

        {/* Sidebar Toggle Button */}
        <button 
          onClick={() => setSidebarOpen(true)} 
          className={`p-2 rounded-xl border transition-all ${darkMode ? 'bg-[#2D3748] border-[#4A5568] text-white' : 'bg-[#F1F5F9] border-[#E2E8F0] text-black'} hover:opacity-80`}>
          <span className="text-sm font-bold px-1">All</span>
        </button>

        {/* Dark Mode Toggle */}
        <button 
          onClick={() => setDarkMode(!darkMode)} 
          className={`p-2 rounded-full transition-all duration-300 hover:rotate-12 ${darkMode ? 'bg-yellow-500/10' : 'bg-indigo-500/10'}`}>
          {darkMode ? '☀️' : '🌙'}
        </button>
      </div>

    </div>
  </div>
</nav>

      {/* Sidebar Content & Logic */}
      <div className={`fixed inset-y-0 right-0 w-80 transform transition-transform duration-300 ease-in-out z-[60] 
        overflow-y-auto h-full
      ${
        sidebarOpen ? 'translate-x-0' : 'translate-x-full'
      } ${darkMode ? 'bg-[#1E2740] border-l border-[#2D3748]' : 'bg-white border-l border-[#E2E8F0]'}`}>
        <div className="p-6">
          <button
            onClick={() => setSidebarOpen(false)}
            className={`absolute top-4 right-4 text-2xl ${darkMode ? 'text-[#A0AEC0] hover:text-[#F0F4FA]' : 'text-[#4A5568] hover:text-[#1F2937]'}`}
          >
            ×
          </button>

          <div className="mt-8">
            {/* LibCore Library Section */}
            <div className="mb-8">
              <h3 className={`text-xl font-bold mb-4 ${darkMode ? 'text-[#F0F4FA]' : 'text-[#1F2937]'}`}>Library</h3>
              <div className="space-y-3">
                <Link to="/login" className="block">
                  <button className={`w-full px-4 py-2 rounded-lg transition-colors duration-300 ${darkMode ? 'bg-[#0A0F1F] text-[#F0F4FA] hover:bg-[#2D3748]' : 'bg-[#F8F9FC] text-[#1F2937] hover:bg-[#E2E8F0]'}`}>Login</button>
                </Link>
                <Link to="/register" className="block">
                  <button className={`w-full px-4 py-2 rounded-lg transition-colors duration-300 ${darkMode ? 'bg-[#5F7DB0] text-white hover:bg-[#4A6A9E]' : 'bg-[#2C3E68] text-white hover:bg-[#1F2F4F]'}`}>Sign up</button>
                </Link>
              </div>
            </div>

            {/* Browse Section */}
            <div className="mb-8">
              <h3 className={`text-lg font-semibold mb-3 ${darkMode ? 'text-[#F0F4FA]' : 'text-[#1F2937]'}`}>Browse</h3>
              <ul className="space-y-2">
               {['Best Sellers', 'New Releases', 'Popular Books', 'Academics', 'History', 'Romance'].map((item, index) => (
  <li key={index}>
    <Link 
      to={index < 3 
        ? `/search?type=collection&q=${item.toLowerCase().replace(' ', '-')}`
        : `/search?type=genre&q=${item.toLowerCase()}`
      } 
      className={`block py-1 transition-colors duration-300 ${darkMode ? 'text-[#A0AEC0] hover:text-[#5F7DB0]' : 'text-[#4A5568] hover:text-[#2C3E68]'}`}
    >
      {item}
    </Link>
  </li>
))}
                <li>
                  <button onClick={handleRandomBook} className={`block py-1 transition-colors duration-300 ${darkMode ? 'text-[#5F7DB0] hover:text-[#7A98C0]' : 'text-[#2C3E68] hover:text-[#1F2F4F]'}`}>Random Book</button>
                </li>
                <li>
                  <Link to="/advanced" className={`block py-1 transition-colors duration-300 ${darkMode ? 'text-[#A0AEC0] hover:text-[#5F7DB0]' : 'text-[#4A5568] hover:text-[#2C3E68]'}`}>Advanced Search</Link>
                </li>
              </ul>
            </div>

            {/* Contribute Section */}
            <div className="mb-8">
              <h3 className={`text-lg font-semibold mb-3 ${darkMode ? 'text-[#F0F4FA]' : 'text-[#1F2937]'}`}>Contribute</h3>
              <ul className="space-y-2">
                {['View your Profile', 'Join a Group', 'Settings'].map((item, index) => (
                  <li key={index}>
                    {item === 'Join a Group' ? (
                      <Link to="/groups" className={`block w-full text-left py-1 transition-colors duration-300 
                        ${darkMode ? 'text-[#A0AEC0] hover:text-[#5F7DB0]' : 'text-[#4A5568] hover:text-[#2C3E68]'}`}
                        >
                          {item}
                        </Link>
                    ): (
                    <button onClick={handleExploreClick} className={`block w-full text-left py-1 transition-colors duration-300 ${darkMode ? 'text-[#A0AEC0] hover:text-[#5F7DB0]' : 'text-[#4A5568] hover:text-[#2C3E68]'}`}>
                      {item}
                    </button>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Sidebar Overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-[55] transition-opacity" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Hero Section */}
      <section className="h-screen w-full relative pt-16">
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${hero})` }}>
          <div className={`absolute inset-0 ${darkMode ? 'bg-black/70' : 'bg-[#2C3E68]/60'}`} />
        </div>
        <div className="relative h-full flex items-center justify-center text-center px-4">
          <div className="max-w-4xl animate-fade-in">
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">Unlock your potential,<br/>one page at a time</h1>
            <p className="text-xl text-white/90 leading-relaxed mb-8">Discover a world of knowledge at your fingertips. Our Library offers an extensive collections of books across all genres.</p>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section ref={statsRef} className="py-20 w-full px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { label: 'Total Books', val: counts.books },
            { label: 'Active Readers', val: counts.users },
            { label: 'Books Borrowed', val: counts.borrows }
          ].map((stat, i) => (
            <div key={i} className={`p-10 rounded-3xl text-center ${darkMode ? 'bg-[#1E2740]' : 'bg-white shadow-xl'}`}>
              <div className="text-5xl font-extrabold text-[#5F7DB0] mb-2">{stat.val.toLocaleString()}</div>
              <div className="text-xl opacity-80">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Book Sliders */}
      <BookSection title="Best Sellers" books={dummyBooks} darkMode={darkMode} />
      <BookSection title="Popular Books" books={dummyBooks} darkMode={darkMode} />
      <BookSection title="Recent Books" books={dummyBooks} darkMode={darkMode} />

      {/* Categories Section */}
      <section className={`py-16 w-full px-6 ${darkMode ? 'bg-[#151B2D]' : 'bg-gray-100'}`}>
        <h2 className="text-3xl font-bold mb-10 text-center">Browse by Category</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-5xl mx-auto">
          {['History', 'Science Fiction', 'Self-help', 'Mystery', 'Romance', 'Children', 'Academic', 'Business', 'Literature', 'Biography'].map((cat) => (
            <Link key={cat} to={`/search?type=genre&q=${cat.toLowerCase()}`} className={`p-4 rounded-xl border text-center transition-all hover:bg-[#5F7DB0] hover:text-white ${darkMode ? 'border-gray-700 bg-[#1E2740]' : 'border-gray-200 bg-white'}`}>
              {cat} Books
            </Link>
          ))}
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20 w-full px-6 max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
          <div className="contact-col">
            <h3 className="text-3xl font-bold mb-4">Send us a message</h3>
            <p className="opacity-80 leading-relaxed">Feel free to reach out through contact form or find our contact information below. Your feedback, questions, and suggestions are important to us.</p>
            <ul className="mt-6">
               <li className="flex items-center space-x-2"><span>📧</span> <span>LibCore.lebanon@gmail.com</span></li>
            </ul>
          </div>
          <div className={`p-8 rounded-2xl ${darkMode ? 'bg-[#1E2740]' : 'bg-white shadow-2xl'}`}>
            <form className="space-y-4">
              <label className="font-semibold block">Write your message here</label>
              <textarea rows="6" className={`w-full p-4 rounded-lg border focus:ring-2 focus:ring-[#5F7DB0] outline-none ${darkMode ? 'bg-[#0A0F1F] border-gray-700' : 'bg-gray-50 border-gray-200'}`} placeholder="Enter your message..."></textarea>
              <button type="submit" className={`w-full py-3 rounded-lg font-bold text-white transition-opacity hover:opacity-90 ${darkMode ? 'bg-[#5F7DB0]' : 'bg-[#2C3E68]'}`}>Submit</button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;