import React from "react";
import { Link } from "react-router-dom";
import { FiArrowRight, FiAward, FiBookOpen, FiCompass, FiEdit3, FiStar, FiTarget } from "react-icons/fi";
import {
  BookCard,
  BookVerseShell,
  InlineLink,
  Pill,
  PrimaryButton,
  ProgressBar,
  RevealOnScroll,
  SectionHeading,
  SecondaryButton,
  StatTile,
  Surface,
} from "../components/BookVerseUI";
import { competitions, featuredBooks } from "../data/bookverse";
import { useBookVerse } from "../context/BookVerseContext";
import hero from "../assets/hero.png";

const Home = ({ darkMode, setDarkMode }) => {
  const { profile, personas } = useBookVerse();
  const featuredCompetition = profile.currentCompetition || competitions[0];

  const staffPicks = featuredBooks.slice(0, 3);
  const highlights = [
    "The final chapter of your latest read has 4 passages saved.",
    "Your note density has increased this week, signaling deeper reflection.",
    "You are 73% through your active reading journey this month.",
  ];

  return (
    <BookVerseShell darkMode={darkMode} setDarkMode={setDarkMode} title="BookVerse" subtitle="Luminous Library">
      <section id="about-bookverse" className="relative overflow-hidden rounded-4xl border border-[#2d2820]/10 bg-[#1f1d1a] text-[#f4e9da] shadow-[0_24px_54px_rgba(26,22,16,0.26)]">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-cover bg-center opacity-25" style={{ backgroundImage: `url(${hero})` }} />
          <div className="absolute inset-0 bg-[linear-gradient(120deg,rgba(20,18,15,0.92),rgba(20,18,15,0.74))]" />
        </div>

        <div className="relative grid gap-8 px-6 py-10 sm:px-10 sm:py-12 lg:grid-cols-[1.08fr_0.92fr] lg:px-14 lg:py-16">
          <div className="space-y-6">
            <Pill tone="dark" className="w-fit">A sanctuary for deep reading</Pill>
            <h1 className="font-display text-[2.6rem] leading-[1.02] text-[#f6ead9] sm:text-[3.5rem] lg:text-[4.4rem]">
              A luminous library experience for readers who want beauty, depth, and quiet reward.
            </h1>
            <p className="max-w-2xl text-base leading-8 text-[#d8cab6] sm:text-lg">
              Discover books in a calm editorial environment, track thoughtful progress, and preserve what matters through notes, highlights, and reflective reading rituals.
            </p>
            <div className="flex flex-wrap gap-3">
              <PrimaryButton to="/search">Enter the Library</PrimaryButton>
              <SecondaryButton tone="dark" to="/profile">Open Reading Journal</SecondaryButton>
            </div>
            <div className="grid gap-3 sm:grid-cols-3">
              <div className="rounded-2xl border border-[#dcc39c]/22 bg-[#f5e6ce]/7 px-4 py-4">
                <p className="text-xs uppercase tracking-[0.2em] text-[#cdb89a]">Collection</p>
                <p className="mt-2 text-2xl font-bold text-[#f4e8d8]">18.2k</p>
                <p className="text-xs text-[#c4b198]">Curated volumes</p>
              </div>
              <div className="rounded-2xl border border-[#dcc39c]/22 bg-[#f5e6ce]/7 px-4 py-4">
                <p className="text-xs uppercase tracking-[0.2em] text-[#cdb89a]">Momentum</p>
                <p className="mt-2 text-2xl font-bold text-[#f4e8d8]">{profile.streak}d</p>
                <p className="text-xs text-[#c4b198]">Current streak</p>
              </div>
              <div className="rounded-2xl border border-[#dcc39c]/22 bg-[#f5e6ce]/7 px-4 py-4">
                <p className="text-xs uppercase tracking-[0.2em] text-[#cdb89a]">Level</p>
                <p className="mt-2 text-2xl font-bold text-[#f4e8d8]">{profile.level}</p>
                <p className="text-xs text-[#c4b198]">Reader rank</p>
              </div>
            </div>
          </div>

          <div className="grid gap-4 self-end">
            <Surface tone="dark" className="p-6">
              <p className="text-xs uppercase tracking-[0.2em] text-[#c6b297]">Reading Journey</p>
              <h3 className="font-display mt-3 text-3xl text-[#f3e6d4]">{profile.persona.name}</h3>
              <p className="mt-2 text-sm text-[#ccbca7]">{profile.persona.title}</p>
              <div className="mt-5">
                <div className="mb-2 flex items-center justify-between text-xs uppercase tracking-[0.16em] text-[#bca98f]">
                  <span>Progress to next level</span>
                  <span>{profile.level + 1}</span>
                </div>
                <ProgressBar value={profile.xp} max={profile.xpToNext} dark />
                <p className="mt-3 text-sm text-[#d5c5b1]">{profile.xp} / {profile.xpToNext} XP</p>
              </div>
            </Surface>

            <Surface className="p-5">
              <p className="text-xs uppercase tracking-[0.18em] text-[#776a5a]">Current Focus</p>
              <p className="mt-2 text-base font-semibold text-[#241f19]">{featuredCompetition.title}</p>
              <p className="mt-1 text-sm text-[#665c50]">{featuredCompetition.theme}</p>
              <div className="mt-4 flex items-center justify-between text-sm text-[#54493e]">
                <span>{featuredCompetition.status}</span>
                <span>{featuredCompetition.rewardCoins} coins</span>
              </div>
            </Surface>
          </div>
        </div>
      </section>

      <RevealOnScroll className="mt-16">
        <SectionHeading
          eyebrow="Featured Collections"
          title="Collections curated like shelves in a private reading room"
          description="Each shelf is organized for atmosphere, depth, and sustained attention."
          action={<InlineLink to="/search">Browse all collections</InlineLink>}
        />
        <div className="mt-8 grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
          {featuredBooks.slice(0, 4).map((book, index) => (
            <BookCard key={book.id} book={book} index={index} />
          ))}
        </div>
      </RevealOnScroll>

      <section className="mt-16 grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
        <RevealOnScroll>
          <Surface className="p-6 sm:p-8">
            <SectionHeading
              eyebrow="Staff Picks"
              title="Recommendations selected for narrative depth"
              description="Handpicked books to broaden perspective without losing immersion."
            />
            <div className="mt-6 grid gap-4">
              {staffPicks.map((book) => (
                <div key={book.id} className="flex items-start justify-between gap-4 rounded-2xl border border-[#2d2820]/10 bg-white/65 px-4 py-4">
                  <div>
                    <p className="font-display text-2xl text-[#231f18]">{book.title}</p>
                    <p className="mt-1 text-sm text-[#6c6154]">{book.author}</p>
                    <p className="mt-2 text-sm text-[#5f5448]">{book.genre}</p>
                  </div>
                  <Pill>Staff Pick</Pill>
                </div>
              ))}
            </div>
          </Surface>
        </RevealOnScroll>

        <RevealOnScroll delay={80}>
          <Surface className="p-6 sm:p-8">
            <SectionHeading
              eyebrow="Saved Highlights"
              title="Your reading traces"
              description="Passages and notes that mark real progress in thought."
            />
            <div className="mt-6 space-y-3">
              {highlights.map((item) => (
                <div key={item} className="rounded-2xl border border-[#2d2820]/10 bg-white/68 px-4 py-4 text-sm leading-7 text-[#5f5448]">
                  {item}
                </div>
              ))}
            </div>
            <div className="mt-6">
              <SecondaryButton to="/comments/book/1">Open reading notes</SecondaryButton>
            </div>
          </Surface>
        </RevealOnScroll>
      </section>

      <section className="mt-16 grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
        <RevealOnScroll>
          <Surface tone="dark" className="bookverse-competition-card p-6 sm:p-8">
            <SectionHeading
              dark
              eyebrow="Reading Journey"
              title="Challenge mode for focused readers"
              description="A darker, more ceremonial mode for readers who want structure and reward."
            />
            <div className="mt-6 grid gap-4 sm:grid-cols-3">
              <StatTile dark label="Reward Coins" value={featuredCompetition.rewardCoins} detail="Unlock profile accents" />
              <StatTile dark label="Reward XP" value={featuredCompetition.rewardPoints} detail="High-value progression" />
              <StatTile dark label="Roadmap" value={featuredCompetition.roadmap.length} detail="Books in this arc" />
            </div>
            <div className="mt-6">
              <PrimaryButton tone="dark" to={`/competitions/${featuredCompetition.id}`}>View active journey</PrimaryButton>
            </div>
          </Surface>
        </RevealOnScroll>

        <RevealOnScroll delay={80}>
          <Surface className="p-6 sm:p-8">
            <SectionHeading
              eyebrow="Personas"
              title="Choose your reading identity"
              description="Your persona shapes tone, goals, and subtle motivational cues."
            />
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              {personas.map((persona) => (
                <div key={persona.id} className="rounded-2xl border border-[#2d2820]/10 bg-white/66 p-4">
                  <p className="text-xs uppercase tracking-[0.18em] text-[#7b6e5f]">{persona.name}</p>
                  <p className="font-display mt-2 text-2xl text-[#231f18]">{persona.title}</p>
                  <p className="mt-2 text-sm leading-7 text-[#665b4f]">{persona.description}</p>
                </div>
              ))}
            </div>
            <div className="mt-6">
              <SecondaryButton to="/personas">Explore all identities</SecondaryButton>
            </div>
          </Surface>
        </RevealOnScroll>
      </section>

      <RevealOnScroll className="mt-16">
        <SectionHeading
          eyebrow="Reflection and Rewards"
          title="Progress that feels meaningful"
          align="center"
          description="BookVerse rewards depth: close reading, consistency, note-taking, and thoughtful completion."
        />
        <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {[
            { title: "Discovery", icon: FiCompass, text: "Curated paths surface books aligned with your pace and taste." },
            { title: "Focus", icon: FiTarget, text: "Daily rhythm is tracked gently, supporting consistency without pressure." },
            { title: "Highlights", icon: FiEdit3, text: "Annotations and highlights preserve your strongest reading moments." },
            { title: "Rewards", icon: FiAward, text: "Earn badges and prestige through sustained, intentional reading." },
          ].map(({ title, icon: Icon, text }) => (
            <Surface key={title} className="p-6">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-[#2d2820]/12 bg-white/70 text-[#2e4a3f]">
                <Icon />
              </div>
              <h3 className="mt-4 font-display text-3xl text-[#1f1c18]">{title}</h3>
              <p className="mt-2 text-sm leading-7 text-[#665b4f]">{text}</p>
            </Surface>
          ))}
        </div>

        <div className="mt-10 grid gap-6 lg:grid-cols-2">
          <Surface className="p-6">
            <p className="text-xs uppercase tracking-[0.2em] text-[#7b6e5f]">Saved Notes</p>
            <h3 className="font-display mt-2 text-3xl text-[#1f1c18]">A quiet place for reflection</h3>
            <p className="mt-2 text-sm leading-7 text-[#665b4f]">Keep chapter reflections, quotations, and themes in one personal archive.</p>
            <div className="mt-5 flex items-center gap-3 text-sm font-semibold text-[#2e4a3f]">
              <FiBookOpen />
              <Link to="/comments/book/1" className="underline-offset-4 hover:underline">Open note archive</Link>
            </div>
          </Surface>

          <Surface className="p-6">
            <p className="text-xs uppercase tracking-[0.2em] text-[#7b6e5f]">Reader Rewards</p>
            <h3 className="font-display mt-2 text-3xl text-[#1f1c18]">Recognition for deep reading</h3>
            <p className="mt-2 text-sm leading-7 text-[#665b4f]">Your profile reflects streak quality, challenge completion, and thoughtful engagement.</p>
            <div className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-[#2e4a3f]">
              <FiStar />
              Quiet prestige, earned steadily
            </div>
          </Surface>
        </div>

        <div className="mt-10 flex justify-center">
          <Link to="/profile" className="inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.16em] text-[#2e4a3f] transition hover:gap-3">
            Continue to dashboard
            <FiArrowRight />
          </Link>
        </div>
      </RevealOnScroll>
    </BookVerseShell>
  );
};

export default Home;
