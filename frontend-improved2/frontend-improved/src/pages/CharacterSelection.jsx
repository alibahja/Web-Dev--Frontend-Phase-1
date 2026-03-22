import React from "react";
import { useNavigate } from "react-router-dom";
import { BookVerseShell, Pill, PrimaryButton, SecondaryButton, SectionHeading, Surface } from "../components/BookVerseUI";
import { useBookVerse } from "../context/BookVerseContext";

const CharacterSelection = ({ darkMode, setDarkMode }) => {
  const navigate = useNavigate();
  const { personas, selectedPersonaId, choosePersona } = useBookVerse();

  return (
    <BookVerseShell darkMode={darkMode} setDarkMode={setDarkMode} title="BookVerse" subtitle="Reader Identities">
      <Surface className="p-6 sm:p-8">
        <SectionHeading
          eyebrow="Character Selection"
          title="Choose the reading identity that fits your style"
          description="Each persona shapes your tone, prestige title, and reading journey. Choose one now and carry it into your dashboard and competitions."
          action={<SecondaryButton to="/profile">Go to dashboard</SecondaryButton>}
        />
      </Surface>

      <section className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        {personas.map((persona) => (
          <Surface
            key={persona.id}
            className={`relative overflow-hidden p-6 transition-transform duration-200 hover:-translate-y-1 ${
              selectedPersonaId === persona.id ? "ring-2 ring-[#c79b52]/60" : ""
            }`}
          >
            <div className={`absolute inset-x-8 top-0 h-24 rounded-full blur-3xl ${persona.aura}`} />
            <div className={`inline-flex rounded-full bg-gradient-to-r px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-slate-900 ${persona.accent}`}>
              {persona.name}
            </div>
            <h2 className="font-display mt-5 text-3xl text-slate-900">{persona.title}</h2>
            <p className="mt-4 text-sm leading-7 text-slate-600">{persona.description}</p>
            <div className="mt-5">
              <Pill>{persona.perk}</Pill>
            </div>
            {selectedPersonaId === persona.id ? (
              <p className="mt-4 text-sm font-semibold text-[#7f5b21]">Currently selected for your BookVerse profile</p>
            ) : null}
            <div className="mt-6">
              <PrimaryButton
                className="w-full"
                onClick={() => {
                  choosePersona(persona.id);
                  navigate("/profile");
                }}
              >
                {selectedPersonaId === persona.id ? `Continue as ${persona.name}` : `Choose ${persona.name}`}
              </PrimaryButton>
            </div>
          </Surface>
        ))}
      </section>
    </BookVerseShell>
  );
};

export default CharacterSelection;
