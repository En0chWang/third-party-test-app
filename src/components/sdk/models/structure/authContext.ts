import { AuthContextType } from '../types/authContextType';

export interface AuthContext {
    // auth code
    [AuthContextType.USER_AUTH_CODE]?: string;

    // sc context token
    [AuthContextType.SC_CONTEXT_TOKEN]?: string;
}
