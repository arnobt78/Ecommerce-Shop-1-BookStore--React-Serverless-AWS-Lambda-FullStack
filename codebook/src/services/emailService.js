/**
 * Email Service - Send transactional emails via Brevo
 *
 * This service handles sending emails through the Lambda email API.
 * Used for order confirmations, shipping notifications, admin alerts, etc.
 */

import { ApiError } from "./apiError";

// AWS Lambda HTTP API Base URL
const LAMBDA_API_BASE =
  process.env.REACT_APP_LAMBDA_API_URL ||
  "https://d4vvkswb4a.execute-api.eu-north-1.amazonaws.com";

/**
 * Get session data from storage
 * @returns {Object} Session data with token and user ID
 */
function getSession() {
  try {
    const token = JSON.parse(sessionStorage.getItem("token"));
    const cbid = JSON.parse(sessionStorage.getItem("cbid"));
    return { token, cbid };
  } catch {
    return { token: null, cbid: null };
  }
}

/**
 * Send email via Brevo API
 *
 * @param {string} to - Recipient email address
 * @param {string} template - Email template name (e.g., "order-confirmation", "shipping-notification")
 * @param {Object} data - Template data (orderId, customerName, items, etc.)
 * @returns {Promise<Object>} Email send result
 * @throws {ApiError} If email sending fails
 *
 * Available templates:
 * - Customer: order-confirmation, shipping-notification, delivery-confirmation, payment-processing, payment-failed, order-canceled, order-refunded
 * - Admin: admin-new-order, admin-low-stock, admin-payment-failure, admin-refund-processed
 */
export async function sendEmail(to, template, data = {}) {
  const browserData = getSession();
  if (!browserData.token) {
    throw new ApiError("User not authenticated", 401);
  }

  const requestOptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${browserData.token}`,
    },
    body: JSON.stringify({
      to,
      template,
      data,
    }),
  };

  const response = await fetch(`${LAMBDA_API_BASE}/email/send`, requestOptions);

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new ApiError(
      errorData.message || "Failed to send email",
      response.status
    );
  }

  return await response.json();
}

/**
 * Send order confirmation email to customer
 *
 * @param {Object} orderData - Order data (orderId, customerName, customerEmail, items, total, orderDate)
 * @returns {Promise<Object>} Email send result
 */
export async function sendOrderConfirmationEmail(orderData) {
  const { customerEmail, customerName, orderId, items, total, orderDate } = orderData;

  if (!customerEmail) {
    throw new ApiError("Customer email is required", 400);
  }

  return sendEmail(customerEmail, "order-confirmation", {
    orderId,
    customerName,
    items,
    total,
    orderDate,
  });
}

/**
 * Send shipping notification email to customer
 *
 * @param {Object} shippingData - Shipping data (orderId, customerName, customerEmail, trackingNumber, trackingCarrier, trackingUrl)
 * @returns {Promise<Object>} Email send result
 */
export async function sendShippingNotificationEmail(shippingData) {
  const { customerEmail, customerName, orderId, trackingNumber, trackingCarrier, trackingUrl } = shippingData;

  if (!customerEmail) {
    throw new ApiError("Customer email is required", 400);
  }

  return sendEmail(customerEmail, "shipping-notification", {
    orderId,
    customerName,
    trackingNumber,
    trackingCarrier: trackingCarrier || "usps",
    trackingUrl: trackingUrl || null,
  });
}

/**
 * Send delivery confirmation email to customer
 *
 * @param {Object} deliveryData - Delivery data (orderId, customerName, customerEmail)
 * @returns {Promise<Object>} Email send result
 */
export async function sendDeliveryConfirmationEmail(deliveryData) {
  const { customerEmail, customerName, orderId } = deliveryData;

  if (!customerEmail) {
    throw new ApiError("Customer email is required", 400);
  }

  return sendEmail(customerEmail, "delivery-confirmation", {
    orderId,
    customerName,
  });
}

/**
 * Send payment processing email to customer
 *
 * @param {Object} paymentData - Payment data (orderId, customerName, customerEmail, amount)
 * @returns {Promise<Object>} Email send result
 */
export async function sendPaymentProcessingEmail(paymentData) {
  const { customerEmail, customerName, orderId, amount } = paymentData;

  if (!customerEmail) {
    throw new ApiError("Customer email is required", 400);
  }

  return sendEmail(customerEmail, "payment-processing", {
    orderId,
    customerName,
    amount,
  });
}

/**
 * Send payment failed email to customer
 *
 * @param {Object} paymentData - Payment data (orderId, customerName, customerEmail, amount)
 * @returns {Promise<Object>} Email send result
 */
export async function sendPaymentFailedEmail(paymentData) {
  const { customerEmail, customerName, orderId, amount } = paymentData;

  if (!customerEmail) {
    throw new ApiError("Customer email is required", 400);
  }

  return sendEmail(customerEmail, "payment-failed", {
    orderId,
    customerName,
    amount,
  });
}

/**
 * Send order canceled email to customer
 *
 * @param {Object} cancelData - Cancel data (orderId, customerName, customerEmail, refundAmount)
 * @returns {Promise<Object>} Email send result
 */
export async function sendOrderCanceledEmail(cancelData) {
  const { customerEmail, customerName, orderId, refundAmount } = cancelData;

  if (!customerEmail) {
    throw new ApiError("Customer email is required", 400);
  }

  return sendEmail(customerEmail, "order-canceled", {
    orderId,
    customerName,
    refundAmount,
  });
}

/**
 * Send order refunded email to customer
 *
 * @param {Object} refundData - Refund data (orderId, customerName, customerEmail, refundAmount, refundId)
 * @returns {Promise<Object>} Email send result
 */
export async function sendOrderRefundedEmail(refundData) {
  const { customerEmail, customerName, orderId, refundAmount, refundId } = refundData;

  if (!customerEmail) {
    throw new ApiError("Customer email is required", 400);
  }

  return sendEmail(customerEmail, "order-refunded", {
    orderId,
    customerName,
    refundAmount,
    refundId,
  });
}

/**
 * Send new order alert email to admin
 *
 * @param {Object} orderData - Order data (orderId, customerName, customerEmail, total, itemCount, totalQuantity, items)
 * @returns {Promise<Object>} Email send result
 */
export async function sendAdminNewOrderEmail(orderData) {
  const { orderId, customerName, customerEmail, total, itemCount, totalQuantity, items } = orderData;

  return sendEmail("arnobt78@gmail.com", "admin-new-order", {
    orderId,
    customerName,
    customerEmail,
    total,
    itemCount,
    totalQuantity, // Total quantity across all items
    items, // Items array for detailed display
  });
}

/**
 * Send low stock alert email to admin
 *
 * @param {Object} stockData - Stock data (productId, productName, currentStock, lowStockThreshold)
 * @returns {Promise<Object>} Email send result
 */
export async function sendAdminLowStockEmail(stockData) {
  const { productId, productName, currentStock, lowStockThreshold } = stockData;

  return sendEmail("arnobt78@gmail.com", "admin-low-stock", {
    productId,
    productName,
    currentStock,
    lowStockThreshold,
  });
}

/**
 * Send out of stock alert email to admin
 *
 * @param {Object} stockData - Stock data (productId, productName)
 * @returns {Promise<Object>} Email send result
 */
export async function sendAdminOutOfStockEmail(stockData) {
  const { productId, productName } = stockData;

  return sendEmail("arnobt78@gmail.com", "admin-out-of-stock", {
    productId,
    productName,
  });
}

/**
 * Send payment failure alert email to admin
 *
 * @param {Object} paymentData - Payment data (orderId, customerName, amount, error)
 * @returns {Promise<Object>} Email send result
 */
export async function sendAdminPaymentFailureEmail(paymentData) {
  const { orderId, customerName, amount, error } = paymentData;

  return sendEmail("arnobt78@gmail.com", "admin-payment-failure", {
    orderId,
    customerName,
    amount,
    error,
  });
}

/**
 * Send refund processed alert email to admin
 *
 * @param {Object} refundData - Refund data (orderId, customerName, refundAmount, refundId)
 * @returns {Promise<Object>} Email send result
 */
export async function sendAdminRefundProcessedEmail(refundData) {
  const { orderId, customerName, refundAmount, refundId } = refundData;

  return sendEmail("arnobt78@gmail.com", "admin-refund-processed", {
    orderId,
    customerName,
    refundAmount,
    refundId,
  });
}

