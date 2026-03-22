import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { BookVerseShell, Pill, PrimaryButton, SecondaryButton, Surface } from "../components/BookVerseUI";
import { useBookVerse } from "../context/BookVerseContext";

function Login({ darkMode, setDarkMode }) {
  const navigate = useNavigate();
  const { refreshCurrentUser } = useBookVerse();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});

  const handleChange = (event) => {
    setFieldErrors((prev) => ({ ...prev, [event.target.name]: "" }));
    setFormData((prev) => ({ ...prev, [event.target.name]: event.target.value }));
  };

  const validateForm = () => {
    const nextErrors = {};
    if (!/\S+@\S+\.\S+/.test(formData.email)) nextErrors.email = "Enter a valid email address.";
    if (!formData.password.trim()) nextErrors.password = "Password is required.";
    setFieldErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setMessage("");
    if (!validateForm()) return;
    setLoading(true);

    try {
      const response = await axios.post("http://localhost:5000/api/auth/login", formData);
      if (response.data.success) {
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("user", JSON.stringify(response.data.user));
        refreshCurrentUser();
        setMessage("Welcome back to BookVerse. Redirecting...");
        setTimeout(() => navigate("/profile"), 700);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Unable to sign in right now.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <BookVerseShell darkMode={darkMode} setDarkMode={setDarkMode} title="BookVerse" subtitle="Login" compact>
      <div className="mx-auto max-w-6xl">
        <div className="grid gap-8 lg:grid-cols-[1.02fr_0.98fr] lg:items-stretch">
          <Surface className="bookverse-auth-panel p-7 sm:p-10">
            <div className="space-y-6">
              <Pill>Welcome back</Pill>
              <h1 className="font-display text-4xl leading-tight text-slate-900 sm:text-5xl">
                Continue your reading journey.
              </h1>
              <p className="max-w-xl text-sm leading-7 text-slate-700 sm:text-base">
                Sign in to access your shelves, reader identity, streak progress, and active competitions.
              </p>

              <div className="grid gap-3 sm:grid-cols-3">
                <div className="rounded-3xl border border-slate-900/10 bg-white/85 px-4 py-4">
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Tracking</p>
                  <p className="mt-2 text-sm font-semibold text-slate-900">XP and streaks</p>
                </div>
                <div className="rounded-3xl border border-slate-900/10 bg-white/85 px-4 py-4">
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Library</p>
                  <p className="mt-2 text-sm font-semibold text-slate-900">Curated shelves</p>
                </div>
                <div className="rounded-3xl border border-slate-900/10 bg-white/85 px-4 py-4">
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Challenges</p>
                  <p className="mt-2 text-sm font-semibold text-slate-900">Live competitions</p>
                </div>
              </div>

              <div className="flex flex-wrap gap-3">
                <SecondaryButton to="/register">Create account</SecondaryButton>
                <SecondaryButton to="/personas">Reader identities</SecondaryButton>
              </div>
            </div>
          </Surface>

          <Surface className="p-6 sm:p-8">
            <div className="mb-6">
              <p className="bookverse-form-label text-xs font-semibold uppercase text-slate-500">Secure Access</p>
              <h2 className="font-display mt-2 text-3xl text-slate-900">Sign in to BookVerse</h2>
              <p className="mt-2 text-sm text-slate-600">Use your account credentials to enter your dashboard.</p>
            </div>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="bookverse-form-label text-xs font-semibold uppercase text-slate-500">Email</label>
                <input
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="reader@bookverse.app"
                  className="mt-2 w-full rounded-[1.3rem] border border-slate-900/10 bg-white/92 px-4 py-4 text-slate-900 outline-none"
                />
                {fieldErrors.email ? <p className="mt-2 text-sm text-rose-600">{fieldErrors.email}</p> : null}
              </div>
              <div>
                <label className="bookverse-form-label text-xs font-semibold uppercase text-slate-500">Password</label>
                <input
                  name="password"
                  type="password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  className="mt-2 w-full rounded-[1.3rem] border border-slate-900/10 bg-white/92 px-4 py-4 text-slate-900 outline-none"
                />
                {fieldErrors.password ? <p className="mt-2 text-sm text-rose-600">{fieldErrors.password}</p> : null}
              </div>

              {message ? <p className="text-sm font-semibold text-emerald-600">{message}</p> : null}
              {error ? <p className="text-sm font-semibold text-rose-600">{error}</p> : null}

              <PrimaryButton className={`w-full ${loading ? "cursor-not-allowed opacity-70" : ""}`} disabled={loading}>
                {loading ? "Opening the library..." : "Sign In"}
              </PrimaryButton>
            </form>
            <p className="mt-6 text-sm text-slate-600">
              New here?{" "}
              <Link to="/register" className="font-semibold text-slate-900 underline-offset-4 hover:underline">
                Create your BookVerse account
              </Link>
            </p>
          </Surface>
        </div>
      </div>
    </BookVerseShell>
  );
}

export default Login;
