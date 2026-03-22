import React from "react";
import { FiAward, FiClock, FiCreditCard, FiLayers, FiZap } from "react-icons/fi";
import {
  BookCard,
  BookVerseShell,
  Pill,
  PrimaryButton,
  ProgressBar,
  SectionHeading,
  SecondaryButton,
  StatTile,
  Surface,
} from "../components/BookVerseUI";
import { featuredBooks } from "../data/bookverse";
import { useBookVerse } from "../context/BookVerseContext";

const Profile = ({ darkMode, setDarkMode }) => {
  const { profile } = useBookVerse();

  return (
    <BookVerseShell darkMode={darkMode} setDarkMode={setDarkMode} title="BookVerse" subtitle="Reader Dashboard">
      <section className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <Surface className="p-6 sm:p-8">
          <div className="flex flex-col gap-6 md:flex-row md:items-center">
            <div className="flex h-28 w-28 items-center justify-center rounded-[2rem] bg-[linear-gradient(145deg,#223653,#0f1927)] text-3xl font-bold text-[#f8f1e2]">
              {profile.initials}
            </div>
            <div className="flex-1">
              <Pill>{profile.persona.name}</Pill>
              <h1 className="font-display mt-4 text-4xl text-slate-900">{profile.name}</h1>
              <p className="mt-2 text-base text-slate-600">{profile.title}</p>
              <p className="mt-4 text-sm text-slate-500">Joined {profile.joined}</p>
            </div>
            <div className="flex flex-wrap gap-3">
              <PrimaryButton to="/personas">Change identity</PrimaryButton>
              <SecondaryButton to="/settings">Open settings</SecondaryButton>
            </div>
          </div>
        </Surface>

        <Surface className="p-6 sm:p-8">
          <SectionHeading
            eyebrow="Progression"
            title={`Level ${profile.level}`}
            description="Steady progression keeps reading rewarding without distracting from the books themselves."
          />
          <div className="mt-6">
            <div className="mb-2 flex items-center justify-between text-sm text-slate-600">
              <span>Current XP</span>
              <span>
                {profile.xp} / {profile.xpToNext}
              </span>
            </div>
            <ProgressBar value={profile.xp} max={profile.xpToNext} />
          </div>
          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            <StatTile label="Coins" value={profile.coins} detail="Cosmetic and prestige currency" />
            <StatTile label="Streak" value={`${profile.streak} days`} detail="Consistency reward" />
            <StatTile label="Badges" value={profile.badges.length} detail="Collected milestones" />
          </div>
        </Surface>
      </section>

      <section className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        {[
          { label: "Reader Identity", value: profile.persona.name, detail: profile.persona.perk, icon: FiLayers },
          { label: "Active Title", value: profile.title, detail: "Current prestige title", icon: FiAward },
          { label: "Reading Pulse", value: "Calm", detail: "Warm historical mode", icon: FiClock },
          { label: "Energy", value: "Focused", detail: "Ideal for long sessions", icon: FiZap },
          { label: "Cosmetic Vault", value: "12 items", detail: "Frames and accessories unlocked", icon: FiCreditCard },
        ].map(({ label, value, detail, icon: Icon }) => (
          <Surface key={label} className="p-5">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-900 text-[#f8f1e2]">
              <Icon />
            </div>
            <p className="mt-4 text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">{label}</p>
            <p className="mt-2 text-xl font-bold text-slate-900">{value}</p>
            <p className="mt-2 text-sm text-slate-600">{detail}</p>
          </Surface>
        ))}
      </section>

      <section className="mt-16 grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
        <Surface className="p-6 sm:p-8">
          <SectionHeading
            eyebrow="Current Competition"
            title={profile.currentCompetition.title}
            description="When you join a challenge, the dashboard becomes your calm command center for progress, rewards, and rank."
          />
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            <StatTile label="Status" value={profile.currentCompetition.status} detail="Live challenge state" />
            <StatTile label="Reward Coins" value={profile.currentCompetition.rewardCoins} detail="Completion reward" />
            <StatTile label="Reward XP" value={profile.currentCompetition.rewardPoints} detail="Roadmap value" />
          </div>
          <div className="mt-6">
            <p className="mb-2 text-sm text-slate-600">Challenge progress</p>
            <ProgressBar value={72} max={100} />
            <p className="mt-2 text-sm text-slate-500">72% of the roadmap completed in your current challenge.</p>
          </div>
          <div className="mt-6">
            <PrimaryButton to={`/competitions/${profile.currentCompetition.id}`}>View challenge detail</PrimaryButton>
          </div>
        </Surface>

        <Surface className="p-6 sm:p-8">
          <SectionHeading
            eyebrow="Badge Cabinet"
            title="Collected achievements"
            description="Subtle prestige items make your profile feel personal and lived-in."
          />
          <div className="mt-6 flex flex-wrap gap-3">
            {profile.badges.map((badge) => (
              <Pill key={badge}>{badge}</Pill>
            ))}
          </div>
        </Surface>
      </section>

      <section className="mt-16">
        <SectionHeading
          eyebrow="Personal Library"
          title="Your shelves stay elegant, visual, and easy to revisit"
          description="From favorites to roadmap reads, everything is organized around the atmosphere of reading rather than administrative clutter."
        />
        <div className="mt-8 grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
          {featuredBooks.slice(0, 4).map((book) => (
            <BookCard key={book.id} book={book} />
          ))}
        </div>
      </section>
    </BookVerseShell>
  );
};

export default Profile;
