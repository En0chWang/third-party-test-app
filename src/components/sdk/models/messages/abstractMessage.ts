import { MessageType } from '../types/messageType';
import { AbstractPayload } from '../payloads/abstractPayload';

/**
 * Abstract Message class used for implementing various message types
 */
export abstract class AbstractMessage<T extends AbstractPayload> {
    type: MessageType;
    payload?: T;
    requestId?: string;

    constructor(type: MessageType, payload?: T) {
        this.type = type;
        this.payload = payload;
        this.requestId = this.generateRequestId();

        if (!this.validatePayload()) {
            throw new Error(`Invalid payload for version ${this.payload?.version}`);
        }
    }

    private generateRequestId(): string {
        return Math.random().toString(36).substring(2);
    }

    public abstract validatePayload(): boolean;
}
