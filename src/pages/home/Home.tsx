import { useSelector } from "react-redux";
import { AboutUs } from "../../components/AboutUs/AboutUs";
import { ImageSlider } from "../../components/ImageSlider/ImageSlider";
import { Search } from "../../components/search/Search";
import "./Home.css";
import type { RootState } from "../../redux/store";
import { FlightResult } from "../../components/flight_result/FlightResult";

export const Home = () => {
  const { flights, message } = useSelector((state: RootState) => state.flights);

  return (
    <div className="home-container" data-testid="home">
      <ImageSlider/>
      <Search />
      { ( flights.length > 0 || message ) && <div className="flight-results-container">
        {flights.length > 0 ? (
          <>
            <h2>Available Flights</h2>
            {flights.map((flight, index) => (
              <FlightResult key={index} flight={flight} />
            ))}
          </>
        ) : (
          <p>{message}</p>
        )}
      </div>}
      <AboutUs/>
    </div>
  );
};
