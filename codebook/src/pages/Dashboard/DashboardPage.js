import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { useTitle } from "../../hooks/useTitle";
import { getUserOrders } from "../../services";
import { DashboardCard } from "./components/DashboardCard";
import { DashboardCardSkeleton } from "./components/DashboardCardSkeleton";
import { DashboardEmpty } from "./components/DashboardEmpty";

export const DashboardPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  useTitle("Dashboard");

  useEffect(() => {
    async function fetchOrders() {
      setLoading(true);
      try {
        const data = await getUserOrders();
        setOrders(data);
      } catch (error) {
        toast.error(error.message, {
          closeButton: true,
          position: "bottom-center",
        });
      } finally {
        setLoading(false);
      }
    }
    fetchOrders();
  }, []);

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
        ) : orders.length > 0 ? (
          // Show actual orders when loaded and orders exist
          orders.map((order) => <DashboardCard key={order.id} order={order} />)
        ) : (
          // Show empty state only when not loading and no orders
          <DashboardEmpty />
        )}
      </section>
    </main>
  );
};
