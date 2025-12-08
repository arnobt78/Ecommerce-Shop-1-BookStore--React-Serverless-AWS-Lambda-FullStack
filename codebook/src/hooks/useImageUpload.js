/**
 * useImageUpload Hook
 *
 * React Query hook for image uploads with caching and error handling.
 * Provides mutation for uploading images to Cloudinary/ImageKit.
 *
 * @returns {Object} Mutation object with upload function and state
 */

import { useMutation } from "@tanstack/react-query";
import { uploadImage } from "../services/imageService";

/**
 * Upload image mutation hook
 *
 * @param {Object} options - Mutation options
 * @param {Function} options.onSuccess - Success callback (receives upload result)
 * @param {Function} options.onError - Error callback (receives error)
 * @returns {Object} Mutation object
 */
export function useImageUpload(options = {}) {
  return useMutation({
    mutationFn: async (file, uploadOptions = {}) => {
      if (!file) {
        throw new Error("No file provided");
      }
      
      // Upload with folder structure for products
      const result = await uploadImage(file, {
        folder: "codebook/products",
        ...uploadOptions,
      });
      
      return result;
    },
    onSuccess: (data, variables, context) => {
      if (options.onSuccess) {
        options.onSuccess(data, variables, context);
      }
    },
    onError: (error, variables, context) => {
      console.error("Image upload error:", error);
      
      // Only show error toast if not already shown by component
      // The ImageUpload component handles its own error toasts to avoid duplicates
      if (options.onError) {
        options.onError(error, variables, context);
      }
    },
    retry: false, // Don't retry failed uploads
  });
}

