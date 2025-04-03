/**
 * Auth Context Type definition
 */
export enum AuthContextType {
    /**
     * This type denotes current logged in User identity vended via LWA auth_code
     */
    USER_AUTH_CODE = 'USER_AUTH_CODE',

    /**
     * This type denotes current Seller Central context token vended via encrypted blurb which can be decrypted via SP-API
     */
    SC_CONTEXT_TOKEN = 'SC_CONTEXT_TOKEN',
}
