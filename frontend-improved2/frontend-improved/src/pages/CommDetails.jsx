import { useLocation } from "react-router-dom";
import { useState } from "react";
import { BookVerseShell, Pill, PrimaryButton, SecondaryButton, SectionHeading, Surface } from "../components/BookVerseUI";

const CommunityDetail = ({ darkMode, setDarkMode }) => {
  const location = useLocation();
  const currentUser = "Ali";
  const [community, setCommunity] = useState(
    location.state || {
      id: 0,
      name: "General Readers",
      description: "A welcoming room for thoughtful readers across all genres.",
      category: "General",
      admin: "System",
      members: ["Ali", "Sara", "John"],
    }
  );

  const isAdmin = community.admin === currentUser;
  const isMember = community.members.includes(currentUser);

  return (
    <BookVerseShell darkMode={darkMode} setDarkMode={setDarkMode} title="BookVerse" subtitle="Group Detail">
      <Surface className="p-6 sm:p-8">
        <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <Pill>{community.category}</Pill>
            <h1 className="font-display mt-5 text-5xl text-slate-900">{community.name}</h1>
            <p className="mt-5 max-w-3xl text-base leading-8 text-slate-600">{community.description}</p>
            <p className="mt-5 text-sm text-slate-500">Hosted by {community.admin}</p>
          </div>
          <div className="space-y-3">
            {isMember ? (
              <button
                onClick={() => setCommunity((prev) => ({ ...prev, members: prev.members.filter((name) => name !== currentUser) }))}
                className="bookverse-button w-full rounded-full border border-slate-900/10 bg-white/65 px-5 py-3 text-sm font-semibold text-slate-900"
              >
                Leave Group
              </button>
            ) : (
              <PrimaryButton
                className="w-full"
                onClick={() => setCommunity((prev) => ({ ...prev, members: [...prev.members, currentUser] }))}
              >
                Join Group
              </PrimaryButton>
            )}
            <SecondaryButton to={`/comments/groups/${community.id}`} className="w-full">
              Open Discussion Board
            </SecondaryButton>
          </div>
        </div>
      </Surface>

      <section className="mt-8 grid gap-6 lg:grid-cols-[1fr_0.85fr]">
        <Surface className="p-6 sm:p-8">
          <SectionHeading eyebrow="Members" title="Who is in the room" description="Groups stay intimate, thoughtful, and easy to understand at a glance." />
          <div className="mt-6 space-y-3">
            {community.members.map((member) => (
              <div key={member} className="flex items-center justify-between rounded-[1.4rem] bg-white/65 px-4 py-4">
                <div>
                  <p className="font-semibold text-slate-900">{member}</p>
                  <p className="text-sm text-slate-500">{member === community.admin ? "Host" : "Member"}</p>
                </div>
                {isAdmin && member !== community.admin ? (
                  <button
                    onClick={() => setCommunity((prev) => ({ ...prev, members: prev.members.filter((name) => name !== member) }))}
                    className="text-sm font-semibold text-rose-600"
                  >
                    Remove
                  </button>
                ) : null}
              </div>
            ))}
          </div>
        </Surface>

        <Surface className="p-6 sm:p-8">
          <SectionHeading eyebrow="Group Rules" title="Shared reading etiquette" />
          <div className="mt-6 space-y-4 text-sm leading-7 text-slate-600">
            <p>Respect every reader's interpretation.</p>
            <p>Mark spoilers clearly in discussion posts.</p>
            <p>Keep recommendations aligned with the group's tone.</p>
            <p>Use BookVerse comments to continue deeper conversations.</p>
          </div>
        </Surface>
      </section>
    </BookVerseShell>
  );
};

export default CommunityDetail;
