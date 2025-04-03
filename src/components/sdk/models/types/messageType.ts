/**
 * Message Type Definitions
 */
export enum MessageType {
    INITIALIZATION_REQUEST = 'INITIALIZATION_REQUEST',      // {@link InitializationRequestMessage}
    INITIALIZATION_RESPONSE = 'INITIALIZATION_RESPONSE',    // {@link InitializationResponseMessage}
    TELEMETRY_REQUEST = 'TELEMETRY_REQUEST',                // {@link TelemetryRequestMessage}
    TELEMETRY_RESPONSE = 'TELEMETRY_RESPONSE',              // {@link TelemetryResponseMessage}
    AUTH_REQUEST = 'AUTH_REQUEST',                          // {@link AuthRequestMessage}
    AUTH_RESPONSE = 'AUTH_RESPONSE',                        // {@link AuthResponseMessage}
    AUTH_CONTEXT_REQUEST = 'AUTH_CONTEXT_REQUEST',          // {@link AuthContextRequestMessage}
    AUTH_CONTEXT_RESPONSE = 'AUTH_CONTEXT_RESPONSE',        // {@link AuthContextResponseMessage}
}
