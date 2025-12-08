import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter as Router } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { FilterProvider, CartProvider } from "./context";
import { LoadingProvider } from "./context/LoadingContext";
import { ScrollToTop } from "./components";
import "./index.css";
import App from "./App";

// Create a QueryClient instance with default options
// Optimized for fast page loads and minimal network requests
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Stale time: how long data is considered fresh (no refetch)
      staleTime: 10 * 60 * 1000, // 10 minutes - longer cache = faster loads
      // Garbage collection time: how long unused data stays in cache
      gcTime: 60 * 60 * 1000, // 1 hour - keep data longer for instant loads
      // Retry failed requests once (faster failure = faster error display)
      retry: 1,
      // Don't refetch on window focus (prevents unnecessary requests)
      refetchOnWindowFocus: false,
      // Don't refetch on reconnect (prevents unnecessary requests)
      refetchOnReconnect: false,
      // Don't refetch on mount if data is fresh (faster initial render)
      refetchOnMount: false,
      // Use cached data as placeholder while refetching in background
      placeholderData: (previousData) => previousData,
      // Network mode: prefer cache first, then network (faster perceived load)
      networkMode: 'online',
    },
  },
});

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
    <Router>
      <CartProvider>
        <FilterProvider>
          <LoadingProvider>
            <ScrollToTop />
            <ToastContainer
              closeButton={false}
              autoClose={3000}
              position="bottom-right"
            />
            <App />
          </LoadingProvider>
        </FilterProvider>
      </CartProvider>
    </Router>
    </QueryClientProvider>
  </React.StrictMode>
);
