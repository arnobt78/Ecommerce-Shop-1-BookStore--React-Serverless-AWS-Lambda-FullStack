import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { AllRoutes } from "./routes/AllRoutes";
import { Footer, Header } from "./components";
import { getFeaturedList } from "./services";

function App() {
  const queryClient = useQueryClient();

  // Prefetch featured products on app mount for instant display
  useEffect(() => {
    // Prefetch featured products - this will cache them immediately
    queryClient.prefetchQuery({
      queryKey: ['featured-products'],
      queryFn: getFeaturedList,
      staleTime: 60 * 60 * 1000, // 1 hour
    });
  }, [queryClient]);

  return (
    <div className="App dark:bg-dark">
      <Header />
      <AllRoutes />
      <Footer />
    </div>
  );
}

export default App;
