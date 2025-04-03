import { AuthRequestPayload } from '../payloads/authRequestPayload';
import { MessageType } from "../types/messageType";
import { AbstractRequestMessage } from "./abstractRequestMessage";

/**
 * Auth Request message used for requesting AuthCode from SDK Bridge
 */
export class AuthRequestMessage extends AbstractRequestMessage<AuthRequestPayload> {
    constructor(payload: AuthRequestPayload) {
        super(MessageType.AUTH_REQUEST, payload);
    }
}
