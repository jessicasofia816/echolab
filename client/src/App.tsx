import './App.css'
import { Routes, Route } from 'react-router'
import Home from './pages/Home/Home'
import MainLayout from './pages/layouts/MainLayout'
import About from './pages/About/About'
import ProductListingPage from './pages/ProductListingPage/ProductListingPage'
import ProductDetailPage from './pages/ProductDetailPage/ProductDetailPage'
import CartPage from './pages/CartPage/CartPage'
import AuthPage from './pages/AuthPage/AuthPage'
import AccountPage from './pages/AccountPage/AccountPage'


function App() {
  return (
    <>
    <Routes>
      <Route element={<MainLayout />}>
        <Route index element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/products" element={<ProductListingPage />} />
        <Route path="/products/:id" element={<ProductDetailPage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/account" element={<AccountPage />} />
      </Route>
    </Routes>
    </>
  )
}

export default App
