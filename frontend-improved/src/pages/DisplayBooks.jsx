import { useState, useEffect, useMemo } from "react";
import { useLocation, Link, useNavigate } from "react-router-dom";
import default_image from "../assets/default-book-cover.jpg";
import api from "../api/client";
import { extractList, normalizeBook, extractTotal } from "../api/normalize";

const ADVANCED_KEYS = ["title", "author", "genre", "isbn", "placeOfPublishing", "minPages", "maxPages"];

function isAdvancedSearch(searchParams) {
  if (searchParams.get("advanced") === "1") return true;
  return ADVANCED_KEYS.some((k) => searchParams.get(k));
}

const BookCard = ({ book, darkMode }) => {
  return (
    <Link to={`/book/${book.id}`} state={{ book }}>
      <div
        className={`flex flex-col group rounded-xl h-full transition-all duration-300 ${
          darkMode ? "bg-[#1E2740] text-white hover:bg-[#25304d]" : "bg-white shadow-sm hover:shadow-md text-gray-800"
        } p-3 border ${darkMode ? "border-[#2D3748]" : "border-[#E2E8F0]"}`}
      >
        <div className="relative aspect-[3/4] overflow-hidden rounded-lg mb-3 bg-gray-200">
          <img
            src={book.coverUrl || default_image}
            alt={book.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            onError={(e) => { e.target.src = default_image; }}
          />
          <div className="absolute top-2 right-2 bg-[#5F7DB0] text-white text-[10px] px-2 py-1 rounded-full font-bold uppercase tracking-wider opacity-0 group-hover:opacity-100 transition-opacity">
            View Details
          </div>
        </div>

        <div className="flex-1">
          <h3 className="font-bold truncate text-sm sm:text-base mb-1 group-hover:text-[#5F7DB0] transition-colors">{book.title}</h3>
          <p className="text-xs opacity-70 mb-2 italic">By {book.author}</p>

          <div className="flex items-center justify-between mt-auto">
             <div className="flex text-yellow-500 text-xs">
              {Array.from({ length: 5 }, (_, i) => (
                <span key={i}>{i < Math.floor(book.rating || 0) ? "★" : "☆"}</span>
              ))}
            </div>
            <span className={`text-[10px] font-bold ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              {book.year ?? "N/A"}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
};

const DisplayBooks = ({ darkMode }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const searchParams = useMemo(() => new URLSearchParams(location.search), [location.search]);

  const searchTerm = (searchParams.get("q") || "").trim();
  const filterType = searchParams.get("type");

  const [sortBy, setSortBy] = useState("year");
  const [books, setBooks] = useState([]);
  const [totalCount, setTotalCount] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const booksPerPage = 12;

  useEffect(() => {
    let cancel = false;
    const run = async () => {
      setLoading(true);
      setError("");
      const params = new URLSearchParams(location.search);
      const page = Number(params.get("page")) || 1;
      const limit = booksPerPage;

      const qs = new URLSearchParams();
      qs.set("page", String(page));
      qs.set("limit", String(limit));
      qs.set("sort", sortBy);

      let path;
      try {
        if (isAdvancedSearch(params)) {
          ADVANCED_KEYS.forEach((k) => {
            const v = params.get(k);
            if (v) qs.set(k, v);
          });
          path = `/api/books/advanced-search?${qs.toString()}`;
        } else if (filterType === "genre") {
          qs.set("type", "genre");
          qs.set("q", searchTerm);
          path = `/api/books/search?${qs.toString()}`;
        } else if (filterType === "collection") {
          qs.set("type", "collection");
          qs.set("q", searchTerm);
          path = `/api/books/search?${qs.toString()}`;
        } else {
          qs.set("q", searchTerm);
          path = `/api/books/search?${qs.toString()}`;
        }

        const res = await api.get(path);
        if (cancel) return;
        const list = extractList(res.data).map(normalizeBook).filter(Boolean);
        setBooks(list);
        const t = extractTotal(res.data);
        setTotalCount(t != null ? t : list.length);
      } catch (e) {
        if (!cancel) {
          setError(e.response?.data?.message || e.response?.data?.error || "Failed to load books.");
          setBooks([]);
          setTotalCount(0);
        }
      } finally {
        if (!cancel) setLoading(false);
      }
    };
    run();
    return () => { cancel = true; };
  }, [location.search, filterType, searchTerm, sortBy]);

  const pageFromUrl = Number(searchParams.get("page"));
  const safePage = !Number.isNaN(pageFromUrl) && pageFromUrl >= 1 ? pageFromUrl : 1;
  const totalPages = totalCount != null && totalCount > 0 ? Math.ceil(totalCount / booksPerPage) : 1;
  const displayTotal = totalCount != null ? totalCount : books.length;

  const goPage = (p) => {
    const next = new URLSearchParams(location.search);
    next.set("page", String(p));
    navigate(`${location.pathname}?${next.toString()}`);
  };

  return (
    <div className={`min-h-screen pt-8 pb-12 px-4 sm:px-8 lg:px-12 transition-colors duration-300 ${darkMode ? "bg-[#0A0F1F]" : "bg-[#F8F9FC]"}`}>
      
      {/* Navigation & Header */}
      <div className="max-w-7xl mx-auto mb-6 flex items-center justify-between">
        <Link to="/" className={`px-5 py-2 rounded-xl text-sm font-bold shadow-md transition-all active:scale-95 ${darkMode ? "bg-[#1E2740] hover:bg-[#2D3748]" : "bg-white hover:bg-gray-50"} ${darkMode ? "text-[#5F7DB0]" : "text-[#2C3E68]"}`}>
          ← Back to Dashboard
        </Link>
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Sidebar - Instructions & Tips */}
        <div className="lg:col-span-1 space-y-6">
          <div className={`p-6 rounded-2xl border ${darkMode ? "bg-[#1E2740] border-[#2D3748]" : "bg-white border-[#E2E8F0] shadow-sm"}`}>
            <h2 className={`font-bold mb-4 flex items-center gap-2 ${darkMode ? "text-white" : "text-[#1F2937]"}`}>
              <span>💡</span> Search Tips
            </h2>
            <ul className={`text-xs space-y-3 leading-relaxed ${darkMode ? "text-[#A0AEC0]" : "text-[#4A5568]"}`}>
              <li>• Use <strong>Advanced Search</strong> to filter by ISBN or page count.</li>
              <li>• Sort by <strong>"Available Copies"</strong> to see what you can borrow right now.</li>
              <li>• Clicking a book cover shows the full summary and availability status.</li>
            </ul>
          </div>

          <div className={`p-6 rounded-2xl border ${darkMode ? "bg-gradient-to-br from-[#1e2740] to-[#161c2e] border-[#2D3748]" : "bg-gradient-to-br from-white to-[#f1f5f9] border-[#E2E8F0] shadow-sm"}`}>
            <h2 className={`font-bold mb-2 ${darkMode ? "text-white" : "text-[#1F2937]"}`}>Reader Instructions</h2>
            <p className={`text-xs leading-relaxed ${darkMode ? "text-[#A0AEC0]" : "text-[#4A5568]"}`}>
              Found a book you like? Click on it to see which library branch holds the physical copy. You can add books to your "Want to Read" list from the profile page.
            </p>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="lg:col-span-3">
          <div className={`mb-8 p-6 rounded-2xl border ${darkMode ? "bg-[#1E2740] border-[#2D3748]" : "bg-white border-[#E2E8F0] shadow-sm"}`}>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h1 className={`text-2xl font-black tracking-tight ${darkMode ? "text-white" : "text-[#1F2937]"}`}>
                  {isAdvancedSearch(searchParams) ? "Advanced Search" : searchTerm ? `Search: ${searchTerm}` : "Library Catalog"}
                </h1>
                <div className="flex items-center gap-2 mt-2">
                  <span className={`text-xs px-2 py-0.5 rounded-md font-bold uppercase ${darkMode ? "bg-[#2D3748] text-[#5F7DB0]" : "bg-[#F1F5F9] text-[#2C3E68]"}`}>
                    {filterType || "Generic Search"}
                  </span>
                  <p className={`text-xs ${darkMode ? "text-[#A0AEC0]" : "text-[#4A5568]"}`}>
                    {loading ? "Syncing..." : `${displayTotal} items found`}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <label className={`text-xs font-bold uppercase tracking-widest ${darkMode ? "text-[#64748B]" : "text-[#94A3B8]"}`}>Order By</label>
                <select
                  value={sortBy}
                  onChange={(e) => {
                    setSortBy(e.target.value);
                    const next = new URLSearchParams(location.search);
                    next.set("page", "1");
                    navigate(`${location.pathname}?${next.toString()}`);
                  }}
                  className={`px-3 py-2 text-sm rounded-lg border outline-none cursor-pointer transition-all ${
                    darkMode ? "bg-[#0A0F1F] border-[#2D3748] text-white" : "bg-[#F8FAFC] border-[#E2E8F0] text-black"
                  }`}
                >
                  <option value="year">Release Year</option>
                  <option value="copies">Availability</option>
                  <option value="newest">Recent Additions</option>
                </select>
              </div>
            </div>
            {error && <p className="text-red-500 text-xs font-bold mt-4 p-3 bg-red-500/10 rounded-lg border border-red-500/20">{error}</p>}
          </div>

          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <div key={i} className={`aspect-[3/4] animate-pulse rounded-xl ${darkMode ? "bg-[#1E2740]" : "bg-gray-200"}`} />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-6">
              {books.map((book) => (
                <BookCard key={book.id} book={book} darkMode={darkMode} />
              ))}
            </div>
          )}

          {!loading && books.length === 0 && (
            <div className={`text-center py-20 rounded-3xl border-2 border-dashed ${darkMode ? "border-[#2D3748] text-[#A0AEC0]" : "border-gray-200 text-gray-400"}`}>
              <span className="text-4xl block mb-4">🕵️‍♂️</span>
              <p className="text-lg font-medium">We couldn't find any matches</p>
              <p className="text-sm">Try adjusting your filters or checking for typos.</p>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && !loading && (
            <div className="mt-12 flex items-center justify-between border-t border-gray-500/20 pt-8">
              <button
                type="button"
                onClick={() => goPage(Math.max(safePage - 1, 1))}
                disabled={safePage === 1}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl border font-bold text-sm transition-all ${
                  safePage === 1 ? "opacity-30 cursor-not-allowed" : "hover:scale-105 active:scale-95"
                } ${darkMode ? "bg-[#1E2740] border-[#2D3748] text-white" : "bg-white border-[#E2E8F0] text-black"}`}
              >
                ← Previous
              </button>

              <div className="flex gap-2">
                {[...Array(totalPages)].map((_, i) => {
                  const p = i + 1;
                  return (
                    <button
                      key={p}
                      onClick={() => goPage(p)}
                      className={`w-8 h-8 rounded-lg text-xs font-bold transition-all ${
                        safePage === p
                          ? "bg-[#5F7DB0] text-white"
                          : darkMode ? "bg-[#1E2740] text-gray-400 hover:text-white" : "bg-white text-gray-400 hover:text-black border border-gray-100"
                      }`}
                    >
                      {p}
                    </button>
                  );
                })}
              </div>

              <button
                type="button"
                onClick={() => goPage(Math.min(safePage + 1, totalPages))}
                disabled={safePage === totalPages}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl border font-bold text-sm transition-all ${
                  safePage === totalPages ? "opacity-30 cursor-not-allowed" : "hover:scale-105 active:scale-95"
                } ${darkMode ? "bg-[#1E2740] border-[#2D3748] text-white" : "bg-white border-[#E2E8F0] text-black"}`}
              >
                Next →
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DisplayBooks;
