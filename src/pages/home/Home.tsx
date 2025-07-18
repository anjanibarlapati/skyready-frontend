import { useDispatch, useSelector } from "react-redux";
import { AboutUs } from "../../components/AboutUs/AboutUs";
import { ImageSlider } from "../../components/ImageSlider/ImageSlider";
import { Search } from "../../components/search/Search";
import "./Home.css";
import type { RootState } from "../../redux/store";
import { FlightResult } from "../../components/flight_result/FlightResult";
import { useEffect, useState } from "react";
import { clearAlert } from "../../redux/flightsSlice";
import { DateNavigator } from "../../components/DateNavigator/DateNavigator";
import { LoadingSpinner } from "../../components/LoadingSpinner/LoadingSpinner";

export const Home = () => {
  const { flights, message, alert, error, loading } = useSelector((state: RootState) => state.flights);
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

  const shouldShowFlightResults = flights.length > 0 || message || error || loading;
  const shouldShowDateNavigator = flights.length > 0 || message || loading ? true : false;

  return (
    <div className="home-container">
      {showBookingAlert && (
        <div className={`alert ${alert?.type === 'success' ? 'alert-success': 'alert-failure'}`}>
          {alert?.message}
        </div>
      )}
      <ImageSlider/>
      <Search />
      { shouldShowFlightResults && <div id="flight-results" className="flight-results-container">
        {shouldShowDateNavigator && <DateNavigator />}
        {loading && <LoadingSpinner/>}
        {flights.length > 0 ? (
          <>
            <h2>Available Flights</h2>
            {flights.map((flight, index) => (
              <FlightResult key={index} flight={flight} />
            ))}
          </>
        ) : (
          <>
        <p>{message || error}</p>
      </>
        )}
      </div>}
      <AboutUs/>
    </div>
  );
};
