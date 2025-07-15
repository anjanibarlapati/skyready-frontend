import React from "react";
import "./FlightResult.css";

export interface Flight {
  airline_name: string;
  flight_number: string;
  departure_time: string;
  arrival_time: string;
  arrival_date_difference?: string;
  source: string;
  destination: string;
  seats: number | string;
  price: number | string;
}

interface FlightCardProps {
  flight: Flight;
}


export const FlightResult: React.FC<FlightCardProps> = ({ flight }) => {
  const formattedPrice = Number(flight.price).toLocaleString("en-IN");

  return (
      <div className="flight-card-container">
        <div className="flight-card">
          <div className="flight-details">
            <div className="flight-block-container">
              <div className="flight-icon">✈️</div>
              <div className="flight-block">
                <span className="airline-name">{flight.airline_name}</span>
                <span className="flight-number">{flight.flight_number}</span>
              </div>
            </div>

            <div className="departure-block">
              <span className="time">🛫 {flight.departure_time}</span>
              <span className="city">{flight.source}</span>
            </div>

            <div className="route-arrow">➡️</div>

            <div className="arrival-block">
              <div className="time-container">
                <span className="time">🛬 {flight.arrival_time}</span>
                {flight.arrival_date_difference && (
                  <span className="date-diff">
                    {flight.arrival_date_difference}
                  </span>
                )}
              </div>
              <span className="city">{flight.destination}</span>
            </div>

            <div className="seats-block">
              <span className="time">Seats Available</span>
              <span className="city">{flight.seats}</span>
            </div>

            <div className="flight-price">
              <span className="price-label">Price</span>
              <span className="price-value">₹ {formattedPrice}</span>
            </div>

            <div className="book-button-container">
              <button className="book-button">Book</button>
            </div>
          </div>
        </div>
      </div>
  );
};
