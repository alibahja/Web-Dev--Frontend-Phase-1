import { useNavigate } from "react-router-dom";
import hero from '../assets/hero.png';
const GameCard = ({ game, darkMode }) => {
  const navigate = useNavigate();
  const img = game.image || hero;
  return (
    <div
  onClick={() => {
    if (!localStorage.getItem("token")) {
     
      navigate("/login", { state: { from: `/games/${game.id}` } });
    } else {
      navigate(`/games/${game.id}`);
    }
  }}
  className={`group relative w-80 h-52 rounded-3xl overflow-hidden cursor-pointer transition-all duration-500 hover:-translate-y-2 ${
    darkMode ? 'bg-[#1E2740]' : 'bg-white shadow-xl'
  }`}
>
  <div
    className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
    style={{ backgroundImage: `url(${img})` }}
  >
    <div className="absolute inset-0 bg-black/50" />
  </div>

  <div className="relative h-full flex flex-col justify-end p-5 text-white">
    <h3 className="text-xl font-bold mb-1">{game.title}</h3>
    <p className="text-sm opacity-80 mb-3 line-clamp-2">{game.description}</p>

    <span className="self-start px-4 py-2 bg-white text-[#2C3E68] rounded-xl font-semibold text-sm transition-all group-hover:bg-[#5F7DB0] group-hover:text-white">
      View Roadmap
    </span>
  </div>
</div>
  );
};
export default GameCard;
