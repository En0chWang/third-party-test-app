import {AbstractPayload} from './abstractPayload';
import {AuthCode} from "../structure/authCode";

/**
 * Auth Response Payload definition
 */
export interface AuthResponsePayload extends AbstractPayload {

    /**
     * Auth code information {@link AuthCode}
     */
    authCode?: AuthCode;
}
