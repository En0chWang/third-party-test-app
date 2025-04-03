import DOMPurify from "dompurify";

/**
 * Sanitizes and formats the log message and data to prevent XSS.
 *
 * @param message - The log message prefix to be sanitized.
 * @param data - The optional data to be sanitized and logged.
 * @returns The formatted log message.
 */
function sanitizeInput(message: string, data?: any): string {
  // Sanitize the message
  const sanitizedMessage = DOMPurify.sanitize(message);

  // Sanitize the data if provided
  if (data !== undefined && data !== null) {
    const sanitizedData =
      typeof data === "string"
        ? DOMPurify.sanitize(data)
        : DOMPurify.sanitize(JSON.stringify(data));
    return `${sanitizedMessage} ${sanitizedData}`;
  } else {
    return sanitizedMessage; // If no data, return only the sanitized message
  }
}

/**
 * Logs an informational message with sanitized message and data.
 *
 * @param message - The log message to be sanitized.
 * @param data - The optional data to be sanitized and logged.
 */
export function logInfo(message: string, data?: any): void {
  console.log(sanitizeInput(message, data));
}

/**
 * Logs a debug message with sanitized message and data.
 *
 * @param message - The debug message to be sanitized.
 * @param data - The optional data to be sanitized and logged.
 */
export function logDebug(message: string, data?: any): void {
  console.debug(sanitizeInput(message, data));
}

/**
 * Logs an error message with sanitized message and data.
 *
 * @param message - The error message to be sanitized.
 * @param data - The optional data to be sanitized and logged.
 */
export function logError(message: string, data?: any): void {
  console.error(sanitizeInput(message, data));
}
