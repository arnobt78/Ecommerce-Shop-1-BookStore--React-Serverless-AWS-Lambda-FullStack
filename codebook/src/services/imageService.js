/**
 * Image Service - Cloudinary/ImageKit Integration
 *
 * Handles image uploads to Cloudinary or ImageKit.
 * Uses unsigned uploads for simplicity (can be secured with Lambda function later).
 *
 * @see https://cloudinary.com/documentation/upload_images
 * @see https://docs.imagekit.io/api-reference/upload-file-api/client-side-file-upload
 */

import { ApiError } from "./apiError";

// Cloudinary Configuration
const CLOUDINARY_CLOUD_NAME = process.env.REACT_APP_CLOUDINARY_CLOUD_NAME || "dstnkgg1p";
const CLOUDINARY_UPLOAD_PRESET = process.env.REACT_APP_CLOUDINARY_UPLOAD_PRESET || "codebook_products";
const CLOUDINARY_UPLOAD_URL = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`;

// ImageKit Configuration (alternative)
const IMAGEKIT_URL_ENDPOINT = process.env.REACT_APP_IMAGEKIT_URL_ENDPOINT || "https://ik.imagekit.io/arnobt78";
const IMAGEKIT_PUBLIC_KEY = process.env.REACT_APP_IMAGEKIT_PUBLIC_KEY || "public_YZnlSVIfQX0AtubHREKqEnnzWSA=";

// Use Cloudinary by default, can be switched to ImageKit
const IMAGE_SERVICE = process.env.REACT_APP_IMAGE_SERVICE || "cloudinary"; // "cloudinary" or "imagekit"

/**
 * Upload image to Cloudinary
 *
 * @param {File} file - Image file to upload
 * @param {Object} options - Upload options (folder, transformation, etc.)
 * @returns {Promise<Object>} Upload result with secure_url
 */
async function uploadToCloudinary(file, options = {}) {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);
  
  // Add optional parameters (only allowed for unsigned uploads)
  // Note: transformation parameter is NOT allowed in unsigned uploads
  // Transformations should be applied when generating display URLs, not during upload
  if (options.folder) {
    formData.append("folder", options.folder);
  }
  if (options.publicId) {
    formData.append("public_id", options.publicId);
  }
  // Note: Do NOT add transformation parameter here - it's not allowed in unsigned uploads
  // Transformations are applied via getOptimizedImageUrl() when displaying images

  try {
    const response = await fetch(CLOUDINARY_UPLOAD_URL, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new ApiError(
        errorData.error?.message || "Failed to upload image to Cloudinary",
        response.status
      );
    }

    const data = await response.json();
    return {
      url: data.secure_url,
      publicId: data.public_id,
      width: data.width,
      height: data.height,
      format: data.format,
      bytes: data.bytes,
    };
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError(`Image upload failed: ${error.message}`, 500);
  }
}

/**
 * Upload image to ImageKit
 *
 * @param {File} file - Image file to upload
 * @param {Object} options - Upload options (folder, fileName, etc.)
 * @returns {Promise<Object>} Upload result with url
 */
async function uploadToImageKit(file, options = {}) {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("publicKey", IMAGEKIT_PUBLIC_KEY);
  
  // Add optional parameters
  if (options.folder) {
    formData.append("folder", options.folder);
  }
  if (options.fileName) {
    formData.append("fileName", options.fileName);
  }

  try {
    const response = await fetch(`${IMAGEKIT_URL_ENDPOINT}/api/v1/files/upload`, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new ApiError(
        errorData.message || "Failed to upload image to ImageKit",
        response.status
      );
    }

    const data = await response.json();
    return {
      url: data.url,
      fileId: data.fileId,
      width: data.width,
      height: data.height,
      size: data.size,
    };
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError(`Image upload failed: ${error.message}`, 500);
  }
}

/**
 * Upload image (uses configured service)
 *
 * @param {File} file - Image file to upload
 * @param {Object} options - Upload options
 * @returns {Promise<Object>} Upload result
 */
export async function uploadImage(file, options = {}) {
  // Validate file
  if (!file) {
    throw new ApiError("No file provided", 400);
  }

  // Validate file type
  const validTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp", "image/gif"];
  if (!validTypes.includes(file.type)) {
    throw new ApiError(
      "Invalid file type. Please upload a JPEG, PNG, WebP, or GIF image.",
      400
    );
  }

  // Validate file size (max 10MB)
  const maxSize = 10 * 1024 * 1024; // 10MB
  if (file.size > maxSize) {
    throw new ApiError("File size exceeds 10MB limit. Please upload a smaller image.", 400);
  }

  // Upload based on configured service
  if (IMAGE_SERVICE === "imagekit") {
    return uploadToImageKit(file, options);
  } else {
    return uploadToCloudinary(file, options);
  }
}

/**
 * Delete image from Cloudinary
 *
 * @param {string} publicId - Cloudinary public ID
 * @returns {Promise<Object>} Deletion result
 */
export async function deleteImage(publicId) {
  // Note: This requires server-side implementation with API secret
  // For now, we'll just return success (images can be manually deleted from Cloudinary dashboard)
  // In production, create a Lambda function for secure deletion
  console.warn("Image deletion requires server-side implementation");
  return { success: true, message: "Image deletion requires server-side implementation" };
}

/**
 * Generate optimized image URL with transformations
 *
 * @param {string} imageUrl - Original image URL
 * @param {Object} transformations - Transformation options (width, height, quality, crop, etc.)
 * @returns {string} Optimized image URL
 * 
 * @example
 * getOptimizedImageUrl(url, { width: 400, height: 300, quality: 'auto', crop: 'fill' })
 */
export function getOptimizedImageUrl(imageUrl, transformations = {}) {
  if (!imageUrl) return "";

  // If Cloudinary URL
  if (imageUrl.includes("cloudinary.com")) {
    const parts = imageUrl.split("/upload/");
    if (parts.length === 2) {
      const baseUrl = parts[0] + "/upload";
      const imagePath = parts[1];
      
      // Build transformation string with automatic optimizations
      const transforms = [];
      
      // Add automatic format and quality optimization
      transforms.push("f_auto"); // Auto format (WebP when supported)
      transforms.push("q_auto:good"); // Auto quality optimization
      
      // Add user-specified transformations
      if (transformations.width) transforms.push(`w_${transformations.width}`);
      if (transformations.height) transforms.push(`h_${transformations.height}`);
      if (transformations.quality && transformations.quality !== "auto") {
        // Replace auto quality if specific quality requested
        const autoIndex = transforms.indexOf("q_auto:good");
        if (autoIndex > -1) transforms.splice(autoIndex, 1);
        transforms.push(`q_${transformations.quality}`);
      }
      if (transformations.crop) transforms.push(`c_${transformations.crop}`);
      if (transformations.gravity) transforms.push(`g_${transformations.gravity}`);
      
      const transformString = transforms.length > 0 ? transforms.join(",") + "/" : "";
      return `${baseUrl}/${transformString}${imagePath}`;
    }
  }

  // If ImageKit URL
  if (imageUrl.includes("imagekit.io")) {
    const url = new URL(imageUrl);
    if (transformations.width) url.searchParams.set("tr", `w-${transformations.width}`);
    if (transformations.height) url.searchParams.set("tr", `h-${transformations.height}`);
    if (transformations.quality) url.searchParams.set("q", transformations.quality);
    return url.toString();
  }

  // Return original URL if not Cloudinary or ImageKit
  return imageUrl;
}

