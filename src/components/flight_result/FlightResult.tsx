import React from "react";
import { useNavigate } from "react-router-dom";
import "./FlightResult.css";
import { convertFromINR, formatCurrency, getCurrencySymbol } from "../../utils/currencyUtils";
import { useSelector } from "react-redux";
import type { RootState } from "../../redux/store";


export interface Flight {
  flight_number: string;
  airline_name: string;
  source: string;
  destination: string;
  departure_date: string;          
  departure_time: string;
  arrival_date: string;   
  arrival_time: string;
  arrival_date_difference?: string; 
  seats: number;
  price: number;
  base_price: number;
  travellers_count: number;
  class_type: string;
}

interface FlightCardProps {
  flight: Flight;
  onSelect: ()=>void, 
  tripType: 'One Way' | 'Round'
  selected: boolean
}


export const FlightResult: React.FC<FlightCardProps> = ({ flight, onSelect, tripType, selected }) => {
  
  const {currency} = useSelector((state: RootState) => state.currency)
  const convertedPrice = convertFromINR(flight.price, currency);
  const symbol = getCurrencySymbol(currency);
  
  const navigate = useNavigate();
  const handleBook = () => {
    const basePrice = convertFromINR(flight.base_price, currency);
    navigate("/confirm-booking", { state: { flight: flight, price: convertedPrice, basePrice: basePrice, symbol: symbol, currency: currency } });
  };

  const handleCardClick = () => {
    if (tripType === 'Round') {
      onSelect();
    }
  };


  return (
      <div className="flight-card-container">
        <div className={`flight-card ${selected ? "selected-card" : ""}`} onClick={handleCardClick}>
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
              <span className="price-value"> {symbol} {formatCurrency(convertedPrice, currency)}</span>
            </div>

            {tripType === 'One Way' && <div className="book-button-container" onClick={handleBook}>
              <button className="book-button">Book</button>
            </div>
            }
          </div>
        </div>
      </div>
  );
};
