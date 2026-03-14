import { useState } from 'react'
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

function App() {
  const [darkMode, setDarkMode] = useState(false);

  return (
    <BrowserRouter>
    
      
      <Routes>
        
        <Route path="/" element={<Home darkMode={darkMode} setDarkMode={setDarkMode} />} />
        
        <Route path="/search" element={<DisplayBooks darkMode={darkMode} setDarkMode={setDarkMode} />} />

        <Route path="/book/:id" element={<BookDetail darkMode={darkMode} setDarkMode={setDarkMode} />} />

        <Route path="/comments/book/:id" element={<Comments darkMode={darkMode} setDarkMode={setDarkMode} />} />
        
        <Route path="/groups" element={<DisplayComm darkMode={darkMode} setDarkMode={setDarkMode} />} />

        <Route path="/groups/:id" element={<CommDetails darkMode={darkMode} setDarkMode={setDarkMode} />} />
        
        <Route path="/comments/groups/:id" element={<Comments darkMode={darkMode} setDarkMode={setDarkMode} />} />
      
        <Route path="*" element={<div className="pt-20 text-center">Page Not Found</div>} />

         <Route path="/login" element={<Login  darkMode={darkMode} setDarkMode={setDarkMode} />} />
        <Route path="/register" element={<Register darkMode={darkMode} setDarkMode={setDarkMode} />} />

        <Route path="/profile" element={<Profile darkMode={darkMode} setDarkMode={setDarkMode} />} />

        <Route path="/settings" element={<Settings darkMode={darkMode} setDarkMode={setDarkMode} />} 
         />

         <Route path="/advanced" element={<Advanced darkMode={darkMode} setDarkMode={setDarkMode} />} />
        
      </Routes>
    </BrowserRouter>
  )
}

export default App