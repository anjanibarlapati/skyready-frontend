import { act, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { ImageSlider } from './ImageSlider';

describe('ImageSlider', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('renders the initial slide image', () => {
    render(<ImageSlider />);
    const img = screen.getByAltText(/slide 1/i);
    expect(img).toBeInTheDocument();
    expect(img.getAttribute("src")).toContain("slide1");
  });

  it('displays overlay text correctly', () => {
    render(<ImageSlider />);
    expect(screen.getByText(/Let’s Fly/i)).toBeInTheDocument();
    expect(screen.getByText(/One Tap To Take Off/i)).toBeInTheDocument();
  });

  it('automatically changes slide every 2 seconds', () => {
    render(<ImageSlider />);

    const img = () => screen.getByRole('img');
    expect(img().getAttribute("src")).toContain("slide1");
    
    act(() => {
      vi.advanceTimersByTime(2000);
    });
    expect(img().getAttribute("src")).toContain("slide2");

    act(() => {
      vi.advanceTimersByTime(2000);
    });
    expect(img().getAttribute("src")).toContain("slide3");
  });
});
