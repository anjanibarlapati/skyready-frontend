import { Footer } from "../../components/footer/Footer";
import { Search } from "../../components/search/Search";
import "./Home.css";
export const Home = () => {
  return (
    <div className="home-container">
      <Search />
      <Footer />
    </div>
  );
};
