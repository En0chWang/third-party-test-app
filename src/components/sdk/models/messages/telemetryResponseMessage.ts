import { TelemetryResponsePayload } from '../payloads/telemetryResponsePayload';
import { MessageType } from "../types/messageType";
import { AbstractResponseMessage } from "./abstractResponseMessage";

/**
 * Options definition for {@link TelemetryResponseMessage}
 */
interface TelemetryResponseMessageOptions {
    /**
     * Boolean indicating the response status
     */
    success: boolean;

    /**
     * Error message information, if any occurred
     */
    error?: string;

    /**
     * TraceId assigned by SDK bridge for request tracking
     */
    traceId?: string;

    /**
     * Telemetry response message payload
     */
    payload?: TelemetryResponsePayload;
}

/**
 * Telemetry Response message used for acknowledging telemetry events from the SDK Bridge
 */
export class TelemetryResponseMessage extends AbstractResponseMessage<TelemetryResponsePayload> {
    constructor({ success, error, traceId, payload }: TelemetryResponseMessageOptions) {
        super(MessageType.TELEMETRY_RESPONSE, {
            success: success,
            error: error,
            traceId: traceId,
            payload: payload
        });
    }
}
