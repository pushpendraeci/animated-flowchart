import "@testing-library/jest-dom";

// Polyfill ResizeObserver for jsdom (React Flow requires it)
global.ResizeObserver = class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
};
