import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { BookVerseShell, LoadingPulse, Pill, PrimaryButton, RevealOnScroll, SectionHeading, StatTile, Surface, TimelineItem } from "../components/BookVerseUI";
import { competitions } from "../data/bookverse";

const Competitions = ({ darkMode, setDarkMode }) => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = window.setTimeout(() => setLoading(false), 320);
    return () => window.clearTimeout(timer);
  }, []);

  return (
    <BookVerseShell mode="competition" darkMode={darkMode} setDarkMode={setDarkMode} title="BookVerse" subtitle="Competition Mode">
      <Surface tone="dark" className="p-6 sm:p-8">
        <SectionHeading
          dark
          eyebrow="Competition Mode"
          title="Challenge arcs for readers who want momentum, rank, and prestige"
          description="Competition mode is darker, sharper, and more charged, but still unmistakably part of the same BookVerse world."
        />
      </Surface>

      <section className="mt-8 grid gap-6 lg:grid-cols-3">
        {loading ? (
          <LoadingPulse label="Gathering competitions..." />
        ) : competitions.length === 0 ? (
          <Surface tone="dark" className="p-8 text-center">
            <h3 className="font-display text-3xl text-white">No competitions yet</h3>
            <p className="mt-3 text-sm leading-7 text-slate-300">New challenge arcs will appear here once administrators publish them.</p>
          </Surface>
        ) : (
          competitions.map((competition, index) => (
            <RevealOnScroll key={competition.id} delay={index * 70}>
            <Surface tone="dark" className="bookverse-competition-card p-6">
              <div className="flex items-center justify-between gap-3">
                <Pill tone="dark">{competition.status}</Pill>
                <span className="text-sm text-slate-400">{competition.theme}</span>
              </div>
              <h2 className="font-display mt-5 text-3xl text-white">{competition.title}</h2>
              <p className="mt-4 text-sm leading-7 text-slate-300">{competition.description}</p>
              <div className="mt-6 grid gap-3">
                <TimelineItem dark label="Join Deadline" value={competition.joinDeadline} />
                <TimelineItem dark label="Start Date" value={competition.startDate} />
                <TimelineItem dark label="End Date" value={competition.endDate} />
              </div>
              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                <StatTile dark label="Reward Coins" value={competition.rewardCoins} detail="Spend on prestige cosmetics" />
                <StatTile dark label="Reward XP" value={competition.rewardPoints} detail="Roadmap multiplier eligible" />
              </div>
              <div className="mt-6">
                <PrimaryButton tone="dark" to={`/competitions/${competition.id}`} className="w-full shadow-[0_16px_38px_rgba(125,211,252,0.18)]">
                  View challenge
                </PrimaryButton>
              </div>
            </Surface>
            </RevealOnScroll>
          ))
        )}
      </section>
    </BookVerseShell>
  );
};

export default Competitions;
