import { AuthContextRequestPayload } from '../payloads/authContextRequestPayload';
import { MessageType } from '../types/messageType';
import { AbstractRequestMessage } from './abstractRequestMessage';

/**
 * Auth Context Request message used for requesting auth context from SDK Bridge
 */
export class AuthContextRequestMessage extends AbstractRequestMessage<AuthContextRequestPayload> {
    constructor(payload: AuthContextRequestPayload) {
        super(MessageType.AUTH_CONTEXT_REQUEST, payload);
    }

    public validatePayload(): boolean {
        //TODO: add more specific validation checks for the payload
        return super.validatePayload();
    }
}
