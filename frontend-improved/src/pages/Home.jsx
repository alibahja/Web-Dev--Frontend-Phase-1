import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import hero from '../assets/hero.png';
import BookCard from '../components/BookCard';
import BookSection from '../components/BookSection';
import GameCard from '../components/GameCard';
import GameSection from '../components/GameSection';
import Footer from '../components/Footer';


// --- Main Home Component ---
const Home = ({ darkMode }) => {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setIsLoggedIn(false);
    setSidebarOpen(false)
    navigate('/');
  };

  const communityRef = useRef(null);
  const [showCommunity, setShowCommunity] = useState(false);

  const [counts, setCounts] = useState({ books: 0, users: 0, borrows: 0 });
  const statsRef = useRef(null);
  const [hasAnimated, setHasAnimated] = useState(false);
  const targets = { books: 15420, users: 8432, borrows: 35678 };
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const storedToken = localStorage.getItem('token');
    setIsLoggedIn(!!storedUser || !!storedToken);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated) {
          startCounter();
          setHasAnimated(true);
        }
      },
      { threshold: 0.2 }
    );

    const communityObserver = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShowCommunity(true);
        }
      },
      { threshold: 0.2 }
    );

    if (statsRef.current) observer.observe(statsRef.current);
    if (communityRef.current) communityObserver.observe(communityRef.current);

    return () => {
      observer.disconnect();
      communityObserver.disconnect();
    };
  }, [hasAnimated]);

  const startCounter = () => {
    const duration = 2000;
    const steps = 60;
    const interval = duration / steps;
    let currentStep = 0;

    const timer = setInterval(() => {
      currentStep++;
      const progress = 1 - Math.pow(1 - currentStep / steps, 3);

      setCounts({
        books: Math.floor(targets.books * progress),
        users: Math.floor(targets.users * progress),
        borrows: Math.floor(targets.borrows * progress),
      });

      if (currentStep >= steps) clearInterval(timer);
    }, interval);
  };

  const handleRandomBook = () => {
    if (!dummyBooks || dummyBooks.length === 0) return;

    const randomIndex = Math.floor(Math.random() * dummyBooks.length);
    const randomBook = dummyBooks[randomIndex];

    setSidebarOpen(false);

    navigate(`/book/${randomBook.id}`, {
      state: {
        book: randomBook,
        isRandom: true,
      },
    });
  };

  const dummyBooks = Array.from({ length: 10 }, (_, i) => ({
    id: i + 1,
    title: `Library Book ${i + 1}`,
    price: 19.99,
    rating: 4.5,
    author: "Unknown Author",
    description: "A randomly selected book from the library."
  }));

  return (
    <div
      className={`w-full min-h-screen transition-colors duration-300 ${
        darkMode ? 'bg-[#0A0F1F] text-[#F0F4FA]' : 'bg-[#F8F9FC] text-[#1F2937]'
      }`}
    >
      {/* Navbar */}
      <nav
        className={`fixed top-0 w-full z-50 transition-colors duration-300 border-b ${
          darkMode ? 'bg-[#1E2740] border-[#2D3748]' : 'bg-white border-[#E2E8F0]'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 gap-4">
            {/* Logo */}
            <div className="flex-shrink-0">
              <div
                className={`px-4 py-1.5 rounded-xl border flex items-center justify-center 
                ${
                  darkMode
                    ? 'bg-[#2D3748] border-[#4A5568] text-[#F0F4FA]'
                    : 'bg-[#F1F5F9] border-[#E2E8F0] text-[#2C3E68]'
                } 
                shadow-sm transition-all duration-300`}
              >
                <span className="font-serif italic font-bold text-xl tracking-tight">
                  BiblioTech
                </span>
              </div>
            </div>

            {/* Navigation */}
            {isLoggedIn && (
              <div className="hidden md:flex items-center">
                <Link
                  to="/profile"
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                    darkMode
                      ? 'text-[#A0AEC0] hover:text-[#F0F4FA] hover:bg-[#2D3748]'
                      : 'text-[#4A5568] hover:text-[#1F2937] hover:bg-[#F8F9FC]'
                  }`}
                >
                  My Profile
                </Link>
              </div>
            )}

            {/* Search */}
            <form onSubmit={handleSearch} className="flex-1 max-w-md lg:max-w-2xl mx-2">
              <div className="relative group">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search books, authors..."
                  className={`w-full pl-4 pr-10 py-2 rounded-xl border outline-none transition-all duration-200
                    ${
                      darkMode
                        ? 'bg-[#0A0F1F] border-[#2D3748] text-[#F0F4FA] focus:border-[#5F7DB0] focus:ring-1 focus:ring-[#5F7DB0]'
                        : 'bg-[#F8F9FC] border-[#E2E8F0] text-black focus:border-[#2C3E68] focus:ring-1 focus:ring-[#2C3E68]'
                    }`}
                />
                <button
                  type="submit"
                  className="absolute right-3 top-2.5 opacity-60 group-focus-within:opacity-100 transition-opacity"
                >
                  🔍
                </button>
              </div>
            </form>

            {/* Action Buttons */}
            <div className="flex items-center space-x-2 sm:space-x-3">
              {!isLoggedIn && (
                <>
                  <Link
                    to="/login"
                    className={`hidden sm:block text-sm font-medium ${
                      darkMode
                        ? 'text-[#A0AEC0] hover:text-white'
                        : 'text-[#4A5568] hover:text-black'
                    }`}
                  >
                    Login
                  </Link>

                  <Link
                    to="/register"
                    className={`px-4 py-2 rounded-xl text-sm font-semibold shadow-md transition-transform active:scale-95 
                    ${
                      darkMode
                        ? 'bg-[#5F7DB0] hover:bg-[#4A6A9E]'
                        : 'bg-[#2C3E68] hover:bg-[#1F2F4F]'
                    } text-white`}
                  >
                    Register
                  </Link>
                </>
              )}

              <button
                onClick={() => setSidebarOpen(true)}
                className={`group w-11 h-11 flex flex-col items-center justify-center rounded-xl transition-all duration-300 ${
                  darkMode
                    ? 'bg-[#1F2937] hover:bg-[#2A3441]'
                    : 'bg-[#F8FAFC] hover:bg-[#E2E8F0]'
                }`}
              >
                <span
                  className={`block w-5 h-[2px] mb-1 rounded-full transition-all ${
                    darkMode ? 'bg-white' : 'bg-black'
                  } group-hover:w-6`}
                />
                <span
                  className={`block w-5 h-[2px] mb-1 rounded-full transition-all ${
                    darkMode ? 'bg-white' : 'bg-black'
                  } group-hover:w-4`}
                />
                <span
                  className={`block w-5 h-[2px] rounded-full transition-all ${
                    darkMode ? 'bg-white' : 'bg-black'
                  } group-hover:w-6`}
                />
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Sidebar */}
      <div
        className={`fixed inset-0 z-[60] ${sidebarOpen ? 'pointer-events-auto' : 'pointer-events-none'}`}
      >
        {/* Overlay */}
        <div
          onClick={() => setSidebarOpen(false)}
          className={`absolute inset-0 bg-black/50 backdrop-blur-[2px] transition-opacity duration-300 ${
            sidebarOpen ? 'opacity-100' : 'opacity-0'
          }`}
        />

        {/* Panel */}
        <aside
          className={`absolute right-0 top-0 h-full w-[22rem] max-w-[90vw] transform transition-transform duration-300 ease-in-out overflow-y-auto shadow-2xl ${
            sidebarOpen ? 'translate-x-0' : 'translate-x-full'
          } ${
            darkMode
              ? 'bg-[#111827] border-l border-[#2D3748] text-[#F0F4FA]'
              : 'bg-[#FCFCFD] border-l border-[#E5E7EB] text-[#1F2937]'
          }`}
        >
          {/* Header */}
          <div
            className={`sticky top-0 z-10 px-6 py-5 border-b backdrop-blur-md ${
              darkMode
                ? 'bg-[#111827]/95 border-[#2D3748]'
                : 'bg-[#FCFCFD]/95 border-[#E5E7EB]'
            }`}
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p
                  className={`text-xs uppercase tracking-[0.2em] font-bold mb-2 ${
                    darkMode ? 'text-[#93A4C3]' : 'text-[#64748B]'
                  }`}
                >
                  Digital Shelf
                </p>
                <h2 className="text-3xl font-black tracking-tight flex items-center gap-2">
                  <span>📚</span>
                  <span>BiblioTech</span>
                </h2>
                <p
                  className={`text-sm mt-2 ${
                    darkMode ? 'text-[#A0AEC0]' : 'text-[#6B7280]'
                  }`}
                >
                  Explore collections, tools, and your reader space.
                </p>
              </div>

              <button
                onClick={() => setSidebarOpen(false)}
                className={`group absolute top-4 right-4 w-11 h-11 flex items-center justify-center rounded-xl transition-all duration-300 active:scale-90 ${
                  darkMode
                    ? 'bg-[#1F2937] hover:bg-[#2A3441]'
                    : 'bg-white border border-[#E5E7EB] hover:bg-[#F3F4F6]'
                }`}
              >
                <div className="relative w-4 h-4 transition-transform duration-300 group-hover:scale-135 group-hover:rotate-90">
                  <span
                    className={`absolute left-1/2 top-1/2 w-5 h-[2px] rounded-full -translate-x-1/2 -translate-y-1/2 rotate-45 ${
                      darkMode ? 'bg-white' : 'bg-[#1F2937]'
                    }`}
                  />
                  <span
                    className={`absolute left-1/2 top-1/2 w-5 h-[2px] rounded-full -translate-x-1/2 -translate-y-1/2 -rotate-45 ${
                      darkMode ? 'bg-white' : 'bg-[#1F2937]'
                    }`}
                  />
                </div>
              </button>
            </div>
          </div>

          <div className="px-6 py-6 space-y-8">
            {/* Auth / Welcome Card */}
            <section
              className={`rounded-3xl border p-5 ${
                darkMode
                  ? 'bg-gradient-to-br from-[#1E2740] to-[#162033] border-[#2D3748]'
                  : 'bg-gradient-to-br from-[#F8FAFC] to-white border-[#E5E7EB]'
              }`}
            >
              {isLoggedIn ? (
                <div>
                  <p
                    className={`text-xs uppercase tracking-[0.2em] font-bold mb-2 ${
                      darkMode ? 'text-[#93A4C3]' : 'text-[#64748B]'
                    }`}
                  >
                    Your Space
                  </p>
                  <h3 className="text-xl font-bold mb-2">Welcome back</h3>
                  <p className={`text-sm mb-4 ${darkMode ? 'text-[#A0AEC0]' : 'text-[#6B7280]'}`}>
                    Continue exploring your library and reader tools.
                  </p>

                  <div className="grid grid-cols-2 gap-3">
                    <Link to="/profile">
                      <button
                        className={`w-full px-4 py-3 rounded-2xl font-semibold transition-all ${
                          darkMode
                            ? 'bg-[#0F172A] text-white hover:bg-[#1E293B]'
                            : 'bg-white border border-[#E5E7EB] text-[#1F2937] hover:bg-[#F8FAFC]'
                        }`}
                      >
                        My Profile
                      </button>
                    </Link>

                    <button
                      onClick={handleLogout}
                      className="w-full px-4 py-3 rounded-2xl font-semibold transition-all bg-red-500 text-white hover:bg-red-600"
                    >
                      Logout
                    </button>
                  </div>
                </div>
              ) : (
                <div>
                  <p
                    className={`text-xs uppercase tracking-[0.2em] font-bold mb-2 ${
                      darkMode ? 'text-[#93A4C3]' : 'text-[#64748B]'
                    }`}
                  >
                    Reader Access
                  </p>
                  <h3 className="text-xl font-bold mb-2">Join the Library</h3>
                  <p className={`text-sm mb-4 ${darkMode ? 'text-[#A0AEC0]' : 'text-[#6B7280]'}`}>
                    Sign in to manage your profile, groups, and personalized features.
                  </p>

                  <div className="grid grid-cols-2 gap-3">
                    <Link to="/login">
                      <button
                        className={`w-full px-4 py-3 rounded-2xl font-semibold transition-all ${
                          darkMode
                            ? 'bg-[#0F172A] text-white hover:bg-[#1E293B]'
                            : 'bg-white border border-[#E5E7EB] text-[#1F2937] hover:bg-[#F8FAFC]'
                        }`}
                      >
                        Login
                      </button>
                    </Link>

                    <Link to="/register">
                      <button
                        className={`w-full px-4 py-3 rounded-2xl font-semibold transition-all ${
                          darkMode
                            ? 'bg-[#5F7DB0] text-white hover:bg-[#4A6A9E]'
                            : 'bg-[#2C3E68] text-white hover:bg-[#1F2F4F]'
                        }`}
                      >
                        Sign Up
                      </button>
                    </Link>
                  </div>
                </div>
              )}
            </section>

            {/* Browse Section */}
            <section>
              <div className="flex items-center gap-2 mb-4">
                <span className="text-lg">🔎</span>
                <h3 className="text-lg font-bold">Browse</h3>
              </div>

              <div className="space-y-2">
                {[
                  { label: 'Best Sellers', to: '/search?type=collection&q=best-sellers' },
                  { label: 'New Releases', to: '/search?type=collection&q=new-releases' },
                  { label: 'Popular Books', to: '/search?type=collection&q=popular-books' },
                  { label: 'Academics', to: '/search?type=genre&q=academics' },
                  { label: 'History', to: '/search?type=genre&q=history' },
                  { label: 'Romance', to: '/search?type=genre&q=romance' },
                  { label: 'Advanced Search', to: '/advanced' },
                ].map((item) => (
                  <Link
                    key={item.label}
                    to={item.to}
                    className={`flex items-center justify-between rounded-2xl px-4 py-3 transition-all ${
                      darkMode
                        ? 'hover:bg-[#1F2937] text-[#D1D5DB]'
                        : 'hover:bg-[#F3F4F6] text-[#374151]'
                    }`}
                  >
                    <span className="font-medium">{item.label}</span>
                    <span className={`${darkMode ? 'text-[#64748B]' : 'text-[#94A3B8]'}`}>→</span>
                  </Link>
                ))}

                <button
                  onClick={handleRandomBook}
                  className={`w-full flex items-center justify-between rounded-2xl px-4 py-3 transition-all ${
                    darkMode
                      ? 'hover:bg-[#1F2937] text-[#D1D5DB]'
                      : 'hover:bg-[#F3F4F6] text-[#374151]'
                  }`}
                >
                  <span className="font-medium">Random Book</span>
                  <span className={`${darkMode ? 'text-[#64748B]' : 'text-[#94A3B8]'}`}>🎲</span>
                </button>
              </div>
            </section>

            {/* Community & Tools */}
            <section>
              <div className="flex items-center gap-2 mb-4">
                <span className="text-lg">🛠️</span>
                <h3 className="text-lg font-bold">Community & Tools</h3>
              </div>

              <div className="space-y-2">
                {[
                  ...(isLoggedIn ? [{ label: 'View your Profile', to: '/profile' }] : []),
                  { label: 'Join a Group', to: '/groups' },
                  { label: 'Settings', to: '/settings' },
                ].map((item) => (
                  <Link
                    key={item.label}
                    to={item.to}
                    className={`flex items-center justify-between rounded-2xl px-4 py-3 transition-all ${
                      darkMode
                        ? 'hover:bg-[#1F2937] text-[#D1D5DB]'
                        : 'hover:bg-[#F3F4F6] text-[#374151]'
                    }`}
                  >
                    <span className="font-medium">{item.label}</span>
                    <span className={`${darkMode ? 'text-[#64748B]' : 'text-[#94A3B8]'}`}>→</span>
                  </Link>
                ))}
              </div>
            </section>

            {/* Footer note */}
            <section
              className={`rounded-3xl px-4 py-4 text-sm ${
                darkMode ? 'bg-[#0F172A] text-[#94A3B8]' : 'bg-[#F8FAFC] text-[#6B7280]'
              }`}
            >
              <p className="leading-relaxed">
                Organize your reading, discover new books, and connect with other readers through one elegant library experience.
              </p>
            </section>
          </div>
        </aside>
      </div>

      {/* Hero Section */}
      <section className="h-screen w-full relative pt-16">
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${hero})` }}>
          <div className={`absolute inset-0 ${darkMode ? 'bg-black/70' : 'bg-[#2C3E68]/60'}`} />
        </div>
        <div className="relative h-full flex items-center justify-center text-center px-4">
          <div className="max-w-4xl animate-fade-in">
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">
              Unlock your potential,
              <br />
              one page at a time
            </h1>
            <p className="text-xl text-white/90 leading-relaxed mb-8">
              Discover a world of knowledge at your fingertips. Our Library offers an extensive
              collections of books across all genres.
            </p>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section ref={statsRef} className="py-20 w-full px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { label: 'Total Books', val: counts.books },
            { label: 'Active Readers', val: counts.users },
            { label: 'Books Borrowed', val: counts.borrows },
          ].map((stat, i) => (
            <div
              key={i}
              className={`p-10 rounded-3xl text-center ${darkMode ? 'bg-[#1E2740]' : 'bg-white shadow-xl'}`}
            >
              <div className="text-5xl font-extrabold text-[#5F7DB0] mb-2">
                {stat.val.toLocaleString()}
              </div>
              <div className="text-xl opacity-80">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Community Section */}
      <section ref={communityRef} className="py-12 w-full px-6 md:px-10 overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-7xl mx-auto">
          <div
            className={`p-10 rounded-[2.5rem] transition-all duration-1000 transform 
            ${showCommunity ? 'translate-x-0 opacity-100' : '-translate-x-full opacity-0'}
            ${darkMode ? 'bg-[#1E2740]' : 'bg-white shadow-2xl border border-gray-100'}`}
          >
            <h2 className="text-4xl font-bold mb-6 text-[#5F7DB0]">Reader Communities</h2>
            <p className={`text-lg leading-relaxed mb-8 opacity-80 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              Don't just read alone. Join our global network of book lovers.
              <strong> Create your own community</strong>, host <strong>Discussion Boards</strong> for your
              favorite sagas, and connect with readers who share your passion.
            </p>
            <div className="flex flex-wrap gap-4">
              <span className={`px-4 py-2 rounded-full text-sm font-bold ${darkMode ? 'bg-[#0A0F1F]' : 'bg-gray-100'}`}>
                #DiscussionBoard
              </span>
              <span className={`px-4 py-2 rounded-full text-sm font-bold ${darkMode ? 'bg-[#0A0F1F]' : 'bg-gray-100'}`}>
                #CreateCommunity
              </span>
            </div>
          </div>

          <div
            className={`relative h-full min-h-[300px] rounded-[2.5rem] overflow-hidden transition-all duration-1000 delay-300 transform 
            ${showCommunity ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'}`}
          >
            <div
              className="absolute inset-0 bg-cover bg-center transition-transform duration-700 hover:scale-110"
              style={{ backgroundImage: `url(${hero})` }}
            >
              <div className={`absolute inset-0 ${darkMode ? 'bg-[#5F7DB0]/40' : 'bg-[#2C3E68]/40'} backdrop-blur-[2px]`} />
            </div>
            <div className="relative h-full flex flex-col items-center justify-center p-8 text-center text-white">
              <h3 className="text-3xl font-bold mb-4">Ready to engage?</h3>
              <p className="mb-8 font-medium">Explore thousands of active reading groups right now.</p>
              <Link
                to="/groups"
                className="px-8 py-4 bg-white text-[#2C3E68] rounded-2xl font-bold shadow-xl hover:bg-[#5F7DB0] hover:text-white transition-all transform hover:-translate-y-1 active:scale-95"
              >
                View all communities
              </Link>
            </div>
          </div>
        </div>
      </section>
      {/* Game Section */}
<GameSection darkMode={darkMode} />

      {/* Book Sliders */}
      <BookSection title="Best Sellers" books={dummyBooks} darkMode={darkMode} />
      <BookSection title="Popular Books" books={dummyBooks} darkMode={darkMode} />
      <BookSection title="Recent Books" books={dummyBooks} darkMode={darkMode} />

      {/* Categories */}
      <section className={`py-16 w-full px-6 ${darkMode ? 'bg-[#151B2D]' : 'bg-gray-100'}`}>
        <h2 className="text-3xl font-bold mb-10 text-center">Browse by Category</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-5xl mx-auto">
          {[
            'History',
            'Science Fiction',
            'Self-help',
            'Mystery',
            'Romance',
            'Children',
            'Academic',
            'Business',
            'Literature',
            'Biography',
          ].map((cat) => (
            <Link
              key={cat}
              to={`/search?type=genre&q=${cat.toLowerCase()}`}
              className={`p-4 rounded-xl border text-center transition-all hover:bg-[#5F7DB0] hover:text-white ${
                darkMode ? 'border-gray-700 bg-[#1E2740]' : 'border-gray-200 bg-white'
              }`}
            >
              {cat} Books
            </Link>
          ))}
        </div>
      </section>

      {/* Contact */}
      <section className="py-20 w-full px-6 max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
          <div className="contact-col">
            <h3 className="text-3xl font-bold mb-4">Send us a message</h3>
            <p className="opacity-80 leading-relaxed">
              Feel free to reach out through contact form or find our contact information below.
              Your feedback, questions, and suggestions are important to us.
            </p>
            <ul className="mt-6">
              <li className="flex items-center space-x-2">
                <span>📧</span> <span>LibCore.lebanon@gmail.com</span>
              </li>
            </ul>
          </div>

          <div className={`p-8 rounded-2xl ${darkMode ? 'bg-[#1E2740]' : 'bg-white shadow-2xl'}`}>
            <form className="space-y-4">
              <label className="font-semibold block">Write your message here</label>
              <textarea
                rows="6"
                className={`w-full p-4 rounded-lg border focus:ring-2 focus:ring-[#5F7DB0] outline-none ${
                  darkMode ? 'bg-[#0A0F1F] border-gray-700' : 'bg-gray-50 border-gray-200'
                }`}
                placeholder="Enter your message..."
              ></textarea>
              <button
                type="submit"
                className={`w-full py-3 rounded-lg font-bold text-white transition-opacity hover:opacity-90 ${
                  darkMode ? 'bg-[#5F7DB0]' : 'bg-[#2C3E68]'
                }`}
              >
                Submit
              </button>
            </form>
          </div>
        </div>
      </section>

      <Footer darkMode={darkMode} />
    </div>
  );
};

export default Home;
