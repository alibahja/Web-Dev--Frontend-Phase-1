import { useLocation, useNavigate, Link } from "react-router-dom";
import { useState } from "react";

const Comments = ({ darkMode, setDarkMode }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const currentUser = "Ali";

  const { type, data } = location.state || {};

  const [comments, setComments] = useState([
    {
      id: 1,
      author: "Sara",
      text: "This discussion is exactly what I was looking for. The depth of analysis here is incredible!",
      replies: [{ id: 11, author: "Ali", text: "Totally agree! Especially the point about the narrative structure." }]
    },
    {
      id: 2,
      author: "John",
      text: "Does anyone have recommendations for similar topics?",
      replies: []
    }
  ]);

  const [newComment, setNewComment] = useState("");

  if (!data) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${darkMode ? 'bg-[#0A0F1F] text-white' : 'bg-[#F8F9FC]'}`}>
        <h2 className="text-2xl font-bold italic">No discussion data found.</h2>
      </div>
    );
  }

  const handleAddComment = () => {
    if (!newComment.trim()) return;
    const newEntry = {
      id: Date.now(),
      author: currentUser,
      text: newComment,
      replies: []
    };
    setComments([newEntry, ...comments]);
    setNewComment("");
  };

  const handleDeleteComment = (id) => {
    setComments(comments.filter((c) => c.id !== id));
  };

  const handleDeleteReply = (commentId, replyId) => {
    setComments(comments.map(c => 
      c.id === commentId 
        ? { ...c, replies: c.replies.filter(r => r.id !== replyId) }
        : c
    ));
  };

  const handleReply = (commentId, replyText) => {
    if (!replyText.trim()) return;
    setComments(comments.map((c) =>
      c.id === commentId
        ? { ...c, replies: [...c.replies, { id: Date.now(), author: currentUser, text: replyText }] }
        : c
    ));
  };

  return (
    <div className={`min-h-screen transition-all duration-500 ${
      darkMode ? 'bg-[#0A0F1F] text-[#F0F4FA]' : 'bg-[#F8F9FC] text-[#1F2937]'
    }`}>
      
      {/* GLOBAL NAVBAR */}
      <nav className={`fixed top-0 w-full z-50 backdrop-blur-md border-b transition-colors ${
        darkMode ? 'bg-[#1E2740]/80 border-[#2D3748]' : 'bg-white/80 border-[#E2E8F0]'
      }`}>
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link to="/" className={`font-serif italic font-bold text-xl ${darkMode ? 'text-[#5F7DB0]' : 'text-[#2C3E68]'}`}>
            LibCore
          </Link>
          <button
            onClick={() => setDarkMode(!darkMode)}
            className={`p-2 rounded-full transition-transform hover:scale-110 ${darkMode ? 'bg-[#5F7DB0]/20 text-yellow-400' : 'bg-[#2C3E68]/10 text-gray-600'}`}
          >
            {darkMode ? "☀️" : "🌙"}
          </button>
        </div>
      </nav>

      {/* HEADER SECTION */}
      <div className="max-w-4xl mx-auto pt-32 pb-10 px-6">
        <button onClick={() => navigate(-1)} className="group flex items-center gap-2 mb-6 text-sm font-black uppercase tracking-widest opacity-40 hover:opacity-100 transition-all">
          <span className="group-hover:-translate-x-1 transition-transform">←</span> Back
        </button>

        <h1 className="text-5xl font-black tracking-tighter mb-4 leading-tight">
          {type === "book" ? `Reviews: ${data.title}` : data.name}
        </h1>
        <div className={`h-1 w-20 rounded-full ${darkMode ? 'bg-[#5F7DB0]' : 'bg-[#2C3E68]'}`}></div>
      </div>

      {/* FLOATING INPUT BOX */}
      <div className="max-w-4xl mx-auto px-6 mb-16">
        <div className={`p-2 rounded-[2rem] border shadow-2xl transition-all ${
          darkMode ? 'bg-[#1E2740] border-[#2D3748]' : 'bg-white border-[#E2E8F0]'
        }`}>
          <textarea
            rows="2"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Join the conversation..."
            className={`w-full p-6 rounded-[1.5rem] outline-none resize-none font-medium transition-colors ${
              darkMode ? 'bg-[#0A0F1F] focus:bg-[#151B2D]' : 'bg-gray-50 focus:bg-white'
            }`}
          />
          <div className="flex justify-end p-2">
            <button
              onClick={handleAddComment}
              className={`px-8 py-3 rounded-2xl font-black text-sm uppercase tracking-widest text-white transition-all hover:shadow-lg active:scale-95 ${
                darkMode ? 'bg-[#5F7DB0]' : 'bg-[#2C3E68]'
              }`}
            >
              Post Comment
            </button>
          </div>
        </div>
      </div>

      {/* THREADED COMMENTS LIST */}
      <div className="max-w-4xl mx-auto px-6 pb-32 space-y-10">
        {comments.map((comment) => (
          <CommentCard
            key={comment.id}
            comment={comment}
            currentUser={currentUser}
            darkMode={darkMode}
            onDelete={handleDeleteComment}
            onDeleteReply={handleDeleteReply}
            onReply={handleReply}
          />
        ))}
      </div>
    </div>
  );
};

const CommentCard = ({ comment, currentUser, darkMode, onDelete, onDeleteReply, onReply }) => {
  const [replyText, setReplyText] = useState("");
  const [isReplying, setIsReplying] = useState(false);

  return (
    <div className="group animate-[fadeIn_0.4s_ease-out]">
      <div className={`p-8 rounded-[2.5rem] border transition-all hover:shadow-xl ${
        darkMode ? 'bg-[#1E2740] border-[#2D3748]' : 'bg-white border-[#E2E8F0]'
      }`}>
        {/* Header */}
        <div className="flex justify-between items-center mb-5">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-black text-xs ${darkMode ? 'bg-[#0A0F1F] text-[#5F7DB0]' : 'bg-gray-100 text-[#2C3E68]'}`}>
              {comment.author[0]}
            </div>
            <span className="font-black text-sm uppercase tracking-wider">{comment.author}</span>
          </div>

          {comment.author === currentUser && (
            <button onClick={() => onDelete(comment.id)} className="text-[10px] font-black uppercase tracking-widest text-red-500 opacity-0 group-hover:opacity-100 transition-opacity hover:underline">
              Remove Thread
            </button>
          )}
        </div>

        <p className="text-lg leading-relaxed mb-6 font-medium opacity-90">{comment.text}</p>

        <button
          onClick={() => setIsReplying(!isReplying)}
          className={`text-xs font-black uppercase tracking-widest opacity-40 hover:opacity-100 transition-all ${isReplying ? 'text-red-500' : ''}`}
        >
          {isReplying ? 'Cancel' : 'Reply'}
        </button>

        {isReplying && (
          <div className="mt-6 flex gap-3 animate-[zoomIn_0.2s_ease-out]">
            <input
              autoFocus
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              placeholder="Write a reply..."
              className={`flex-1 p-4 rounded-2xl text-sm border outline-none transition-all ${
                darkMode ? 'bg-[#0A0F1F] border-[#2D3748] focus:border-[#5F7DB0]' : 'bg-gray-50 border-gray-200 focus:border-[#2C3E68]'
              }`}
            />
            <button
              onClick={() => {
                onReply(comment.id, replyText);
                setReplyText("");
                setIsReplying(false);
              }}
              className={`px-6 rounded-2xl font-black text-[10px] uppercase tracking-widest text-white ${
                darkMode ? 'bg-[#5F7DB0]' : 'bg-[#2C3E68]'
              }`}
            >
              Send
            </button>
          </div>
        )}

        {/* REPLIES NESTED */}
        {comment.replies.length > 0 && (
          <div className="mt-8 space-y-6 pl-6 border-l-2 border-gray-500/10">
            {comment.replies.map((reply) => (
              <div key={reply.id} className="group/reply relative pl-4">
                <div className="flex justify-between items-start mb-1">
                  <span className="font-black text-[11px] uppercase tracking-tighter opacity-50">{reply.author}</span>
                  {reply.author === currentUser && (
                    <button 
                      onClick={() => onDeleteReply(comment.id, reply.id)}
                      className="text-[9px] font-black text-red-400 opacity-0 group-hover/reply:opacity-100 transition-opacity hover:text-red-600"
                    >
                      Delete
                    </button>
                  )}
                </div>
                <p className="text-sm font-medium leading-relaxed opacity-80">{reply.text}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Comments;