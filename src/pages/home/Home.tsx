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
  const {  alert, loading } = useSelector((state: RootState) => state.flights);
  const {departureFlights, departureMessage, departureError} = useSelector((state: RootState) => state.departureFlights);
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

  const shouldShowDepartureFlightResults = departureFlights.length > 0 || departureMessage || departureError || loading;
  const shouldShowDepartureDateNavigator = departureFlights.length > 0 || departureMessage || loading ? true : false;

  return (
    <div className="home-container">
      {showBookingAlert && (
        <div className={`alert ${alert?.type === 'success' ? 'alert-success': 'alert-failure'}`}>
          {alert?.message}
        </div>
      )}
      <ImageSlider/>
      <Search />
      { shouldShowDepartureFlightResults && <div id="flight-results" className="flight-results-container">
        {shouldShowDepartureDateNavigator && <DateNavigator />}
        {loading && <LoadingSpinner/>}
        {departureFlights.length > 0 ? (
          <>
            <h2>Available Flights</h2>
            {departureFlights.map((flight, index) => (
              <FlightResult key={index} flight={flight} />
            ))}
          </>
        ) : (
          <>
        <p>{departureMessage|| departureError}</p>
      </>
        )}
      </div>}
      <AboutUs/>
    </div>
  );
};
