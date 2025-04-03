import {AuthCodeType} from "../types/authCodeType";

/**
 * Auth Code definition used widget token exchange
 */
export interface AuthCode {
    /**
     * String value of the generated Auth code
     */
    value: string;

    /**
     * Type of associated auth code {@link AuthCodeType}
     */
    type: AuthCodeType;
}