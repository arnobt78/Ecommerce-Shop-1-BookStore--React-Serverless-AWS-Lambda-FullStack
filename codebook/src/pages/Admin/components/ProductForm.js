/**
 * ProductForm Component
 *
 * Form component for creating and editing products.
 * Handles form validation, submission, and error states.
 * Includes validation for max 3 featured products.
 *
 * @param {Object} product - Existing product data (for edit mode) or null (for create mode)
 * @param {Function} onSubmit - Callback function when form is submitted
 * @param {boolean} isLoading - Loading state from mutation
 * @param {number} featuredProductsCount - Current count of featured products (for validation)
 */

import { useState, useEffect } from "react";
import {
  FormInput,
  FormLabel,
  FormTextarea,
  FormCheckbox,
  FormError,
  ImageUpload,
} from "../../../components/ui";
import { useImageUpload } from "../../../hooks/useImageUpload";

export const ProductForm = ({ product = null, onSubmit, isLoading = false, featuredProductsCount = 0 }) => {
  const isEditMode = !!product;

  // Image upload hook
  const imageUploadMutation = useImageUpload({
    onSuccess: (result) => {
      // Update form data with uploaded image URL
      setFormData((prev) => ({
        ...prev,
        image_local: result.url || "",
      }));
    },
  });

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    stock: "",
    lowStockThreshold: "",
    overview: "",
    long_description: "",
    image_local: "",
    poster: "",
    in_stock: true,
    best_seller: false,
    featured_product: false,
    rating: "",
  });

  // Form validation errors
  const [errors, setErrors] = useState({});

  // Initialize form with product data if editing
  // Handle both Number (1/0) and Boolean (true/false) for backward compatibility
  useEffect(() => {
    if (product) {
      // Convert featured_product from Number (1/0) to Boolean for checkbox
      const featuredValue = product.featured_product !== undefined
        ? (product.featured_product === 1 || product.featured_product === true)
        : false;
      
      // Debug logging to verify product data being loaded
      console.log("📥 Product Form - Loading product data:", {
        productId: product.id,
        productStock: product.stock,
        productStockType: typeof product.stock,
        productLowStockThreshold: product.lowStockThreshold,
        productLowStockThresholdType: typeof product.lowStockThreshold,
        fullProduct: product,
      });
      
      const formDataToSet = {
        name: product.name || "",
        price: product.price || "",
        // Handle stock: preserve 0 values, use empty string only if undefined/null
        stock: product.stock !== undefined && product.stock !== null ? String(product.stock) : "",
        // Handle lowStockThreshold: preserve 0 values, use empty string only if undefined/null
        lowStockThreshold: product.lowStockThreshold !== undefined && product.lowStockThreshold !== null ? String(product.lowStockThreshold) : "",
        overview: product.overview || "",
        long_description: product.long_description || "",
        image_local: product.image_local || "",
        poster: product.poster || "",
        in_stock: product.in_stock !== undefined ? product.in_stock : true,
        best_seller: product.best_seller !== undefined ? product.best_seller : false,
        featured_product: featuredValue, // Boolean for checkbox (converted from Number)
        rating: product.rating !== undefined ? product.rating : "",
      };
      
      console.log("📝 Product Form - Setting form data:", {
        stock: formDataToSet.stock,
        stockType: typeof formDataToSet.stock,
        lowStockThreshold: formDataToSet.lowStockThreshold,
        lowStockThresholdType: typeof formDataToSet.lowStockThreshold,
      });
      
      setFormData(formDataToSet);
    }
  }, [product]);

  // Check if featured product checkbox should be disabled
  // Disabled if: 3 products are already featured AND this product is not currently featured
  const isFeaturedDisabled = featuredProductsCount >= 3 && !formData.featured_product;
  
  // Get list of currently featured product names for tooltip message
  // This will be passed from parent component
  const getFeaturedTooltipText = () => {
    if (featuredProductsCount >= 3 && !formData.featured_product) {
      return `Maximum 3 featured products allowed. ${featuredProductsCount} products are already marked as featured. Please uncheck another featured product first to select this one.`;
    }
    return "";
  };

  // Handle input change
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  // Validate form
  const validate = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Product name is required";
    }

    if (!formData.price || Number(formData.price) <= 0) {
      newErrors.price = "Valid price is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    // Prepare data for submission
    // In edit mode, only include fields that actually changed
    let submitData;
    if (isEditMode && product) {
      // Compare form data with original product data and only include changed fields
      const changes = {};
      
      // Helper function to normalize values for comparison
      const normalizeValue = (val) => {
        if (val === "" || val === null || val === undefined) return null;
        if (typeof val === "string" && val.trim() === "") return null;
        return val;
      };
      
      // Compare each field
      if (normalizeValue(formData.name) !== normalizeValue(product.name)) {
        changes.name = formData.name;
      }
      if (normalizeValue(formData.price) !== normalizeValue(String(product.price || ""))) {
        changes.price = formData.price;
      }
      if (normalizeValue(formData.stock) !== normalizeValue(String(product.stock ?? ""))) {
        changes.stock = formData.stock;
      }
      if (normalizeValue(formData.lowStockThreshold) !== normalizeValue(String(product.lowStockThreshold ?? ""))) {
        changes.lowStockThreshold = formData.lowStockThreshold;
      }
      if (normalizeValue(formData.overview) !== normalizeValue(product.overview)) {
        changes.overview = formData.overview;
      }
      if (normalizeValue(formData.long_description) !== normalizeValue(product.long_description)) {
        changes.long_description = formData.long_description;
      }
      if (normalizeValue(formData.image_local) !== normalizeValue(product.image_local)) {
        changes.image_local = formData.image_local;
      }
      if (normalizeValue(formData.poster) !== normalizeValue(product.poster)) {
        changes.poster = formData.poster;
      }
      
      // Compare boolean fields (handle both Number 1/0 and Boolean true/false)
      const currentInStock = product.in_stock === 1 || product.in_stock === true;
      if (formData.in_stock !== currentInStock) {
        changes.in_stock = formData.in_stock;
      }
      
      const currentBestSeller = product.best_seller === 1 || product.best_seller === true;
      if (formData.best_seller !== currentBestSeller) {
        changes.best_seller = formData.best_seller;
      }
      
      const currentFeatured = product.featured_product === 1 || product.featured_product === true;
      if (formData.featured_product !== currentFeatured) {
        changes.featured_product = formData.featured_product;
      }
      
      // Handle rating: only detect change if form value is different from product value
      // Empty string in form means no rating (same as undefined/null in product)
      const formRatingValue = formData.rating === "" ? null : (formData.rating !== undefined && formData.rating !== null ? Number(formData.rating) : null);
      const productRatingValue = product.rating !== undefined && product.rating !== null ? Number(product.rating) : null;
      // Only add to changes if values are actually different
      if (formRatingValue !== productRatingValue) {
        changes.rating = formData.rating;
      }
      
      // Convert values to proper types for backend
      const processedChanges = {};
      if (changes.name !== undefined) processedChanges.name = changes.name;
      if (changes.price !== undefined) processedChanges.price = Number(changes.price);
      if (changes.stock !== undefined) {
        processedChanges.stock = changes.stock !== "" && changes.stock !== null ? Number(changes.stock) : undefined;
      }
      if (changes.lowStockThreshold !== undefined) {
        processedChanges.lowStockThreshold = changes.lowStockThreshold !== "" && changes.lowStockThreshold !== null ? Number(changes.lowStockThreshold) : undefined;
      }
      if (changes.overview !== undefined) processedChanges.overview = changes.overview;
      if (changes.long_description !== undefined) processedChanges.long_description = changes.long_description;
      if (changes.image_local !== undefined) processedChanges.image_local = changes.image_local;
      if (changes.poster !== undefined) processedChanges.poster = changes.poster;
      if (changes.in_stock !== undefined) processedChanges.in_stock = changes.in_stock;
      if (changes.best_seller !== undefined) processedChanges.best_seller = changes.best_seller;
      if (changes.featured_product !== undefined) processedChanges.featured_product = changes.featured_product ? 1 : 0; // Convert Boolean to Number (1/0)
      if (changes.rating !== undefined) processedChanges.rating = changes.rating !== "" ? Number(changes.rating) : undefined;
      
      submitData = processedChanges;
    } else {
      // Create mode: send all fields
      submitData = {
        ...formData,
        price: Number(formData.price),
        // Handle stock: preserve 0 values, only use undefined if empty string
        // Convert to Number, but allow 0 as a valid value
        stock: formData.stock !== "" && formData.stock !== null ? Number(formData.stock) : undefined,
        // Handle lowStockThreshold: preserve 0 values, only use undefined if empty string
        // Convert to Number, but allow 0 as a valid value
        lowStockThreshold: formData.lowStockThreshold !== "" && formData.lowStockThreshold !== null ? Number(formData.lowStockThreshold) : undefined,
        featured_product: formData.featured_product ? 1 : 0, // Convert Boolean to Number (1/0)
        rating: formData.rating !== "" ? Number(formData.rating) : undefined, // Convert rating to Number or undefined
      };
    }

    // Debug logging to verify data being sent
    console.log("📤 Product Form - Submitting data:", {
      stock: submitData.stock,
      stockType: typeof submitData.stock,
      stockOriginal: formData.stock,
      lowStockThreshold: submitData.lowStockThreshold,
      lowStockThresholdType: typeof submitData.lowStockThreshold,
      lowStockThresholdOriginal: formData.lowStockThreshold,
      fullSubmitData: submitData,
    });

    onSubmit(submitData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Name Field */}
      <div>
        <FormLabel htmlFor="name" required>
          Product Name
        </FormLabel>
        <FormInput
          id="name"
          name="name"
          type="text"
          value={formData.name}
          onChange={handleChange}
          placeholder="Enter product name"
          required
          error={errors.name}
        />
        <FormError message={errors.name} />
      </div>

      {/* Price Field */}
      <div>
        <FormLabel htmlFor="price" required>
          Price ($)
        </FormLabel>
        <FormInput
          id="price"
          name="price"
          type="number"
          value={formData.price}
          onChange={handleChange}
          step="0.01"
          min="0"
          placeholder="0.00"
          required
          error={errors.price}
        />
        <FormError message={errors.price} />
      </div>

      {/* Stock Quantity and Low Stock Threshold Fields */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Stock Quantity Field */}
        <div>
          <FormLabel htmlFor="stock">
            Stock Quantity
          </FormLabel>
          <FormInput
            id="stock"
            name="stock"
            type="number"
            value={formData.stock}
            onChange={handleChange}
            step="1"
            min="0"
            placeholder="0"
            error={errors.stock}
          />
          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
            Current stock quantity (leave empty if not tracking)
          </p>
          <FormError message={errors.stock} />
        </div>

        {/* Low Stock Threshold Field */}
        <div>
          <FormLabel htmlFor="lowStockThreshold">
            Low Stock Threshold
          </FormLabel>
          <FormInput
            id="lowStockThreshold"
            name="lowStockThreshold"
            type="number"
            value={formData.lowStockThreshold}
            onChange={handleChange}
            step="1"
            min="0"
            placeholder="10"
            error={errors.lowStockThreshold}
          />
          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
            Alert when stock falls below this number (default: 10)
          </p>
          <FormError message={errors.lowStockThreshold} />
        </div>
      </div>

      {/* Overview Field */}
      <div>
        <FormLabel htmlFor="overview">Overview</FormLabel>
        <FormTextarea
          id="overview"
          name="overview"
          value={formData.overview}
          onChange={handleChange}
          rows={3}
          placeholder="Short description of the product"
        />
      </div>

      {/* Long Description Field */}
      <div>
        <FormLabel htmlFor="long_description">Long Description</FormLabel>
        <FormTextarea
          id="long_description"
          name="long_description"
          value={formData.long_description}
          onChange={handleChange}
          rows={6}
          placeholder="Detailed description of the product"
        />
      </div>

      {/* Product Image Upload */}
      <div>
        <ImageUpload
          label="Product Image"
          value={formData.image_local}
          onChange={(url) => {
            setFormData((prev) => ({
              ...prev,
              image_local: url || "",
            }));
          }}
          onUpload={async (file) => {
            const result = await imageUploadMutation.mutateAsync(file);
            return result;
          }}
          disabled={isLoading || imageUploadMutation.isPending}
        />
        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
          Upload a product image. Supported formats: JPEG, PNG, WebP, GIF (max 10MB)
        </p>
      </div>

      {/* Image Local Path (Fallback/Manual Entry) */}
      <div>
        <FormLabel htmlFor="image_local">Image URL (Manual Entry)</FormLabel>
        <FormInput
          id="image_local"
          name="image_local"
          type="text"
          value={formData.image_local}
          onChange={handleChange}
          placeholder="https://cloudinary.com/image.jpg or /assets/image.jpg"
        />
        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
          Or manually enter image URL/path
        </p>
      </div>

      {/* Poster URL Field */}
      <div>
        <FormLabel htmlFor="poster">Poster URL (Optional)</FormLabel>
        <FormInput
          id="poster"
          name="poster"
          type="url"
          value={formData.poster}
          onChange={handleChange}
          placeholder="https://image.url"
        />
        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
          Optional poster/thumbnail image URL
        </p>
      </div>

      {/* Rating Field */}
      <div>
        <FormLabel htmlFor="rating">Rating</FormLabel>
        <FormInput
          id="rating"
          name="rating"
          type="number"
          value={formData.rating}
          onChange={handleChange}
          min="1"
          max="5"
          step="1"
          placeholder="1-5"
        />
        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
          Enter a rating from 1 to 5 (leave empty for no rating)
        </p>
      </div>

      {/* Checkboxes */}
      <div className="flex flex-col sm:flex-row gap-6">
        {/* In Stock Checkbox */}
        <FormCheckbox
          id="in_stock"
          name="in_stock"
          checked={formData.in_stock}
          onChange={handleChange}
          label="In Stock"
        />

        {/* Best Seller Checkbox */}
        <FormCheckbox
          id="best_seller"
          name="best_seller"
          checked={formData.best_seller}
          onChange={handleChange}
          label="Best Seller"
        />

        {/* Featured Product Checkbox */}
        <div className="flex items-center relative group">
          <FormCheckbox
            id="featured_product"
            name="featured_product"
            checked={formData.featured_product}
            onChange={handleChange}
            disabled={isFeaturedDisabled}
            label="Featured Product"
            className="flex-shrink-0"
          />
          
          {/* Info Icon with Tooltip */}
          {isFeaturedDisabled && (
            <div className="ml-2 relative">
              <span className="bi-info-circle text-gray-400 dark:text-gray-500 cursor-help"></span>
              {/* Tooltip */}
              <div className="absolute left-0 bottom-full mb-2 w-64 p-2 bg-gray-900 dark:bg-gray-700 text-white text-xs rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                {getFeaturedTooltipText()}
                <div className="absolute left-4 top-full -mt-1 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900 dark:border-t-gray-700"></div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Submit Button */}
      <div className="flex items-center justify-end gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
        <button
          type="button"
          onClick={() => window.history.back()}
          className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
          disabled={isLoading}
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isLoading}
          className="px-4 py-2 text-sm font-medium text-white bg-blue-600 dark:bg-blue-500 rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading
            ? "Saving..."
            : isEditMode
            ? "Update Product"
            : "Create Product"}
        </button>
      </div>
    </form>
  );
};

