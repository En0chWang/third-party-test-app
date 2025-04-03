import { PKCE } from '../structure/pkce';
import { AbstractPayload } from './abstractPayload';

/**
 * Auth Context Request Payload definition.
 */
export interface AuthContextRequestPayload extends AbstractPayload {
    pkce?: PKCE;
}
