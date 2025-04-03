import { AbstractPayload } from './abstractPayload';
import { AuthContext } from '../structure/authContext';

/**
 * Auth Context Response Payload definition
 */
export interface AuthContextResponsePayload extends AbstractPayload {
    /**
     * Auth Context {@link AuthContext}
     */
    authContext: AuthContext;
}
