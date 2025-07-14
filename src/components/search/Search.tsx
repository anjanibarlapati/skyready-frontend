import { useEffect, useState } from "react";
import { InputDropdown } from "../input_dropdown/InputDropdown";
import {
  FlightResult,
  type Flight,
} from "../../pages/flight_result/FlightResult";
import "./Search.css";

export const Search = () => {
  const [source, setSource] = useState("");
  const [destination, setDestination] = useState("");
  const [departureDate, setDepartureDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [travellersCount, setTravellersCount] = useState(1);
  const [classType, setClassType] = useState("Economic");
  const [error, setError] = useState("");
  const [cities, setCities] = useState<string[]>([]);
  const [flights, setFlights] = useState<Flight[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  useEffect(() => {
    const fetchCities = async () => {
      try {
        const url = `${import.meta.env.VITE_BASE_URL}/api/v1/cities`;

        const response = await fetch(url);
        if (response.ok) {
          const data = await response.json();
          setCities(data);
        }
      } catch (err) {
        console.error("Failed to fetch cities:", err);
      }
    };

    fetchCities();
  }, []);

  const handleTravellerChange = (delta: number) => {
    setTravellersCount((prev) => {
      const newCount = prev + delta;
      return newCount < 1 ? 1 : newCount > 9 ? 9 : newCount;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const matchedSource = cities.find(
      (city) => city.toLowerCase() === source.toLowerCase()
    );
    const matchedDestination = cities.find(
      (city) => city.toLowerCase() === destination.toLowerCase()
    );

    if (!source || !destination) {
      setError("Please select both source and destination.");
      return;
    }

    if (!matchedSource || !matchedDestination) {
      setError("Please select valid cities from dropdown.");
      return;
    }

    if (matchedSource === matchedDestination) {
      setError("Source and destination cannot be the same.");
      return;
    }

    setError("");
    setLoading(true);
    setFlights([]);
    setHasSearched(true);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_BASE_URL}/api/v1/flights/search`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            source: matchedSource,
            destination: matchedDestination,
            departure_date: departureDate,
            travellers_count: travellersCount,
            class_type: classType,
          }),
        }
      );

      const data = await response.json();
      setFlights(data.flights || []);
    } catch (err) {
      console.error("Error fetching flights:", err);
      setError("Something went wrong while fetching flights.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="search-main-container">
      <form onSubmit={handleSubmit}>
        <div className="search-container">
          <div className="input-fields-row">
            <div className="input-field">
              <label htmlFor="source">Source</label>
              <InputDropdown
                id="source"
                name="source"
                placeholder="Enter source"
                value={source}
                options={cities}
                onChange={setSource}
              />
            </div>

            <div className="input-field">
              <label htmlFor="destination">Destination</label>
              <InputDropdown
                id="destination"
                name="destination"
                placeholder="Enter destination"
                value={destination}
                options={cities}
                onChange={setDestination}
              />
            </div>

            <div className="input-field">
              <label htmlFor="departureDate">Departure Date</label>
              <input
                type="date"
                id="departureDate"
                name="departureDate"
                className="date-picker"
                value={departureDate}
                min={new Date().toISOString().split("T")[0]}
                onChange={(e) => setDepartureDate(e.target.value)}
              />
            </div>

            <div className="input-field">
              <label htmlFor="travellers_count">Travellers</label>
              <div className="traveller-counter">
                <button
                  type="button"
                  className="counter-btn"
                  onClick={() => handleTravellerChange(-1)}
                  disabled={travellersCount <= 1}
                >
                  -
                </button>
                <input
                  type="number"
                  id="travellers_count"
                  name="travellers_count"
                  min={1}
                  max={9}
                  value={travellersCount}
                  readOnly
                />
                <button
                  type="button"
                  className="counter-btn"
                  onClick={() => handleTravellerChange(1)}
                  disabled={travellersCount >= 9}
                >
                  +
                </button>
              </div>
            </div>

            <div className="input-field">
              <label htmlFor="class_type">Class Type</label>
              <InputDropdown
                id="class_type"
                name="class_type"
                placeholder="Select class type"
                value={classType}
                options={["Economic", "Second Class", "First Class"]}
                onChange={setClassType}
              />
            </div>

            <div className="input-field">
              <div className="search-button-wrapper">
                <button type="submit" className="search-button">
                  Search
                </button>
              </div>
            </div>
          </div>

          <div className="search-error">{error}</div>
        </div>
      </form>

      {loading && <div className="loading">Loading flights...</div>}

      {!loading && flights.length > 0 && (
        <div className="flight-results-container">
          <h2 className="flight-results-header">Available Flights</h2>
          {flights.map((flight, index) => (
            <FlightResult key={index} flight={flight} />
          ))}
        </div>
      )}

      {!loading && hasSearched && flights.length === 0 && (
        <div className="flight-results-container">
          <p> No flights found for the selected route.</p>
        </div>
      )}
    </div>
  );
};