import { Route, Routes } from 'react-router-dom'
import './App.css'
import { Footer } from './components/footer/Footer'
import { Header } from './components/header/Header'
import { Home } from './pages/home/Home'
import { ConfirmBooking } from './pages/confirmBooking/ConfirmBooking'

export function App() {
  return (
    <div className='app-container'>
      <Header/>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/confirm-booking" element={<ConfirmBooking />} />
        </Routes>
      <Footer/>
    </div>
  )
}

