import { useRef, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import GameCard from './GameCard';
import hero from '../assets/hero.png';

const GameSection = ({ darkMode }) => {
  const scrollRef = useRef(null);
  const sectionRef = useRef(null);
  const [showGames, setShowGames] = useState(false);

  const games = [
    {
      id: 1,
      title: "Master Web Development",
      description: "HTML → CSS → JavaScript → React",
      image: hero,
    },
    {
      id: 2,
      title: "Become a Data Scientist",
      description: "Python → Data Analysis → ML",
      image: hero,
    },
    {
      id: 3,
      title: "History Explorer",
      description: "Ancient → Medieval → Modern",
      image: hero,
    },
    {
      id: 4,
      title: "Fitness & Nutrition",
      description: "Training → Diet → Recovery",
      image: hero,
    },
  ];

  const scroll = (direction) => {
    if (!scrollRef.current) return;

    scrollRef.current.scrollBy({
      left: direction === "left" ? -300 : 300,
      behavior: "smooth",
    });
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShowGames(true);
        }
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) observer.observe(sectionRef.current);

    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className="py-16 w-full px-6 md:px-10 overflow-hidden">
      <Link to="/all-games">
        <h2
          className={`text-3xl font-bold mb-10 transition-all duration-700 ${
            showGames ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
          } ${darkMode ? "text-white" : "text-[#1F2937]"}`}
        >
          Reading Games
        </h2>
      </Link>

      <div className="relative group">
        <button
          onClick={() => scroll("left")}
          className="absolute left-[-20px] top-1/2 -translate-y-1/2 z-10 bg-black/50 text-white p-3 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
        >
          &larr;
        </button>

        <div
          ref={scrollRef}
          className="flex gap-6 overflow-x-auto scrollbar-hide scroll-smooth pb-4"
        >
          {games.map((game, index) => (
            <div
              key={game.id}
              className={`transition-all duration-700 transform ${
                showGames
                  ? "translate-x-0 opacity-100"
                  : "translate-x-[-100px] opacity-0"
              }`}
              style={{ transitionDelay: `${index * 150}ms` }}
            >
              <GameCard game={game} darkMode={darkMode} />
            </div>
          ))}
        </div>

        <button
          onClick={() => scroll("right")}
          className="absolute right-[-20px] top-1/2 -translate-y-1/2 z-10 bg-black/50 text-white p-3 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
        >
          &rarr;
        </button>
      </div>
    </section>
  );
};

export default GameSection;