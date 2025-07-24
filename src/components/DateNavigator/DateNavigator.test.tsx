import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, test, vi } from "vitest";
import {
  setLoading,
  setSearchData,
  type SearchData,
} from "../../redux/flightsSlice";
import { DateNavigator } from "./DateNavigator";

const mockDispatch = vi.fn();
const mockFetchFlights = vi.fn();

const today = new Date();
today.setHours(0, 0, 0, 0);

const formatForSearchData = (date: Date) =>
  date.toLocaleDateString("en-CA");

let mockedSelectedDate = formatForSearchData(today);
let mockedDepartureDate = formatForSearchData(today);
let mockedReturnDate = formatForSearchData(today);
let mockedSelectedReturnDate = formatForSearchData(today);

vi.mock("react-redux", async () => {
  const actual = await vi.importActual<typeof import("react-redux")>(
    "react-redux"
  );
  return {
    ...actual,
    useDispatch: () => mockDispatch,
    useSelector: (
      selector: (state: { flights: { searchData: SearchData } }) => SearchData
    ) =>
      selector({
        flights: {
          searchData: {
            source: "Delhi",
            destination: "Mumbai",
            selectedDate: mockedSelectedDate,
            departureDate: mockedDepartureDate,
            returnDate: mockedReturnDate,
            selectedReturnDate: mockedSelectedReturnDate,
            travellersCount: 2,
            classType: "Economy",
            tripType: "Round",
          },
        },
      }),
  };
});

vi.mock("../../hooks/useFetchFlights", () => ({
  useFetchFlights: () => ({
    fetchFlights: mockFetchFlights,
  }),
}));

describe("DateNavigator", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockedSelectedDate = formatForSearchData(today);
    mockedDepartureDate = formatForSearchData(today);
    mockedReturnDate = formatForSearchData(today);
    mockedSelectedReturnDate = formatForSearchData(today);
  });

  test("renders current departure date and nav buttons", () => {
    render(<DateNavigator type="departure" />);

    const expectedLabel = today.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });

    expect(screen.getByText(expectedLabel)).toBeInTheDocument();
    expect(screen.getByText("←")).toBeInTheDocument();
    expect(screen.getByText("→")).toBeInTheDocument();
  });

  test("disables previous button when departure date is minDate", () => {
    render(<DateNavigator type="departure" />);
    expect(screen.getByText("←")).toBeDisabled();
  });

  test("clicking next on departure updates departureDate and dispatches actions", async () => {
    render(<DateNavigator type="departure" />);

    const nextDay = new Date(today);
    nextDay.setDate(today.getDate() + 1);
    const expectedDate = nextDay.toLocaleDateString("en-CA");

    fireEvent.click(screen.getByText("→"));

    await waitFor(() => {
      expect(mockDispatch).toHaveBeenCalledWith(setLoading(true));
      expect(mockDispatch).toHaveBeenCalledWith(
        setSearchData(expect.objectContaining({ departureDate: expectedDate }))
      );
      expect(mockFetchFlights).toHaveBeenCalledWith(
        expect.objectContaining({ departureDate: expectedDate }),
        "departure"
      );
      expect(mockDispatch).toHaveBeenCalledWith(setLoading(false));
    });
  });

  test("clicking previous on future departure updates date", async () => {
    const futureDate = new Date(today);
    futureDate.setDate(today.getDate() + 1);
    mockedSelectedDate = formatForSearchData(futureDate);
    mockedDepartureDate = formatForSearchData(futureDate);

    render(<DateNavigator type="departure" />);

    fireEvent.click(screen.getByText("←"));

    const expectedDate = today.toLocaleDateString("en-CA");

    await waitFor(() => {
      expect(mockDispatch).toHaveBeenCalledWith(setLoading(true));
      expect(mockDispatch).toHaveBeenCalledWith(
        setSearchData(expect.objectContaining({ departureDate: expectedDate }))
      );
      expect(mockFetchFlights).toHaveBeenCalledWith(
        expect.objectContaining({ departureDate: expectedDate }),
        "departure"
      );
      expect(mockDispatch).toHaveBeenCalledWith(setLoading(false));
    });
  });

  test("does NOT dispatch or fetch when clicking ← at minDate", async () => {
    render(<DateNavigator type="departure" />);

    fireEvent.click(screen.getByText("←"));

    await waitFor(() => {
      expect(mockDispatch).not.toHaveBeenCalledWith(
        setSearchData(expect.anything())
      );
      expect(mockFetchFlights).not.toHaveBeenCalled();
    });
  });

  test("does NOT dispatch or fetch when clicking → at maxDate", async () => {
    const maxDate = new Date(today);
    maxDate.setMonth(today.getMonth() + 2);
    mockedSelectedDate = formatForSearchData(maxDate);
    mockedDepartureDate = formatForSearchData(maxDate);

    render(<DateNavigator type="departure" />);

    fireEvent.click(screen.getByText("→"));

    await waitFor(() => {
      expect(mockDispatch).not.toHaveBeenCalledWith(
        setSearchData(expect.anything())
      );
      expect(mockFetchFlights).not.toHaveBeenCalled();
    });
  });

  test("clicking next on return updates returnDate", async () => {
    render(<DateNavigator type="return" />);

    const nextDay = new Date(today);
    nextDay.setDate(today.getDate() + 1);
    const expectedDate = nextDay.toLocaleDateString("en-CA");

    fireEvent.click(screen.getByText("→"));

    await waitFor(() => {
      expect(mockDispatch).toHaveBeenCalledWith(setLoading(true));
      expect(mockDispatch).toHaveBeenCalledWith(
        setSearchData(expect.objectContaining({ returnDate: expectedDate }))
      );
      expect(mockFetchFlights).toHaveBeenCalledWith(
        expect.objectContaining({ returnDate: expectedDate }),
        "return"
      );
      expect(mockDispatch).toHaveBeenCalledWith(setLoading(false));
    });
  });
});
