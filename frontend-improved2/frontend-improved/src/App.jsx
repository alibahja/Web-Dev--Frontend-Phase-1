import { useEffect, useState } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './App.css'
import Home from './pages/Home'
import DisplayBooks from './pages/DisplayBooks'
import BookDetail from './pages/BookDetail'
import Comments from './pages/Comments'
import DisplayComm from './pages/DisplayComm'
import CommDetails from './pages/CommDetails'
import Login from './pages/Login'
import Register from './pages/Register'
import Settings from './pages/Settings'
import Profile from './pages/Profile'
import Advanced from './pages/Advanced'
import Admin from './pages/Admin'
import CharacterSelection from './pages/CharacterSelection'
import Competitions from './pages/Competitions'
import CompetitionDetail from './pages/CompetitionDetail'
import { BookVerseProvider } from './context/BookVerseContext'
import { BookVerseShell, PrimaryButton, Surface } from './components/BookVerseUI'

function NotFound({ darkMode, setDarkMode }) {
  return (
    <BookVerseShell darkMode={darkMode} setDarkMode={setDarkMode} title="BookVerse" subtitle="Page Not Found" compact>
      <Surface className="mx-auto max-w-2xl p-8 text-center sm:p-10">
        <h1 className="font-display text-4xl text-slate-900 sm:text-5xl">This page is not on the shelf.</h1>
        <p className="mt-4 text-base leading-8 text-slate-600">
          The path you opened does not exist in BookVerse yet. You can return to the main library and keep exploring.
        </p>
        <div className="mt-8 flex justify-center">
          <PrimaryButton to="/">Return to Library</PrimaryButton>
        </div>
      </Surface>
    </BookVerseShell>
  )
}

function App() {
  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window === 'undefined') return false
    return window.localStorage.getItem('bookverse.darkMode') === 'true'
  });

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
    window.localStorage.setItem('bookverse.darkMode', String(darkMode));
  }, [darkMode]);

  return (
    <BookVerseProvider>
      <BrowserRouter>
        <Routes>
        
        <Route path="/" element={<Home darkMode={darkMode} setDarkMode={setDarkMode} />} />
        
        <Route path="/search" element={<DisplayBooks darkMode={darkMode} setDarkMode={setDarkMode} />} />

        <Route path="/book/:id" element={<BookDetail darkMode={darkMode} setDarkMode={setDarkMode} />} />

        <Route path="/comments/book/:id" element={<Comments darkMode={darkMode} setDarkMode={setDarkMode} />} />
        
        <Route path="/groups" element={<DisplayComm darkMode={darkMode} setDarkMode={setDarkMode} />} />

        <Route path="/groups/:id" element={<CommDetails darkMode={darkMode} setDarkMode={setDarkMode} />} />
        
        <Route path="/comments/groups/:id" element={<Comments darkMode={darkMode} setDarkMode={setDarkMode} />} />
      
        <Route path="*" element={<NotFound darkMode={darkMode} setDarkMode={setDarkMode} />} />

         <Route path="/login" element={<Login  darkMode={darkMode} setDarkMode={setDarkMode} />} />
        <Route path="/register" element={<Register darkMode={darkMode} setDarkMode={setDarkMode} />} />

        <Route path="/profile" element={<Profile darkMode={darkMode} setDarkMode={setDarkMode} />} />

        <Route path="/settings" element={<Settings darkMode={darkMode} setDarkMode={setDarkMode} />} 
         />

         <Route path="/advanced" element={<Advanced darkMode={darkMode} setDarkMode={setDarkMode} />} />

        <Route path="/admin" element={<Admin darkMode={darkMode} setDarkMode={setDarkMode} />} />
        <Route path="/personas" element={<CharacterSelection darkMode={darkMode} setDarkMode={setDarkMode} />} />
        <Route path="/competitions" element={<Competitions darkMode={darkMode} setDarkMode={setDarkMode} />} />
        <Route path="/competitions/:id" element={<CompetitionDetail darkMode={darkMode} setDarkMode={setDarkMode} />} />
        
        </Routes>
      </BrowserRouter>
    </BookVerseProvider>
  )
}

export default App
