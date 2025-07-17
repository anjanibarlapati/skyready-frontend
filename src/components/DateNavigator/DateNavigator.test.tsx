import { describe, test, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { DateNavigator } from "./DateNavigator";
import { setSearchData } from "../../redux/flightsSlice";

type SearchData = {
  source: string;
  destination: string;
  selectedDate: string;
  travellersCount: number;
  classType: string;
};

const mockDispatch = vi.fn();
const mockFetchFlights = vi.fn();

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
            selectedDate: "2025-07-20",
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
  });

  test("renders correctly with formatted date", () => {
    render(<DateNavigator />);
    expect(screen.getByText("20 Jul 2025")).toBeInTheDocument();

    expect(screen.getAllByRole("button")).toHaveLength(2);
    expect(screen.getByText("←")).toBeInTheDocument();
    expect(screen.getByText("→")).toBeInTheDocument();
  });

  test("clicking previous date button updates date, dispatches setSearchData, and fetchFlights", () => {
    render(<DateNavigator />);

    const prevBtn = screen.getByText("←");
    fireEvent.click(prevBtn);

    const expectedDate = "2025-07-19";

    expect(mockDispatch).toHaveBeenCalledWith(
      setSearchData(
        expect.objectContaining({
          selectedDate: expectedDate,
        })
      )
    );

    expect(mockFetchFlights).toHaveBeenCalledWith(
      expect.objectContaining({
        selectedDate: expectedDate,
      })
    );
  });

  test("clicking next date button updates date, dispatches setSearchData, and fetchFlights", () => {
    render(<DateNavigator />);

    const nextBtn = screen.getByText("→");
    fireEvent.click(nextBtn);
    const expectedDate = "2025-07-21";

    expect(mockDispatch).toHaveBeenCalledWith(
      setSearchData(
        expect.objectContaining({
          selectedDate: expectedDate,
        })
      )
    );

    expect(mockFetchFlights).toHaveBeenCalledWith(
      expect.objectContaining({
        selectedDate: expectedDate,
      })
    );
  });
});
