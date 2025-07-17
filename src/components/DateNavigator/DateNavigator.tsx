import React from "react";
import { useDispatch, useSelector } from "react-redux";
import "./DateNavigator.css";
import type { RootState } from "../../redux/store";
import { useFetchFlights } from "../../hooks/useFetchFlights";
import { setSearchData } from "../../redux/flightsSlice";

export const DateNavigator: React.FC = () => {
  const { fetchFlights } = useFetchFlights();
  const dispatch = useDispatch();

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const searchData = useSelector(
    (state: RootState) => state.flights.searchData
  );
  const { selectedDate, source, destination } = searchData;

  const isSameCity =
    source.trim().toLowerCase() === destination.trim().toLowerCase();
  if (!source || !destination || isSameCity) return null;

  const currentDate = new Date(selectedDate);

  const changeDate = (days: number) => {
    const newDate = new Date(currentDate);
    newDate.setDate(currentDate.getDate() + days);

    if (newDate < today) return;

    const formattedDate = newDate.toISOString().split("T")[0];
    const updatedSearchData = { ...searchData, selectedDate: formattedDate };

    dispatch(setSearchData(updatedSearchData));
    fetchFlights(updatedSearchData);
  };

  const formatDate = (date: Date) =>
    date.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });

  return (
    <div className="date-nav-container">
      <button
        className="nav-btn"
        onClick={() => changeDate(-1)}
        disabled={currentDate <= today}
      >
        ←
      </button>
      <span className="current-date">{formatDate(currentDate)}</span>
      <button className="nav-btn" onClick={() => changeDate(1)}>
        →
      </button>
    </div>
  );
};
