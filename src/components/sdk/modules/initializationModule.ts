import { DataExchangeModule } from "./dataExchangeModule";
import { SdkModule } from "./sdkModule";
import { InitializationRequestPayload } from "../models/payloads/initializationRequestPayload";
import { InitializationRequestMessage } from "../models/messages/initializationRequestMessage";
import { Version } from "../models/types/version";

import { logInfo, logError } from "../utilityHelper";

/**
 * Initialization Module responsible for establishing handshake and initializing the SDK.
 */
export class InitializationModule implements SdkModule {
  private dataExchangeModule: DataExchangeModule;

  constructor(dataExchangeModule: DataExchangeModule) {
    // Use the existing data exchange module instance from the singleton SDK class
    this.dataExchangeModule = dataExchangeModule;
  }

  initialize(): void {
    // No listeners or initialization required here
  }

  public establishHandshake(): Promise<boolean> {
    logInfo("Establishing handshake...");

    const initializationRequestPayload: InitializationRequestPayload = {
      version: Version.V1,
    };

    const initializationRequestMessage = new InitializationRequestMessage(
      initializationRequestPayload
    );

    return this.dataExchangeModule
      .sendMessage(initializationRequestMessage)
      .then((response) => {
        if (!response.success) {
          logError("Received Handshake response failure:", response.error);
          return false;
        } else {
          logInfo("Handshake successful:", response);
          return true;
        }
      })
      .catch((error) => {
        logError("Failed to establish handshake:", error.message);
        return false;
      });
  }
}
