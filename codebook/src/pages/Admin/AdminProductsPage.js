/**
 * AdminProductsPage Component
 *
 * Product management page for admin panel.
 * Displays all products in a table with search, filters, and CRUD operations.
 * Uses React Query for efficient data fetching and caching.
 *
 * Features:
 * - Product list table with search and filters
 * - Create new product button
 * - Edit/Delete actions for each product
 * - Real-time updates with cache invalidation
 */

import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { toast } from "react-toastify";
import { useTitle } from "../../hooks/useTitle";
import { useAllProducts, useDeleteProduct } from "../../hooks/useAdmin";
import { AdminLayout, useAdminLayout } from "../../components/Layouts/Admin";
import {
  getProductImageUrl,
  getProductImageKey,
} from "../../utils/productImage";
import { formatPrice } from "../../utils/formatPrice";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  SortableTable,
  PageHeader,
  SearchFilterBar,
  StatusBadge,
  LoadingState,
  ErrorState,
  EmptyState,
  Card,
  ResultsCount,
} from "../../components/ui";

// Inner component that uses the AdminLayout context
const AdminProductsContent = () => {
  const { toggleSidebar } = useAdminLayout();
  const navigate = useNavigate();
  const { data: products, isLoading, error } = useAllProducts();
  const deleteProductMutation = useDeleteProduct();
  const [searchQuery, setSearchQuery] = useState("");
  const [filterInStock, setFilterInStock] = useState("all"); // "all", "in_stock", "out_of_stock", "featured"
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null); // { id, name }

  // Show error toast if API call fails
  useEffect(() => {
    if (error) {
      toast.error(error.message || "Failed to load products", {
        closeButton: true,
        position: "bottom-right",
      });
    }
  }, [error]);

  // Filter products based on search query and stock filter
  const filteredProducts = useMemo(() => {
    if (!products) return [];

    let filtered = [...products];

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      filtered = filtered.filter(
        (product) =>
          product.name?.toLowerCase().includes(query) ||
          product.overview?.toLowerCase().includes(query) ||
          product.id?.toLowerCase().includes(query)
      );
    }

    // Apply stock filter
    if (filterInStock === "in_stock") {
      filtered = filtered.filter((product) => product.in_stock === true);
    } else if (filterInStock === "out_of_stock") {
      filtered = filtered.filter((product) => product.in_stock === false);
    } else if (filterInStock === "featured") {
      // Filter for featured products (handle both Number 1/0 and Boolean true/false)
      filtered = filtered.filter(
        (product) =>
          product.featured_product === 1 || product.featured_product === true
      );
    }

    return filtered;
  }, [products, searchQuery, filterInStock]);

  // Open delete confirmation dialog
  const handleDeleteClick = (productId, productName) => {
    setProductToDelete({ id: productId, name: productName });
    setDeleteDialogOpen(true);
  };

  // Handle delete product confirmation
  const handleDeleteConfirm = async () => {
    if (!productToDelete) return;

    try {
      await deleteProductMutation.mutateAsync(productToDelete.id);
      setDeleteDialogOpen(false);
      setProductToDelete(null);
    } catch (error) {
      // Error toast is handled by the mutation hook
      console.error("Delete error:", error);
      // Keep dialog open on error so user can try again
    }
  };

  // Define table columns configuration
  const tableColumns = [
    {
      key: "name",
      label: "Name",
      sortable: true,
      className: "",
    },
    {
      key: "price",
      label: "Price",
      sortable: true,
      sortFn: (a, b) => Number(a.price || 0) - Number(b.price || 0),
      className: "",
    },
    {
      key: "stock",
      label: "Stock",
      sortable: true,
      sortFn: (a, b) => {
        // Sort by stock quantity (numeric)
        const aStock =
          a.stock !== undefined ? Number(a.stock) : a.in_stock ? 999 : 0;
        const bStock =
          b.stock !== undefined ? Number(b.stock) : b.in_stock ? 999 : 0;
        return aStock - bStock;
      },
      className: "",
    },
    {
      key: "best_seller",
      label: "Best Seller",
      sortable: true,
      sortFn: (a, b) => {
        // Sort: best sellers first
        if (a.best_seller === b.best_seller) return 0;
        return a.best_seller ? -1 : 1;
      },
      className: "",
    },
    {
      key: "featured_product",
      label: "Featured",
      sortable: true,
      sortFn: (a, b) => {
        // Sort: featured products first (handle both Number 1/0 and Boolean)
        const aFeatured =
          a.featured_product === 1 || a.featured_product === true;
        const bFeatured =
          b.featured_product === 1 || b.featured_product === true;
        if (aFeatured === bFeatured) return 0;
        return aFeatured ? -1 : 1;
      },
      className: "",
    },
    {
      key: "actions",
      label: "Actions",
      sortable: false,
      className: "",
    },
  ];

  // Available filter options
  const filterOptions = [
    { value: "all", label: "All Products" },
    { value: "in_stock", label: "In Stock" },
    { value: "out_of_stock", label: "Out of Stock" },
    { value: "featured", label: "Featured Products" },
  ];

  return (
    <div className="space-y-6 w-full max-w-full">
      {/* Page Header */}
      <PageHeader
        title="Products Management"
        description="Manage all products in your store"
        onToggleSidebar={toggleSidebar}
        actions={
          <button
            onClick={() => navigate("/admin/products/new")}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 dark:bg-blue-500 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors"
          >
            <span className="bi-plus-lg"></span>
            <span className="hidden sm:inline">Create Product</span>
          </button>
        }
      />

      {/* Loading State */}
      {isLoading && <LoadingState message="Loading products..." />}

      {/* Error State */}
      {error && !isLoading && (
        <ErrorState message={error.message || "Failed to load products"} />
      )}

      {/* Products Table */}
      {!isLoading && !error && (
        <Card className="p-0">
          {/* Search and Filter Bar */}
          <SearchFilterBar
            searchValue={searchQuery}
            onSearchChange={setSearchQuery}
            searchPlaceholder="Search by name, overview, or ID..."
            filterValue={filterInStock}
            onFilterChange={setFilterInStock}
            filterOptions={filterOptions}
          >
            <ResultsCount
              filteredCount={filteredProducts.length}
              totalCount={products?.length || 0}
              entityName="products"
            />
          </SearchFilterBar>

          {/* Products Table */}
          {filteredProducts.length === 0 ? (
            <EmptyState
              message={
                searchQuery || filterInStock !== "all"
                  ? "No products found matching your filters"
                  : "No products available"
              }
            />
          ) : (
            <SortableTable
              data={filteredProducts}
              columns={tableColumns}
              defaultSortColumn="name"
              defaultSortDirection="asc"
              renderRow={(product, index) => (
                <tr
                  key={product.id}
                  className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  <td className="px-4 sm:px-6 py-4">
                    <div className="flex items-center gap-3">
                      {/* Product Image */}
                      {getProductImageUrl(product) && (
                        <div className="flex-shrink-0">
                          <img
                            key={getProductImageKey(product)}
                            src={getProductImageUrl(product)}
                            alt={product.name || "Product"}
                            className="w-16 h-16 object-cover rounded-lg border border-gray-200 dark:border-gray-700"
                            loading="lazy"
                            onError={(e) => {
                              // Fallback if image fails to load
                              e.target.style.display = "none";
                            }}
                          />
                        </div>
                      )}
                      {/* Product Name and Overview */}
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {product.name || "N/A"}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400 truncate max-w-xs">
                          {product.overview || "No description"}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                    <span className="text-sm font-semibold text-gray-900 dark:text-white">
                      ${formatPrice(product.price)}
                    </span>
                  </td>
                  <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                    {/* Show stock quantity if available, otherwise fallback to in_stock boolean */}
                    {product.stock !== undefined ? (
                      <span
                        className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                          product.stock === 0
                            ? "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300"
                            : product.stock <= (product.lowStockThreshold || 10)
                            ? "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300"
                            : "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
                        }`}
                      >
                        <i
                          className={`bi ${
                            product.stock === 0
                              ? "bi-x-circle"
                              : product.stock <=
                                (product.lowStockThreshold || 10)
                              ? "bi-exclamation-triangle"
                              : "bi-check-circle"
                          } mr-1.5 text-xs`}
                        ></i>
                        {product.stock === 0
                          ? "Out of Stock"
                          : product.stock <= (product.lowStockThreshold || 10)
                          ? `Low (${product.stock})`
                          : product.stock}
                      </span>
                    ) : (
                      <StatusBadge
                        status={product.in_stock ? "in_stock" : "out_of_stock"}
                        customLabels={{
                          in_stock: "In Stock",
                          out_of_stock: "Out of Stock",
                        }}
                      />
                    )}
                  </td>
                  <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                    {product.best_seller ? (
                      <StatusBadge
                        status="best_seller"
                        customLabels={{ best_seller: "Best Seller" }}
                      />
                    ) : (
                      <span className="text-xs text-gray-400 dark:text-gray-500">
                        -
                      </span>
                    )}
                  </td>
                  <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                    {/* Featured badge - handle both Number (1/0) and Boolean (true/false) */}
                    {product.featured_product === 1 ||
                    product.featured_product === true ? (
                      <StatusBadge
                        status="featured"
                        customLabels={{ featured: "Featured" }}
                      />
                    ) : (
                      <span className="text-xs text-gray-400 dark:text-gray-500">
                        -
                      </span>
                    )}
                  </td>
                  <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center gap-2">
                      {/* View Button */}
                      <button
                        onClick={() => navigate(`/admin/products/${product.id}`)}
                        className="text-blue-600 dark:text-blue-400 hover:text-blue-900 dark:hover:text-blue-300"
                        aria-label="View product details"
                      >
                        <span className="bi-eye"></span>
                      </button>
                      {/* Edit Button */}
                      <button
                        onClick={() =>
                          navigate(`/admin/products/${product.id}/edit`)
                        }
                        className="text-blue-600 dark:text-blue-400 hover:text-blue-900 dark:hover:text-blue-300"
                        aria-label="Edit product"
                      >
                        <span className="bi-pencil"></span>
                      </button>
                      {/* Delete Button */}
                      <button
                        onClick={() =>
                          handleDeleteClick(product.id, product.name)
                        }
                        className="text-red-600 dark:text-red-400 hover:text-red-900 dark:hover:text-red-300"
                        aria-label="Delete product"
                        disabled={deleteProductMutation.isPending}
                      >
                        <span className="bi-trash"></span>
                      </button>
                    </div>
                  </td>
                </tr>
              )}
            />
          )}
        </Card>
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Product</AlertDialogTitle>
            <AlertDialogDescription>
              {productToDelete
                ? `Are you sure you want to delete "${productToDelete.name}"? This action cannot be undone.`
                : "Are you sure you want to delete this product? This action cannot be undone."}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleteProductMutation.isPending}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              disabled={deleteProductMutation.isPending}
              className="bg-red-600 dark:bg-red-500 hover:bg-red-700 dark:hover:bg-red-600"
            >
              {deleteProductMutation.isPending ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export const AdminProductsPage = () => {
  useTitle("Admin Products");
  const navigate = useNavigate();

  // Check if user is admin before rendering
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
      <AdminProductsContent />
    </AdminLayout>
  );
};
