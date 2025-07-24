import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import dropdown from "../../assets/dropdown.png";
import swapIcon from '../../assets/swap.png';
import { useFetchFlights } from "../../hooks/useFetchFlights";
import { setCurrency } from "../../redux/currencySlice";
import {
  setSearchData,
} from "../../redux/flightsSlice";
import type { RootState } from "../../redux/store";
import { detectCurrency, supportedCurrencies } from "../../utils/currencyUtils";
import { InputDropdown } from "../input_dropdown/InputDropdown";
import { LoadingSpinner } from "../LoadingSpinner/LoadingSpinner";
import "./Search.css";
import { clearDepartureFlights, setDepartureError, setDepartureMessage } from "../../redux/departureFlightsSlice";



export const Search = () => {
  const [source, setSource] = useState("");
  const [destination, setDestination] = useState("");
  const [departureDate, setDepartureDate] = useState( new Date().toLocaleDateString("en-CA") );
  const [travellersCount, setTravellersCount] = useState(1);
  const [classType, setClassType] = useState("Economy");
  const [cities, setCities] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const {currency} = useSelector((state: RootState) => state.currency)



  const dispatch = useDispatch();
  const { fetchFlights } = useFetchFlights();

    useEffect(() => {
    const detectUserCountry = async () => {
      try {
        const response = await fetch('https://ipapi.co/json/');
        const data = await response.json();
        dispatch(setCurrency(detectCurrency(data.country_code)));
      } catch (err) {
        console.error("Geolocation detection failed:", err);
      }
    };

    detectUserCountry();
  }, [dispatch]);

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
    dispatch(setDepartureMessage(""));
    dispatch(setDepartureError(""));
    setLoading(true);

    const matchedSource = cities.find(
      (city) => city.toLowerCase() === source.toLowerCase()
    );
    const matchedDestination = cities.find(
      (city) => city.toLowerCase() === destination.toLowerCase()
    );

    if (!matchedSource || !matchedDestination) {
      dispatch(clearDepartureFlights());
      setLoading(false);
      dispatch(setDepartureError("Please select valid cities."));
      return;
    }

    if (matchedSource === matchedDestination) {
      dispatch(clearDepartureFlights());
      setLoading(false);
      dispatch(setDepartureError("Source and destination cannot be same"));
      return;
    }


    const searchParams = {
      selectedDate: departureDate,
      departureDate: departureDate,
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

  const handleSwap = () => {
    setSource(destination);
    setDestination(source);
  };

  return (
    <>
      <div className="search-main-container">
        <div className="search-body">
          <div className="search-top-container">
            <div className="currency-dropdown-wrapper">
              <select
                id="currency"
                name="currency"
                value={currency}
                onChange={(e) => dispatch(setCurrency(e.target.value))}
                className="currency-dropdown"
              >
                {supportedCurrencies.map((currency) => (
                  <option key={currency.code} value={currency.code}>
                    {currency.label}
                  </option>
                ))}
              </select>
              <span className="drop-down-icon">
                <img src={dropdown} alt="dropdown" id="dropdown" />
              </span>
            </div>
          </div>

          <form onSubmit={handleSubmit}>
              <div className="input-fields-row">
                <div className="source-destination-wrapper">
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

                  <div className="swap-icon-wrapper">
                    <img
                      src={swapIcon}
                      alt="swap-icon"
                      className="swap-icon"
                      onClick={handleSwap}
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
                      new Date(new Date().setMonth(new Date().getMonth() + 2)).toLocaleDateString("en-CA")}
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
          </form>
        </div>
      </div>
      {loading && <LoadingSpinner />}
    </>
  );
};
