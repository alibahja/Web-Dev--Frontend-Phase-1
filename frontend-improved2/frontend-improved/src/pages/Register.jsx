import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { BookVerseShell, Pill, PrimaryButton, SecondaryButton, Surface } from "../components/BookVerseUI";

function Register({ darkMode, setDarkMode }) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "student",
  });
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
    if (!formData.full_name.trim()) nextErrors.full_name = "Full name is required.";
    if (!/\S+@\S+\.\S+/.test(formData.email)) nextErrors.email = "Enter a valid email address.";
    if (formData.password.length < 8) nextErrors.password = "Password must be at least 8 characters.";
    if (formData.password !== formData.confirmPassword) nextErrors.confirmPassword = "Passwords do not match.";
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
      const response = await axios.post("http://localhost:5000/api/auth/register", {
        full_name: formData.full_name,
        email: formData.email,
        password: formData.password,
        role: formData.role,
      });

      if (response.data.success) {
        setMessage("Account created. Redirecting to login...");
        setTimeout(() => navigate("/login"), 900);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Unable to create account right now.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <BookVerseShell darkMode={darkMode} setDarkMode={setDarkMode} title="BookVerse" subtitle="Register" compact>
      <div className="mx-auto max-w-6xl">
        <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <Surface className="bookverse-auth-panel p-7 sm:p-10">
          <div className="space-y-5">
            <Pill>New reader identity</Pill>
            <h1 className="font-display text-4xl leading-tight text-slate-900 sm:text-5xl">
              Create your BookVerse account.
            </h1>
            <p className="max-w-xl text-sm leading-7 text-slate-700 sm:text-base">
              Start tracking progress, join competitions, and build your reader profile.
            </p>
            <div className="flex flex-wrap gap-3">
              <SecondaryButton to="/personas">Explore reader personas</SecondaryButton>
              <SecondaryButton to="/competitions">See competition mode</SecondaryButton>
            </div>
          </div>
          </Surface>

          <Surface className="p-6 sm:p-8">
            <div className="mb-6">
              <p className="bookverse-form-label text-xs font-semibold uppercase text-slate-500">Account Setup</p>
              <h2 className="font-display mt-2 text-3xl text-slate-900">Register</h2>
              <p className="mt-2 text-sm text-slate-600">Complete the form to create your profile.</p>
            </div>
            <form onSubmit={handleSubmit} className="grid gap-5 md:grid-cols-2">
              <div className="md:col-span-2">
                <label className="bookverse-form-label text-xs font-semibold uppercase text-slate-500">Full Name</label>
                <input name="full_name" value={formData.full_name} onChange={handleChange} required className="mt-2 w-full rounded-[1.3rem] border border-slate-900/10 bg-white/92 px-4 py-4 text-slate-900 outline-none" />
                {fieldErrors.full_name ? <p className="mt-2 text-sm text-rose-600">{fieldErrors.full_name}</p> : null}
              </div>
              <div className="md:col-span-2">
                <label className="bookverse-form-label text-xs font-semibold uppercase text-slate-500">Email</label>
                <input name="email" type="email" value={formData.email} onChange={handleChange} required className="mt-2 w-full rounded-[1.3rem] border border-slate-900/10 bg-white/92 px-4 py-4 text-slate-900 outline-none" />
                {fieldErrors.email ? <p className="mt-2 text-sm text-rose-600">{fieldErrors.email}</p> : null}
              </div>
              <div>
                <label className="bookverse-form-label text-xs font-semibold uppercase text-slate-500">Password</label>
                <input name="password" type="password" value={formData.password} onChange={handleChange} required className="mt-2 w-full rounded-[1.3rem] border border-slate-900/10 bg-white/92 px-4 py-4 text-slate-900 outline-none" />
                {fieldErrors.password ? <p className="mt-2 text-sm text-rose-600">{fieldErrors.password}</p> : null}
              </div>
              <div>
                <label className="bookverse-form-label text-xs font-semibold uppercase text-slate-500">Confirm Password</label>
                <input name="confirmPassword" type="password" value={formData.confirmPassword} onChange={handleChange} required className="mt-2 w-full rounded-[1.3rem] border border-slate-900/10 bg-white/92 px-4 py-4 text-slate-900 outline-none" />
                {fieldErrors.confirmPassword ? <p className="mt-2 text-sm text-rose-600">{fieldErrors.confirmPassword}</p> : null}
              </div>
              <div className="md:col-span-2">
                <label className="bookverse-form-label text-xs font-semibold uppercase text-slate-500">Role</label>
                <select name="role" value={formData.role} onChange={handleChange} className="mt-2 w-full rounded-[1.3rem] border border-slate-900/10 bg-white/92 px-4 py-4 text-slate-900 outline-none">
                  <option value="student">Student</option>
                  <option value="librarian">Librarian</option>
                  <option value="admin">Admin</option>
                </select>
              </div>

              {message ? <p className="md:col-span-2 text-sm font-semibold text-emerald-600">{message}</p> : null}
              {error ? <p className="md:col-span-2 text-sm font-semibold text-rose-600">{error}</p> : null}

              <div className="md:col-span-2">
                <PrimaryButton className={`w-full ${loading ? "cursor-not-allowed opacity-70" : ""}`} disabled={loading}>
                  {loading ? "Binding your library card..." : "Create Account"}
                </PrimaryButton>
              </div>
            </form>
            <p className="mt-6 text-sm text-slate-600">
              Already registered?{" "}
              <Link to="/login" className="font-semibold text-slate-900 underline-offset-4 hover:underline">
                Sign in here
              </Link>
            </p>
          </Surface>
        </div>
      </div>
    </BookVerseShell>
  );
}

export default Register;
