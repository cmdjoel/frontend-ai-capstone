import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";
import { render } from "@testing-library/react";
import SmoothCursor from "./SmoothCursor";

describe("SmoothCursor", () => {
  const originalInnerWidth = window.innerWidth;
  const originalInnerHeight = window.innerHeight;

  beforeEach(() => {
    // Default to desktop landscape non-touch
    Object.defineProperty(window, "innerWidth", { writable: true, configurable: true, value: 1280 });
    Object.defineProperty(window, "innerHeight", { writable: true, configurable: true, value: 800 });
    Object.defineProperty(navigator, "maxTouchPoints", { writable: true, configurable: true, value: 0 });
    delete (window as unknown as { ontouchstart?: unknown }).ontouchstart;
  });

  afterEach(() => {
    Object.defineProperty(window, "innerWidth", { writable: true, configurable: true, value: originalInnerWidth });
    Object.defineProperty(window, "innerHeight", { writable: true, configurable: true, value: originalInnerHeight });
    document.body.style.cursor = "auto";
  });

  it("renders on desktop landscape non-touch devices", () => {
    const { container } = render(<SmoothCursor />);
    expect(container.querySelector("svg")).toBeDefined();
  });

  it("does not render when viewport width is below 768px", () => {
    Object.defineProperty(window, "innerWidth", { writable: true, configurable: true, value: 500 });
    const { container } = render(<SmoothCursor />);
    expect(container.querySelector("svg")).toBeNull();
  });

  it("does not render when viewport is portrait", () => {
    Object.defineProperty(window, "innerWidth", { writable: true, configurable: true, value: 800 });
    Object.defineProperty(window, "innerHeight", { writable: true, configurable: true, value: 1200 });
    const { container } = render(<SmoothCursor />);
    expect(container.querySelector("svg")).toBeNull();
  });

  it("restores body cursor to auto upon unmount", () => {
    const { unmount } = render(<SmoothCursor hideSystemCursor={true} />);
    unmount();
    expect(document.body.style.cursor).toBe("auto");
  });
});
