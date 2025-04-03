import { SdkModule } from "./sdkModule";
import { DataExchangeModule } from "./dataExchangeModule";
import { PKCE } from "../models/structure/pkce";
import { AuthCode } from "../models/structure/authCode";
import { AuthContext } from "../models/structure/authContext";
import { AuthRequestPayload } from "../models/payloads/authRequestPayload";
import { Version } from "../models/types/version";
import { AuthRequestMessage } from "../models/messages/authRequestMessage";
import { AuthResponseMessage } from "../models/messages/authResponseMessage";
import { AuthContextRequestPayload } from "../models/payloads/authContextRequestPayload";
import { AuthContextRequestMessage } from "../models/messages/authContextRequestMessage";
import { AuthContextResponseMessage } from "../models/messages/authContextResponseMessage";

export interface AuthContextInput {
  pkce?: PKCE;
}

/**
 * Authorization Module responsible for handling auth code retrieval and auto refresh
 */
export class AuthorizationModule implements SdkModule {
  private authCode?: AuthCode;
  private authContext?: AuthContext;

  private dataExchangeModule: DataExchangeModule;

  constructor(dataExchangeModule: DataExchangeModule) {
    // Use the existing data exchange module instance from the singleton SDK class
    this.dataExchangeModule = dataExchangeModule;
  }

  initialize(): void {
    // TODO: Implement recurring auth code token refresh logic
  }

  /**
   * @deprecated This method has been deprecated in favor of the getAuthContext method and will be removed in a future version
   */
  getAuthCode(): Promise<AuthCode | undefined> {
    const payload: AuthRequestPayload = {
      version: Version.V1,
    };

    const message = new AuthRequestMessage(payload);

    return this.dataExchangeModule
      .sendMessage(message)
      .then((response: AuthResponseMessage) => {
        console.log("Auth message response received:", response);

        if (!response.success) {
          return Promise.reject(
            new Error(`Received Auth code response failure: ${response.error}`)
          );
        }

        this.authCode = response.payload?.authCode;
        return Promise.resolve(this.authCode);
      })
      .catch((error) => {
        console.error(`Failed to retrieve auth code: ${error}`);
        return Promise.reject(error);
      });
  }

  getAuthContext(
    authContextInput: AuthContextInput
  ): Promise<AuthContext | undefined> {
    const payload: AuthContextRequestPayload = {
      ...authContextInput,
      version: Version.V1,
    };

    const message = new AuthContextRequestMessage(payload);

    return this.dataExchangeModule
      .sendMessage(message)
      .then((response: AuthContextResponseMessage) => {
        console.log("Auth context response received:", response);

        if (!response.success) {
          return Promise.reject(
            new Error(
              `Received auth context response failure: ${response.error}`
            )
          );
        }

        this.authContext = response.payload?.authContext;
        return Promise.resolve(this.authContext);
      })
      .catch((error) => {
        console.error(`Failed to retrieve auth context: ${error}`);
        return Promise.reject(error);
      });
  }
}
