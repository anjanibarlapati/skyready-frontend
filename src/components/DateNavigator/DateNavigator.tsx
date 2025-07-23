import React, { useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useFetchFlights } from "../../hooks/useFetchFlights";
import { setLoading, setSearchData } from "../../redux/flightsSlice";
import type { RootState } from "../../redux/store";
import "./DateNavigator.css";

const startOfDay = (date: Date) => {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
};

const addDays = (date: Date, days: number) => {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
};

const addMonths = (date: Date, months: number) => {
  const d = new Date(date);
  d.setMonth(d.getMonth() + months);
  return d;
};

const maxDateFn = (d1: Date, d2: Date) => (d1 > d2 ? d1 : d2);

const minDateFn = (d1: Date, d2: Date) => (d1 < d2 ? d1 : d2);

export const DateNavigator: React.FC = () => {
  const dispatch = useDispatch();
  const { fetchFlights } = useFetchFlights();

  const searchData = useSelector(
    (state: RootState) => state.flights.searchData
  );
  const currentDate = startOfDay(new Date(searchData.selectedDate));
  const today = startOfDay(new Date());

  const departureDate = useMemo(() => {
    return searchData.departureDate
      ? startOfDay(new Date(searchData.departureDate))
      : startOfDay(new Date(searchData.selectedDate));
  }, [searchData.departureDate, searchData.selectedDate]);

  const tentativeMinDate = addDays(departureDate, -7);
  const minDate = maxDateFn(today, tentativeMinDate);
  const maxBookingDate = addMonths(today, 2);
  const tentativeMaxDate = addDays(departureDate, 7);
  const maxDate = minDateFn(tentativeMaxDate, maxBookingDate);
  const prevDisabled = currentDate <= minDate;
  const nextDisabled = currentDate >= maxDate;

  const changeDate = async (days: number) => {
    const newDate = addDays(currentDate, days);
    if (newDate < minDate || newDate > maxDate) return;

    const formattedDate = newDate.toLocaleDateString("en-CA");
    const updatedSearchData = {
      ...searchData,
      selectedDate: `${formattedDate} 00:00:00`,
    };

    dispatch(setSearchData(updatedSearchData));
    dispatch(setLoading(true));
    try {
      await fetchFlights(updatedSearchData);
    } finally {
      dispatch(setLoading(false));
    }
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
        disabled={prevDisabled}
        aria-label="Previous day"
      >
        ←
      </button>
      <span className="current-date">{formatDate(currentDate)}</span>
      <button
        className="nav-btn"
        onClick={() => changeDate(1)}
        disabled={nextDisabled}
        aria-label="Next day"
      >
        →
      </button>
    </div>
  );
};
