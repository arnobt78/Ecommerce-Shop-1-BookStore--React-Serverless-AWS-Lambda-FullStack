import { Link } from "react-router-dom";
import {
  getProductImageUrl,
  getProductImageKey,
} from "../../../utils/productImage";
import { formatPrice } from "../../../utils/formatPrice";
import { StatusBadge, OrderTrackingInfo } from "../../../components/ui";

export const DashboardCard = ({ order }) => {
  // Format order date
  const formatDate = (dateString) => {
    if (!dateString) return "Date not available";
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch (error) {
      return "Date not available";
    }
  };

  // Get order ID (display full ID, responsive to available space)
  const getOrderId = (id) => {
    if (!id) return "N/A";
    return id;
  };

  return (
    <div className="max-w-7xl mx-auto mb-6 p-4 sm:p-6 border border-gray-200 dark:border-slate-700 rounded-lg shadow-sm dark:shadow-slate-900/50 bg-white dark:bg-slate-800 transition-colors">
      {/* Order Header with Badges */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-4 pb-4 border-b border-gray-200 dark:border-slate-700">
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 flex-wrap">
          {/* Order ID Badge - full ID displayed, responsive */}
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 border border-blue-200 dark:border-blue-800 max-w-full">
            <span className="mr-1.5 whitespace-nowrap flex-shrink-0">
              Order:
            </span>
            <span className="font-mono break-all sm:break-normal">
              {getOrderId(order.id)}
            </span>
          </span>

          {/* Order Date Badge */}
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-600">
            <i className="bi bi-calendar3 mr-1.5"></i>
            {formatDate(order.createdAt)}
          </span>

          {/* Order Status Badge and Quantity Badge - Same Row */}
          <div className="flex items-center gap-2 flex-wrap">
            <StatusBadge
              status={order.status || "pending"}
              customLabels={{
                pending: "Pending",
                processing: "Processing",
                shipped: "Shipped",
                delivered: "Delivered",
                cancelled: "Cancelled",
                refunded: "Refunded",
              }}
            />

            {/* Quantity Badge */}
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300 border border-purple-200 dark:border-purple-800">
              <i className="bi bi-box-seam mr-1.5"></i>
              {order.cartList?.reduce(
                (sum, item) => sum + (item.quantity || 1),
                0
              ) ||
                order.quantity ||
                order.cartList?.length ||
                0}{" "}
              item
              {(order.cartList?.reduce(
                (sum, item) => sum + (item.quantity || 1),
                0
              ) ||
                order.quantity ||
                order.cartList?.length ||
                0) !== 1
                ? "s"
                : ""}
            </span>
          </div>
        </div>

        {/* Total Amount Badge */}
        <span className="inline-flex items-center px-4 py-2 rounded-lg text-lg font-bold bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300 border border-green-200 dark:border-green-800">
          ${formatPrice(order.amount_paid)}
        </span>
      </div>

      {/* Order Items */}
      <div className="space-y-4">
        {order.cartList?.map((product, index) => (
          <div key={product.id}>
            <div className="flex flex-col sm:flex-row gap-4 p-3 sm:p-4 rounded-lg bg-gray-50 dark:bg-slate-900/50 hover:bg-gray-100 dark:hover:bg-slate-900 transition-colors">
              {/* Product Image */}
              <Link to={`/products/${product.id}`} className="flex-shrink-0">
                <img
                  className="w-full sm:w-32 h-auto sm:h-32 rounded-lg object-cover border border-gray-200 dark:border-slate-700 hover:opacity-90 transition-opacity"
                  src={
                    getProductImageUrl(product) || "/assets/images/10001.avif"
                  }
                  key={getProductImageKey(product)}
                  alt={product.name || "Product"}
                  onError={(e) => {
                    // Fallback to local image if poster fails to load
                    if (
                      e.target.src !== product.image_local &&
                      product.image_local
                    ) {
                      e.target.src = product.image_local;
                    } else {
                      // Final fallback to default image
                      e.target.src = "/assets/images/10001.avif";
                    }
                  }}
                />
              </Link>

              {/* Product Details */}
              <div className="flex-1 flex flex-col justify-between min-w-0">
                <div>
                  <Link to={`/products/${product.id}`}>
                    <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-slate-200 hover:text-blue-600 dark:hover:text-blue-400 transition-colors mb-2 line-clamp-2">
                      {product.name}
                    </h3>
                  </Link>

                  {/* Product Badges */}
                  <div className="flex flex-wrap gap-2 mb-2">
                    {/* Quantity Badge - Show quantity for this specific product */}
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
                      <i className="bi bi-123 mr-1 text-xs"></i>
                      Qty: {product.quantity || 1}
                    </span>

                    {product.best_seller && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
                        <i className="bi bi-star-fill mr-1 text-xs"></i>
                        Best Seller
                      </span>
                    )}
                    {/* Show stock status at time of order (informational) */}
                    {product.in_stock !== undefined &&
                      (product.in_stock ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                          <i className="bi bi-check-circle mr-1 text-xs"></i>
                          In Stock
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
                          <i className="bi bi-info-circle mr-1 text-xs"></i>
                          Out of Stock (at time of order)
                        </span>
                      ))}
                    {product.size && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                        <i className="bi bi-file-earmark mr-1 text-xs"></i>
                        {product.size} MB
                      </span>
                    )}
                  </div>
                </div>

                {/* Product Price */}
                <div className="mt-2 sm:mt-0">
                  <div className="text-xs text-gray-600 dark:text-gray-400 mb-1">
                    ${formatPrice(product.price)} each
                  </div>
                  <span className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-slate-100">
                    $
                    {formatPrice(
                      (product.price || 0) * (product.quantity || 1)
                    )}
                  </span>
                </div>
              </div>
            </div>

            {/* Separator line between items (not after the last item) */}
            {index < (order.cartList?.length || 0) - 1 && (
              <div className="my-4 border-t border-gray-200 dark:border-slate-700"></div>
            )}
          </div>
        ))}
      </div>

      {/* Shipping & Tracking Information */}
      {/* Only shows for shipped/delivered orders, hides for cancelled/refunded */}
      <OrderTrackingInfo order={order} />
    </div>
  );
};
