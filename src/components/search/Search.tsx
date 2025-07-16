import { useEffect, useState } from "react";
import { InputDropdown } from "../input_dropdown/InputDropdown";
import "./Search.css";
import { useDispatch } from "react-redux";
import { setMessage, setSearchData } from "../../redux/flightsSlice";
import { useFetchFlights } from "../../hooks/useFetchFlights";

export const Search = () => {
  const [source, setSource] = useState("");
  const [destination, setDestination] = useState("");
  const [departureDate, setDepartureDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [travellersCount, setTravellersCount] = useState(1);
  const [classType, setClassType] = useState("Economy");
  const [cities, setCities] = useState<string[]>([]);

  const dispatch = useDispatch();
  const { fetchFlights } = useFetchFlights();

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
  dispatch(setMessage(""));

  const matchedSource = cities.find(
    (city) => city.toLowerCase() === source.toLowerCase()
  );
  const matchedDestination = cities.find(
    (city) => city.toLowerCase() === destination.toLowerCase()
  );

  if (!matchedSource || !matchedDestination) {
    dispatch(setMessage("Please select valid cities."));
    return;
  }

  if (matchedSource === matchedDestination) {
    dispatch(setMessage("Source and destination cannot be same"));
    return;
  }

  const searchParams = {
    selectedDate: departureDate,
    source,
    destination,
    travellersCount,
    classType,
  };

  dispatch(setSearchData(searchParams));     // Update Redux
  await fetchFlights(searchParams);          // Use latest input directly
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
                required={true}
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
                required={true}
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
                options={["Economy", "Second Class", "First Class"]}
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
        </div>
      </form>
    </div>
  );
};
