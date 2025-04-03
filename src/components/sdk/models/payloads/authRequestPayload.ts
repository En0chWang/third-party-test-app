import { AbstractPayload } from './abstractPayload';

/**
 * Auth Request Payload definition. Note, for P0 we don't need any info from 3P.
 * Following info will be inferred in SDK Bridge independently 1) Origin Widget/App Id 2) MechantId
 */
export interface AuthRequestPayload extends AbstractPayload {

}
