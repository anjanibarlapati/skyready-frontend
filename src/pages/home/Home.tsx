import { AboutUs } from "../../components/AboutUs/AboutUs";
import { ImageSlider } from "../../components/ImageSlider/ImageSlider";
import { Search } from "../../components/search/Search";
import "./Home.css";

export const Home = () => {
  return (
    <div className="home-container" data-testid="home">
      <ImageSlider/>
      <Search />
      <AboutUs/>
    </div>
  );
};
