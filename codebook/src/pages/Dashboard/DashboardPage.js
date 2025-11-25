import { useMemo } from "react";
import { toast } from "react-toastify";
import { useTitle } from "../../hooks/useTitle";
import { useUserOrders } from "../../hooks/useUser";
import { DashboardCard } from "./components/DashboardCard";
import { DashboardCardSkeleton } from "./components/DashboardCardSkeleton";
import { DashboardEmpty } from "./components/DashboardEmpty";

export const DashboardPage = () => {
  useTitle("Dashboard");

  // Use React Query hook - automatically handles caching, deduplication, and loading states
  const { data: orders = [], isLoading: loading, error } = useUserOrders();

  // Sort orders by date (most recent first) - using useMemo to avoid re-sorting on every render
  const sortedOrders = useMemo(() => {
    return [...orders].sort((a, b) => {
      const dateA = a.createdAt ? new Date(a.createdAt) : new Date(0);
      const dateB = b.createdAt ? new Date(b.createdAt) : new Date(0);
      return dateB - dateA; // Most recent first
    });
  }, [orders]);

  // Show error toast if API call fails
  if (error) {
    toast.error(error.message, {
      closeButton: true,
      position: "bottom-center",
    });
  }

  return (
    <main>
      <section>
        <p className="text-2xl text-center font-semibold dark:text-slate-100 my-10 underline underline-offset-8">
          My Dashboard
        </p>
      </section>

      <section>
        {loading ? (
          // Show skeleton loaders while loading
          Array(2).fill(0).map((_, index) => (
            <DashboardCardSkeleton key={`skeleton-${index}`} />
          ))
        ) : sortedOrders.length > 0 ? (
          // Show actual orders when loaded and orders exist (sorted by date)
          sortedOrders.map((order) => <DashboardCard key={order.id} order={order} />)
        ) : (
          // Show empty state only when not loading and no orders
          <DashboardEmpty />
        )}
      </section>
    </main>
  );
};
