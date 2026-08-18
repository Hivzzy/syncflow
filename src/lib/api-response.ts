import { ZodError } from 'zod';

/**
 * Standard Success Response Helper for Next.js Route Handlers
 */
export function apiSuccess<T>(data: T, status = 200) {
  return Response.json(data, { status });
}

/**
 * Standard Error Response Helper for Next.js Route Handlers
 */
export function apiError(message: string, status = 400, errors: unknown = null) {
  return Response.json(
    {
      success: false,
      message,
      errors,
    },
    { status }
  );
}

/**
 * Global Error Handler for Route Handlers
 */
export function handleApiError(error: unknown) {
  console.error('API Handler Error:', error);

  // Handle Zod Validation Errors
  if (error instanceof ZodError) {
    const formattedErrors = error.errors.map((e) => ({
      field: e.path.join('.'),
      message: e.message,
    }));
    return apiError('Validation failed', 422, formattedErrors);
  }

  // Handle Postgres Duplicate Key Errors (23505)
  if (typeof error === 'object' && error !== null && 'code' in error && (error as { code: string }).code === '23505') {
    return apiError('A record with this identifier already exists', 409);
  }

  if (error instanceof Error) {
    return apiError(error.message, 500);
  }

  return apiError('Internal server error', 500);
}
