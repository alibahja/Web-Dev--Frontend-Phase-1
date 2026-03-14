import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { FaSearch, FaUndo, FaLightbulb, FaArrowLeft } from "react-icons/fa";

const Advanced = ({ darkMode }) => {
  const navigate = useNavigate();
  const [searchCriteria, setSetarchCriteria] = useState({
    title: '',
    author: '',
    genre: '',
    isbn: '',
    placeOfPublishing: '', // Fixed naming consistency from your input
    minPages: '',
    maxPages: ''
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSetarchCriteria(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setError('');
    
    // Basic Validation
    if (searchCriteria.minPages && searchCriteria.maxPages) {
      if (parseInt(searchCriteria.minPages) > parseInt(searchCriteria.maxPages)) {
        setError("Minimum pages cannot be greater than maximum pages.");
        return;
      }
    }

    setLoading(true);

    // Create Search Query String
    const params = new URLSearchParams();
    Object.entries(searchCriteria).forEach(([key, value]) => {
      if (value.trim() !== '') {
        params.append(key, value.trim());
      }
    });

    // Simulate a slight delay for "Advanced Processing" feel
    setTimeout(() => {
      setLoading(false);
      navigate(`/search?${params.toString()}`);
    }, 800);
  };

  const handleReset = () => {
    setSetarchCriteria({
      title: '', author: '', genre: '', isbn: '',
      placeOfPublishing: '', minPages: '', maxPages: '',
    });
    setError('');
  };

  const isFormEmpty = Object.values(searchCriteria).every(value => String(value).trim() === '');

  // Tailwind Logic for Dark Mode
  const inputClass = `w-full px-4 py-3 rounded-xl border transition-all outline-none focus:ring-2 ${
    darkMode 
    ? 'bg-[#0A0F1F] border-[#2D3748] text-white focus:ring-[#5F7DB0] focus:border-transparent' 
    : 'bg-gray-50 border-gray-200 text-gray-900 focus:ring-[#2C3E68] focus:border-transparent'
  }`;

  const labelClass = `block text-xs font-black uppercase tracking-widest mb-2 ${
    darkMode ? 'text-[#5F7DB0]' : 'text-[#2C3E68]'
  }`;

  return (
    <div className={`min-h-screen transition-colors duration-500 pt-24 pb-12 px-6 ${
      darkMode ? 'bg-[#0A0F1F] text-[#F0F4FA]' : 'bg-[#F8F9FC] text-[#1F2937]'
    }`}>
      <div className="max-w-4xl mx-auto">
        
        {/* HEADER */}
        <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <Link to="/" className="flex items-center gap-2 text-sm font-bold opacity-60 hover:opacity-100 mb-4 transition-opacity">
              <FaArrowLeft /> Back to Home
            </Link>
            <h1 className="text-5xl font-black tracking-tighter mb-2">Advanced Search</h1>
            <p className="text-lg opacity-60 font-medium">Refine your hunt for the perfect read.</p>
          </div>
        </div>

        {/* SEARCH FORM */}
        <form 
          onSubmit={handleSearch}
          className={`p-8 md:p-12 rounded-[2.5rem] border shadow-2xl transition-all ${
            darkMode ? 'bg-[#1E2740] border-[#2D3748]' : 'bg-white border-[#E2E8F0]'
          }`}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            {/* Title */}
            <div className="md:col-span-2">
              <label htmlFor="title" className={labelClass}>Book Title</label>
              <input
                type="text" id="title" name="title"
                className={inputClass}
                placeholder="e.g. The Shadow of the Wind"
                value={searchCriteria.title}
                onChange={handleInputChange}
              />
            </div>

            {/* Author */}
            <div>
              <label htmlFor="author" className={labelClass}>Author</label>
              <input
                type="text" id="author" name="author"
                className={inputClass}
                placeholder="e.g. Carlos Ruiz Zafón"
                value={searchCriteria.author}
                onChange={handleInputChange}
              />
            </div>

            {/* Genre */}
            <div>
              <label htmlFor="genre" className={labelClass}>Genre</label>
              <select 
                id="genre" name="genre"
                className={inputClass}
                value={searchCriteria.genre}
                onChange={handleInputChange}
              >
                <option value="">All Genres</option>
                <option value="Fiction">Fiction</option>
                <option value="Science Fiction">Science Fiction</option>
                <option value="Fantasy">Fantasy</option>
                <option value="Mystery">Mystery</option>
                <option value="History">History</option>
                <option value="Business">Business</option>
              </select>
            </div>

            {/* ISBN */}
            <div>
              <label htmlFor="isbn" className={labelClass}>ISBN</label>
              <input
                type="text" id="isbn" name="isbn"
                className={inputClass}
                placeholder="10 or 13 digit code"
                value={searchCriteria.isbn}
                onChange={handleInputChange}
              />
            </div>

            {/* Location */}
            <div>
              <label htmlFor="placeOfPublishing" className={labelClass}>Place of Publishing</label>
              <input
                type="text" id="placeOfPublishing" name="placeOfPublishing"
                className={inputClass}
                placeholder="City or Country"
                value={searchCriteria.placeOfPublishing}
                onChange={handleInputChange}
              />
            </div>

            {/* Pages Range */}
            <div className="md:col-span-2">
              <label className={labelClass}>Page Count Range</label>
              <div className="flex items-center gap-4">
                <input
                  type="number" name="minPages"
                  className={inputClass}
                  placeholder="Min"
                  value={searchCriteria.minPages}
                  onChange={handleInputChange}
                />
                <span className="font-bold opacity-30">TO</span>
                <input
                  type="number" name="maxPages"
                  className={inputClass}
                  placeholder="Max"
                  value={searchCriteria.maxPages}
                  onChange={handleInputChange}
                />
              </div>
            </div>
          </div>

          {error && (
            <div className="mt-8 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-sm font-bold flex items-center gap-2">
              ⚠️ {error}
            </div>
          )}

          {/* ACTIONS */}
          <div className="mt-12 flex flex-col md:flex-row gap-4">
            <button
              type="button"
              onClick={handleReset}
              disabled={isFormEmpty}
              className={`flex-1 py-4 rounded-2xl font-black uppercase tracking-widest flex items-center justify-center gap-2 transition-all border-2 ${
                isFormEmpty ? 'opacity-20 cursor-not-allowed' : 'hover:bg-gray-500/10 border-transparent'
              }`}
            >
              <FaUndo className="text-xs" /> Reset
            </button>
            <button
              type="submit"
              disabled={loading || isFormEmpty}
              className={`flex-[2] py-4 rounded-2xl font-black uppercase tracking-widest flex items-center justify-center gap-2 transition-all shadow-xl ${
                loading || isFormEmpty 
                ? 'bg-gray-400 cursor-not-allowed text-white' 
                : darkMode 
                  ? 'bg-[#5F7DB0] hover:bg-[#4a648c] text-white shadow-[#5F7DB0]/20' 
                  : 'bg-[#2C3E68] hover:bg-[#1a253e] text-white shadow-[#2C3E68]/20'
              }`}
            >
              {loading ? 'Processing...' : <><FaSearch className="text-xs" /> Search Books</>}
            </button>
          </div>
        </form>

        {/* TIPS */}
        <div className={`mt-12 p-8 rounded-[2rem] border transition-all ${
          darkMode ? 'bg-[#1E2740]/30 border-[#2D3748]' : 'bg-gray-100/50 border-gray-200'
        }`}>
          <h3 className="flex items-center gap-2 font-black uppercase tracking-wider text-sm mb-4">
            <FaLightbulb className="text-yellow-500" /> Search Tips
          </h3>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3 text-sm font-medium opacity-70">
            <li className="flex items-start gap-2">• Combine multiple filters for pinpoint accuracy.</li>
            <li className="flex items-start gap-2">• Partial titles like "Hobbit" will find "The Hobbit".</li>
            <li className="flex items-start gap-2">• Leave fields blank to exclude them from filters.</li>
            <li className="flex items-start gap-2">• ISBN works best with exact 10 or 13 digits.</li>
          </ul>
        </div>

      </div>
    </div>
  );
};

export default Advanced;