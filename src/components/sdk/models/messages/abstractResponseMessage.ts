import { AbstractMessage } from "./abstractMessage";
import { AbstractPayload } from "../payloads/abstractPayload";
import { Version } from "../types/version";
import { Utils } from "../../utils/utils";
import { MessageType } from "../types/messageType";

/**
 * Options interface for {@link AbstractResponseMessage}
 */
interface AbstractResponseMessageOptions<T extends AbstractPayload> {
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
     * Abstract response message payload
     */
    payload?: T;
}

/**
 * Abstract class used for implementing various response message types
 */
export abstract class AbstractResponseMessage<T extends AbstractPayload> extends AbstractMessage<T> {
    success: boolean;
    traceId?: string;
    error?: string;

    constructor(type: MessageType, { success, error, traceId, payload}: AbstractResponseMessageOptions<T>) {
        super(type, payload);

        this.success = success;
        this.error = error;
        this.traceId = traceId;

        if (!this.success) {
            if (Utils.isBlank(this.error)) {
                throw new Error(`Error message should be present when success is false`);
            }
        }
    }

    public validatePayload(): boolean {
        // Return true if payload is empty as it's optional
        if (Utils.isBlank(this.payload)) {
            return true;
        }

        // This will be updated later to handle validations for specific versions
        if (this.payload?.version != Version.V1) {
            return false;
        }

        // No other validations required, add more validations later
        return true;
    }
}

