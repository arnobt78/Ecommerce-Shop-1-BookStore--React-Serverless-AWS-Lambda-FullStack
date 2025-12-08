/**
 * React Query hooks for analytics data
 *
 * Provides automatic caching, deduplication, and loading states for analytics.
 * All analytics calculations are done client-side from existing data.
 * Uses infinite cache strategy - data cached until manually invalidated.
 */

import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { useAllOrders } from "./useAdmin";
import { useAllProducts } from "./useAdmin";
import { useAllUsers } from "./useAdmin";
import {
  calculateRevenueByPeriod,
  calculateSalesTrends,
  calculateTopProducts,
  calculateProductPerformance,
  calculateUserAnalytics,
  calculateAnalyticsSummary,
} from "../services/analyticsService";

/**
 * Hook to get revenue data by period (daily, weekly, monthly, yearly)
 * @param {string} period - 'daily', 'weekly', 'monthly', 'yearly'
 * @param {boolean} enabled - Whether to enable the query (default: true)
 * @returns {Object} Query result with revenue data, loading, error states
 */
export function useRevenueByPeriod(period = "monthly", enabled = true) {
  const { data: orders = [], isLoading: ordersLoading, error: ordersError } = useAllOrders(enabled);

  const revenueData = useMemo(() => {
    if (ordersLoading || ordersError || !orders.length) return [];
    return calculateRevenueByPeriod(orders, period);
  }, [orders, period, ordersLoading, ordersError]);

  return {
    data: revenueData,
    isLoading: ordersLoading,
    error: ordersError,
  };
}

/**
 * Hook to get sales trends (revenue over time)
 * @param {number} days - Number of days to analyze (default: 30)
 * @param {boolean} enabled - Whether to enable the query (default: true)
 * @returns {Object} Query result with trends data, loading, error states
 */
export function useSalesTrends(days = 30, enabled = true) {
  const { data: orders = [], isLoading: ordersLoading, error: ordersError } = useAllOrders(enabled);

  const trendsData = useMemo(() => {
    if (ordersLoading || ordersError || !orders.length) return [];
    return calculateSalesTrends(orders, days);
  }, [orders, days, ordersLoading, ordersError]);

  return {
    data: trendsData,
    isLoading: ordersLoading,
    error: ordersError,
  };
}

/**
 * Hook to get top-selling products
 * @param {number} limit - Number of top products to return (default: 10)
 * @param {boolean} enabled - Whether to enable the query (default: true)
 * @returns {Object} Query result with top products data, loading, error states
 */
export function useTopProducts(limit = 10, enabled = true) {
  const { data: orders = [], isLoading: ordersLoading, error: ordersError } = useAllOrders(enabled);
  const { data: products = [], isLoading: productsLoading, error: productsError } = useAllProducts(enabled);

  const topProducts = useMemo(() => {
    if (ordersLoading || productsLoading || ordersError || productsError || !orders.length || !products.length) {
      return [];
    }
    return calculateTopProducts(orders, products, limit);
  }, [orders, products, limit, ordersLoading, productsLoading, ordersError, productsError]);

  return {
    data: topProducts,
    isLoading: ordersLoading || productsLoading,
    error: ordersError || productsError,
  };
}

/**
 * Hook to get product performance metrics
 * @param {boolean} enabled - Whether to enable the query (default: true)
 * @returns {Object} Query result with performance metrics, loading, error states
 */
export function useProductPerformance(enabled = true) {
  const { data: orders = [], isLoading: ordersLoading, error: ordersError } = useAllOrders(enabled);
  const { data: products = [], isLoading: productsLoading, error: productsError } = useAllProducts(enabled);

  const performance = useMemo(() => {
    if (ordersLoading || productsLoading || ordersError || productsError) {
      return {
        totalProducts: 0,
        productsSold: 0,
        averagePrice: 0,
        totalRevenue: 0,
        bestSeller: null,
        bestSellers: [],
        topSellersByRevenue: [],
        topSellersByQuantity: [],
        unsoldProducts: [],
      };
    }
    return calculateProductPerformance(orders, products);
  }, [orders, products, ordersLoading, productsLoading, ordersError, productsError]);

  return {
    data: performance,
    isLoading: ordersLoading || productsLoading,
    error: ordersError || productsError,
  };
}

/**
 * Hook to get user analytics
 * @param {boolean} enabled - Whether to enable the query (default: true)
 * @returns {Object} Query result with user analytics, loading, error states
 */
export function useUserAnalytics(enabled = true) {
  const { data: users = [], isLoading: usersLoading, error: usersError } = useAllUsers(enabled);
  const { data: orders = [], isLoading: ordersLoading, error: ordersError } = useAllOrders(enabled);

  const userAnalytics = useMemo(() => {
    if (usersLoading || ordersLoading || usersError || ordersError) {
      return {
        totalUsers: 0,
        activeUsers: 0,
        newUsersThisMonth: 0,
        registrationTrends: [],
      };
    }
    return calculateUserAnalytics(users, orders);
  }, [users, orders, usersLoading, ordersLoading, usersError, ordersError]);

  return {
    data: userAnalytics,
    isLoading: usersLoading || ordersLoading,
    error: usersError || ordersError,
  };
}

/**
 * Hook to get overall analytics summary
 * @param {boolean} enabled - Whether to enable the query (default: true)
 * @returns {Object} Query result with summary data, loading, error states
 */
export function useAnalyticsSummary(enabled = true) {
  const { data: orders = [], isLoading: ordersLoading, error: ordersError } = useAllOrders(enabled);
  const { data: products = [], isLoading: productsLoading, error: productsError } = useAllProducts(enabled);
  const { data: users = [], isLoading: usersLoading, error: usersError } = useAllUsers(enabled);

  const summary = useMemo(() => {
    if (ordersLoading || productsLoading || usersLoading || ordersError || productsError || usersError) {
      return {
        totalRevenue: 0,
        totalOrders: 0,
        totalProducts: 0,
        totalUsers: 0,
        averageOrderValue: 0,
      };
    }
    return calculateAnalyticsSummary(orders, products, users);
  }, [orders, products, users, ordersLoading, productsLoading, usersLoading, ordersError, productsError, usersError]);

  return {
    data: summary,
    isLoading: ordersLoading || productsLoading || usersLoading,
    error: ordersError || productsError || usersError,
  };
}

