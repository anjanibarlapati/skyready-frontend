import  "./FlightCard.css";
import type { Flight } from "../flight_result/FlightResult";
import { journeyDuration } from "../../utils/journeyDuration";
import { useEffect, useState } from "react";
import line from '../../assets/line-segment.png';
import { formatCurrency } from "../../utils/currencyUtils";


type FlightCardProps = {
  flight: Flight;
  symbol: string,
  price: number,
  currency: string,
};

const formatDate = (dateStr: string) => {
  const options: Intl.DateTimeFormatOptions = {
    day: "2-digit",
    month: "short",
  };
  return new Date(dateStr).toLocaleDateString("en-IN", options);
};

export const FlightCard = ({ flight, symbol, price, currency }: FlightCardProps) => {

  const [duration, setDuration] = useState("");

  useEffect(() => {
    const result = journeyDuration(
      flight.departure_date,
      flight.departure_time,
      flight.arrival_date,
      flight.arrival_time
    );
    setDuration(result);
    
  }, [flight]);

return (
  <div className="detailedFlightCardContainer">
    <div className="detailedFlightDetails">
      <div className="detailedFlightBlock">
        <div className="detailedIcon">✈️</div>
        <div className="detailedAirlineInfo">
          <span className="detailedAirlineName">{flight.airline_name}</span>
          <span className="detailedFlightNumber">{flight.flight_number}</span>
        </div>
      </div>

      <div className="detailedDeparture">
        <span className="detailedDate">{formatDate(flight.departure_date)}</span>
        <span className="detailedTime">{flight.departure_time}</span>
        <span className="detailedCity">{flight.source}</span>
      </div>

      <div className="detailedJourneyPath">
        <span className="detailedDuration">{duration}</span>
        <img src={line} className="detailedLineImg" alt="line" />
      </div>

      <div className="detailedArrival">
        <span className="detailedDate">{formatDate(flight.arrival_date)}</span>
        <span className="detailedTime">{flight.arrival_time}</span>
        <span className="detailedCity">{flight.destination}</span>
      </div>

      <div className="detailedPrice">
        <span className="detailedLabel">Price</span>
        <span className="detailedValue">{symbol} {formatCurrency(price, currency)}</span>
      </div>
    </div>
  </div>
);
};
