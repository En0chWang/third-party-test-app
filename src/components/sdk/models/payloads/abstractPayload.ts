/**
 *  Abstract payload class used to implement various payload types
 */
import { Version } from "../types/version";

export interface AbstractPayload {
    version: Version;
}
