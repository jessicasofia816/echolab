import './App.css'
import { Routes, Route } from 'react-router'
import Home from './pages/Home/Home'


function App() {
  return (
    <>
      <Routes>
        <Route index element={<Home />} />
      </Routes>
    </>
  )
}

export default App
