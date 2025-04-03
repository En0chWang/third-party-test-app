import { MetricType, MetricNameConstants } from "../types/telemetryTypes";

/**
 * Telemetry Metrics entry definition
 */
export interface Metrics {

    /**
     * Type of the metrics entry captured {@link MetricType}
     */
    metricsType: MetricType;

    /**
     * String name for the metrics entry
     */
    metricName: MetricNameConstants | string;

    /**
     * Value for the metric entry
     */
    value: number;

    /**
     * Associated timestamp for metric (in epoch)
     */
    timestamp: number;

    /**
     * Boolean indicating whether client needs to retry
     */
    isRetryable?: boolean
}