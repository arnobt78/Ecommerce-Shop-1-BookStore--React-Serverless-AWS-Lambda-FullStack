import { useLocation } from "react-router-dom";
import { AllRoutes } from "./routes/AllRoutes";
import { Footer, Header } from "./components";

function App() {
  const location = useLocation();
  
  // Check if current route is an admin route
  const isAdminRoute = location.pathname.startsWith("/admin");

  // Note: Featured products are now filtered from products list
  // No need to prefetch separately - products query handles it

  return (
    <div className="App dark:bg-dark">
      {/* Hide Header and Footer on admin routes */}
      {!isAdminRoute && <Header />}
      <AllRoutes />
      {!isAdminRoute && <Footer />}
    </div>
  );
}

export default App;
