import { useLocation, useNavigate, Link, useParams } from "react-router-dom";
import { useState, useEffect, useMemo } from "react";
import api from "../api/client";
import { extractList, normalizeComment } from "../api/normalize";

const Comments = ({ darkMode }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { id } = useParams();

  const isBook = location.pathname.includes("/comments/book/");
  const entityType = isBook ? "book" : "community";

  const stored = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem("user") || "null");
    } catch {
      return null;
    }
  }, []);
  
  const currentUser = stored?.full_name ?? stored?.name ?? stored?.username ?? stored?.email ?? "Guest";
  const currentUserId = stored?._id ?? stored?.id;
  const isLoggedIn = !!localStorage.getItem("token");

  const stateData = location.state?.data;
  const [headerData, setHeaderData] = useState(stateData);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [newComment, setNewComment] = useState("");

  useEffect(() => {
    let cancel = false;
    (async () => {
      setLoading(true);
      setError("");
      try {
        const path = isBook ? `/api/comments/book/${id}` : `/api/comments/community/${id}`;
        const res = await api.get(path);
        if (cancel) return;
        const list = extractList(res.data).map(normalizeComment).filter(Boolean);
        setComments(list);

        if (!location.state?.data) {
          if (isBook) {
            const br = await api.get(`/api/books/${id}`).catch(() => null);
            if (!cancel && br?.data) {
              const b = br.data.book ?? br.data;
              setHeaderData({ title: b.title, name: b.title, author: b.author });
            }
          } else {
            const cr = await api.get(`/api/communities/${id}`).catch(() => null);
            if (!cancel && cr?.data) {
              const c = cr.data.community ?? cr.data;
              setHeaderData({ name: c.name, title: c.name, description: c.description });
            }
          }
        }
      } catch (e) {
        if (!cancel) setError("Discussion is currently unavailable.");
      } finally {
        if (!cancel) setLoading(false);
      }
    })();
    return () => { cancel = true; };
  }, [id, isBook]);

  const titleLabel = entityType === "book" 
    ? headerData?.title ?? "Book Discussion" 
    : headerData?.name ?? "Community Lounge";

  const handleAddComment = async () => {
    if (!newComment.trim()) return;
    if (!isLoggedIn) {
      navigate("/login", { state: { from: location.pathname } });
      return;
    }
    try {
      const url = isBook ? `/api/comments/book/${id}` : `/api/comments/community/${id}`;
      await api.post(url, { content: newComment.trim() });
      setNewComment("");
      const res = await api.get(url);
      setComments(extractList(res.data).map(normalizeComment).filter(Boolean));
    } catch (e) {
      setError("Failed to post message.");
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      await api.delete(`/api/comments/${commentId}`);
      setComments((prev) => prev.filter((c) => c.id !== commentId));
    } catch (e) { setError("Delete failed."); }
  };

  const handleDeleteReply = async (commentId, replyId) => {
    try {
      await api.delete(`/api/comments/${replyId}`);
      setComments((prev) =>
        prev.map((c) =>
          c.id === commentId ? { ...c, replies: c.replies.filter((r) => r.id !== replyId) } : c
        )
      );
    } catch (e) { setError("Delete failed."); }
  };

  const handleReply = async (commentId, replyText) => {
    if (!replyText.trim()) return;
    try {
      await api.post(`/api/comments/reply/${commentId}`, { content: replyText.trim() });
      const path = isBook ? `/api/comments/book/${id}` : `/api/comments/community/${id}`;
      const res = await api.get(path);
      setComments(extractList(res.data).map(normalizeComment).filter(Boolean));
    } catch (e) { setError("Reply failed."); }
  };

  return (
    <div className={`min-h-screen transition-all duration-500 ${darkMode ? 'bg-[#0A0F1F] text-[#F0F4FA]' : 'bg-[#F8F9FC] text-[#1F2937]'}`}>
      
      {/* Top Nav */}
      <nav className={`fixed top-0 w-full z-50 backdrop-blur-md border-b ${darkMode ? 'bg-[#1E2740]/80 border-[#2D3748]' : 'bg-white/80 border-[#E2E8F0]'}`}>
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link to="/" className={`font-serif italic font-bold text-xl ${darkMode ? 'text-[#5F7DB0]' : 'text-[#2C3E68]'}`}>BiblioTech</Link>
          <div className="text-xs font-bold uppercase tracking-widest opacity-60">Discussion Hub</div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto pt-28 px-6 grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* LEFT COLUMN: Main Discussion */}
        <div className="lg:col-span-8">
          <button onClick={() => navigate(-1)} className="group flex items-center gap-2 mb-4 text-xs font-black uppercase tracking-widest opacity-40 hover:opacity-100 transition-all">
            <span>←</span> Back to exploring
          </button>

          <header className="mb-10">
            <h1 className="text-4xl font-black tracking-tighter mb-2 leading-tight">
              {entityType === "book" ? `Reviews: ${titleLabel}` : titleLabel}
            </h1>
            <div className={`h-1.5 w-24 rounded-full ${darkMode ? 'bg-[#5F7DB0]' : 'bg-[#2C3E68]'}`}></div>
          </header>

          {/* Comment Input */}
          <div className={`mb-12 p-1.5 rounded-[2.5rem] border shadow-xl transition-all ${
            darkMode ? 'bg-[#1E2740] border-[#2D3748]' : 'bg-white border-[#E2E8F0]'
          } ${!isLoggedIn ? 'opacity-70 grayscale-[0.3]' : ''}`}>
            <textarea
              rows="3"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder={isLoggedIn ? "Share your thoughts with the community..." : "You must be logged in to participate..."}
              disabled={!isLoggedIn}
              className={`w-full p-6 rounded-[2rem] outline-none resize-none font-medium transition-colors ${
                darkMode ? 'bg-[#0A0F1F] focus:bg-[#151B2D]' : 'bg-gray-50 focus:bg-white'
              }`}
            />
            <div className="flex justify-between items-center px-6 py-3">
              <p className="text-[10px] uppercase font-bold opacity-40">Markdown supported</p>
              <button
                type="button"
                onClick={handleAddComment}
                className={`px-8 py-2.5 rounded-xl font-black text-xs uppercase tracking-widest text-white transition-all hover:scale-105 active:scale-95 ${
                  darkMode ? 'bg-[#5F7DB0]' : 'bg-[#2C3E68]'
                }`}
              >
                {isLoggedIn ? 'Post Message' : 'Login to Post'}
              </button>
            </div>
          </div>

          {loading && <div className="space-y-4 animate-pulse">
            {[...Array(3)].map((_, i) => <div key={i} className={`h-32 rounded-3xl ${darkMode ? 'bg-[#1E2740]' : 'bg-gray-200'}`} />)}
          </div>}

          {error && <p className="bg-red-500/10 text-red-500 p-4 rounded-xl text-center mb-6 text-sm font-bold">{error}</p>}

          <div className="space-y-8 pb-20">
            {!loading && comments.map((comment) => (
              <CommentCard
                key={comment.id}
                comment={comment}
                currentUser={currentUser}
                currentUserId={currentUserId}
                darkMode={darkMode}
                onDelete={handleDeleteComment}
                onDeleteReply={handleDeleteReply}
                onReply={handleReply}
                isLoggedIn={isLoggedIn}
              />
            ))}
            {!loading && comments.length === 0 && (
              <div className="text-center py-20 opacity-40 italic">
                <p className="text-3xl mb-2">💬</p>
                <p>No messages yet. Be the first to start the thread!</p>
              </div>
            )}
          </div>
        </div>

        {/* RIGHT COLUMN: Info Sidebars */}
        <div className="lg:col-span-4 space-y-6 pb-20">
          
          {/* Context Card */}
          <div className={`p-6 rounded-3xl border ${darkMode ? 'bg-[#1E2740] border-[#2D3748]' : 'bg-white border-[#E2E8F0] shadow-sm'}`}>
            <h3 className="font-black text-xs uppercase tracking-[0.2em] mb-4 opacity-50">About this {entityType}</h3>
            <p className="font-bold text-lg mb-2">{titleLabel}</p>
            {headerData?.author && <p className="text-sm opacity-60 mb-4 italic">By {headerData.author}</p>}
            {headerData?.description && <p className="text-sm opacity-80 leading-relaxed mb-4">{headerData.description}</p>}
            <div className={`p-4 rounded-xl text-xs leading-relaxed ${darkMode ? 'bg-[#0A0F1F] text-blue-300' : 'bg-blue-50 text-blue-800'}`}>
              <strong>Note:</strong> Discussions are moderated. Please keep it respectful.
            </div>
          </div>

          {/* User Status Card */}
          <div className={`p-6 rounded-3xl border flex items-center gap-4 ${darkMode ? 'bg-gradient-to-br from-[#1E2740] to-[#151B2D] border-[#2D3748]' : 'bg-white border-[#E2E8F0] shadow-sm'}`}>
            <div className={`w-12 h-12 rounded-full flex items-center justify-center font-black text-lg ${darkMode ? 'bg-[#0A0F1F] text-[#5F7DB0]' : 'bg-gray-100 text-[#2C3E68]'}`}>
              {currentUser[0].toUpperCase()}
            </div>
            <div>
              <p className="text-[10px] uppercase font-black opacity-40 leading-none mb-1">Authenticated As</p>
              <p className="font-bold">{isLoggedIn ? currentUser : "Guest User"}</p>
            </div>
          </div>

          {/* Guidelines */}
          <div className={`p-6 rounded-3xl border ${darkMode ? 'bg-[#1E2740] border-[#2D3748]' : 'bg-white border-[#E2E8F0] shadow-sm'}`}>
            <h3 className="font-black text-xs uppercase tracking-[0.2em] mb-4 opacity-50">Discussion Guide</h3>
            <ul className="text-xs space-y-4 font-medium opacity-70">
              <li className="flex gap-2"><span>✅</span> Be helpful and polite</li>
              <li className="flex gap-2"><span>🚫</span> No spoilers without warning</li>
              <li className="flex gap-2"><span>📎</span> Keep topics relevant to {entityType}</li>
            </ul>
          </div>
        </div>

      </div>
    </div>
  );
};

const CommentCard = ({ comment, currentUser, currentUserId, darkMode, onDelete, onDeleteReply, onReply, isLoggedIn }) => {
  const [replyText, setReplyText] = useState("");
  const [isReplying, setIsReplying] = useState(false);

  const canDeleteMain =
    comment.author === currentUser ||
    (comment.raw?.userId && currentUserId && String(comment.raw.userId) === String(currentUserId));

  return (
    <div className="group animate-[fadeIn_0.3s_ease-out]">
      <div className={`p-8 rounded-[2rem] border transition-all hover:shadow-xl ${
        darkMode ? 'bg-[#1E2740] border-[#2D3748]' : 'bg-white border-[#E2E8F0]'
      }`}>
        <div className="flex justify-between items-center mb-5">
          <div className="flex items-center gap-3">
            <div className={`w-9 h-9 rounded-full flex items-center justify-center font-black text-[10px] ${darkMode ? 'bg-[#0A0F1F] text-[#5F7DB0]' : 'bg-gray-100 text-[#2C3E68]'}`}>
              {comment.author[0].toUpperCase()}
            </div>
            <div className="flex flex-col">
               <span className="font-black text-[11px] uppercase tracking-wider">{comment.author}</span>
               <span className="text-[9px] font-bold opacity-30">Member Since 2024</span>
            </div>
          </div>

          {canDeleteMain && (
            <button type="button" onClick={() => onDelete(comment.id)} className="text-[9px] font-black uppercase tracking-widest text-red-500/50 hover:text-red-500 transition-colors">
              Remove
            </button>
          )}
        </div>

        <p className="text-md leading-relaxed mb-6 font-medium opacity-90">{comment.text}</p>

        <div className="flex items-center gap-6">
          <button
            type="button"
            disabled={!isLoggedIn}
            onClick={() => setIsReplying(!isReplying)}
            className={`text-[10px] font-black uppercase tracking-widest transition-all ${
              !isLoggedIn ? 'opacity-20 cursor-not-allowed' : 'opacity-40 hover:opacity-100'
            } ${isReplying ? 'text-red-500' : ''}`}
          >
            {isReplying ? 'Close' : 'Reply'}
          </button>
          <span className="text-[10px] font-bold opacity-20 uppercase">Shared Publicly</span>
        </div>

        {isReplying && (
          <div className="mt-6 flex gap-3 animate-[zoomIn_0.2s_ease-out]">
            <input
              autoFocus
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              placeholder="Type your response..."
              className={`flex-1 p-3 px-5 rounded-xl text-sm border outline-none transition-all ${
                darkMode ? 'bg-[#0A0F1F] border-[#2D3748] focus:border-[#5F7DB0]' : 'bg-gray-50 border-gray-200 focus:border-[#2C3E68]'
              }`}
            />
            <button
              type="button"
              onClick={() => {
                onReply(comment.id, replyText);
                setReplyText("");
                setIsReplying(false);
              }}
              className={`px-6 rounded-xl font-black text-[10px] uppercase tracking-widest text-white ${
                darkMode ? 'bg-[#5F7DB0]' : 'bg-[#2C3E68]'
              }`}
            >
              Send
            </button>
          </div>
        )}

        {comment.replies.length > 0 && (
          <div className="mt-8 space-y-6 pl-6 border-l-2 border-gray-500/10">
            {comment.replies.map((reply) => (
              <div key={reply.id} className="group/reply relative pl-4">
                <div className="flex justify-between items-start mb-1">
                  <span className="font-black text-[10px] uppercase tracking-tighter opacity-50">{reply.author}</span>
                  {reply.author === currentUser && (
                    <button 
                      type="button"
                      onClick={() => onDeleteReply(comment.id, reply.id)}
                      className="text-[9px] font-black text-red-400 opacity-0 group-hover/reply:opacity-100 transition-opacity"
                    >
                      Delete
                    </button>
                  )}
                </div>
                <p className="text-sm font-medium leading-relaxed opacity-70">{reply.text}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Comments;
