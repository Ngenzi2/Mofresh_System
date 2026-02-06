import { Route, Routes } from 'react-router';
import Home from '@/pages/Home';
import About from '@/pages/About';
import Login from '@/pages/Login';
import Register from '@/pages/Register';
import VerifyOTP from '@/pages/VerifyOTP';
import Dashboard from '@/pages/Dashboard';
import ForgotPassword from '@/pages/ForgotPassword';
import Cart from '@/pages/Cart';
import Contact from '@/pages/Contact';

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/about" element={<About />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/verify-otp" element={<VerifyOTP />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/cart" element={<Cart />} />
    </Routes>
  );
}

export default AppRoutes;