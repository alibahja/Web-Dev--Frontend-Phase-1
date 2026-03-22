import { useEffect, useMemo, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { BookCard, BookVerseShell, LoadingPulse, Pill, SectionHeading, SecondaryButton, Surface } from "../components/BookVerseUI";
import { featuredBooks } from "../data/bookverse";

const genres = ["All", "Fantasy", "Dark Academia", "Historical Fantasy", "Cozy Sci-Fi", "Epic Fantasy", "Literary Fantasy"];

const DisplayBooks = ({ darkMode, setDarkMode }) => {
  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const initialSearch = query.get("q")?.toLowerCase() || "";

  const [search, setSearch] = useState(initialSearch);
  const [selectedGenre, setSelectedGenre] = useState("All");
  const [sortBy, setSortBy] = useState("featured");
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    setIsSearching(true);
    const timer = window.setTimeout(() => setIsSearching(false), 260);
    return () => window.clearTimeout(timer);
  }, [search, selectedGenre, sortBy]);

  const books = useMemo(() => {
    let next = [...featuredBooks];

    if (search) {
      next = next.filter((book) =>
        [book.title, book.author, book.genre, book.blurb].some((value) =>
          value.toLowerCase().includes(search.toLowerCase())
        )
      );
    }

    if (selectedGenre !== "All") {
      next = next.filter((book) => book.genre === selectedGenre);
    }

    if (sortBy === "rating") next.sort((a, b) => b.rating - a.rating);
    if (sortBy === "xp") next.sort((a, b) => b.xp - a.xp);
    if (sortBy === "price") next.sort((a, b) => a.price - b.price);

    return next;
  }, [search, selectedGenre, sortBy]);

  return (
    <BookVerseShell darkMode={darkMode} setDarkMode={setDarkMode} title="BookVerse" subtitle="Curated Shelves">
      <Surface className="p-6 sm:p-8">
        <SectionHeading
          eyebrow="All Books"
          title="A Pinterest-inspired reading wall with premium pacing"
          description="Filters and sorting stay clean and quiet while the books remain the clear visual heroes."
          action={<SecondaryButton to="/advanced">Advanced search</SecondaryButton>}
        />
        <div className="mt-6 grid gap-4 lg:grid-cols-[1fr_auto_auto]">
          <label className="rounded-[1.5rem] border border-slate-900/8 bg-white/75 px-4 py-4">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">Search</p>
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search titles, authors, moods..."
              className="mt-2 w-full bg-transparent text-sm text-slate-900 outline-none placeholder:text-slate-400"
            />
          </label>
          <label className="rounded-[1.5rem] border border-slate-900/8 bg-white/75 px-4 py-4">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">Genre</p>
            <select value={selectedGenre} onChange={(e) => setSelectedGenre(e.target.value)} className="mt-2 w-full bg-transparent text-sm text-slate-900 outline-none">
              {genres.map((genre) => (
                <option key={genre}>{genre}</option>
              ))}
            </select>
          </label>
          <label className="rounded-[1.5rem] border border-slate-900/8 bg-white/75 px-4 py-4">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">Sort</p>
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="mt-2 w-full bg-transparent text-sm text-slate-900 outline-none">
              <option value="featured">Featured</option>
              <option value="rating">Highest Rated</option>
              <option value="xp">Most XP</option>
              <option value="price">Price</option>
            </select>
          </label>
        </div>
        <div className="mt-5 flex flex-wrap gap-2">
          {genres.map((genre) => (
            <button key={genre} onClick={() => setSelectedGenre(genre)}>
              <Pill className={selectedGenre === genre ? "bg-slate-900 text-[#f8f1e2]" : ""}>{genre}</Pill>
            </button>
          ))}
        </div>
      </Surface>

      <div className="mt-8 flex items-center justify-between">
        <p className="text-sm text-slate-600">
          Showing <span className="font-semibold text-slate-900">{books.length}</span> beautifully indexed reads
        </p>
        <Link to="/" className="text-sm font-semibold text-slate-900 underline-offset-4 hover:underline">
          Return Home
        </Link>
      </div>

      <section className="mt-8 columns-1 gap-6 sm:columns-2 lg:columns-3 xl:columns-4">
        {isSearching ? (
          <LoadingPulse label="Refreshing shelves..." />
        ) : books.length === 0 ? (
          <Surface className="break-inside-avoid p-8 text-center">
            <h3 className="font-display text-3xl text-slate-900">No books found</h3>
            <p className="mt-3 text-sm leading-7 text-slate-600">No results found. Try adjusting filters.</p>
          </Surface>
        ) : (
          books.map((book, index) => (
            <div key={book.id} className={index % 3 === 0 ? "mb-6 break-inside-avoid" : "mb-6 break-inside-avoid"}>
              <BookCard book={book} compact={index % 2 === 0} />
            </div>
          ))
        )}
      </section>
    </BookVerseShell>
  );
};

export default DisplayBooks;
