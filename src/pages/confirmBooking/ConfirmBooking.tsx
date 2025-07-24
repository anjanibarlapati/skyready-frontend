import { useDispatch } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { FlightCard } from "../../components/FlightCard/FlightCard";
import { setAlert } from "../../redux/flightsSlice";
import "./ConfirmBooking.css";
import { LoadingSpinner } from "../../components/LoadingSpinner/LoadingSpinner";
import { useState } from "react";
import { formatCurrency } from "../../utils/currencyUtils";
import { clearDepartureFlights } from "../../redux/departureFlightsSlice";
import type { Flight } from "../../components/flight_result/FlightResult";
import { clearReturnFlights } from "../../redux/returnFlightsSlice";

type ConfirmBookingNavigationProps = {
  flight: Flight;
  price: number;
  basePrice: number;
  symbol: string;
  currency: string;
  returnFlight?: Flight;
  returnFlightPrice?: number;
  returnFlightBasePrice?: number;
}

export const ConfirmBooking = () => {
    const location = useLocation();
    const { flight, price, basePrice, symbol, currency, returnFlight, returnFlightPrice, returnFlightBasePrice }: ConfirmBookingNavigationProps= location.state;

  const baseFare =  basePrice * flight.travellers_count + (returnFlightBasePrice ? returnFlightBasePrice * flight.travellers_count: 0);
  const taxes = (price - basePrice) * flight.travellers_count + (returnFlightPrice && returnFlightBasePrice ? (returnFlightPrice - returnFlightBasePrice) * flight.travellers_count: 0);
  let total = price * flight.travellers_count + (returnFlightPrice ? returnFlightPrice * flight.travellers_count: 0);
  const discount = returnFlight ? (total * 0.05) : 0;
  if(discount) {
    total = total - discount;
  }

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleConfirmBooking = async () => {
    setLoading(true);
    const payload = {
      flight: {
        flight_number: flight.flight_number,
        departure_date: `${flight.departure_date} ${flight.departure_time}:00`,
        class_type: flight.class_type,
        travellers_count: flight.travellers_count,
      },
    };
    try {
      const response = returnFlight ?  await fetch(
        `${import.meta.env.VITE_BASE_URL}/api/v1/flights/confirm-round-trip`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify( {
            data: {
              departure_flight_number: flight.flight_number,
              departure_date: `${flight.departure_date} ${flight.departure_time}:00`,
              return_flight_number: returnFlight.flight_number,
              return_date: `${returnFlight.departure_date} ${returnFlight.departure_time}:00`,
              class_type: flight.class_type,
              travellers_count: flight.travellers_count,
            }
        }),
        }
      ):   await fetch(
        `${import.meta.env.VITE_BASE_URL}/api/v1/flights/confirm-booking`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      const result = await response.json();
      if (response.ok) {
        dispatch(
          setAlert({
            type: "success",
            message: "🎉 Booking confirmed successfully!",
          })
        );
      } else {
        dispatch(
          setAlert({ type: "failure", message: `❌ ${result.message}` })
        );
      }
    } 
    catch {
      dispatch(
        setAlert({
          type: "failure",
          message: "❌ Network error. Please try again.",
        })
      );
    } 
    finally {
      dispatch(clearDepartureFlights());
      dispatch(clearReturnFlights());
      setLoading(false);
      navigate("/");
    }
  };

  return (
    <div className="booking-page">

      {loading &&<div className="loading-container">
        <LoadingSpinner />
       </div>
       }
      <div className={`booking-content ${loading ? "blurred" : ""}`}>
        <div className="booking-header">
          <h1>Confirm Your Flight</h1>
        </div>

        <div className="booking-details-container">
          <FlightCard flight={flight} symbol={symbol} price={price} currency={currency}/>
          {returnFlight && returnFlightPrice && <FlightCard flight={returnFlight} symbol={symbol} price={returnFlightPrice} currency={currency}/>}

          <div className="fare-summary-card">
            <h2>Fare Summary</h2>

            <div className="fare-line">
              <span>Base Fare</span>
              <span>{symbol} {formatCurrency(baseFare, currency)}</span>
            </div>

            <div className="fare-line">
              <span>Taxes & Fees</span>
              <span>{symbol} {formatCurrency(taxes, currency)}</span>
            </div>

            {discount >0 && <div className="fare-line">
              <span>Discount</span>
              <span>{symbol} {formatCurrency(discount, currency)}</span>
            </div>}

            <hr />

            <div className="fare-line total">
              <strong>Total</strong>
              <strong>{symbol} {formatCurrency(total, currency)}</strong>
            </div>
          </div>
        </div>

        <div className="booking-actions">
          <button className="confirm-button" onClick={handleConfirmBooking}>
            Confirm Booking
          </button>
        </div>
      </div>
    </div>
  );
};