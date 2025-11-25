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
// This handles caching, deduplication, and automatic refetching
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Stale time: how long data is considered fresh (no refetch)
      staleTime: 5 * 60 * 1000, // 5 minutes (increased for better caching)
      // Garbage collection time: how long unused data stays in cache
      gcTime: 30 * 60 * 1000, // 30 minutes (increased to keep data longer)
      // Retry failed requests once
      retry: 1,
      // Refetch on window focus (optional - can be disabled if needed)
      refetchOnWindowFocus: false,
      // Use cached data as placeholder while refetching in background
      placeholderData: (previousData) => previousData,
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
              position={"bottom-right"}
            />
            <App />
          </LoadingProvider>
        </FilterProvider>
      </CartProvider>
    </Router>
    </QueryClientProvider>
  </React.StrictMode>
);
