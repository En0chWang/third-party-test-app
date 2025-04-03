import { InitializationResponsePayload } from '../payloads/initializationResponsePayload';
import { MessageType } from "../types/messageType";
import { AbstractResponseMessage } from "./abstractResponseMessage";

/**
 * Options interface for {@link InitializationResponseMessage}
 */
interface InitializationResponseMessageOptions {
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
     * Initialization response message payload
     */
    payload?: InitializationResponsePayload;
}

/**
 * Initialization Response message used for client SDK handshake response from the Bridge
 */
export class InitializationResponseMessage extends AbstractResponseMessage<InitializationResponsePayload> {
    constructor({ success, error, traceId, payload }: InitializationResponseMessageOptions) {
        super(MessageType.INITIALIZATION_RESPONSE, {
            success: success,
            error: error,
            traceId: traceId,
            payload: payload
        });
    }
}
