import { describe, test, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { DateNavigator } from "./DateNavigator";
import { setSearchData, setLoading, type SearchData } from "../../redux/flightsSlice";

const mockDispatch = vi.fn();
const mockFetchFlights = vi.fn();

const today = new Date();
today.setHours(0, 0, 0, 0);
const formatForSearchData = (date: Date) =>
  `${date.toLocaleDateString("en-CA")} 00:00:00`;

let mockedSelectedDate = formatForSearchData(today);

vi.mock("react-redux", async () => {
  const actual = await vi.importActual<typeof import("react-redux")>("react-redux");
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
            travellersCount: 2,
            classType: "Economy",
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
  });

  test("renders current date and nav buttons", () => {
    render(<DateNavigator />);

    const expectedLabel = today.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });

    expect(screen.getByText(expectedLabel)).toBeInTheDocument();
    expect(screen.getByText("←")).toBeInTheDocument();
    expect(screen.getByText("→")).toBeInTheDocument();
  });

  test("disables previous button when selected date is today", () => {
    render(<DateNavigator />);
    expect(screen.getByText("←")).toBeDisabled();
  });

  test("clicking next date dispatches updated search data and fetches flights", async () => {
    render(<DateNavigator />);

    const nextDay = new Date(today);
    nextDay.setDate(today.getDate() + 1);
    const expectedDate = formatForSearchData(nextDay);

    fireEvent.click(screen.getByText("→"));

    await waitFor(() => {
      expect(mockDispatch).toHaveBeenCalledWith(setLoading(true));
      expect(mockDispatch).toHaveBeenCalledWith(
        setSearchData(expect.objectContaining({ selectedDate: expectedDate }))
      );
      expect(mockFetchFlights).toHaveBeenCalledWith(
        expect.objectContaining({ selectedDate: expectedDate })
      );
      expect(mockDispatch).toHaveBeenCalledWith(setLoading(false));
    });
  });

  test("clicking previous date dispatches updated search data and fetches flights", async () => {
    const futureDate = new Date(today);
    futureDate.setDate(today.getDate() + 1);
    mockedSelectedDate = formatForSearchData(futureDate); 

    render(<DateNavigator />);

    fireEvent.click(screen.getByText("←"));

    const expectedDate = formatForSearchData(today);

    await waitFor(() => {
      expect(mockDispatch).toHaveBeenCalledWith(setLoading(true));
      expect(mockDispatch).toHaveBeenCalledWith(
        setSearchData(expect.objectContaining({ selectedDate: expectedDate }))
      );
      expect(mockFetchFlights).toHaveBeenCalledWith(
        expect.objectContaining({ selectedDate: expectedDate })
      );
      expect(mockDispatch).toHaveBeenCalledWith(setLoading(false));
    });
  });
});
