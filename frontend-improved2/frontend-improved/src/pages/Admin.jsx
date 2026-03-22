import React from "react";
import { Link } from "react-router-dom";
import { BookVerseShell, Pill, PrimaryButton, SecondaryButton, SectionHeading, StatTile, Surface } from "../components/BookVerseUI";
import { competitions, featuredBooks } from "../data/bookverse";

const adminBooks = featuredBooks.slice(0, 4);
const users = [
  { name: "Ayla Mercer", role: "Reader", level: 17, status: "Active" },
  { name: "Mina Albrecht", role: "Moderator", level: 22, status: "Active" },
  { name: "Noor Ash", role: "Reader", level: 14, status: "Competition Lead" },
];

function Admin({ darkMode, setDarkMode }) {
  return (
    <BookVerseShell darkMode={darkMode} setDarkMode={setDarkMode} title="BookVerse Admin" subtitle="Management Dashboard">
      <Surface className="p-6 sm:p-8">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <Pill>Admin Dashboard</Pill>
            <h1 className="font-display mt-4 text-5xl text-slate-900">Manage the library without leaving the BookVerse world</h1>
            <p className="mt-4 max-w-3xl text-base leading-8 text-slate-600">
              Oversee books, users, and competitions in a way that still feels connected to the main reading experience.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <SecondaryButton to="/">Return to Library</SecondaryButton>
            <SecondaryButton to="/competitions">View Live Competitions</SecondaryButton>
          </div>
        </div>
      </Surface>

      <section className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatTile label="Books Managed" value="18,240" detail="Curated across shelves and roadmaps" />
        <StatTile label="Users" value="8,912" detail="Readers, moderators, and admins" />
        <StatTile label="Competitions" value={competitions.length} detail="Across all statuses" />
        <StatTile label="Join Deadlines" value="2 upcoming" detail="Ready for moderation checks" />
      </section>

      <section className="mt-10 grid gap-6 xl:grid-cols-[1fr_1fr]">
        <Surface className="p-6 sm:p-8">
          <SectionHeading eyebrow="Manage Books" title="Editorial control for featured titles" description="Keep the collection elegant and current." />
          <div className="mt-6 space-y-3">
            {adminBooks.map((book) => (
              <div key={book.id} className="flex items-center justify-between rounded-[1.5rem] bg-white/65 px-4 py-4">
                <div>
                  <p className="font-semibold text-slate-900">{book.title}</p>
                  <p className="text-sm text-slate-500">{book.author}</p>
                </div>
                <div className="flex gap-2">
                  <button className="bookverse-button rounded-full border border-slate-900/10 bg-white px-4 py-2 text-sm font-semibold text-slate-900">Edit</button>
                  <button className="bookverse-button rounded-full border border-rose-200 bg-rose-50 px-4 py-2 text-sm font-semibold text-rose-700">Archive</button>
                </div>
              </div>
            ))}
          </div>
        </Surface>

        <Surface className="p-6 sm:p-8">
          <SectionHeading eyebrow="Manage Users" title="Reader and moderator visibility" description="Review status, progression, and moderation roles." />
          <div className="mt-6 space-y-3">
            {users.map((user) => (
              <div key={user.name} className="flex items-center justify-between rounded-[1.5rem] bg-white/65 px-4 py-4">
                <div>
                  <p className="font-semibold text-slate-900">{user.name}</p>
                  <p className="text-sm text-slate-500">{user.role}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-slate-900">Level {user.level}</p>
                  <p className="text-sm text-slate-500">{user.status}</p>
                </div>
              </div>
            ))}
          </div>
        </Surface>
      </section>

      <section className="mt-10 grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <Surface className="p-6 sm:p-8">
          <SectionHeading eyebrow="Competition Management" title="Create and update challenge arcs" description="Join deadlines, roadmap books, rewards, and timing all stay in one connected flow." />
          <form className="mt-6 grid gap-4 md:grid-cols-2">
            {[
              ["Competition Title", "Moonlit Marathon"],
              ["Theme", "Nocturne Fantasy"],
              ["Join Deadline", "2026-04-04"],
              ["Start Date", "2026-04-05"],
              ["End Date", "2026-04-26"],
              ["Reward Coins", "1200"],
              ["Reward Points", "2800"],
              ["Roadmap Books", "The Starless Sea, Piranesi"],
            ].map(([label, placeholder]) => (
              <label key={label} className={label === "Roadmap Books" ? "md:col-span-2" : ""}>
                <span className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">{label}</span>
                <input className="mt-2 w-full rounded-[1.4rem] border border-slate-900/8 bg-white/75 px-4 py-4 text-slate-900 outline-none" placeholder={placeholder} />
              </label>
            ))}
            <label className="md:col-span-2">
              <span className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">Description</span>
              <textarea rows="4" className="mt-2 w-full rounded-[1.4rem] border border-slate-900/8 bg-white/75 px-4 py-4 text-slate-900 outline-none" placeholder="Describe the theme, roadmap intent, and reward structure..." />
            </label>
            <div className="md:col-span-2 flex flex-wrap gap-3">
              <PrimaryButton>Publish Competition</PrimaryButton>
              <SecondaryButton>Save Draft</SecondaryButton>
            </div>
          </form>
        </Surface>

        <Surface className="p-6 sm:p-8">
          <SectionHeading eyebrow="Competition Statuses" title="Current challenge overview" />
          <div className="mt-6 space-y-3">
            {competitions.map((competition) => (
              <Link key={competition.id} to={`/competitions/${competition.id}`} className="block rounded-[1.5rem] bg-white/65 px-4 py-4 transition hover:-translate-y-0.5">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="font-semibold text-slate-900">{competition.title}</p>
                    <p className="text-sm text-slate-500">{competition.theme}</p>
                  </div>
                  <Pill>{competition.status}</Pill>
                </div>
              </Link>
            ))}
          </div>
        </Surface>
      </section>
    </BookVerseShell>
  );
}

export default Admin;
