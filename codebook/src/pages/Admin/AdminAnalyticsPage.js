/**
 * AdminAnalyticsPage Component
 *
 * Comprehensive analytics dashboard for admin users.
 * Displays revenue charts, sales trends, top products, user analytics, and product performance.
 * Includes export functionality (CSV/PDF).
 *
 * Features:
 * - Revenue charts (daily, weekly, monthly, yearly)
 * - Sales trends over time
 * - Top-selling products
 * - User registration trends
 * - Product performance metrics
 * - Export to CSV/PDF
 */

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useTitle } from "../../hooks/useTitle";
import {
  useRevenueByPeriod,
  useSalesTrends,
  useTopProducts,
  useProductPerformance,
  useUserAnalytics,
  useAnalyticsSummary,
} from "../../hooks/useAnalytics";
import { AdminLayout, useAdminLayout } from "../../components/Layouts/Admin";
import {
  PageHeader,
  Card,
  RevenueChart,
  SalesTrendChart,
  TopProductsChart,
  UserAnalyticsChart,
  LoadingState,
  ErrorState,
  FormSelect,
  StatusBadge,
} from "../../components/ui";
import {
  exportRevenueToCSV,
  exportTopProductsToCSV,
  exportUserAnalyticsToCSV,
  exportSalesTrendsToCSV,
  exportSummaryToCSV,
  printToPDF,
} from "../../utils/exportUtils";
import { formatPrice } from "../../utils/formatPrice";

const AdminAnalyticsContent = () => {
  const { toggleSidebar } = useAdminLayout();
  const navigate = useNavigate();

  // State for period selection
  const [revenuePeriod, setRevenuePeriod] = useState("monthly");

  // Fetch all analytics data
  const {
    data: revenueData,
    isLoading: revenueLoading,
    error: revenueError,
  } = useRevenueByPeriod(revenuePeriod);

  const {
    data: salesTrendsData,
    isLoading: salesTrendsLoading,
    error: salesTrendsError,
  } = useSalesTrends(30);

  const {
    data: topProductsData,
    isLoading: topProductsLoading,
    error: topProductsError,
  } = useTopProducts(10);

  const {
    data: productPerformance,
    isLoading: performanceLoading,
    error: performanceError,
  } = useProductPerformance();

  const {
    data: userAnalytics,
    isLoading: userAnalyticsLoading,
    error: userAnalyticsError,
  } = useUserAnalytics();

  const {
    data: summary,
    isLoading: summaryLoading,
    error: summaryError,
  } = useAnalyticsSummary();

  // Check for errors
  useEffect(() => {
    const errors = [
      revenueError,
      salesTrendsError,
      topProductsError,
      performanceError,
      userAnalyticsError,
      summaryError,
    ].filter(Boolean);

    if (errors.length > 0) {
      toast.error("Failed to load some analytics data", {
        closeButton: true,
        position: "bottom-right",
      });
    }
  }, [
    revenueError,
    salesTrendsError,
    topProductsError,
    performanceError,
    userAnalyticsError,
    summaryError,
  ]);

  // Loading state
  const isLoading =
    revenueLoading ||
    salesTrendsLoading ||
    topProductsLoading ||
    performanceLoading ||
    userAnalyticsLoading ||
    summaryLoading;

  // Export handlers
  const handleExportRevenue = () => {
    if (!revenueData || revenueData.length === 0) {
      toast.error("No revenue data to export", {
        closeButton: true,
        position: "bottom-right",
      });
      return;
    }
    exportRevenueToCSV(revenueData, revenuePeriod);
    toast.success("Revenue data exported successfully", {
      closeButton: true,
      position: "bottom-right",
    });
  };

  const handleExportTopProducts = () => {
    if (!topProductsData || topProductsData.length === 0) {
      toast.error("No product data to export", {
        closeButton: true,
        position: "bottom-right",
      });
      return;
    }
    exportTopProductsToCSV(topProductsData);
    toast.success("Top products data exported successfully", {
      closeButton: true,
      position: "bottom-right",
    });
  };

  const handleExportUserAnalytics = () => {
    if (
      !userAnalytics?.registrationTrends ||
      userAnalytics.registrationTrends.length === 0
    ) {
      toast.error("No user analytics data to export", {
        closeButton: true,
        position: "bottom-right",
      });
      return;
    }
    exportUserAnalyticsToCSV(userAnalytics.registrationTrends);
    toast.success("User analytics data exported successfully", {
      closeButton: true,
      position: "bottom-right",
    });
  };

  const handleExportSalesTrends = () => {
    if (!salesTrendsData || salesTrendsData.length === 0) {
      toast.error("No sales trends data to export", {
        closeButton: true,
        position: "bottom-right",
      });
      return;
    }
    exportSalesTrendsToCSV(salesTrendsData);
    toast.success("Sales trends data exported successfully", {
      closeButton: true,
      position: "bottom-right",
    });
  };

  const handleExportSummary = () => {
    if (!summary) {
      toast.error("No summary data to export", {
        closeButton: true,
        position: "bottom-right",
      });
      return;
    }
    exportSummaryToCSV(summary);
    toast.success("Analytics summary exported successfully", {
      closeButton: true,
      position: "bottom-right",
    });
  };

  const handlePrintPDF = () => {
    printToPDF();
  };

  // Period options for revenue chart
  const periodOptions = [
    { value: "daily", label: "Daily" },
    { value: "weekly", label: "Weekly" },
    { value: "monthly", label: "Monthly" },
    { value: "yearly", label: "Yearly" },
  ];

  return (
    <div className="space-y-6 w-full max-w-full">
      <PageHeader
        title="Business Insights Dashboard"
        description="Comprehensive analytics and insights for your e-commerce platform"
        onToggleSidebar={toggleSidebar}
        showBackButton={false}
      />

      {/* Loading State */}
      {isLoading && (
        <div className="space-y-6">
          <LoadingState message="Loading analytics data..." />
        </div>
      )}

      {/* Error State */}
      {!isLoading && (summaryError || revenueError) && (
        <ErrorState message="Failed to load analytics data. Please try again later." />
      )}

      {/* Analytics Content */}
      {!isLoading && !summaryError && (
        <>
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="p-4 sm:p-6">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Total Revenue
                </h3>
                <span className="bi-currency-dollar text-xl text-blue-600 dark:text-blue-400"></span>
              </div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {summary ? formatPrice(summary.totalRevenue) : "$0.00"}
              </p>
            </Card>

            <Card className="p-4 sm:p-6">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Total Orders
                </h3>
                <span className="bi-cart-check text-xl text-green-600 dark:text-green-400"></span>
              </div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {summary?.totalOrders || 0}
              </p>
            </Card>

            <Card className="p-4 sm:p-6">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Total Products
                </h3>
                <span className="bi-box-seam text-xl text-purple-600 dark:text-purple-400"></span>
              </div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {summary?.totalProducts || 0}
              </p>
            </Card>

            <Card className="p-4 sm:p-6">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Total Users
                </h3>
                <span className="bi-people text-xl text-indigo-600 dark:text-indigo-400"></span>
              </div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {summary?.totalUsers || 0}
              </p>
            </Card>
          </div>

          {/* Additional Metrics */}
          {summary && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="p-4 sm:p-6">
                <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
                  Average Order Value
                </h3>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {formatPrice(summary.averageOrderValue)}
                </p>
              </Card>

              {productPerformance && (
                <Card className="p-4 sm:p-6">
                  <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
                    Products Sold
                  </h3>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {productPerformance.productsSold} /{" "}
                    {productPerformance.totalProducts}
                  </p>
                </Card>
              )}
            </div>
          )}

          {/* Revenue Chart with Period Selector */}
          <div className="space-y-4">
            <div className="flex items-center justify-between gap-4 w-full">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white flex-shrink min-w-0">
                Revenue Analysis
              </h2>
              <div className="flex items-center gap-3 flex-shrink-0">
                <FormSelect
                  id="revenue-period"
                  name="revenue-period"
                  value={revenuePeriod}
                  onChange={(e) => setRevenuePeriod(e.target.value)}
                  options={periodOptions}
                  className="w-32"
                />
                <button
                  onClick={handleExportRevenue}
                  className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors whitespace-nowrap"
                >
                  <span className="bi-download mr-2"></span>
                  Export CSV
                </button>
              </div>
            </div>
            <RevenueChart
              data={revenueData}
              period={revenuePeriod}
              isLoading={revenueLoading}
              error={revenueError}
            />
          </div>

          {/* Sales Trends Chart */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Sales Trends
              </h2>
              <button
                onClick={handleExportSalesTrends}
                className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
              >
                <span className="bi-download mr-2"></span>
                Export CSV
              </button>
            </div>
            <SalesTrendChart
              data={salesTrendsData}
              isLoading={salesTrendsLoading}
              error={salesTrendsError}
            />
          </div>

          {/* Top Products Chart */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Top Selling Products
              </h2>
              <button
                onClick={handleExportTopProducts}
                className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
              >
                <span className="bi-download mr-2"></span>
                Export CSV
              </button>
            </div>
            <TopProductsChart
              data={topProductsData}
              limit={10}
              isLoading={topProductsLoading}
              error={topProductsError}
            />
          </div>

          {/* Product Performance */}
          {productPerformance && (
            <Card className="p-4 sm:p-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                Product Performance
              </h2>

              {/* Summary Metrics */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                  <h3 className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                    Total Products
                  </h3>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {productPerformance.totalProducts}
                  </p>
                </div>
                <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                  <h3 className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                    Products Sold
                  </h3>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {productPerformance.productsSold}
                  </p>
                </div>
                <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                  <h3 className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                    Average Price
                  </h3>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {formatPrice(productPerformance.averagePrice)}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Best Sellers (All Tied) */}
                <div>
                  <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                    Best Sellers
                    {productPerformance.bestSellers &&
                      productPerformance.bestSellers.length > 1 && (
                        <StatusBadge
                          status="featured"
                          customLabels={{ featured: "Tied" }}
                        />
                      )}
                  </h3>
                  {productPerformance.bestSellers &&
                  productPerformance.bestSellers.length > 0 ? (
                    <div className="space-y-2">
                      {productPerformance.bestSellers.map((product, index) => (
                        <div
                          key={product.id}
                          className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg border border-gray-200 dark:border-gray-700"
                        >
                          <p className="text-sm font-semibold text-gray-900 dark:text-white mb-1">
                            {product.name}
                          </p>
                          <div className="flex items-center gap-4 text-xs text-gray-600 dark:text-gray-400">
                            <span>Revenue: {formatPrice(product.revenue)}</span>
                            <span>Qty: {product.quantity}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500 dark:text-gray-500">
                      No best sellers yet
                    </p>
                  )}
                </div>

                {/* Top 3 by Revenue */}
                <div>
                  <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">
                    Top 3 by Revenue
                  </h3>
                  {productPerformance.topSellersByRevenue &&
                  productPerformance.topSellersByRevenue.length > 0 ? (
                    <div className="space-y-2">
                      {productPerformance.topSellersByRevenue.map(
                        (product, index) => (
                          <div
                            key={product.id}
                            className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg border border-gray-200 dark:border-gray-700 flex items-center justify-between"
                          >
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="text-xs font-bold text-gray-500 dark:text-gray-400">
                                  #{index + 1}
                                </span>
                                <p className="text-sm font-semibold text-gray-900 dark:text-white">
                                  {product.name}
                                </p>
                              </div>
                              <div className="flex items-center gap-4 text-xs text-gray-600 dark:text-gray-400">
                                <span>
                                  Revenue: {formatPrice(product.revenue)}
                                </span>
                                <span>Qty: {product.quantity}</span>
                              </div>
                            </div>
                          </div>
                        )
                      )}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500 dark:text-gray-500">
                      No sales data yet
                    </p>
                  )}
                </div>

                {/* Top 3 by Quantity (Demand) */}
                <div>
                  <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">
                    Top 3 by Demand (Quantity Sold)
                  </h3>
                  {productPerformance.topSellersByQuantity &&
                  productPerformance.topSellersByQuantity.length > 0 ? (
                    <div className="space-y-2">
                      {productPerformance.topSellersByQuantity.map(
                        (product, index) => (
                          <div
                            key={product.id}
                            className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg border border-gray-200 dark:border-gray-700 flex items-center justify-between"
                          >
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="text-xs font-bold text-gray-500 dark:text-gray-400">
                                  #{index + 1}
                                </span>
                                <p className="text-sm font-semibold text-gray-900 dark:text-white">
                                  {product.name}
                                </p>
                              </div>
                              <div className="flex items-center gap-4 text-xs text-gray-600 dark:text-gray-400">
                                <span className="font-semibold">
                                  Qty: {product.quantity}
                                </span>
                                <span>
                                  Revenue: {formatPrice(product.revenue)}
                                </span>
                              </div>
                            </div>
                          </div>
                        )
                      )}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500 dark:text-gray-500">
                      No sales data yet
                    </p>
                  )}
                </div>

                {/* Unsold Products */}
                <div>
                  <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">
                    Unsold Products
                    {productPerformance.unsoldProducts &&
                      productPerformance.unsoldProducts.length > 0 && (
                        <span className="ml-2 text-xs font-normal text-gray-500 dark:text-gray-400">
                          ({productPerformance.unsoldProducts.length})
                        </span>
                      )}
                  </h3>
                  {productPerformance.unsoldProducts &&
                  productPerformance.unsoldProducts.length > 0 ? (
                    <div className="max-h-64 overflow-y-auto space-y-2">
                      {productPerformance.unsoldProducts.map((product) => (
                        <div
                          key={product.id}
                          className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg border border-gray-200 dark:border-gray-700 flex items-center justify-between"
                        >
                          <div className="flex-1">
                            <p className="text-sm font-medium text-gray-900 dark:text-white mb-1">
                              {product.name}
                            </p>
                            <p className="text-xs text-gray-600 dark:text-gray-400">
                              Price: {formatPrice(product.price)}
                            </p>
                          </div>
                          <StatusBadge
                            status="unverified"
                            customLabels={{ unverified: "No Sales" }}
                          />
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500 dark:text-gray-500">
                      All products have been sold
                    </p>
                  )}
                </div>
              </div>
            </Card>
          )}

          {/* User Analytics Chart */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                User Analytics
              </h2>
              <button
                onClick={handleExportUserAnalytics}
                className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
              >
                <span className="bi-download mr-2"></span>
                Export CSV
              </button>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card className="p-4 sm:p-6">
                <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
                  Total Users
                </h3>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {userAnalytics?.totalUsers || 0}
                </p>
              </Card>
              <Card className="p-4 sm:p-6">
                <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
                  Active Users
                </h3>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {userAnalytics?.activeUsers || 0}
                </p>
              </Card>
              <Card className="p-4 sm:p-6">
                <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
                  New Users This Month
                </h3>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {userAnalytics?.newUsersThisMonth || 0}
                </p>
              </Card>
            </div>
            <UserAnalyticsChart
              data={userAnalytics?.registrationTrends || []}
              isLoading={userAnalyticsLoading}
              error={userAnalyticsError}
            />
          </div>

          {/* Export All / Print PDF */}
          <Card className="p-4 sm:p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Export Reports
            </h2>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={handleExportSummary}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 dark:bg-blue-500 rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors"
              >
                <span className="bi-download mr-2"></span>
                Export Summary (CSV)
              </button>
              <button
                onClick={handlePrintPDF}
                className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
              >
                <span className="bi-printer mr-2"></span>
                Print / Save as PDF
              </button>
            </div>
          </Card>
        </>
      )}
    </div>
  );
};

export const AdminAnalyticsPage = () => {
  useTitle("Business Insights - Admin");
  const navigate = useNavigate();

  useEffect(() => {
    const userRole = sessionStorage.getItem("userRole");
    if (userRole !== "admin") {
      toast.error("Admin access required", {
        closeButton: true,
        position: "bottom-right",
      });
      navigate("/products");
    }
  }, [navigate]);

  return (
    <AdminLayout>
      <AdminAnalyticsContent />
    </AdminLayout>
  );
};
