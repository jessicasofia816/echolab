import './App.css'
import { Routes, Route } from 'react-router'
import Home from './pages/Home/Home'
import MainLayout from './pages/layouts/MainLayout'
import About from './pages/About/About'


function App() {
  return (
    <>
    <Routes>
      <Route element={<MainLayout />}>
        <Route index element={<Home />} />
        <Route path="/about" element={<About />} />
      </Route>
    </Routes>
    </>
  )
}

export default App
