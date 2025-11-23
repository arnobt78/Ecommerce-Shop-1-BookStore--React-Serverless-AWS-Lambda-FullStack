/**
 * CORS headers for all responses
 */
export const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
};

/**
 * Create success response
 */
export function successResponse(data, statusCode = 200) {
  return {
    statusCode,
    headers: corsHeaders,
    body: JSON.stringify(data),
  };
}

/**
 * Create error response
 */
export function errorResponse(message, statusCode = 400) {
  return {
    statusCode,
    headers: corsHeaders,
    body: JSON.stringify({ 
      error: message,
      message 
    }),
  };
}

/**
 * Handle OPTIONS request for CORS
 */
export function handleOptions() {
  return {
    statusCode: 200,
    headers: corsHeaders,
    body: '',
  };
}

