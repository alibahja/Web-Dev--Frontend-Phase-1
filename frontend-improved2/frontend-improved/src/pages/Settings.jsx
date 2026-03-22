import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiBell, FiMoon, FiShield, FiUser } from "react-icons/fi";
import { BookVerseShell, Pill, PrimaryButton, ProgressBar, SectionHeading, Surface } from "../components/BookVerseUI";
import { useBookVerse } from "../context/BookVerseContext";

const settingsBlocks = [
  {
    title: "Profile Presence",
    description: "Control your reader title, public progress, and display preferences.",
    icon: FiUser,
  },
  {
    title: "Theme Atmosphere",
    description: "Choose how warm reading mode and darker challenge mode transition across the app.",
    icon: FiMoon,
  },
  {
    title: "Notifications",
    description: "Manage competition reminders, join deadlines, and streak nudges.",
    icon: FiBell,
  },
  {
    title: "Account Safety",
    description: "Keep your account protected while preserving your BookVerse identity.",
    icon: FiShield,
  },
];

const Settings = ({ darkMode, setDarkMode }) => {
  const navigate = useNavigate();
  const { currentUser, logout, profile } = useBookVerse();
  const [userDetails, setUserDetails] = useState({
    name: profile.name,
    email: profile.email,
  });
  const [passwords, setPasswords] = useState({
    current: "",
    next: "",
    confirm: "",
  });
  const [feedback, setFeedback] = useState("");

  const handleProfileSave = () => {
    setFeedback("Profile preferences saved.");
    window.setTimeout(() => setFeedback(""), 2200);
  };

  const handlePasswordChange = () => {
    if (!passwords.current || !passwords.next || passwords.next !== passwords.confirm) {
      setFeedback("Please enter matching passwords.");
      window.setTimeout(() => setFeedback(""), 2200);
      return;
    }
    setFeedback("Password updated successfully.");
    setPasswords({ current: "", next: "", confirm: "" });
    window.setTimeout(() => setFeedback(""), 2200);
  };

  const handleLogout = () => {
    logout();
    setFeedback("Logged out successfully.");
    window.setTimeout(() => navigate("/login"), 600);
  };

  return (
    <BookVerseShell darkMode={darkMode} setDarkMode={setDarkMode} title="BookVerse" subtitle="Settings">
      <Surface className="p-6 sm:p-8">
        <SectionHeading
          eyebrow="Settings"
          title="Fine-tune your atmosphere, identity, and account"
          description="Preferences are designed to feel like curation, not configuration. Everything stays premium and readable."
        />
      </Surface>

      <section className="mt-8 grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <Surface className="p-6 sm:p-8">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">Theme Preferences</p>
          <h2 className="font-display mt-3 text-3xl text-slate-900">Atmosphere intensity</h2>
          <p className="mt-3 text-sm leading-7 text-slate-600">
            Reading mode stays warm and historical. Competition mode deepens into a richer, darker palette while preserving the same BookVerse DNA.
          </p>
          <div className="mt-6 space-y-5">
            <div>
              <div className="mb-2 flex items-center justify-between text-sm text-slate-600">
                <span>Warm reading softness</span>
                <span>82%</span>
              </div>
              <ProgressBar value={82} max={100} />
            </div>
            <div>
              <div className="mb-2 flex items-center justify-between text-sm text-slate-600">
                <span>Competition glow intensity</span>
                <span>68%</span>
              </div>
              <ProgressBar value={68} max={100} />
            </div>
          </div>
          <div className="mt-6 flex items-center justify-between rounded-[1.5rem] border border-slate-900/8 bg-white/70 px-4 py-4">
            <div>
              <p className="font-semibold text-slate-900">Dark atmosphere toggle</p>
              <p className="text-sm text-slate-600">Useful for late-night reading sessions.</p>
            </div>
            <button
              onClick={() => setDarkMode(!darkMode)}
              className={`relative h-8 w-16 rounded-full transition ${darkMode ? "bg-slate-900" : "bg-slate-300"}`}
            >
              <span
                className={`absolute top-1 h-6 w-6 rounded-full bg-[#f8f1e2] transition ${darkMode ? "left-9" : "left-1"}`}
              />
            </button>
          </div>
          <p className="mt-4 text-sm text-slate-600 dark:text-slate-300">
            This preference now persists across the whole app and smoothly carries the library into a darker midnight tone.
          </p>
        </Surface>

        <div className="grid gap-6">
          <Surface className="p-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-900 text-[#f8f1e2]">
              <FiUser />
            </div>
            <h3 className="mt-5 text-2xl font-bold text-slate-900">Profile</h3>
            <div className="mt-4 space-y-4">
              <label className="block">
                <span className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Name</span>
                <input
                  value={userDetails.name}
                  onChange={(event) => setUserDetails((prev) => ({ ...prev, name: event.target.value }))}
                  className="mt-2 w-full rounded-[1.2rem] border border-slate-900/8 bg-white/75 px-4 py-3 text-slate-900 outline-none"
                />
              </label>
              <label className="block">
                <span className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Email</span>
                <input
                  value={userDetails.email}
                  onChange={(event) => setUserDetails((prev) => ({ ...prev, email: event.target.value }))}
                  className="mt-2 w-full rounded-[1.2rem] border border-slate-900/8 bg-white/75 px-4 py-3 text-slate-900 outline-none"
                />
              </label>
              {currentUser ? (
                <p className="text-sm text-slate-600">Signed in as {currentUser.email || currentUser.name}.</p>
              ) : (
                <p className="text-sm text-slate-600">You are currently browsing without an active session.</p>
              )}
              <PrimaryButton onClick={handleProfileSave}>Save Profile</PrimaryButton>
            </div>
          </Surface>

          <Surface className="p-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-900 text-[#f8f1e2]">
              <FiShield />
            </div>
            <h3 className="mt-5 text-2xl font-bold text-slate-900">Change Password</h3>
            <div className="mt-4 space-y-4">
              {[
                ["current", "Current Password"],
                ["next", "New Password"],
                ["confirm", "Confirm New Password"],
              ].map(([field, label]) => (
                <label key={field} className="block">
                  <span className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">{label}</span>
                  <input
                    type="password"
                    value={passwords[field]}
                    onChange={(event) => setPasswords((prev) => ({ ...prev, [field]: event.target.value }))}
                    className="mt-2 w-full rounded-[1.2rem] border border-slate-900/8 bg-white/75 px-4 py-3 text-slate-900 outline-none"
                  />
                </label>
              ))}
              <PrimaryButton onClick={handlePasswordChange}>Update Password</PrimaryButton>
            </div>
          </Surface>

          {settingsBlocks.map(({ title, description, icon: Icon }) => (
            <Surface key={title} className="p-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-900 text-[#f8f1e2]">
                <Icon />
              </div>
              <h3 className="mt-5 text-2xl font-bold text-slate-900">{title}</h3>
              <p className="mt-3 text-sm leading-7 text-slate-600">{description}</p>
              <div className="mt-5 flex flex-wrap gap-2"><Pill>Available</Pill></div>
            </Surface>
          ))}

          <Surface className="p-6">
            <h3 className="text-2xl font-bold text-slate-900">Session</h3>
            <p className="mt-3 text-sm leading-7 text-slate-600">Log out from your current BookVerse session when you are finished reading.</p>
            <div className="mt-5 flex flex-wrap items-center gap-4">
              <button onClick={handleLogout} className="bookverse-button rounded-full border border-rose-200 bg-rose-50 px-5 py-3 text-sm font-semibold text-rose-700">
                Logout
              </button>
              <span className="text-sm text-slate-500">{feedback}</span>
            </div>
          </Surface>
        </div>
      </section>
    </BookVerseShell>
  );
};

export default Settings;
