import { Link } from 'react-router-dom';
import defaultimage from '../assets/default-book-cover.jpg';

const BookCard = ({ book, darkMode }) => {
  const defaultCover = defaultimage;

  return (
    <Link to={`/book/${book.id}`} state={{ book }}>
      <div
        className={`group flex-shrink-0 w-64 p-4 rounded-xl cursor-pointer transition-all duration-300 hover:-translate-y-2 ${
          darkMode
            ? 'bg-[#1E2740] text-white hover:bg-[#25304d]'
            : 'bg-white shadow-md text-gray-800 hover:shadow-xl'
        }`}
      >
        <div className="h-80 overflow-hidden rounded-lg mb-4 bg-gray-200">
          <img
            src={book.coverUrl || defaultCover}
            alt={book.title}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            onError={(e) => (e.target.src = defaultCover)}
          />
        </div>

        <h3 className="font-bold truncate text-lg">{book.title}</h3>

        <div className="flex items-center my-2 text-yellow-500">
          {Array.from({ length: 5 }, (_, i) => (
            <span key={i}>
              {i < Math.floor(book.rating || 0) ? '★' : '☆'}
            </span>
          ))}
          <span className="ml-2 text-sm opacity-70">
            ({(book.rating || 0).toFixed(1)})
          </span>
        </div>

        <p className="text-xl font-semibold text-[#5F7DB0]">
          ${(book.price || 0).toFixed(2)}
        </p>
      </div>
    </Link>
  );
};

export default BookCard;