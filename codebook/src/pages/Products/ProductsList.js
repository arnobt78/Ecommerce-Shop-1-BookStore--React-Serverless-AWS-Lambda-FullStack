import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { useTitle } from "../../hooks/useTitle";

import { ProductCard, ProductCardSkeleton } from "../../components";
import { FilterBar } from "./components/FilterBar";

import { useFilter } from "../../context";
import { getProductList } from "../../services";
import { toast } from "react-toastify";

export const ProductsList = () => {
  const { products, initialProductList } = useFilter();
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(true);
  const search = useLocation().search;
  const searchTerm = new URLSearchParams(search).get("q");
  useTitle("Explore eBooks Collection");

  useEffect(() => {
    async function fetchProducts() {
      setLoading(true);
      try {
        const data = await getProductList(searchTerm);
        initialProductList(data);
      } catch (error) {
        toast.error(error.message, {
          closeButton: true,
          position: "bottom-center",
        });
      } finally {
        setLoading(false);
      }
    }
    fetchProducts();
  }, [searchTerm, initialProductList]); //eslint-disable-line

  return (
    <main>
      <section className="my-5">
        <div className="my-5 flex justify-between">
          <span className="text-2xl font-semibold dark:text-slate-100 mb-5">
            All eBooks ({products.length})
          </span>
          <span>
            <button
              onClick={() => setShow(!show)}
              id="dropdownMenuIconButton"
              data-dropdown-toggle="dropdownDots"
              className="inline-flex items-center p-2 text-sm font-medium text-center text-gray-900 bg-gray-100 rounded-lg hover:bg-gray-200 dark:text-white dark:bg-gray-600 dark:hover:bg-gray-700"
              type="button"
            >
              <svg
                className="w-6 h-6"
                aria-hidden="true"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z"></path>
              </svg>
            </button>
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 justify-items-center max-w-6xl mx-auto">
          {loading ? (
            Array(6).fill(0).map((_, index) => (
              <ProductCardSkeleton key={`skeleton-${index}`} />
            ))
          ) : (
            products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))
          )}
        </div>
      </section>

      {show && <FilterBar setShow={setShow} />}
    </main>
  );
};
