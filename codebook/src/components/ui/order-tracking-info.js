/**
 * Order Tracking Info Component
 *
 * Displays shipping tracking information for orders.
 * Shows tracking number, carrier, tracking URL, and label PDF download.
 * Only displays for shipped orders (hides for cancelled/refunded orders).
 *
 * @param {Object} order - Order object with tracking information
 * @param {string} className - Additional CSS classes
 */

import { Card } from "./card";
import { StatusBadge } from "./status-badge";

export function OrderTrackingInfo({ order, className = "" }) {
  // Don't show tracking info for cancelled or refunded orders
  // Check both order.status and paymentStatus (order can be shipped but payment refunded)
  const isInvalidStatus = 
    order.status === "cancelled" || 
    order.status === "refunded" ||
    order.paymentStatus === "refunded";
  
  // Only show tracking info if order is shipped/delivered and has tracking number
  // Hide if order is cancelled/refunded (tracking is no longer valid)
  const hasTrackingInfo = 
    (order.status === "shipped" || order.status === "delivered") && 
    order.trackingNumber &&
    !isInvalidStatus;

  if (!hasTrackingInfo) {
    return null;
  }

  // Generate tracking URL based on carrier if not provided
  const getTrackingUrl = () => {
    if (order.trackingUrl) {
      return order.trackingUrl;
    }

    const trackingNumber = order.trackingNumber;
    const carrier = (order.trackingCarrier || "usps").toLowerCase();

    // Generate carrier-specific tracking URLs
    switch (carrier) {
      case "usps":
        return `https://tools.usps.com/go/TrackConfirmAction_input?origTrackNum=${trackingNumber}`;
      case "ups":
        return `https://www.ups.com/track?tracknum=${trackingNumber}`;
      case "fedex":
        return `https://www.fedex.com/fedextrack/?trknbr=${trackingNumber}`;
      case "dhl":
        return `https://www.dhl.com/en/express/tracking.html?AWB=${trackingNumber}`;
      default:
        return null;
    }
  };

  const trackingUrl = getTrackingUrl();
  const carrier = (order.trackingCarrier || "usps").toUpperCase();

  return (
    <Card className={`mt-4 ${className}`}>
      <div className="p-4">
        <div className="flex items-center gap-2 mb-3">
          <i className="bi bi-truck text-lg text-purple-600 dark:text-purple-400"></i>
          <h4 className="text-sm font-semibold text-gray-900 dark:text-white">
            Shipping & Tracking
          </h4>
        </div>

        <div className="space-y-3">
          {/* Tracking Number */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-2">
            <span className="text-xs font-medium text-gray-600 dark:text-gray-400 whitespace-nowrap">
              Tracking Number:
            </span>
            <span className="text-sm font-mono text-gray-900 dark:text-white break-all">
              {order.trackingNumber}
            </span>
          </div>

          {/* Carrier Badge */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-gray-600 dark:text-gray-400">
              Carrier:
            </span>
            <StatusBadge
              status={carrier}
              className="bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800"
            />
          </div>

          {/* Tracking URL Link */}
          {trackingUrl && (
            <div>
              <a
                href={trackingUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 hover:underline transition-colors"
              >
                <i className="bi bi-box-arrow-up-right text-xs"></i>
                <span>Track Package</span>
              </a>
            </div>
          )}

          {/* Label PDF Download (only if available) */}
          {order.labelUrl && (
            <div>
              <a
                href={order.labelUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-white bg-blue-600 dark:bg-blue-500 hover:bg-blue-700 dark:hover:bg-blue-600 rounded-lg transition-colors"
              >
                <i className="bi bi-download text-xs"></i>
                <span>Download Label PDF</span>
              </a>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}

