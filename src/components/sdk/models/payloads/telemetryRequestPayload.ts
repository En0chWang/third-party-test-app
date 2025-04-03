import { Log } from "../structure/log";
import { Metrics } from "../structure/metrics";
import { AbstractPayload } from './abstractPayload';

/**
 * Telemetry Request Payload definition
 */
export interface TelemetryRequestPayload extends AbstractPayload {
    /**
     * The telemetry metrics record to be published back to Amazon/SDK Bridge
     */
    metrics?: Metrics;

    /**
     * The telemetry log record be published back to Amazon/SDK Bridge
     */
    log?: Log;
}
