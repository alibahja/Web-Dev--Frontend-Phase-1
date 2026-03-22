import { useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import { FiAward, FiBookOpen, FiChevronUp, FiMessageCircle, FiTrendingUp } from "react-icons/fi";
import {
  BookCard,
  BookVerseShell,
  LoadingPulse,
  Pill,
  PrimaryButton,
  ProgressBar,
  SectionHeading,
  SecondaryButton,
  StatTile,
  Surface,
} from "../components/BookVerseUI";
import { competitions, featuredBooks } from "../data/bookverse";
import { useBookVerse } from "../context/BookVerseContext";

const fallbackBook = featuredBooks[0];

const defaultCommentsByBook = {
  1: [
    {
      id: 101,
      username: "Mina",
      timestamp: "2026-03-19T10:15:00.000Z",
      text: "This is exactly the kind of reflective, atmospheric novel BookVerse was made for.",
      likes: 3,
    },
    {
      id: 102,
      username: "Kareem",
      timestamp: "2026-03-20T08:45:00.000Z",
      text: "The emotional tone lingers in a really elegant way. I loved the premise.",
      likes: 1,
    },
  ],
};

const BookDetail = ({ darkMode, setDarkMode }) => {
  const location = useLocation();
  const [progress, setProgress] = useState(42);
  const book = location.state?.book || fallbackBook;
  const { profile } = useBookVerse();
  const storageKey = `bookverse.comments.book.${book.id}`;
  const [commentText, setCommentText] = useState("");
  const [commentFeedback, setCommentFeedback] = useState("");
  const [commentError, setCommentError] = useState("");
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);
  const [isBookLoading, setIsBookLoading] = useState(true);
  const [comments, setComments] = useState(() => {
    if (typeof window === "undefined") return defaultCommentsByBook[book.id] || [];
    const stored = window.localStorage.getItem(storageKey);
    return stored ? JSON.parse(stored) : defaultCommentsByBook[book.id] || [];
  });
  const roadmapCompetition = competitions.find((competition) =>
    competition.roadmap.some((item) => item.id === book.id)
  );
  const sortedComments = useMemo(
    () => [...comments].sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp)),
    [comments]
  );

  useEffect(() => {
    setIsBookLoading(true);
    const timer = window.setTimeout(() => setIsBookLoading(false), 260);
    return () => window.clearTimeout(timer);
  }, [book.id]);

  const persistComments = (nextComments) => {
    setComments(nextComments);
    if (typeof window !== "undefined") {
      window.localStorage.setItem(storageKey, JSON.stringify(nextComments));
    }
  };

  const handleCommentSubmit = () => {
    setCommentFeedback("");
    setCommentError("");
    if (!commentText.trim()) {
      setCommentError("Please write a comment before posting.");
      return;
    }

    setIsSubmittingComment(true);
    window.setTimeout(() => {
      try {
        const nextComments = [
          ...comments,
          {
            id: Date.now(),
            username: profile.name,
            timestamp: new Date().toISOString(),
            text: commentText.trim(),
            likes: 0,
          },
        ];
        persistComments(nextComments);
        setCommentText("");
        setCommentFeedback("Comment posted successfully.");
      } catch {
        setCommentError("Comment could not be posted. Please try again.");
      } finally {
        setIsSubmittingComment(false);
        window.setTimeout(() => {
          setCommentFeedback("");
          setCommentError("");
        }, 2200);
      }
    }, 300);
  };

  const handleLike = (commentId) => {
    const nextComments = comments.map((comment) =>
      comment.id === commentId ? { ...comment, likes: comment.likes + 1 } : comment
    );
    persistComments(nextComments);
  };

  return (
    <BookVerseShell darkMode={darkMode} setDarkMode={setDarkMode} title="BookVerse" subtitle="Book Detail">
      {isBookLoading ? (
        <LoadingPulse label="Loading book details..." />
      ) : (
        <>
      <div className="grid gap-8 lg:grid-cols-[0.7fr_1.3fr]">
        <Surface className="overflow-hidden p-4 sm:p-6">
          <div className="rounded-[1.8rem] bg-[linear-gradient(145deg,#203553,#0d1827)] p-6 text-white">
            <div className="aspect-[4/5] rounded-[1.4rem] bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.28),transparent_30%),linear-gradient(145deg,#314a6f,#14243b)] p-6">
              <Pill tone="dark">{book.genre}</Pill>
              <div className="mt-10">
                <h1 className="font-display text-4xl leading-tight">{book.title}</h1>
                <p className="mt-3 text-lg text-white/75">{book.author}</p>
              </div>
            </div>
          </div>
          <div className="mt-5 flex flex-wrap gap-3">
            <PrimaryButton>Read Now</PrimaryButton>
            <SecondaryButton>Borrow Edition</SecondaryButton>
          </div>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <StatTile label="XP Value" value={`+${book.xp}`} detail="Roadmap bonus eligible" />
            <StatTile label="Reader Rating" value={book.rating.toFixed(1)} detail="Curated community score" />
          </div>
        </Surface>

        <div className="space-y-6">
          <Surface className="p-6 sm:p-8">
            <Pill>{book.status}</Pill>
            <h2 className="font-display mt-4 text-4xl text-slate-900">{book.title}</h2>
            <p className="mt-2 text-lg text-slate-600">by {book.author}</p>
            <p className="mt-6 text-base leading-8 text-slate-700">{book.blurb}</p>

            <div className="mt-8 grid gap-4 md:grid-cols-3">
              <StatTile label="Price" value={`$${book.price.toFixed(2)}`} detail="Premium digital edition" />
              <StatTile label="Genre" value={book.genre} detail="Curated aesthetic shelf" />
              <StatTile label="Reading Mood" value="Luminous" detail="Quietly magical atmosphere" />
            </div>
          </Surface>

          <Surface className="p-6 sm:p-8">
            <SectionHeading
              eyebrow="Your Progress"
              title="Build momentum with gentle progression"
              description="BookVerse rewards consistency without overwhelming the reading experience."
            />
            <div className="mt-6">
              <div className="mb-2 flex items-center justify-between text-sm text-slate-600">
                <span>Current reading progress</span>
                <span>{progress}%</span>
              </div>
              <ProgressBar value={progress} max={100} />
            </div>
            <div className="mt-5 flex flex-wrap gap-3">
              {[15, 42, 68, 100].map((value) => (
                <button
                  key={value}
                  onClick={() => setProgress(value)}
                  className="rounded-full border border-slate-900/10 bg-white/70 px-4 py-2 text-sm font-semibold text-slate-900"
                >
                  Mark {value}%
                </button>
              ))}
            </div>
          </Surface>

          {roadmapCompetition ? (
            <Surface className="p-6 sm:p-8">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <Pill>Roadmap Relevance</Pill>
                  <h3 className="font-display mt-4 text-3xl text-slate-900">{roadmapCompetition.title}</h3>
                  <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-600">{roadmapCompetition.description}</p>
                </div>
                <SecondaryButton to={`/competitions/${roadmapCompetition.id}`}>View competition</SecondaryButton>
              </div>
              <div className="mt-6 grid gap-4 md:grid-cols-3">
                <StatTile label="Status" value={roadmapCompetition.status} detail="Current competition phase" />
                <StatTile label="Reward Coins" value={roadmapCompetition.rewardCoins} detail="Shared reward pool" />
                <StatTile label="Reward XP" value={roadmapCompetition.rewardPoints} detail="Roadmap completion bonus" />
              </div>
            </Surface>
          ) : null}

          <div className="grid gap-4 md:grid-cols-3">
            {[
              { icon: FiMessageCircle, title: "Reviews", detail: "Thoughtful comments and community notes" },
              { icon: FiAward, title: "Rewards", detail: "XP, streaks, and collectible profile prestige" },
              { icon: FiTrendingUp, title: "Momentum", detail: "Progress shapes your identity and ranking" },
            ].map(({ icon: Icon, title, detail }) => (
              <Surface key={title} className="p-5">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-900 text-[#f8f1e2]">
                  <Icon />
                </div>
                <h3 className="mt-4 text-xl font-bold text-slate-900">{title}</h3>
                <p className="mt-2 text-sm leading-7 text-slate-600">{detail}</p>
              </Surface>
            ))}
          </div>
        </div>
      </div>

      <section className="mt-16">
        <Surface className="p-6 sm:p-8" id="comments">
          <SectionHeading
            eyebrow="Comments"
            title="Reader reflections"
            description="Share impressions directly on the book page. Comments appear in chronological order so the conversation reads naturally."
          />
          <div className="mt-6 space-y-4">
            <textarea
              rows="4"
              value={commentText}
              onChange={(event) => setCommentText(event.target.value)}
              placeholder="Write your thoughts about this book..."
              className="w-full rounded-[1.5rem] border border-slate-900/8 bg-white/80 p-4 text-slate-900 outline-none transition dark:border-white/10 dark:bg-white/8 dark:text-white"
            />
            <div className="flex flex-wrap items-center justify-between gap-3">
              <p
                className={`text-sm ${
                  commentError
                    ? "text-rose-600 dark:text-rose-300"
                    : commentFeedback
                      ? "text-emerald-600 dark:text-emerald-300"
                      : "text-slate-500 dark:text-slate-300"
                }`}
              >
                {commentError || commentFeedback || "Add a comment to join the discussion."}
              </p>
              <PrimaryButton
                onClick={handleCommentSubmit}
                disabled={isSubmittingComment}
                className={isSubmittingComment ? "cursor-not-allowed opacity-70" : ""}
              >
                {isSubmittingComment ? "Posting..." : "Post Comment"}
              </PrimaryButton>
            </div>
          </div>

          <div className="mt-8 space-y-4">
            {sortedComments.length === 0 ? (
              <div className="rounded-[1.5rem] border border-dashed border-slate-900/12 bg-white/60 px-5 py-6 text-center text-sm text-slate-600 dark:border-white/10 dark:bg-white/5 dark:text-slate-300">
                Be the first to comment.
              </div>
            ) : (
              sortedComments.map((comment) => (
                <div key={comment.id} className="rounded-[1.5rem] bg-white/65 px-5 py-5 dark:bg-white/5">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <p className="font-semibold text-slate-900 dark:text-white">{comment.username}</p>
                      <p className="text-xs uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
                        {new Date(comment.timestamp).toLocaleString()}
                      </p>
                    </div>
                    <button
                      onClick={() => handleLike(comment.id)}
                      className="inline-flex items-center gap-2 rounded-full border border-slate-900/8 bg-white px-3 py-2 text-xs font-semibold text-slate-700 dark:border-white/10 dark:bg-white/8 dark:text-slate-200"
                    >
                      <FiChevronUp />
                      {comment.likes}
                    </button>
                  </div>
                  <p className="mt-4 text-sm leading-7 text-slate-700 dark:text-slate-200">{comment.text}</p>
                </div>
              ))
            )}
          </div>
        </Surface>
      </section>

      <section className="mt-16">
        <SectionHeading
          eyebrow="More to Discover"
          title="Keep wandering through adjacent shelves"
          description="BookVerse recommends books that extend the mood and atmosphere of what you are reading."
          action={
            <a href="#comments" className="inline-flex items-center gap-2 text-sm font-semibold text-slate-900 dark:text-white">
              <FiBookOpen />
              Jump to comments
            </a>
          }
        />
        <div className="mt-8 grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
          {featuredBooks.filter((item) => item.id !== book.id).slice(0, 4).map((item) => (
            <BookCard key={item.id} book={item} />
          ))}
        </div>
      </section>
        </>
      )}
    </BookVerseShell>
  );
};

export default BookDetail;
