import { LogType } from "../types/telemetryTypes";

/**
 * Telemetry Log entry definition
 */
export interface Log {
    /**
     * String message for the log entry
     */
    message: string;

    /**
     * Type of the log entry captured {@link LogType}
     */
    logType: LogType;

    /**
     * Associated timestamp for log (in epoch)
     */
    timestamp: number;

    /**
     * Boolean indicating whether client needs to retry
     */
    isRetryable?: boolean
}