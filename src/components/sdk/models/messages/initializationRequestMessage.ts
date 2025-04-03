import { InitializationRequestPayload } from '../payloads/initializationRequestPayload';
import { MessageType } from "../types/messageType";
import { AbstractRequestMessage } from "./abstractRequestMessage";

/**
 * Initialization Request message used for client SDK handshake request with the Bridge
 */
export class InitializationRequestMessage extends AbstractRequestMessage<InitializationRequestPayload> {
    constructor(payload: InitializationRequestPayload) {
        super(MessageType.INITIALIZATION_REQUEST, payload);
    }
}
