import { Link } from 'react-router-dom';

const GameCard = ({ game, darkMode }) => {
  return (
    <Link to={`/games/${game.id || ''}`}>
      <div
        className={`group relative w-80 h-52 rounded-3xl overflow-hidden cursor-pointer transition-all duration-500 hover:-translate-y-2 ${
          darkMode ? 'bg-[#1E2740]' : 'bg-white shadow-xl'
        }`}
      >
        {/* Background */}
        <div
          className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
          style={{ backgroundImage: `url(${game.image})` }}
        >
          <div className="absolute inset-0 bg-black/50" />
        </div>

        {/* Content */}
        <div className="relative h-full flex flex-col justify-end p-5 text-white">
          <h3 className="text-xl font-bold mb-1">{game.title}</h3>
          <p className="text-sm opacity-80 mb-3">{game.description}</p>

          <button className="self-start px-4 py-2 bg-white text-[#2C3E68] rounded-xl font-semibold text-sm transition-all hover:bg-[#5F7DB0] hover:text-white">
            View Roadmap
          </button>
        </div>
      </div>
    </Link>
  );
};

export default GameCard;