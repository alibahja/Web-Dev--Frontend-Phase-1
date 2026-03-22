import { useLocation } from "react-router-dom";
import { useState } from "react";
import { BookVerseShell, Pill, PrimaryButton, SecondaryButton, SectionHeading, Surface } from "../components/BookVerseUI";

const Comments = ({ darkMode, setDarkMode }) => {
  const location = useLocation();
  const currentUser = "Ali";
  const { type, data } = location.state || {};
  const [comments, setComments] = useState([
    {
      id: 1,
      author: "Sara",
      text: "The atmosphere in this read stays with you long after the final page. BookVerse surfaced it at exactly the right moment.",
      replies: [{ id: 11, author: "Ali", text: "Agreed. It feels like the kind of book you keep thinking about all week." }],
    },
    {
      id: 2,
      author: "John",
      text: "Would love similar recommendations with the same editorial and slightly magical tone.",
      replies: [],
    },
  ]);
  const [newComment, setNewComment] = useState("");

  const detailTarget =
    type === "book" ? `/book/${data?.id}` : data?.id ? `/groups/${data.id}` : "/search";

  const handleAddComment = () => {
    if (!newComment.trim()) return;
    setComments((prev) => [{ id: Date.now(), author: currentUser, text: newComment, replies: [] }, ...prev]);
    setNewComment("");
  };

  if (!data) {
    return (
      <BookVerseShell darkMode={darkMode} setDarkMode={setDarkMode} title="BookVerse" subtitle="Comments">
        <Surface className="p-8 text-center">
          <SectionHeading title="No discussion context was found" description="Return to the library flow and open comments from a book or group page." align="center" />
          <div className="mt-6">
            <SecondaryButton to="/search">Go to All Books</SecondaryButton>
          </div>
        </Surface>
      </BookVerseShell>
    );
  }

  return (
    <BookVerseShell darkMode={darkMode} setDarkMode={setDarkMode} title="BookVerse" subtitle="Comments & Reviews">
      <Surface className="p-6 sm:p-8">
        <SectionHeading
          eyebrow={type === "book" ? "Book Reviews" : "Group Discussion"}
          title={type === "book" ? `Reviews for ${data.title}` : `${data.name} discussion board`}
          description="Thoughtful conversation is part of the BookVerse reading journey. Threads stay calm, readable, and easy to return to."
          action={<SecondaryButton to={detailTarget}>Back to detail page</SecondaryButton>}
        />
      </Surface>

      <Surface className="mt-8 p-4 sm:p-5">
        <textarea
          rows="4"
          value={newComment}
          onChange={(event) => setNewComment(event.target.value)}
          placeholder="Add your reflection, note, or recommendation..."
          className="w-full rounded-[1.5rem] border border-slate-900/8 bg-white/75 p-5 text-slate-900 outline-none"
        />
        <div className="mt-4 flex justify-end">
          <PrimaryButton onClick={handleAddComment}>Post Comment</PrimaryButton>
        </div>
      </Surface>

      <div className="mt-8 space-y-5">
        {comments.map((comment) => (
          <CommentCard key={comment.id} comment={comment} currentUser={currentUser} setComments={setComments} />
        ))}
      </div>
    </BookVerseShell>
  );
};

const CommentCard = ({ comment, currentUser, setComments }) => {
  const [replyText, setReplyText] = useState("");
  const [isReplying, setIsReplying] = useState(false);

  const addReply = () => {
    if (!replyText.trim()) return;
    setComments((prev) =>
      prev.map((entry) =>
        entry.id === comment.id
          ? {
              ...entry,
              replies: [...entry.replies, { id: Date.now(), author: currentUser, text: replyText }],
            }
          : entry
      )
    );
    setReplyText("");
    setIsReplying(false);
  };

  return (
    <Surface className="p-6 sm:p-7">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">{comment.author}</p>
          <p className="mt-1 text-base leading-8 text-slate-700">{comment.text}</p>
        </div>
        <Pill>{comment.replies.length} replies</Pill>
      </div>
      <button onClick={() => setIsReplying((prev) => !prev)} className="mt-4 text-sm font-semibold text-slate-900">
        {isReplying ? "Cancel reply" : "Reply"}
      </button>
      {isReplying ? (
        <div className="mt-4 flex flex-col gap-3 sm:flex-row">
          <input
            value={replyText}
            onChange={(event) => setReplyText(event.target.value)}
            placeholder="Write a reply..."
            className="flex-1 rounded-[1.2rem] border border-slate-900/8 bg-white/75 px-4 py-3 text-slate-900 outline-none"
          />
          <button onClick={addReply} className="bookverse-button rounded-full bg-slate-900 px-5 py-3 text-sm font-semibold text-[#f8f1e2]">
            Send
          </button>
        </div>
      ) : null}
      {comment.replies.length ? (
        <div className="mt-5 space-y-3 border-l border-slate-900/8 pl-4">
          {comment.replies.map((reply) => (
            <div key={reply.id} className="rounded-[1.2rem] bg-white/60 px-4 py-3">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">{reply.author}</p>
              <p className="mt-1 text-sm leading-7 text-slate-600">{reply.text}</p>
            </div>
          ))}
        </div>
      ) : null}
    </Surface>
  );
};

export default Comments;
