/**
 * Auth Code Type definition
 */
export enum AuthCodeType {
    /*
    This type denotes current logged in User identity vended via LWA auth_code
     */
    USER = "USER",

    /*
        This type denotes current Merchant identity vended via encrypted blurb which can be decrypted via SP-API
     */
    MERCHANT = "MERCHANT",
}