import { AuthContextResponsePayload } from '../payloads/authContextResponsePayload';
import { MessageType } from '../types/messageType';
import { Utils } from '../../utils/utils';
import { AbstractResponseMessage } from './abstractResponseMessage';

/**
 * Options interface for {@link AuthContextResponseMessage}
 */
interface AuthContextResponseMessageOptions {
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
     * Auth context response payload
     */
    payload?: AuthContextResponsePayload;
}

/**
 * Auth Context Response message used for returning auth context by SDK Bridge
 */
export class AuthContextResponseMessage extends AbstractResponseMessage<AuthContextResponsePayload> {
    constructor({ success, error, traceId, payload }: AuthContextResponseMessageOptions) {
        super(MessageType.AUTH_CONTEXT_RESPONSE, {
            success: success,
            error: error,
            traceId: traceId,
            payload: payload,
        });
    }

    public validatePayload(): boolean {
        if (Utils.isBlank(this.payload)) {
            return true;
        }

        return (
            super.validatePayload() &&
            (Utils.isNotBlank(this.payload?.authContext.SC_CONTEXT_TOKEN) ||
                Utils.isNotBlank(this.payload?.authContext.USER_AUTH_CODE))
        );
    }
}
