import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/client";
import {
  FaCog,
  FaMoon,
  FaQuestionCircle,
  FaExclamationTriangle,
  FaEnvelope,
  FaPaperPlane,
  FaInfoCircle,
  FaBook,
  FaUsers,
  FaGamepad,
  FaComments,
  FaShieldAlt,
  FaRocket
} from "react-icons/fa";

const Settings = ({ darkMode, setDarkMode }) => {
  const navigate = useNavigate();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState("");

  const handleDeleteAccount = async () => {
    setDeleteError("");
    setDeleting(true);
    try {
      const response = await api.delete("/api/auth/account");

      if (response.data.success !== false) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setShowDeleteModal(false);
        navigate("/", { replace: true });
      }
    } catch (error) {
      setDeleteError(error.response?.data?.message || error.response?.data?.error || "Failed to delete account");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div
      className={`min-h-screen pb-12 transition-all ${
        darkMode
          ? "bg-[#0A0F1F] text-[#F0F4FA]"
          : "bg-[#F8F9FC] text-[#1F2937]"
      }`}
    >
      <nav
        className={`fixed top-0 w-full z-50 backdrop-blur-xl border-b ${
          darkMode
            ? "bg-[#111827]/80 border-[#2D3748]"
            : "bg-white/80 border-[#E2E8F0]"
        }`}
      >
        <div className="max-w-7xl mx-auto px-8 h-16 flex items-center justify-between">
          <Link
            to="/"
            className={`px-4 py-2 rounded-lg text-sm font-semibold shadow-md transition hover:scale-105 ${
              darkMode
                ? "bg-[#5F7DB0] hover:bg-[#4A6A9E]"
                : "bg-[#2C3E68] hover:bg-[#1F2F4F]"
            } text-white`}
          >
            Home
          </Link>

          <span
            className={`font-serif italic font-black text-xl tracking-tight ${
              darkMode ? "text-[#5F7DB0]" : "text-[#2C3E68]"
            }`}
          >
            BiblioTech
          </span>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto pt-24 px-6">
        <div
          className={`p-8 rounded-3xl border shadow-xl ${
            darkMode
              ? "bg-[#1E2740] border-[#2D3748]"
              : "bg-white border-[#E2E8F0]"
          }`}
        >
          <h2 className="text-2xl font-black mb-6 flex items-center gap-2">
            <FaCog className="text-[#5F7DB0]" />
            Settings
          </h2>

          {/* Dark Mode Toggle */}
          <div className="flex items-center justify-between py-4 border-b border-gray-300/20">
            <div>
              <p className="font-semibold flex items-center gap-2">
                <FaMoon /> Dark Mode
              </p>
              <p className="text-sm opacity-60">
                Switch between light and dark theme
              </p>
            </div>

            <button
              type="button"
              onClick={() => setDarkMode(!darkMode)}
              className={`w-14 h-7 rounded-full relative transition ${
                darkMode ? "bg-[#5F7DB0]" : "bg-gray-300"
              }`}
            >
              <span
                className={`absolute top-1 left-1 w-5 h-5 rounded-full bg-white transition ${
                  darkMode ? "translate-x-7" : ""
                }`}
              ></span>
            </button>
          </div>

          {/* Quick Info Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
            <div className={`p-4 rounded-xl border ${darkMode ? "border-[#2D3748] bg-[#0A0F1F]" : "border-gray-200 bg-gray-50"}`}>
              <FaBook className="text-[#5F7DB0] text-xl mb-2" />
              <p className="text-xs font-bold uppercase opacity-60">Library</p>
              <p className="text-sm font-semibold">Browse 1000+ books</p>
            </div>
            <div className={`p-4 rounded-xl border ${darkMode ? "border-[#2D3748] bg-[#0A0F1F]" : "border-gray-200 bg-gray-50"}`}>
              <FaUsers className="text-[#5F7DB0] text-xl mb-2" />
              <p className="text-xs font-bold uppercase opacity-60">Community</p>
              <p className="text-sm font-semibold">Join reading groups</p>
            </div>
            <div className={`p-4 rounded-xl border ${darkMode ? "border-[#2D3748] bg-[#0A0F1F]" : "border-gray-200 bg-gray-50"}`}>
              <FaGamepad className="text-[#5F7DB0] text-xl mb-2" />
              <p className="text-xs font-bold uppercase opacity-60">Games</p>
              <p className="text-sm font-semibold">Learn through roadmaps</p>
            </div>
            <div className={`p-4 rounded-xl border ${darkMode ? "border-[#2D3748] bg-[#0A0F1F]" : "border-gray-200 bg-gray-50"}`}>
              <FaComments className="text-[#5F7DB0] text-xl mb-2" />
              <p className="text-xs font-bold uppercase opacity-60">Reviews</p>
              <p className="text-sm font-semibold">Share your thoughts</p>
            </div>
          </div>

          {/* FAQ Section */}
          <div className="mt-8">
            <p className="font-semibold mb-3 flex items-center gap-2 text-lg">
              <FaQuestionCircle />
              Frequently Asked Questions
            </p>

            <div className="space-y-3">
              {/* Getting Started */}
              <details
                className={`p-4 rounded-xl border cursor-pointer ${
                  darkMode
                    ? "bg-[#0A0F1F] border-[#2D3748]"
                    : "bg-gray-50 border-gray-200"
                }`}
              >
                <summary className="font-semibold">📚 How do I get started?</summary>
                <p className="text-sm opacity-70 mt-2">
                  Create a free account, then browse our collection of thousands of books. 
                  You can search by title, author, or genre. Add books to your reading list, 
                  borrow them, or purchase them directly from the library.
                </p>
              </details>

              {/* Borrowing Books */}
              <details
                className={`p-4 rounded-xl border cursor-pointer ${
                  darkMode
                    ? "bg-[#0A0F1F] border-[#2D3748]"
                    : "bg-gray-50 border-gray-200"
                }`}
              >
                <summary className="font-semibold">📖 How do I borrow a book?</summary>
                <p className="text-sm opacity-70 mt-2">
                  Go to any book detail page and click "Borrow Now" if copies are available. 
                  The book will appear in your Borrowed list in your profile. You have 14 days 
                  to return the book. When you return it, it will count toward your reading stats!
                </p>
              </details>

              {/* Reading Lists */}
              <details
                className={`p-4 rounded-xl border cursor-pointer ${
                  darkMode
                    ? "bg-[#0A0F1F] border-[#2D3748]"
                    : "bg-gray-50 border-gray-200"
                }`}
              >
                <summary className="font-semibold">📝 What are reading lists?</summary>
                <p className="text-sm opacity-70 mt-2">
                  You can organize books into different lists: "Want to Read" for future reads, 
                  "Currently Reading" for books in progress, and "Favorite" for books you love. 
                  Click the shelf buttons on any book page to add them to your lists.
                </p>
              </details>

              {/* Reading Games */}
              <details
                className={`p-4 rounded-xl border cursor-pointer ${
                  darkMode
                    ? "bg-[#0A0F1F] border-[#2D3748]"
                    : "bg-gray-50 border-gray-200"
                }`}
              >
                <summary className="font-semibold">🎮 What are Reading Games?</summary>
                <p className="text-sm opacity-70 mt-2">
                  Reading games are structured learning paths that guide you through multiple 
                  books on a specific topic (like Web Development, Data Science, History). 
                  Each game has steps with recommended books. Complete steps to earn badges 
                  and track your progress!
                </p>
              </details>

              {/* Communities */}
              <details
                className={`p-4 rounded-xl border cursor-pointer ${
                  darkMode
                    ? "bg-[#0A0F1F] border-[#2D3748]"
                    : "bg-gray-50 border-gray-200"
                }`}
              >
                <summary className="font-semibold">👥 How do communities work?</summary>
                <p className="text-sm opacity-70 mt-2">
                  Communities are groups of readers with shared interests. You can join existing 
                  communities or create your own! Once joined, you can participate in discussion 
                  boards, share book recommendations, and connect with fellow readers.
                </p>
              </details>

              {/* Comments & Discussions */}
              <details
                className={`p-4 rounded-xl border cursor-pointer ${
                  darkMode
                    ? "bg-[#0A0F1F] border-[#2D3748]"
                    : "bg-gray-50 border-gray-200"
                }`}
              >
                <summary className="font-semibold">💬 Can I comment on books?</summary>
                <p className="text-sm opacity-70 mt-2">
                  Yes! Every book has a discussion board where you can leave reviews, ask questions, 
                  and reply to other readers. For communities, you must be a member to participate 
                  in discussions.
                </p>
              </details>

              {/* Reading Stats */}
              <details
                className={`p-4 rounded-xl border cursor-pointer ${
                  darkMode
                    ? "bg-[#0A0F1F] border-[#2D3748]"
                    : "bg-gray-50 border-gray-200"
                }`}
              >
                <summary className="font-semibold">📊 How are reading stats calculated?</summary>
                <p className="text-sm opacity-70 mt-2">
                  Your reading stats are based on completed books (books you've borrowed and returned 
                  or marked as read). We track: total books read, total pages read, monthly reading, 
                  and your favorite genre based on your most-read categories.
                </p>
              </details>

              {/* Achievement Ranks */}
              <details
                className={`p-4 rounded-xl border cursor-pointer ${
                  darkMode
                    ? "bg-[#0A0F1F] border-[#2D3748]"
                    : "bg-gray-50 border-gray-200"
                }`}
              >
                <summary className="font-semibold">🏆 How are achievement ranks calculated?</summary>
                <p className="text-sm opacity-70 mt-2">
                  <strong>5 books</strong> → Avid Reader<br />
                  <strong>10 books</strong> → Book Lover<br />
                  <strong>25 books</strong> → Book Master<br />
                  <strong>50+ books</strong> → Scholar
                </p>
              </details>

              {/* Profile Picture */}
              <details
                className={`p-4 rounded-xl border cursor-pointer ${
                  darkMode
                    ? "bg-[#0A0F1F] border-[#2D3748]"
                    : "bg-gray-50 border-gray-200"
                }`}
              >
                <summary className="font-semibold">🖼️ How do I add a profile picture?</summary>
                <p className="text-sm opacity-70 mt-2">
                  Go to your Profile page and click the camera icon 📷 on your profile circle. 
                  Upload a JPG, PNG, or GIF image (max 5MB). Your picture will appear across the site.
                </p>
              </details>

              {/* Account Deletion */}
              <details
                className={`p-4 rounded-xl border cursor-pointer ${
                  darkMode
                    ? "bg-[#0A0F1F] border-[#2D3748]"
                    : "bg-gray-50 border-gray-200"
                }`}
              >
                <summary className="font-semibold">⚠️ Can I delete my account permanently?</summary>
                <p className="text-sm opacity-70 mt-2">
                  Yes. Use the delete button below. This action cannot be undone. All your data 
                  (comments, reading lists, borrowed books) will be permanently removed.
                </p>
              </details>

              {/* Support */}
              <details
                className={`p-4 rounded-xl border cursor-pointer ${
                  darkMode
                    ? "bg-[#0A0F1F] border-[#2D3748]"
                    : "bg-gray-50 border-gray-200"
                }`}
              >
                <summary className="font-semibold">📧 How can I get help?</summary>
                <p className="text-sm opacity-70 mt-2">
                  You can email us at <strong>bibliotech453@gmail.com</strong> or use the contact 
                  form on the homepage. We typically respond within 24-48 hours.
                </p>
              </details>
            </div>
          </div>

          {/* Tips & Tricks Box */}
          <div className={`mt-8 p-6 rounded-xl border-2 border-dashed ${
            darkMode ? "border-[#5F7DB0]/30 bg-[#5F7DB0]/5" : "border-[#2C3E68]/30 bg-[#2C3E68]/5"
          }`}>
            <div className="flex items-center gap-2 mb-3">
              <FaRocket className="text-[#5F7DB0]" />
              <h3 className="font-bold">Pro Tips</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
              <div className="flex items-start gap-2">
                <span className="text-[#5F7DB0]">★</span>
                <span>Complete reading games to earn badges and track your learning progress</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-[#5F7DB0]">★</span>
                <span>Join communities to discuss books with fellow readers</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-[#5F7DB0]">★</span>
                <span>Rate books you've read to help others discover great reads</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-[#5F7DB0]">★</span>
                <span>Use advanced search to filter books by pages, language, and more</span>
              </div>
            </div>
          </div>

          {/* Delete Account Section */}
          <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-300/20 flex-wrap gap-4">
            <div>
              <p className="font-semibold flex items-center gap-2 text-red-500">
                <FaExclamationTriangle /> Delete Account
              </p>
              <p className="text-sm opacity-60">
                Permanently erase all personal data
              </p>
            </div>

            <button
              type="button"
              onClick={() => {
                if (!localStorage.getItem("token")) {
                  navigate("/login", { state: { from: "/settings" } });
                  return;
                }
                setShowDeleteModal(true);
              }}
              className="px-5 py-2 rounded-full border border-red-500 text-red-500 font-semibold hover:bg-red-500 hover:text-white transition"
            >
              Delete
            </button>
          </div>

          {/* Contact Section */}
          <div className="flex items-center justify-between flex-wrap gap-4 mt-8">
            <span className="flex items-center gap-2 text-sm">
              <FaEnvelope /> Need help?
            </span>

            <a
              href="mailto:bibliotech453@gmail.com"
              className={`px-4 py-2 rounded-full border text-sm font-semibold flex items-center gap-2 transition ${
                darkMode
                  ? "border-[#5F7DB0] text-[#5F7DB0] hover:bg-[#5F7DB0] hover:text-white"
                  : "border-[#2C3E68] text-[#2C3E68] hover:bg-[#2C3E68] hover:text-white"
              }`}
            >
              <FaPaperPlane />
              bibliotech453@gmail.com
            </a>
          </div>

          <p className="text-xs opacity-60 mt-4 flex items-center gap-2">
            <FaInfoCircle /> For technical support or feature requests, please email us.
          </p>
        </div>

        <div className="text-center text-sm opacity-50 mt-8">
          © BiblioTech · Reading Reimagined
        </div>
      </main>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div
            className={`w-full max-w-md rounded-2xl p-8 border shadow-2xl ${
              darkMode ? "bg-[#1E2740] border-[#2D3748] text-white" : "bg-white border-[#E2E8F0]"
            }`}
          >
            <h3 className="text-xl font-black mb-2">Delete account?</h3>
            <p className="text-sm opacity-80 mb-6">
              This permanently removes your account and all associated data. This cannot be undone.
            </p>
            {deleteError && <p className="text-red-500 text-sm font-semibold mb-4">{deleteError}</p>}
            <div className="flex gap-3">
              <button
                type="button"
                disabled={deleting}
                onClick={() => { setShowDeleteModal(false); setDeleteError(""); }}
                className="flex-1 py-3 rounded-xl font-semibold border border-white/20 hover:opacity-80"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={deleting}
                onClick={handleDeleteAccount}
                className="flex-1 py-3 rounded-xl font-semibold bg-red-600 text-white hover:bg-red-700 disabled:opacity-50"
              >
                {deleting ? "Deleting…" : "Delete forever"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Settings;
