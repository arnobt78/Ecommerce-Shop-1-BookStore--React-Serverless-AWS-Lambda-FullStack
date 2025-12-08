/**
 * Unified API Client for AWS Lambda HTTP API
 * 
 * This client wraps all Lambda endpoints and provides:
 * - Consistent error handling
 * - Automatic token management
 * - Request/response interceptors
 * - Type-safe API methods
 * 
 * @typedef {Object} ApiResponse
 * @property {boolean} ok - Whether the request was successful
 * @property {any} data - Response data
 * @property {number} status - HTTP status code
 * @property {string} [error] - Error message if request failed
 */

// AWS Lambda HTTP API Base URL
// Can be overridden via REACT_APP_LAMBDA_API_URL environment variable
const LAMBDA_API_BASE_URL = 
  process.env.REACT_APP_LAMBDA_API_URL || 
  'https://d4vvkswb4a.execute-api.eu-north-1.amazonaws.com';

/**
 * Get authentication token from session storage
 * @returns {string|null} JWT token or null
 */
function getAuthToken() {
  try {
    const token = sessionStorage.getItem("token");
    return token ? JSON.parse(token) : null;
  } catch {
    return null;
  }
}

/**
 * Get user ID from session storage
 * @returns {string|null} User ID or null
 */
function getUserId() {
  try {
    const cbid = sessionStorage.getItem("cbid");
    return cbid ? JSON.parse(cbid) : null;
  } catch {
    return null;
  }
}

/**
 * Unified API request handler
 * 
 * @param {string} endpoint - API endpoint (e.g., '/products', '/login')
 * @param {Object} options - Request options
 * @param {string} [options.method='GET'] - HTTP method
 * @param {Object} [options.body] - Request body (will be JSON stringified)
 * @param {Object} [options.headers={}] - Additional headers
 * @param {boolean} [options.requireAuth=false] - Whether authentication is required
 * @param {Object} [options.queryParams] - Query parameters
 * @returns {Promise<ApiResponse>} API response
 */
async function apiRequest(endpoint, options = {}) {
  const {
    method = 'GET',
    body = null,
    headers = {},
    requireAuth = false,
    queryParams = null,
  } = options;

  // Build URL with query parameters
  let url = `${LAMBDA_API_BASE_URL}${endpoint}`;
  if (queryParams) {
    const params = new URLSearchParams();
    Object.entries(queryParams).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
        params.append(key, value);
      }
    });
    const queryString = params.toString();
    if (queryString) {
      url += `?${queryString}`;
    }
  }

  // Prepare headers
  const requestHeaders = {
    'Content-Type': 'application/json',
    ...headers,
  };

  // Add authentication token if required
  if (requireAuth) {
    const token = getAuthToken();
    if (!token) {
      return {
        ok: false,
        status: 401,
        error: 'Authentication required',
        data: null,
      };
    }
    requestHeaders['Authorization'] = `Bearer ${token}`;
  }

  // Prepare request options
  const requestOptions = {
    method,
    headers: requestHeaders,
  };

  // Add body for POST/PUT requests
  if (body && (method === 'POST' || method === 'PUT' || method === 'PATCH')) {
    requestOptions.body = JSON.stringify(body);
  }

  try {
    const response = await fetch(url, requestOptions);
    
    // Parse response
    let data;
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      data = await response.json();
    } else {
      data = await response.text();
    }

    // Handle non-OK responses
    if (!response.ok) {
      return {
        ok: false,
        status: response.status,
        error: data.message || data.error || `HTTP ${response.status}: ${response.statusText}`,
        data: data,
      };
    }

    return {
      ok: true,
      status: response.status,
      data: data,
      error: null,
    };
  } catch (error) {
    // Network or parsing errors
    return {
      ok: false,
      status: 0,
      error: error.message || 'Network error',
      data: null,
    };
  }
}

/**
 * Products API Methods
 */
export const productsApi = {
  /**
   * Get all products with optional search
   * @param {string} [searchTerm=''] - Search term to filter products
   * @returns {Promise<ApiResponse>}
   */
  getAll: async (searchTerm = '') => {
    return apiRequest('/products', {
      method: 'GET',
      queryParams: searchTerm ? { name_like: searchTerm } : null,
    });
  },

  /**
   * Get product by ID
   * @param {string} productId - Product ID
   * @returns {Promise<ApiResponse>}
   */
  getById: async (productId) => {
    return apiRequest(`/products/${productId}`, {
      method: 'GET',
    });
  },

  /**
   * Get featured products
   * @returns {Promise<ApiResponse>}
   */
  getFeatured: async () => {
    return apiRequest('/featured-products', {
      method: 'GET',
    });
  },
};

/**
 * Auth API Methods
 */
export const authApi = {
  /**
   * Login user
   * @param {Object} credentials - Login credentials
   * @param {string} credentials.email - User email
   * @param {string} credentials.password - User password
   * @returns {Promise<ApiResponse>}
   */
  login: async (credentials) => {
    const response = await apiRequest('/login', {
      method: 'POST',
      body: credentials,
    });

    // Store token and user info on successful login
    if (response.ok && response.data?.accessToken) {
      sessionStorage.setItem("token", JSON.stringify(response.data.accessToken));
      sessionStorage.setItem("cbid", JSON.stringify(response.data.user.id));
      if (response.data.user?.email) {
        sessionStorage.setItem("userEmail", response.data.user.email);
      }
      if (response.data.user?.role) {
        sessionStorage.setItem("userRole", response.data.user.role);
      }
    }

    return response;
  },

  /**
   * Register new user
   * @param {Object} userData - User registration data
   * @param {string} userData.email - User email
   * @param {string} userData.password - User password
   * @param {string} userData.name - User name
   * @returns {Promise<ApiResponse>}
   */
  register: async (userData) => {
    const response = await apiRequest('/register', {
      method: 'POST',
      body: userData,
    });

    // Store token and user info on successful registration
    if (response.ok && response.data?.accessToken) {
      sessionStorage.setItem("token", JSON.stringify(response.data.accessToken));
      sessionStorage.setItem("cbid", JSON.stringify(response.data.user.id));
      if (response.data.user?.email) {
        sessionStorage.setItem("userEmail", response.data.user.email);
      }
      if (response.data.user?.role) {
        sessionStorage.setItem("userRole", response.data.user.role);
      } else {
        sessionStorage.setItem("userRole", "user");
      }
    }

    return response;
  },

  /**
   * Logout user (clears session storage)
   */
  logout: () => {
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("cbid");
    sessionStorage.removeItem("userEmail");
    sessionStorage.removeItem("userRole");
  },
};

/**
 * Orders API Methods
 */
export const ordersApi = {
  /**
   * Get all orders for authenticated user
   * @param {string} [userId] - Optional user ID (must match authenticated user)
   * @returns {Promise<ApiResponse>}
   */
  getAll: async (userId = null) => {
    return apiRequest('/orders', {
      method: 'GET',
      requireAuth: true,
      queryParams: userId ? { 'user.id': userId } : null,
    });
  },

  /**
   * Create new order
   * @param {Object} orderData - Order data
   * @param {Array} orderData.cartList - Cart items
   * @param {number} orderData.amount_paid - Total amount paid
   * @param {number} orderData.quantity - Total quantity
   * @param {Object} orderData.user - User information
   * @returns {Promise<ApiResponse>}
   */
  create: async (orderData) => {
    return apiRequest('/orders', {
      method: 'POST',
      body: orderData,
      requireAuth: true,
    });
  },
};

/**
 * Users API Methods
 */
export const usersApi = {
  /**
   * Get user by ID
   * @param {string} userId - User ID
   * @returns {Promise<ApiResponse>}
   */
  getById: async (userId) => {
    return apiRequest(`/users/${userId}`, {
      method: 'GET',
      requireAuth: true,
    });
  },
};

// Export default API client with all methods
export default {
  products: productsApi,
  auth: authApi,
  orders: ordersApi,
  users: usersApi,
  // Expose base request method for custom requests
  request: apiRequest,
};

