import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { useTitle } from "../hooks/useTitle";
import { Rating, ProductDetailSkeleton } from "../components";
import { useCart } from "../context";
import { useProduct } from "../hooks/useProducts";

export const ProductDetail = () => {
  const { cartList, addToCart, removeFromCart } = useCart();
  const [inCart, setInCart] = useState(false);
  const { id } = useParams();

  // Use React Query hook - automatically handles caching, deduplication, and loading states
  // Only fetches if id exists
  const {
    data: product = {},
    isLoading: loading,
    error,
  } = useProduct(id, !!id);

  useTitle(product.name);

  // Show error toast if API call fails
  if (error) {
    toast.error(error.message, {
      closeButton: true,
      position: "bottom-center",
    });
  }

  useEffect(() => {
    const productInCart = cartList.find((item) => item.id === product.id);

    if (productInCart) {
      setInCart(true);
    } else {
      setInCart(false);
    }
  }, [cartList, product.id]);

  if (loading) {
    return <ProductDetailSkeleton />;
  }

  return (
    <main>
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-10">
        {/* Title and Overview */}
        <div className="text-center mb-4">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-slate-200">
            {product.name}
          </h1>
          <p className="mb-2 text-base sm:text-lg text-center text-gray-700 dark:text-slate-300 max-w-7xl mx-auto">
            {product.overview}
          </p>
        </div>

        {/* Main Content Card */}
        <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg shadow-sm dark:shadow-slate-900/50 p-4 sm:p-6 lg:p-8">
          <div className="flex flex-col lg:flex-row lg:items-stretch gap-4 lg:gap-8">
            {/* Left Section - Product Image */}
            <div className="flex-shrink-0 w-full lg:w-auto lg:max-w-xl">
              <div className="rounded-lg overflow-hidden border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-900 h-full">
                <img
                  className="w-full h-full rounded-lg object-cover"
                  src={product.poster}
                  alt={product.name}
                />
              </div>
            </div>

            {/* Right Section - Product Details Card */}
            <div className="flex-1 min-w-0 flex flex-col">
              <div className="space-y-2 sm:space-y-2">
                {/* Price Badge */}
                <div>
                  <span className="inline-flex items-center px-4 py-2 rounded-lg text-2xl sm:text-3xl font-bold bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300 border border-green-200 dark:border-green-800">
                    <i className="bi bi-currency-dollar mr-1.5"></i>
                    {product.price?.toFixed(2) || "0.00"}
                  </span>
                </div>

                {/* Rating */}
                <div className="flex items-center gap-2">
                  <Rating rating={product.rating} />
                  <span className="text-sm text-gray-600 dark:text-slate-400">
                    ({product.rating} out of 5)
                  </span>
                </div>

                {/* Product Badges */}
                <div className="flex flex-wrap gap-2">
                  {product.best_seller && (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
                      <i className="bi bi-star-fill mr-1.5 text-xs"></i>
                      Best Seller
                    </span>
                  )}
                  {product.in_stock ? (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                      <i className="bi bi-check-circle mr-1.5 text-xs"></i>
                      In Stock
                    </span>
                  ) : (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-rose-100 text-rose-800 dark:bg-rose-900/30 dark:text-rose-300 border border-rose-200 dark:border-rose-800">
                      <i className="bi bi-x-circle mr-1.5 text-xs"></i>
                      Out of Stock
                    </span>
                  )}
                  {product.size && (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                      <i className="bi bi-file-earmark mr-1.5 text-xs"></i>
                      {product.size} MB
                    </span>
                  )}
                </div>

                {/* Add to Cart Button */}
                <div className="py-2">
                  {!inCart ? (
                    <button
                      onClick={() => addToCart(product)}
                      className={`inline-flex items-center justify-center py-3 px-6 text-base sm:text-lg font-medium text-center text-white rounded-lg transition-colors ${
                        product.in_stock
                          ? "bg-blue-700 hover:bg-blue-800 dark:bg-blue-600 dark:hover:bg-blue-700"
                          : "bg-gray-400 cursor-not-allowed"
                      }`}
                      disabled={!product.in_stock}
                    >
                      <i className="bi bi-cart-plus mr-2"></i>
                      Add To Cart
                    </button>
                  ) : (
                    <button
                      onClick={() => removeFromCart(product)}
                      className={`inline-flex items-center justify-center py-3 px-6 text-base sm:text-lg font-medium text-center text-white rounded-lg transition-colors ${
                        product.in_stock
                          ? "bg-red-600 hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-800"
                          : "bg-gray-400 cursor-not-allowed"
                      }`}
                      disabled={!product.in_stock}
                    >
                      <i className="bi bi-trash3 mr-2"></i>
                      Remove From Cart
                    </button>
                  )}
                </div>

                {/* Divider */}
                <div className="border-t border-gray-200 dark:border-slate-700 pt-1 sm:pt-1"></div>

                {/* Product Description */}
                <div>
                  <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 dark:text-slate-200 mb-2">
                    Description
                  </h2>
                  <p className="text-base sm:text-lg text-gray-700 dark:text-slate-300 leading-relaxed whitespace-pre-line text-justify">
                    {product.long_description}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};
