import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { BookVerseShell, Pill, PrimaryButton, SecondaryButton, SectionHeading, Surface } from "../components/BookVerseUI";

const Advanced = ({ darkMode, setDarkMode }) => {
  const navigate = useNavigate();
  const [criteria, setCriteria] = useState({
    title: "",
    author: "",
    genre: "",
    isbn: "",
    place: "",
    minPages: "",
    maxPages: "",
  });
  const [error, setError] = useState("");

  const updateField = (event) => {
    setCriteria((prev) => ({ ...prev, [event.target.name]: event.target.value }));
  };

  const handleSearch = (event) => {
    event.preventDefault();
    setError("");

    if (criteria.minPages && criteria.maxPages && Number(criteria.minPages) > Number(criteria.maxPages)) {
      setError("Minimum pages cannot be greater than maximum pages.");
      return;
    }

    const params = new URLSearchParams();
    Object.entries(criteria).forEach(([key, value]) => {
      if (String(value).trim()) params.append(key, String(value).trim());
    });
    navigate(`/search?${params.toString()}`);
  };

  const reset = () => {
    setCriteria({ title: "", author: "", genre: "", isbn: "", place: "", minPages: "", maxPages: "" });
    setError("");
  };

  return (
    <BookVerseShell darkMode={darkMode} setDarkMode={setDarkMode} title="BookVerse" subtitle="Advanced Search">
      <Surface className="p-6 sm:p-8">
        <SectionHeading
          eyebrow="Advanced Search"
          title="Refine your search like a careful archivist"
          description="Search by title, author, genre, publication trail, or page range without leaving the warm BookVerse reading flow."
          action={<SecondaryButton to="/search">Back to all books</SecondaryButton>}
        />
      </Surface>

      <form onSubmit={handleSearch} className="mt-8">
        <Surface className="p-6 sm:p-8">
          <div className="grid gap-5 md:grid-cols-2">
            {[
              ["title", "Book Title", "The Shadow of the Wind"],
              ["author", "Author", "Carlos Ruiz Zafon"],
              ["genre", "Genre", "Fantasy"],
              ["isbn", "ISBN", "10 or 13 digit code"],
              ["place", "Place of Publishing", "London"],
            ].map(([name, label, placeholder]) => (
              <label key={name} className={name === "title" ? "md:col-span-2" : ""}>
                <span className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">{label}</span>
                <input
                  name={name}
                  value={criteria[name]}
                  onChange={updateField}
                  placeholder={placeholder}
                  className="mt-2 w-full rounded-[1.4rem] border border-slate-900/8 bg-white/75 px-4 py-4 text-slate-900 outline-none"
                />
              </label>
            ))}
            <div className="md:col-span-2 grid gap-5 md:grid-cols-2">
              <label>
                <span className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">Minimum Pages</span>
                <input
                  type="number"
                  name="minPages"
                  value={criteria.minPages}
                  onChange={updateField}
                  placeholder="120"
                  className="mt-2 w-full rounded-[1.4rem] border border-slate-900/8 bg-white/75 px-4 py-4 text-slate-900 outline-none"
                />
              </label>
              <label>
                <span className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">Maximum Pages</span>
                <input
                  type="number"
                  name="maxPages"
                  value={criteria.maxPages}
                  onChange={updateField}
                  placeholder="450"
                  className="mt-2 w-full rounded-[1.4rem] border border-slate-900/8 bg-white/75 px-4 py-4 text-slate-900 outline-none"
                />
              </label>
            </div>
          </div>

          {error ? <p className="mt-5 text-sm font-semibold text-rose-600">{error}</p> : null}

          <div className="mt-8 flex flex-wrap gap-3">
            <PrimaryButton className="w-full min-w-0 sm:w-auto sm:min-w-48">Search Collection</PrimaryButton>
            <button type="button" onClick={reset} className="bookverse-button w-full rounded-full border border-slate-900/10 bg-white/65 px-5 py-3 text-sm font-semibold text-slate-900 sm:w-auto">
              Reset Filters
            </button>
          </div>
        </Surface>
      </form>

      <div className="mt-8 grid gap-4 md:grid-cols-3">
        {[
          "Combine title and genre to narrow quickly.",
          "Use page range when you want shorter or longer reads.",
          "Leave fields blank if you want broader discovery.",
        ].map((tip) => (
          <Surface key={tip} className="p-5">
            <Pill>Search Tip</Pill>
            <p className="mt-4 text-sm leading-7 text-slate-600">{tip}</p>
          </Surface>
        ))}
      </div>
    </BookVerseShell>
  );
};

export default Advanced;
