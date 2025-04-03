import { AuthResponsePayload } from '../payloads/authResponsePayload';
import { MessageType } from "../types/messageType";
import { Utils } from "../../utils/utils";
import { AbstractResponseMessage } from "./abstractResponseMessage";

/**
 * Options interface for {@link AuthResponseMessage}
 */
interface AuthResponseMessageOptions {
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
     * Auth response message payload
     */
    payload?: AuthResponsePayload;
}

/**
 * Auth Response message used for returning AuthCode by SDK Bridge
 */
export class AuthResponseMessage extends AbstractResponseMessage<AuthResponsePayload> {
    constructor({ success, error, traceId, payload }: AuthResponseMessageOptions) {
        super(MessageType.AUTH_RESPONSE, {
            success: success,
            error: error,
            traceId: traceId,
            payload: payload
        });
    }

    public validatePayload(): boolean {
        const parentValidationSuccess = super.validatePayload();

        // Return true if payload is empty as it's optional
        if (Utils.isBlank(this.payload)) {
            return true;
        }

        if (!parentValidationSuccess || Utils.isBlank(this.payload?.authCode)) {
            return false;
        }

        // No other validations required, add more validations later
        return true;
    }
}

