import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import anotherphoto from '../assets/another_photo.png';
import hero from '../assets/hero.png';
import logo from "../assets/logo.jpeg";
import api from '../api/client';
import { extractList, normalizeBook} from '../api/normalize';
import  BookSection from '../components/BookSection';
import GameSection from '../components/GameSection';
import Footer from '../components/Footer';

const Home = ({ darkMode }) => {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setIsLoggedIn(false);
    setSidebarOpen(false);
    navigate('/');
  };

  const communityRef = useRef(null);
  const [showCommunity, setShowCommunity] = useState(false);

  const [counts, setCounts] = useState({ books: 0, users: 0, borrows: 0 });
  const statTargetsRef = useRef({ books: 0, users: 0, borrows: 0 });
  const statsRef = useRef(null);
  const [hasAnimated, setHasAnimated] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const [bestSellers, setBestSellers] = useState([]);
  const [popularBooks, setPopularBooks] = useState([]);
  const [recentBooks, setRecentBooks] = useState([]);
  const [booksLoading, setBooksLoading] = useState(true);

  const [contactMessage, setContactMessage] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactLoading, setContactLoading] = useState(false);
  const [contactError, setContactError] = useState('');
  const [contactSuccess, setContactSuccess] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);
  const [honeypot, setHoneypot] = useState('');
  
useEffect(() => {
  const storedUser = localStorage.getItem('user');
  const storedToken = localStorage.getItem('token');
  setIsLoggedIn(!!storedUser || !!storedToken);
  
  // Check if user is admin
  if (storedUser) {
    try {
      const user = JSON.parse(storedUser);
      setIsAdmin(user.role === 'admin');
    } catch {
      setIsAdmin(false);
    }
  }
}, []);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const storedToken = localStorage.getItem('token');
    setIsLoggedIn(!!storedUser || !!storedToken);
  }, []);

  useEffect(() => {
    let cancel = false;
    const fetchStats = async () => {
      try {
        const { data } = await api.get('/api/books/stats/public');
        if (!cancel && data.stats) {
          statTargetsRef.current = {
            books: Number(data.stats.totalBooks) || 0,
            users: Number(data.stats.totalUsers) || 0,
            borrows: Number(data.stats.borrowedBooks) || 0,
          };
          // If stats already visible, start counter immediately
          if (statsRef.current && isElementInViewport(statsRef.current)) {
            startCounter();
            setHasAnimated(true);
          }
        }
      } catch (err) {
        console.error('Failed to fetch stats:', err);
        statTargetsRef.current = { books: 0, users: 0, borrows: 0 };
      }
    };
    fetchStats();
    return () => { cancel = true; };
  }, []);
  // Helper function to check if element is in viewport
function isElementInViewport(el) {
    const rect = el.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}

  useEffect(() => {
    let cancel = false;
    setBooksLoading(true);
    Promise.all([
      api.get('/api/books/collection/best-sellers').catch(() => ({ data: [] })),
      api.get('/api/books/collection/popular-books').catch(() => ({ data: [] })),
      api.get('/api/books?sort=newest').catch(() => ({ data: [] })),
    ])
      .then(([a, b, c]) => {
        if (cancel) return;
        setBestSellers(extractList(a.data).map(normalizeBook).filter(Boolean));
        setPopularBooks(extractList(b.data).map(normalizeBook).filter(Boolean));
        setRecentBooks(extractList(c.data).map(normalizeBook).filter(Boolean));
      })
      .finally(() => {
        if (!cancel) setBooksLoading(false);
      });
    return () => {
      cancel = true;
    };
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
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
    const targets = statTargetsRef.current;
    if (targets.books === 0 && targets.users === 0 && targets.borrows === 0) {
        setCounts({ books: 0, users: 0, borrows: 0 });
        return;
    }
    
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

  const handleRandomBook = async () => {
    setSidebarOpen(false);
    try {
      const { data } = await api.get('/api/books/random');
      const raw = data.book ?? data;
      const book = normalizeBook(raw);
      if (!book?.id) {
        window.alert('Could not load a random book.');
        return;
      }
      navigate(`/book/${book.id}`, {
        state: { book, isRandom: true },
      });
    } catch {
      window.alert('Random book is unavailable right now.');
    }
  };

  const handleContactSubmit = async (e) => {
    e.preventDefault();
    setContactError('');
    setContactSuccess('');
    if (!contactMessage.trim()) {
      setContactError('Please enter a message.');
      return;
    }
    const loggedIn = !!localStorage.getItem('token');
    if (!loggedIn && !contactEmail.trim()) {
      setContactError('Please enter your email so we can reply.');
      return;
    }
    setContactLoading(true);
    try {
      if (loggedIn) {
        await api.post('/api/email/message', { message: contactMessage.trim() });
      } else {
        await api.post('/api/email/contact', {
          message: contactMessage.trim(),
          email: contactEmail.trim(),
        });
      }
      setContactSuccess('Message sent. Thank you!');
      setContactMessage('');
      setContactEmail('');
    } catch (err) {
      setContactError(err.response?.data?.message || err.response?.data?.error || 'Failed to send message.');
    } finally {
      setContactLoading(false);
    }
  };

  return (
    <div
      className={`w-full min-h-screen transition-colors duration-300 ${
        darkMode ? 'bg-[#0A0F1F] text-[#F0F4FA]' : 'bg-[#F8F9FC] text-[#1F2937]'
      }`}
    >
      <nav
  className={`fixed top-0 w-full z-50 transition-all duration-500 ${
    darkMode
      ? 'bg-[#0A0F1F]/80 backdrop-blur-xl border-b border-white/10'
      : 'bg-white/70 backdrop-blur-xl border-b border-black/10'
  }`}
>
  <div className="max-w-7xl mx-auto px-6 lg:px-10">
    <div className="flex items-center justify-between h-20">

      {/* 🔥 LOGO (UPGRADED BIG TIME) */}
      <Link to="/" className="flex items-center gap-4 group">
        <div className="relative">
          {/* Glow */}
          <div className="absolute inset-0 rounded-2xl bg-[#5F7DB0]/30 blur-xl opacity-0 group-hover:opacity-100 transition duration-500" />

          {/* Logo Image */}
          <img
            src={logo}
            alt="logo"
            className="w-12 h-12 object-contain rounded-xl relative z-10 transition-transform duration-300 group-hover:scale-110"
          />
        </div>

        {/* Brand */}
        <div className="leading-tight">
          <span className={`block text-2xl font-extrabold tracking-tight ${
            darkMode ? 'text-white' : 'text-[#1F2937]'
          }`}>
            BiblioTech
          </span>
          <span className="text-xs opacity-60 tracking-wide">
            Digital Library
          </span>
        </div>
      </Link>

      {/* 🔥 SEARCH (MORE PREMIUM) */}
      <form onSubmit={handleSearch} className="flex-1 max-w-xl mx-8">
        <div
          className={`flex items-center gap-3 px-4 py-3 rounded-2xl border transition-all duration-300
          ${
            darkMode
              ? 'bg-white/5 border-white/10 focus-within:border-[#5F7DB0] focus-within:bg-white/10'
              : 'bg-white border-gray-200 focus-within:border-[#2C3E68] shadow-sm'
          }`}
        >
          <span className="text-lg opacity-60">🔍</span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search books, authors..."
            className="w-full bg-transparent outline-none text-sm"
          />
        </div>
      </form>

      {/* 🔥 RIGHT SIDE */}
      <div className="flex items-center gap-3">

        {!isLoggedIn ? (
          <>
            <Link
              to="/login"
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                darkMode
                  ? 'text-gray-300 hover:text-white'
                  : 'text-gray-600 hover:text-black'
              }`}
            >
              Login
            </Link>

            <Link
              to="/register"
              className="px-5 py-2.5 rounded-xl text-sm font-semibold text-white 
              bg-gradient-to-r from-[#5F7DB0] to-[#2C3E68] 
              shadow-lg hover:scale-105 active:scale-95 transition-all"
            >
              Register
            </Link>
          </>
        ) : (
          <>
            {isAdmin && (
              <Link
                to="/admin"
                className="px-4 py-2 rounded-xl text-sm font-semibold bg-red-600 text-white hover:bg-red-700 transition"
              >
                Admin
              </Link>
            )}

            <button
              onClick={handleLogout}
              className="px-4 py-2 rounded-xl text-sm text-red-500 hover:bg-red-500/10 transition"
            >
              Logout
            </button>
          </>
        )}

        {/* 🔥 MENU BUTTON (ANIMATED) */}
        <button
          onClick={() => setSidebarOpen(true)}
          className="w-11 h-11 flex items-center justify-center rounded-xl bg-gradient-to-br from-[#5F7DB0] to-[#2C3E68] shadow-lg hover:scale-105 active:scale-95 transition-all"
        >
          <div className="flex flex-col gap-[3px]">
            <span className="w-5 h-[2px] bg-white rounded"></span>
            <span className="w-4 h-[2px] bg-white rounded"></span>
            <span className="w-5 h-[2px] bg-white rounded"></span>
          </div>
        </button>

      </div>
    </div>
  </div>
</nav>


      <div
        className={`fixed inset-0 z-[60] ${sidebarOpen ? 'pointer-events-auto' : 'pointer-events-none'}`}
      >
        <div
          role="presentation"
          onClick={() => setSidebarOpen(false)}
          className={`absolute inset-0 bg-black/50 backdrop-blur-[2px] transition-opacity duration-300 ${
            sidebarOpen ? 'opacity-100' : 'opacity-0'
          }`}
        />

        <aside
          className={`absolute right-0 top-0 h-full w-[22rem] max-w-[90vw] transform transition-transform duration-300 ease-in-out overflow-y-auto shadow-2xl ${
            sidebarOpen ? 'translate-x-0' : 'translate-x-full'
          } ${
            darkMode
              ? 'bg-[#111827] border-l border-[#2D3748] text-[#F0F4FA]'
              : 'bg-[#FCFCFD] border-l border-[#E5E7EB] text-[#1F2937]'
          }`}
        >
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
                type="button"
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
                        type="button"
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
                      type="button"
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
                        type="button"
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
                        type="button"
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
                  type="button"
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

      <section ref={communityRef} className="py-12 w-full px-6 md:px-10 overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-7xl mx-auto">
          <div
            className={`p-10 rounded-[2.5rem] transition-all duration-1000 transform 
            ${showCommunity ? 'translate-x-0 opacity-100' : '-translate-x-full opacity-0'}
            ${darkMode ? 'bg-[#1E2740]' : 'bg-white shadow-2xl border border-gray-100'}`}
          >
            <h2 className="text-4xl font-bold mb-6 text-[#5F7DB0]">Reader Communities</h2>
            <p className={`text-lg leading-relaxed mb-8 opacity-80 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              Don&apos;t just read alone. Join our global network of book lovers.
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
              style={{ backgroundImage: `url(${anotherphoto})` }}
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

      <GameSection darkMode={darkMode} />

      <BookSection title="Best Sellers" books={bestSellers} darkMode={darkMode} loading={booksLoading} />
      <BookSection title="Popular Books" books={popularBooks} darkMode={darkMode} loading={booksLoading} />
      <BookSection title="Recent Books" books={recentBooks} darkMode={darkMode} loading={booksLoading} />

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
              to={`/search?type=genre&q=${encodeURIComponent(cat.toLowerCase())}`}
              className={`p-4 rounded-xl border text-center transition-all hover:bg-[#5F7DB0] hover:text-white ${
                darkMode ? 'border-gray-700 bg-[#1E2740]' : 'border-gray-200 bg-white'
              }`}
            >
              {cat} Books
            </Link>
          ))}
        </div>
      </section>

     <section className="py-20 w-full px-6 max-w-6xl mx-auto">
  <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
    {/* Left Column */}
    <div className="contact-col">
      <h3 className={`text-3xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-[#000f38]'}`}>
        Send us a message <span>📩</span>
      </h3>
      <p className="opacity-80 leading-relaxed">
        Feel free to reach out through contact form or find our contact information 
        below. Your feedback, questions, and suggestions are important to us as we 
        strive to provide exceptional service to BiblioTech customers.
      </p>

      {/* Logged In Info */}
      {isLoggedIn && (
        <div className={`mt-4 p-4 rounded-lg border-l-4 ${
          darkMode ? 'bg-emerald-900/20 border-emerald-500 text-emerald-200' : 'bg-emerald-50 border-emerald-500 text-emerald-800'
        }`}>
          <p className="text-sm"><strong>Logged in:</strong> Ready to send.</p>
        </div>
      )}

      <ul className="mt-6 space-y-4">
        <li className="flex items-center space-x-2">
          <span>📧</span> <span>bibliotech453@gmail.com</span>
        </li>
      </ul>

      {/* ONLY SHOW THIS IF NOT LOGGED IN */}
      {!isLoggedIn && (
        <div className={`mt-6 p-6 rounded-xl border-l-4 ${
          darkMode ? 'bg-amber-900/20 border-amber-500 text-amber-200' : 'bg-amber-50 border-amber-500 text-amber-800'
        }`}>
          <p className="font-bold mb-3">🔐 Please log in to send us a message.</p>
          <button 
            onClick={() => navigate('/login')}
            className="px-6 py-2 bg-[#2C3E68] text-white rounded-lg font-bold hover:opacity-90 transition-all"
          >
            Go to Login
          </button>
        </div>
      )}
    </div>

    {/* Right Column (Form) */}
    <div className={`p-8 rounded-2xl transition-all ${
      !isLoggedIn ? 'opacity-60 grayscale-[0.5]' : ''
    } ${darkMode ? 'bg-[#1E2740]' : 'bg-white shadow-2xl'}`}>
      
      <form className="space-y-4" onSubmit={handleContactSubmit}>
        {/* Honeypot field - hidden from real users */}
        <input 
          type="text" 
          style={{ display: 'none' }}
          tabIndex="-1"
          value={honeypot}
          onChange={(e) => setHoneypot(e.target.value)}
        />
        
        <label className="font-semibold block">Write your message here</label>
        <textarea
          rows="6"
          value={contactMessage}
          onChange={(e) => setContactMessage(e.target.value)}
          disabled={!isLoggedIn || contactLoading}
          placeholder={isLoggedIn ? "Enter your message (min 10 characters)..." : "Please login to type..."}
          className={`w-full p-4 rounded-lg border outline-none transition-all ${
            !isLoggedIn ? 'cursor-not-allowed bg-gray-200' : 'focus:ring-2 focus:ring-[#5F7DB0]'
          } ${darkMode ? 'bg-[#0A0F1F] border-gray-700' : 'bg-gray-50 border-gray-200'}`}
        />

        <div className="flex justify-between items-center text-xs opacity-60">
          <span>{contactMessage.length}/1000 characters</span>
          {contactMessage.length > 0 && contactMessage.length < 10 && (
            <span className="text-red-500">Min. 10 required</span>
          )}
        </div>

        {contactError && <p className="text-red-500 text-sm font-semibold">{contactError}</p>}
        {contactSuccess && <p className="text-emerald-500 text-sm font-semibold">{contactSuccess}</p>}
        
        <button
          type="submit"
          disabled={!isLoggedIn || contactLoading || contactMessage.trim().length < 10}
          className={`w-full py-3 rounded-lg font-bold text-white transition-all ${
            !isLoggedIn || contactMessage.trim().length < 10
              ? 'bg-gray-500 cursor-not-allowed' 
              : (darkMode ? 'bg-[#5F7DB0] hover:bg-[#4A6A9E]' : 'bg-[#2C3E68] hover:opacity-90')
          }`}
        >
          {contactLoading ? '⏳ Sending…' : 'Submit'}
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

