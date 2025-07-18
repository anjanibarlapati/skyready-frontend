import { useDispatch } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { FlightCard } from "../../components/FlightCard/FlightCard";
import { clearFlights, setAlert } from "../../redux/flightsSlice";
import "./ConfirmBooking.css";
import { LoadingSpinner } from "../../components/LoadingSpinner/LoadingSpinner";
import { useState } from "react";

export const ConfirmBooking = () => {
  const { state } = useLocation();
  const flight = state.flight;

  const baseFare = flight.price * flight.travellers_count;
  const taxes = (flight.price - flight.base_price) * flight.travellers_count;
  const total = flight.price * flight.travellers_count;
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
      const response = await fetch(
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
      dispatch(clearFlights());
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
          <FlightCard flight={flight} />
          <div className="fare-summary-card">
            <h2>Fare Summary</h2>

            <div className="fare-line">
              <span>Base Fare</span>
              <span>₹ {baseFare}</span>
            </div>

            <div className="fare-line">
              <span>Taxes & Fees</span>
              <span>₹ {taxes}</span>
            </div>

            <hr />

            <div className="fare-line total">
              <strong>Total</strong>
              <strong>₹ {total}</strong>
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