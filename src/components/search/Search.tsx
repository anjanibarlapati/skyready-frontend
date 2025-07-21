import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useFetchFlights } from "../../hooks/useFetchFlights";
import {
  clearFlights,
  setError,
  setMessage,
  setSearchData,
} from "../../redux/flightsSlice";
import { InputDropdown } from "../input_dropdown/InputDropdown";
import "./Search.css";
import { LoadingSpinner } from "../LoadingSpinner/LoadingSpinner";

export const Search = () => {
  const [source, setSource] = useState("");
  const [destination, setDestination] = useState("");
  const [departureDate, setDepartureDate] = useState(
    new Date().toLocaleDateString("en-CA")
  );
  const [travellersCount, setTravellersCount] = useState(1);
  const [classType, setClassType] = useState("Economy");
  const [cities, setCities] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

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

  const getFormattedDateTime = () => {
    const today = new Date().toLocaleDateString("en-CA");

    const timePart =
      departureDate === today
        ? new Date().toTimeString().slice(0, 8)
        : "00:00:00";

    return `${departureDate} ${timePart}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(setMessage(""));
    dispatch(setError(""));
    setLoading(true);

    const matchedSource = cities.find(
      (city) => city.toLowerCase() === source.toLowerCase()
    );
    const matchedDestination = cities.find(
      (city) => city.toLowerCase() === destination.toLowerCase()
    );

    if (!matchedSource || !matchedDestination) {
      dispatch(clearFlights());
      setLoading(false);
      dispatch(setError("Please select valid cities."));
      return;
    }

    if (matchedSource === matchedDestination) {
      dispatch(clearFlights());
      setLoading(false);
      dispatch(setError("Source and destination cannot be same"));
      return;
    }

    const selectedDateTime = getFormattedDateTime();

    const searchParams = {
      selectedDate: selectedDateTime,
      source,
      destination,
      travellersCount,
      classType,
    };

    dispatch(setSearchData(searchParams));
    try {
      await fetchFlights(searchParams);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
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
                  min={new Date().toLocaleDateString("en-CA")}
                  max={
                    new Date(new Date().setMonth(new Date().getMonth() + 2))
                      .toISOString()
                      .split("T")[0]
                  }
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
                  disableFilter={true}
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
      {loading && <LoadingSpinner />}
    </>
  );
};
