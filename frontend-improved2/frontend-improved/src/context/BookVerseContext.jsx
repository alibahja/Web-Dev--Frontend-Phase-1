import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { competitions, personas, userProfile } from "../data/bookverse";

const BookVerseContext = createContext(null);

const STORAGE_KEYS = {
  personaId: "bookverse.personaId",
  joinedCompetitionIds: "bookverse.joinedCompetitionIds",
  user: "user",
};

function getStoredValue(key, fallback) {
  if (typeof window === "undefined") return fallback;
  const value = window.localStorage.getItem(key);
  if (!value) return fallback;
  try {
    return JSON.parse(value);
  } catch {
    return fallback;
  }
}

function getPersonaTitle(persona) {
  const titles = {
    scholar: "Scholar of the Golden Wing",
    explorer: "Explorer of Hidden Aisles",
    "story-seeker": "Story Seeker of the Velvet Stacks",
    archivist: "Archivist of the Luminous Wing",
  };

  return titles[persona.id] || userProfile.title;
}

export function BookVerseProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(() =>
    getStoredValue(STORAGE_KEYS.user, null)
  );
  const [selectedPersonaId, setSelectedPersonaId] = useState(() =>
    getStoredValue(STORAGE_KEYS.personaId, userProfile.persona.id)
  );
  const [joinedCompetitionIds, setJoinedCompetitionIds] = useState(() =>
    getStoredValue(STORAGE_KEYS.joinedCompetitionIds, [userProfile.currentCompetition.id])
  );

  useEffect(() => {
    if (typeof window === "undefined") return;
    window.localStorage.setItem(STORAGE_KEYS.personaId, JSON.stringify(selectedPersonaId));
  }, [selectedPersonaId]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    window.localStorage.setItem(STORAGE_KEYS.joinedCompetitionIds, JSON.stringify(joinedCompetitionIds));
  }, [joinedCompetitionIds]);

  useEffect(() => {
    if (typeof window === "undefined") return undefined;

    const syncUser = () => {
      setCurrentUser(getStoredValue(STORAGE_KEYS.user, null));
    };

    window.addEventListener("storage", syncUser);
    return () => window.removeEventListener("storage", syncUser);
  }, []);

  const selectedPersona =
    personas.find((persona) => persona.id === selectedPersonaId) || userProfile.persona;

  const activeCompetition =
    competitions.find((competition) => joinedCompetitionIds.includes(competition.id)) ||
    userProfile.currentCompetition;

  const profile = useMemo(() => {
    const joinedCompetitions = competitions.filter((competition) =>
      joinedCompetitionIds.includes(competition.id)
    );

    return {
      ...userProfile,
      name: currentUser?.full_name || currentUser?.name || userProfile.name,
      email: currentUser?.email || "ayla@bookverse.app",
      persona: selectedPersona,
      title: getPersonaTitle(selectedPersona),
      competitionsJoined: joinedCompetitions.length,
      currentCompetition: activeCompetition,
    };
  }, [activeCompetition, currentUser, joinedCompetitionIds, selectedPersona]);

  const choosePersona = (personaId) => {
    setSelectedPersonaId(personaId);
  };

  const joinCompetition = (competitionId) => {
    setJoinedCompetitionIds((prev) =>
      prev.includes(competitionId) ? prev : [competitionId, ...prev]
    );
  };

  const refreshCurrentUser = () => {
    setCurrentUser(getStoredValue(STORAGE_KEYS.user, null));
  };

  const logout = () => {
    if (typeof window === "undefined") return;
    window.localStorage.removeItem("token");
    window.localStorage.removeItem(STORAGE_KEYS.user);
    setCurrentUser(null);
  };

  const value = {
    profile,
    personas,
    competitions,
    currentUser,
    isAuthenticated: Boolean(currentUser),
    isAdmin: currentUser?.role === "admin",
    selectedPersona,
    selectedPersonaId,
    joinedCompetitionIds,
    activeCompetition,
    choosePersona,
    joinCompetition,
    refreshCurrentUser,
    setCurrentUser,
    logout,
  };

  return <BookVerseContext.Provider value={value}>{children}</BookVerseContext.Provider>;
}

export function useBookVerse() {
  const context = useContext(BookVerseContext);
  if (!context) {
    throw new Error("useBookVerse must be used within a BookVerseProvider");
  }
  return context;
}
