import { AboutUs } from "../../components/AboutUs/AboutUs"
import "./Home.css"

export const Home = () => {
  return (
    <div className="home-container" data-testid="home">
      <AboutUs/>
    </div>
  )
}

