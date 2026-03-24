import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  FiArrowLeft,
  FiCheckCircle,
  FiLock,
  FiChevronLeft,
  FiChevronRight,
  FiCheck,
  FiAward
} from "react-icons/fi";

import hero from "../assets/hero.png";
import defaultimage from "../assets/default-book-cover.jpg";

const BookCard = ({ book, darkMode }) => {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(`/book/${book.id}`, { state: { book } })}
      className={`group flex-shrink-0 w-44 md:w-52 p-4 rounded-[2rem] cursor-pointer transition-all duration-500 hover:scale-105 ${
        darkMode
          ? "bg-[#1E2740]/40 hover:bg-[#1E2740]/80 border border-white/5"
          : "bg-white shadow-lg text-gray-800 hover:shadow-2xl border border-gray-100"
      }`}
    >
      <div className="relative h-64 overflow-hidden rounded-[1.5rem] mb-4 shadow-md">
        <img
          src={book.coverUrl || defaultimage}
          alt={book.title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          onError={(e) => (e.target.src = defaultimage)}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center pb-4">
          <span className="text-white text-xs font-bold uppercase tracking-widest">
            View Details
          </span>
        </div>
      </div>

      <h3 className="font-bold text-sm truncate mb-1">{book.title}</h3>
      <p className="text-xs opacity-60 italic">{book.author}</p>
    </div>
  );
};

const RoadmapStep = ({
  step,
  index,
  darkMode,
  isCompleted,
  isUnlocked,
  isLast,
  onToggle
}) => {
  const scrollRef = useRef(null);

  const scroll = (direction) => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const scrollTo =
        direction === "left"
          ? scrollLeft - clientWidth
          : scrollLeft + clientWidth;
      scrollRef.current.scrollTo({ left: scrollTo, behavior: "smooth" });
    }
  };

  return (
    <div className="relative flex flex-col items-center">
      <div
        className={`relative w-full flex flex-col md:flex-row transition-all duration-700 ${
          !isUnlocked ? "opacity-40 grayscale" : ""
        }`}
      >
        <div
          className={`absolute left-0 md:left-1/2 md:-translate-x-1/2 z-10 w-12 h-12 rounded-full flex items-center justify-center border-4 shadow-xl ${
            isCompleted
              ? "bg-green-500 border-green-200"
              : isUnlocked
              ? "bg-blue-600 border-blue-200"
              : "bg-gray-500 border-gray-300"
          }`}
        >
          {isCompleted ? (
            <FiCheckCircle className="text-white" />
          ) : !isUnlocked ? (
            <FiLock className="text-white" />
          ) : (
            <span className="text-white font-bold">{index + 1}</span>
          )}
        </div>

        <div
          className={`w-full md:w-[46%] pl-16 md:pl-0 p-8 rounded-[3rem] border ${
            isCompleted
              ? "border-green-500/30 bg-green-500/5"
              : darkMode
              ? "bg-[#161B2D] border-white/5"
              : "bg-white border-gray-100 shadow-xl"
          } ${index % 2 === 0 ? "md:mr-auto" : "md:ml-auto"}`}
        >
          <div className="flex justify-between items-start mb-6">
            <div>
              <span className="text-[10px] uppercase font-bold tracking-widest text-blue-500">
                {step.level}
              </span>
              <h3 className="text-2xl font-bold mt-1">{step.title}</h3>
            </div>

            <button
              onClick={() => onToggle(step.id)}
              disabled={!isUnlocked}
              className={`p-3 rounded-2xl transition-all ${
                !isUnlocked
                  ? "cursor-not-allowed opacity-50 bg-gray-400/10 text-gray-400"
                  : isCompleted
                  ? "bg-green-500 text-white"
                  : "bg-blue-600/10 text-blue-500 hover:bg-blue-600 hover:text-white"
              }`}
            >
              <FiCheck />
            </button>
          </div>

          <div className="relative group">
            {step.books.length > 2 && (
              <>
                <button
                  onClick={() => scroll("left")}
                  className="absolute left-[-15px] top-1/2 -translate-y-1/2 z-20 p-2 rounded-full bg-blue-600 text-white opacity-0 group-hover:opacity-100"
                >
                  <FiChevronLeft />
                </button>

                <button
                  onClick={() => scroll("right")}
                  className="absolute right-[-15px] top-1/2 -translate-y-1/2 z-20 p-2 rounded-full bg-blue-600 text-white opacity-0 group-hover:opacity-100"
                >
                  <FiChevronRight />
                </button>
              </>
            )}

            <div
              ref={scrollRef}
              className="flex gap-4 overflow-x-auto pb-4 no-scrollbar"
            >
              {step.books.map((book) => (
                <BookCard key={book.id} book={book} darkMode={darkMode} />
              ))}
            </div>
          </div>
        </div>
      </div>

      {!isLast && (
        <div
          className={`w-1 h-12 rounded-full my-2 transition-all duration-500 ${
            isCompleted ? "bg-green-500" : darkMode ? "bg-white/10" : "bg-gray-200"
          }`}
        />
      )}
    </div>
  );
};

const RoadMap = ({ darkMode }) => {
  const navigate = useNavigate();
  const [completed, setCompleted] = useState([]);

  const roadmapSteps = [
    {
      id: 1,
      level: "Beginner",
      title: "Foundations",
      books: [{ id: 1, title: "HTML Basics", author: "John Doe" }]
    },
    {
      id: 2,
      level: "Intermediate",
      title: "JavaScript",
      books: [{ id: 2, title: "JS Guide", author: "Alex" }]
    }
  ];

  const toggleComplete = (id) => {
    setCompleted((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const progress = Math.round(
    (completed.length / roadmapSteps.length) * 100
  );

  return (
    <div
      className={`min-h-screen ${
        darkMode ? "bg-[#050810] text-white" : "bg-[#F3F5F9]"
      }`}
    >
      <div
        className="relative h-[40vh] flex items-center justify-center bg-cover bg-center"
        style={{ backgroundImage: `url(${hero})` }}
      >
        <button
          onClick={() => navigate(-1)}
          className="absolute top-6 left-6 p-2 rounded-full bg-black/30 text-white hover:bg-black/50 transition"
        >
          <FiArrowLeft size={20} />
        </button>

        <h1 className="text-4xl font-bold text-white drop-shadow-lg">
          Learning Roadmap
        </h1>
      </div>

      <div className="p-6">
        <div
          className={`p-4 rounded-xl ${
            darkMode ? "bg-[#161B2D] text-white" : "bg-white text-gray-800"
          }`}
        >
          <div className="flex justify-between mb-2">
            <span className="font-semibold text-sm">Overall Progress</span>
            <span className="font-bold text-blue-500">{progress}%</span>
          </div>
          <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-blue-500 rounded-full transition-all duration-700"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>

      <div className="p-6 space-y-0">
        {roadmapSteps.map((step, index) => (
          <RoadmapStep
            key={step.id}
            step={step}
            index={index}
            darkMode={darkMode}
            isCompleted={completed.includes(step.id)}
            isUnlocked={
              index === 0 || completed.includes(roadmapSteps[index - 1]?.id)
            }
            isLast={index === roadmapSteps.length - 1}
            onToggle={toggleComplete}
          />
        ))}
      </div>

      {progress === 100 && (
        <button className="fixed bottom-10 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-green-500 text-white px-6 py-3 rounded-full shadow-lg hover:bg-green-600 transition">
          <FiAward />
          <span>Game Completed</span>
        </button>
      )}
    </div>
  );
};

export default RoadMap;