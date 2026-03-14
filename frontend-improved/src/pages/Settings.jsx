import React from "react";
import { Link } from "react-router-dom";
import {
  FaCog,
  FaMoon,
  FaQuestionCircle,
  FaExclamationTriangle,
  FaEnvelope,
  FaPaperPlane,
  FaInfoCircle
} from "react-icons/fa";

const Settings = ({ darkMode, setDarkMode }) => {
  return (
    <div
      className={`min-h-screen pb-12 transition-all ${
        darkMode
          ? "bg-[#0A0F1F] text-[#F0F4FA]"
          : "bg-[#F8F9FC] text-[#1F2937]"
      }`}
    >
      {/* NAVBAR */}
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
            Library
          </span>

          
        </div>
      </nav>

      <main className="max-w-3xl mx-auto pt-24 px-6">
        <div
          className={`p-8 rounded-3xl border shadow-xl ${
            darkMode
              ? "bg-[#1E2740] border-[#2D3748]"
              : "bg-white border-[#E2E8F0]"
          }`}
        >
          {/* TITLE */}
          <h2 className="text-2xl font-black mb-6 flex items-center gap-2">
            <FaCog className="text-[#5F7DB0]" />
            Settings
          </h2>

          {/* DARK MODE */}
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

          {/* FAQ */}
          <div className="mt-6">
            <p className="font-semibold mb-3 flex items-center gap-2">
              <FaQuestionCircle />
              Frequently Asked Questions
            </p>

            <div className="space-y-3">
              <details
                className={`p-4 rounded-xl border cursor-pointer ${
                  darkMode
                    ? "bg-[#0A0F1F] border-[#2D3748]"
                    : "bg-gray-50 border-gray-200"
                }`}
              >
                <summary className="font-semibold">
                  How do I borrow a book?
                </summary>
                <p className="text-sm opacity-70 mt-2">
                  Go to any book detail page and click "Borrow" if copies are
                  available. The book will appear in your Borrowed list.
                </p>
              </details>

              <details
                className={`p-4 rounded-xl border ${
                  darkMode
                    ? "bg-[#0A0F1F] border-[#2D3748]"
                    : "bg-gray-50 border-gray-200"
                }`}
              >
                <summary className="font-semibold">
                  Can I delete my account permanently?
                </summary>
                <p className="text-sm opacity-70 mt-2">
                  Yes. Use the delete button below. This action cannot be
                  undone and all your data will be removed.
                </p>
              </details>

              <details
                className={`p-4 rounded-xl border ${
                  darkMode
                    ? "bg-[#0A0F1F] border-[#2D3748]"
                    : "bg-gray-50 border-gray-200"
                }`}
              >
                <summary className="font-semibold">
                  How are achievement ranks calculated?
                </summary>
                <p className="text-sm opacity-70 mt-2">
                  5 books → Beginner Reader  
                  20 books → Book Lover  
                  50 books → Library Master
                </p>
              </details>
            </div>
          </div>

          {/* DELETE ACCOUNT */}
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
              onClick={() =>
                window.confirm(
                  "Are you sure? This will permanently delete your account."
                )
              }
              className="px-5 py-2 rounded-full border border-red-500 text-red-500 font-semibold hover:bg-red-500 hover:text-white transition"
            >
              Delete
            </button>
          </div>

          {/* CONTACT */}
          <div className="flex items-center justify-between flex-wrap gap-4 mt-8">
            <span className="flex items-center gap-2 text-sm">
              <FaEnvelope /> Need help?
            </span>

            <a
              href="mailto:library@support.com"
              className={`px-4 py-2 rounded-full border text-sm font-semibold flex items-center gap-2 transition ${
                darkMode
                  ? "border-[#5F7DB0] text-[#5F7DB0] hover:bg-[#5F7DB0] hover:text-white"
                  : "border-[#2C3E68] text-[#2C3E68] hover:bg-[#2C3E68] hover:text-white"
              }`}
            >
              <FaPaperPlane />
              library@support.com
            </a>
          </div>

          <p className="text-xs opacity-60 mt-4 flex items-center gap-2">
            <FaInfoCircle /> You can also send a direct email to the website
            address.
          </p>
        </div>

        {/* FOOTER */}
        <div className="text-center text-sm opacity-50 mt-8">
          © LibroView · reading reimagined
        </div>
      </main>
    </div>
  );
};

export default Settings;