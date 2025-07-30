import { useDispatch, useSelector } from "react-redux";
import { AboutUs } from "../../components/AboutUs/AboutUs";
import { ImageSlider } from "../../components/ImageSlider/ImageSlider";
import { Search } from "../../components/search/Search";
import "./Home.css";
import type { RootState } from "../../redux/store";
import { type Flight, FlightResult } from "../../components/flight_result/FlightResult";
import { useEffect, useState } from "react";
import { clearAlert, setAlert } from "../../redux/flightsSlice";
import { DateNavigator } from "../../components/DateNavigator/DateNavigator";
import { LoadingSpinner } from "../../components/LoadingSpinner/LoadingSpinner";
import { convertFromINR, getCurrencySymbol } from "../../utils/currencyUtils";
import { useNavigate } from "react-router-dom";

export const Home = () => {
  const {  alert, loading, searchData } = useSelector((state: RootState) => state.flights);
  const {  currency} = useSelector((state: RootState) => state.currency);

  const {departureFlights, departureMessage, departureError} = useSelector((state: RootState) => state.departureFlights);
  const {returnFlights, returnMessage, returnError} = useSelector((state: RootState) => state.returnFlights);
  const [showBookingAlert, setShowBookingAlert] = useState(false);
  const dispatch = useDispatch();
  const [selectedDirection, setSelectedDirection] = useState<"departure" | "return">("departure");
  const [departureFlight, setDepartureFlight] = useState<Flight>();
  const [returnFlight, setReturnFlight] = useState<Flight>();

  const navigate = useNavigate();
  const symbol = getCurrencySymbol(currency);

  useEffect(() => {
    if (alert?.message) {
      setShowBookingAlert(true);
    }
  }, [alert]);


  const handleDepartureFlight = (flight: Flight) =>{
    if(departureFlight?.flight_number === flight.flight_number) {
        setDepartureFlight(undefined);
    } else{
      setDepartureFlight(flight);
    }
  }


  const handleReturnFlight = (flight: Flight) =>{
    if(returnFlight?.flight_number === flight.flight_number) {
        setReturnFlight(undefined);
    } else {
      setReturnFlight(flight);
    }
  }

  const handleBook = async () =>{
      if(!departureFlight || !returnFlight){
        return;
      }

      if (!((new Date(searchData.returnDate!) > new Date(searchData.departureDate)) && (departureFlight.arrival_time < returnFlight.departure_time))) {
        dispatch(setAlert({ type: "failure", message: "Return flight cannot be before departure flight" }));
        return;
      }
      const convertedPrice = convertFromINR(departureFlight.price, currency);
      const basePrice = convertFromINR(departureFlight.base_price, currency);
      const convertedReturnFlightPrice = convertFromINR(returnFlight.price, currency);
      const returnFlightBasePrice = convertFromINR(returnFlight.base_price, currency);
      const bookingData = { 
          flight: departureFlight,
          price: convertedPrice,
          basePrice: basePrice, 
          symbol: symbol, currency: 
          currency, returnFlight: returnFlight, 
          returnFlightPrice: convertedReturnFlightPrice, 
          returnFlightBasePrice: returnFlightBasePrice 
        }
      navigate("/confirm-booking", { state: bookingData });
  }

  const shouldShowDepartureFlightResults = departureFlights.length > 0 || departureMessage || departureError || loading;
  const shouldShowDepartureDateNavigator = departureFlights.length > 0 || departureMessage || loading ? true : false;
  const shouldShowReturnFlightResults = returnFlights.length > 0 || returnMessage || returnError || loading;
  const shouldShowReturnDateNavigator = returnFlights.length > 0 || returnMessage || loading ? true : false;


  return (
    <div className="home-container">
      {showBookingAlert && (
        <div className="modal-overlay">
          <div className={`modal-content`}>
            <p>{alert?.message}</p>
            <button className={`modal-content-button ${alert?.type === "success" ? "success" : "failure"}`} onClick={() => {
              setShowBookingAlert(false);
              dispatch(clearAlert());
            }}>
              OK
            </button>
          </div>
        </div>
      )}
      <ImageSlider/>
      <Search />

      {(departureFlights.length > 0 || departureMessage || departureError) && (returnFlights.length > 0 || returnMessage || returnError) && <div className="flight-tabs">
            <button
              className={`tab ${selectedDirection === "departure" ? "active" : ""}`}
              onClick={() => setSelectedDirection("departure")}
            >
              {searchData.source} <span className="arrow"/> {searchData.destination}
            </button>
            <button
              className={`tab ${selectedDirection === "return" ? "active" : ""}`}
              onClick={() => setSelectedDirection("return")}
            >
              {searchData.destination} <span className="arrow"/> {searchData.source}
            </button>
          </div>
      } 
      {selectedDirection === 'departure'? 
        ( shouldShowDepartureFlightResults && <div id="flight-results" className="flight-results-container">
          {shouldShowDepartureDateNavigator && <DateNavigator type="departure" />}
          {loading && <LoadingSpinner/>}
          {departureFlights.length > 0 ? (
            <>
              <h2>Available Flights</h2>
              {departureFlights.map((flight, index) => (
                <FlightResult key={index} flight={flight} selected={departureFlight?.flight_number === flight.flight_number}  tripType={searchData.tripType} onSelect={()=>{handleDepartureFlight(flight)}}/>
              ))}
            </>
          ) : (
            <>
          <p>{departureMessage|| departureError}</p>
          </>
          )}
        </div>
        ) :
        ( shouldShowReturnFlightResults && <div id="flight-results" className="flight-results-container">
          {shouldShowReturnDateNavigator && <DateNavigator type='return'/>}
          {loading && <LoadingSpinner/>}
          {returnFlights.length > 0 ? (
            <>
              <h2>Available Flights</h2>
              {returnFlights.map((flight, index) => (
                <FlightResult key={index} flight={flight} selected={returnFlight?.flight_number === flight.flight_number} tripType={searchData.tripType} onSelect={()=>{handleReturnFlight(flight)}}/>
              ))}
            </>
          ) : (
            <>
          <p>{returnMessage|| returnError}</p>
          </>
          )}
          <div className="book-container" >
              <button className="book-button" onClick={handleBook} disabled={!departureFlight || !returnFlight}>Book</button>
          </div>
        </div>
        )
      }
      
      <AboutUs/>
    </div>
  );
};
