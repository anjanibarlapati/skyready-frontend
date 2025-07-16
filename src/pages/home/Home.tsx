import { useDispatch, useSelector } from "react-redux";
import { AboutUs } from "../../components/AboutUs/AboutUs";
import { ImageSlider } from "../../components/ImageSlider/ImageSlider";
import { Search } from "../../components/search/Search";
import "./Home.css";
import type { RootState } from "../../redux/store";
import { FlightResult } from "../../components/flight_result/FlightResult";
import { useEffect, useState } from "react";
import { clearAlert } from "../../redux/flightsSlice";

export const Home = () => {
  const { flights, message, alert } = useSelector((state: RootState) => state.flights);
  const [showBookingAlert, setShowBookingAlert] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    if (alert?.message) {
      setShowBookingAlert(true);
      const timer = setTimeout(() => {
        setShowBookingAlert(false);
        dispatch(clearAlert());
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [alert, dispatch]);

  return (
    <div className="home-container">
      {showBookingAlert && (
        <div className={`alert ${alert?.type === 'success' ? 'alert-success': 'alert-failure'}`}>
          {alert?.message}
        </div>
      )}
      <ImageSlider/>
      <Search />
      { ( flights.length > 0 || message ) && <div id="flight-results" className="flight-results-container">
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
