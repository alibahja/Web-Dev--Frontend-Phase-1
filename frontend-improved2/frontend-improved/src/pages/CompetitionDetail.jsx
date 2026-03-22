import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { BookCard, BookVerseShell, LoadingPulse, Pill, PrimaryButton, ProgressBar, SectionHeading, SecondaryButton, StatTile, Surface, TimelineItem } from "../components/BookVerseUI";
import { competitions } from "../data/bookverse";
import { useBookVerse } from "../context/BookVerseContext";

const CompetitionDetail = ({ darkMode, setDarkMode }) => {
  const { id } = useParams();
  const competition = competitions.find((entry) => entry.id === id) || competitions[0];
  const { joinedCompetitionIds, joinCompetition } = useBookVerse();
  const hasJoined = joinedCompetitionIds.includes(competition.id);
  const [joinFeedback, setJoinFeedback] = React.useState("");
  const [loading, setLoading] = React.useState(true);

  useEffect(() => {
    const timer = window.setTimeout(() => setLoading(false), 260);
    return () => window.clearTimeout(timer);
  }, [id]);

  if (loading) {
    return (
      <BookVerseShell mode="competition" darkMode={darkMode} setDarkMode={setDarkMode} title="BookVerse" subtitle="Competition Detail">
        <LoadingPulse label="Loading challenge details..." />
      </BookVerseShell>
    );
  }

  return (
    <BookVerseShell mode="competition" darkMode={darkMode} setDarkMode={setDarkMode} title="BookVerse" subtitle="Competition Detail">
      <section className="grid gap-8 xl:grid-cols-[1.05fr_0.95fr]">
        <Surface tone="dark" className="p-6 sm:p-8">
          <Pill tone="dark">{competition.status}</Pill>
          <h1 className="font-display mt-5 text-5xl text-white sm:text-6xl">{competition.title}</h1>
          <p className="mt-5 max-w-3xl text-base leading-8 text-slate-300">{competition.description}</p>

          <div className="mt-8 grid gap-4 md:grid-cols-3">
            <StatTile dark label="Theme" value={competition.theme} detail="Curated challenge atmosphere" />
            <StatTile dark label="Reward Coins" value={competition.rewardCoins} detail="Currency for prestige cosmetics" />
            <StatTile dark label="Reward XP" value={competition.rewardPoints} detail="Bonus awarded on completion" />
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            <PrimaryButton
              tone="dark"
              onClick={() => {
                joinCompetition(competition.id);
                setJoinFeedback(hasJoined ? "You are already part of this competition." : "Competition joined successfully.");
                window.setTimeout(() => setJoinFeedback(""), 2200);
              }}
            >
              {hasJoined ? "Joined Challenge" : "Join Competition"}
            </PrimaryButton>
            <SecondaryButton tone="dark">Preview rewards</SecondaryButton>
          </div>
          {joinFeedback ? <p className="bookverse-feedback-pop mt-4 text-sm text-emerald-300">{joinFeedback}</p> : null}
        </Surface>

        <Surface tone="dark" className="p-6 sm:p-8">
          <SectionHeading
            dark
            eyebrow="Timeline"
            title="Important dates"
            description="Users can only join before the deadline, then progress through the roadmap during the active window."
          />
          <div className="mt-6 grid gap-5">
            <TimelineItem dark label="Join Deadline" value={competition.joinDeadline} />
            <TimelineItem dark label="Start Date" value={competition.startDate} />
            <TimelineItem dark label="End Date" value={competition.endDate} />
          </div>
          <div className="mt-8">
            <p className="mb-2 text-sm text-slate-300">Sample reader progress</p>
            <div className="bookverse-progress-track" style={{ "--bookverse-progress": "62%" }}>
              <div className="bookverse-progress-marker">A</div>
            </div>
            <div className="mt-2 flex items-center justify-between text-xs uppercase tracking-[0.18em] text-slate-400">
              <span>Joined</span>
              <span>62% complete</span>
              <span>Finish line</span>
            </div>
          </div>
        </Surface>
      </section>

      <section className="mt-16 grid gap-8 xl:grid-cols-[1.1fr_0.9fr]">
        <Surface tone="dark" className="p-6 sm:p-8">
          <SectionHeading
            dark
            eyebrow="Roadmap"
            title="Books that define the competition journey"
            description="Roadmap books award more points and shape the story arc of the challenge."
          />
          <div className="mt-8 grid gap-6 sm:grid-cols-2">
            {competition.roadmap.map((book) => (
              <BookCard key={book.id} book={book} dark />
            ))}
          </div>
        </Surface>

        <div className="grid gap-8">
          <Surface tone="dark" className="p-6 sm:p-8">
            <SectionHeading
              dark
              eyebrow="Leaderboard"
              title="Current ranking"
              description="The challenge theme gets stronger here, but the brand still feels elegant and composed."
            />
            <div className="mt-6 space-y-3">
              {competition.leaderboard.map((entry) => (
                <div key={`${entry.rank}-${entry.name}`} className="rounded-[1.5rem] border border-white/10 bg-white/5 px-4 py-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-semibold uppercase tracking-[0.22em] text-slate-400">Rank {entry.rank}</p>
                      <p className="mt-1 text-xl font-bold text-white">{entry.name}</p>
                    </div>
                    <p className="text-lg font-semibold text-cyan-200">{entry.points} pts</p>
                  </div>
                </div>
              ))}
            </div>
          </Surface>

          <Surface tone="dark" className="p-6 sm:p-8">
            <SectionHeading dark eyebrow="Rewards" title="What unlocks at the finish" />
            <div className="mt-6 flex flex-wrap gap-2">
              {competition.rewards.map((reward) => (
                <Pill key={reward} tone="dark">{reward}</Pill>
              ))}
            </div>
          </Surface>
        </div>
      </section>
    </BookVerseShell>
  );
};

export default CompetitionDetail;
