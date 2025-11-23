import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { ProductCard, ProductCardSkeleton } from "../../../components";
import { getFeaturedList } from "../../../services";

export const FeaturedProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProducts() {
      setLoading(true);
      try {
        const data = await getFeaturedList();
        setProducts(data);
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
  }, []);

  return (
    <section className="my-20">
      <h1 className="text-2xl text-center font-semibold dark:text-slate-100 mb-5 underline underline-offset-8">
        Featured eBooks
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 justify-items-center max-w-6xl mx-auto">
        {loading ? (
          Array(3).fill(0).map((_, index) => (
            <ProductCardSkeleton key={`skeleton-${index}`} />
          ))
        ) : (
          products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))
        )}
      </div>
    </section>
  );
};
