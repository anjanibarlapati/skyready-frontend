import './App.css'
import { Footer } from './components/footer/Footer'
import { Header } from './components/header/Header'
import { Home } from './pages/home/Home'

export function App() {
  return (
    <div className='app-container'>
      <Header/>
      <Home/>
      <Footer/>
    </div>
  )
}

