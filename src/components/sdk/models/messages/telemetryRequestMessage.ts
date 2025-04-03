import { TelemetryRequestPayload } from '../payloads/telemetryRequestPayload';
import { MessageType } from "../types/messageType";
import { Utils } from "../../utils/utils";
import { AbstractRequestMessage } from "./abstractRequestMessage";

/**
 * Telemetry Request message used for capturing telemetry events to the SDK Bridge
 */
export class TelemetryRequestMessage extends AbstractRequestMessage<TelemetryRequestPayload> {
    constructor(payload: TelemetryRequestPayload) {
        super(MessageType.TELEMETRY_REQUEST, payload);
    }

    public validatePayload(): boolean {
        const parentValidationSuccess  = super.validatePayload();

        if (!parentValidationSuccess) {
            return false;
        }

        // Invalid if both logs and metrics are not defined
        if (Utils.isBlank(this.payload?.metrics) && Utils.isBlank(this.payload?.log)) {
            return false;
        }

        return true;
    }
}
