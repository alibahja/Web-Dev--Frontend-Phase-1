import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

function Login({ darkMode }) {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData((prevData) => ({
      ...prevData,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);

    try {
      const response = await axios.post("http://localhost:5000/api/auth/login", formData);

      if (response.data.success) {
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("user", JSON.stringify(response.data.user));
        setMessage("Welcome back! Redirecting...");

        setTimeout(() => {
          navigate("/dashboard");
        }, 700);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`min-h-screen flex items-center justify-center px-6 transition-all duration-500 ${
      darkMode ? 'bg-[#0A0F1F] text-[#F0F4FA]' : 'bg-[#F8F9FC]'
    }`}>
      
        <button onClick={()=>navigate(-1)}  className="fixed top-8 left-20 group flex items-center gap-2 mb-6 text-sm font-black uppercase tracking-widest opacity-40 hover:opacity-100 transition-all">
          <span className="group-hover:-translate-x-1 transition-transform">←</span>Back
        </button>
      
      
      {/* BACKGROUND DECORATION */}
      <div className={`fixed top-0 left-0 w-full h-full overflow-hidden pointer-events-none opacity-20`}>
        <div className={`absolute -top-24 -left-24 w-96 h-96 rounded-full blur-3xl ${darkMode ? 'bg-[#5F7DB0]' : 'bg-[#2C3E68]'}`}></div>
        <div className={`absolute -bottom-24 -right-24 w-96 h-96 rounded-full blur-3xl ${darkMode ? 'bg-[#5F7DB0]' : 'bg-[#2C3E68]'}`}></div>
      </div>

      <div className={`relative w-full max-w-md p-10 rounded-[2.5rem] border shadow-2xl transition-all animate-[zoomIn_0.4s_ease-out] ${
        darkMode ? 'bg-[#1E2740] border-[#2D3748]' : 'bg-white border-[#E2E8F0]'
      }`}>
        
        {/* LOGO / TITLE */}
        <div className="text-center mb-10">
          <h2 className={`font-serif italic font-black text-3xl tracking-tighter mb-2 ${
            darkMode ? 'text-[#5F7DB0]' : 'text-[#2C3E68]'
          }`}>
            Library
          </h2>
          <p className="text-sm font-bold uppercase tracking-[0.2em] opacity-50">
            Sign in to continue
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* EMAIL INPUT */}
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest opacity-50 ml-1">
              Email Address
            </label>
            <input
              type="email"
              name="email"
              placeholder="name@example.com"
              value={formData.email}
              onChange={handleChange}
              required
              className={`w-full px-5 py-4 rounded-2xl outline-none transition-all border ${
                darkMode 
                  ? 'bg-[#0A0F1F] border-[#2D3748] focus:border-[#5F7DB0] text-white' 
                  : 'bg-gray-50 border-gray-200 focus:border-[#2C3E68] text-[#1F2937]'
              } focus:ring-4 focus:ring-blue-500/10`}
            />
          </div>

          {/* PASSWORD INPUT */}
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest opacity-50 ml-1">
              Password
            </label>
            <input
              type="password"
              name="password"
              placeholder="••••••••"
              value={formData.password}
              onChange={handleChange}
              required
              className={`w-full px-5 py-4 rounded-2xl outline-none transition-all border ${
                darkMode 
                  ? 'bg-[#0A0F1F] border-[#2D3748] focus:border-[#5F7DB0] text-white' 
                  : 'bg-gray-50 border-gray-200 focus:border-[#2C3E68] text-[#1F2937]'
              } focus:ring-4 focus:ring-blue-500/10`}
            />
          </div>

          {/* MESSAGES */}
          {message && <p className="text-emerald-500 text-xs font-bold text-center animate-pulse">{message}</p>}
          {error && <p className="text-red-500 text-xs font-bold text-center animate-bounce">{error}</p>}

          {/* SUBMIT BUTTON */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-4 rounded-2xl font-black text-sm uppercase tracking-widest text-white shadow-xl transition-all hover:-translate-y-1 active:scale-95 disabled:opacity-50 ${
              darkMode ? 'bg-[#5F7DB0]' : 'bg-[#2C3E68]'
            }`}
          >
            {loading ? "Verifying..." : "Sign In"}
          </button>
        </form>

        {/* FOOTER */}
        <div className="mt-8 text-center">
          <p className="text-sm font-medium opacity-60">
            Don’t have an account?{" "}
            <Link 
              to="/register" 
              className={`font-black hover:underline transition-all ${darkMode ? 'text-[#5F7DB0]' : 'text-[#2C3E68]'}`}
            >
              Register
            </Link>
          </p>
        </div>
      </div>

     
    </div>
  );
}

export default Login;