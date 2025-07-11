import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { describe, expect, test } from 'vitest'
import { Header } from "./Header";

describe("Header", () => {
  test("renders the logo image with correct src and alt text", () => {
    render(<Header />);
    const logo = screen.getByAltText("SkyReady Logo");
    expect(logo).toBeInTheDocument();
    expect(logo).toHaveAttribute("src", "/logo.png");
  });
  test("renders the navigation links", () => {
    render(<Header />);
    const homeLink = screen.getByRole("link", { name: /home/i });
    const aboutUsLink = screen.getByRole("link", { name: /about us/i });

    expect(homeLink).toBeInTheDocument();
    expect(homeLink).toHaveAttribute("href", "/");

    expect(aboutUsLink).toBeInTheDocument();
    expect(aboutUsLink).toHaveAttribute("href", "#about-us");
  });
  test("has correct class names for structure and stylings", () => {
    const { container } = render(<Header />);
    expect(container.querySelector(".header")).toBeInTheDocument();
    expect(container.querySelector(".header-container")).toBeInTheDocument();
    expect(container.querySelector(".logo-group")).toBeInTheDocument();
    expect(container.querySelector(".logo-img")).toBeInTheDocument();
    expect(container.querySelector(".nav-links")).toBeInTheDocument();
    expect(container.querySelectorAll(".nav-button").length).toBe(2);
  });
});
