import './App.css'
import { Routes, Route } from 'react-router'
import Home from './pages/Home/Home'
import MainLayout from './pages/layouts/MainLayout'


function App() {
  return (
    <>
    <Routes>
      <Route element={<MainLayout />}>
        <Route index element={<Home />} />
      </Route>
    </Routes>
    </>
  )
}

export default App
