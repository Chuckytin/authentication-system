import { ToastContainer } from 'react-toastify'
import { Routes, Route } from 'react-router-dom'
import './App.css'
import Home from './pages/Home'
import Login from './pages/Login'
import EmailVerify from './pages/EmailVerify'
import ResetPassword from './pages/ResetPassword'

/**
 * Componente principal de la aplicación que configura el enrutamiento y la estructura base.
 */
const App = () => {
  return (
    <div>
      <ToastContainer />
      
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/email-verify" element={<EmailVerify />} />
        <Route path="/reset-password" element={<ResetPassword />} />
      </Routes>
    </div> 
  )
}

export default App
