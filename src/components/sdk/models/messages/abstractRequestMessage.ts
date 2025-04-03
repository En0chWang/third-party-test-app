import { AbstractMessage} from "./abstractMessage";
import { AbstractPayload} from "../payloads/abstractPayload";
import { Version } from "../types/version";

/**
 * Abstracts class used for implementing various request message types
 */
export abstract class AbstractRequestMessage<T extends AbstractPayload> extends AbstractMessage< T> {
    public validatePayload(): boolean {
        // This will be updated later to handle validations for specific versions
        if (this.payload?.version != Version.V1) {
            return false;
        }

        // No other validations required, add more validations later
        return true;
    }
}
