import { InitializationModule } from "./modules/initializationModule";
import { DataExchangeModule } from "./modules/dataExchangeModule";
import { AuthorizationModule } from "./modules/authorizationModule";
import { TelemetryModule } from "./modules/telemetryModule";
import { logError, logInfo } from "./utilityHelper";

/**
 * Singleton instance of Embedded App SDK for instantiating and managing all module interactions.
 */
export class EmbeddedAppSDK {
  private static instance: EmbeddedAppSDK;
  private dataExchangeModule: DataExchangeModule = new DataExchangeModule();
  authorizationModule: AuthorizationModule = new AuthorizationModule(
    this.dataExchangeModule
  );
  initializationModule: InitializationModule = new InitializationModule(
    this.dataExchangeModule
  );
  telemetryModule: TelemetryModule = new TelemetryModule(
    this.dataExchangeModule
  );

  private constructor() {
    // Private constructor to prevent direct instantiation
  }

  /**
   * Create a singleton instance of the class
   */
  static getInstance(): EmbeddedAppSDK {
    if (!EmbeddedAppSDK.instance) {
      EmbeddedAppSDK.instance = new EmbeddedAppSDK();
    }
    return EmbeddedAppSDK.instance;
  }

  /**
   * Initializes all the required modules for SDK
   */
  async initialize(): Promise<void> {
    try {
      // Setup and initialize foundational modules
      this.initializationModule.initialize();
      this.dataExchangeModule.initialize();

      // Establish Handshake and wait for it
      await this.initializationModule.establishHandshake();
      logInfo("Embedded SDK initialization succeeded");

      // Initialize authentication module
      this.authorizationModule.initialize();

      // Initialize telemetry module
      this.telemetryModule.initialize();
    } catch (error) {
      logError("Embedded SDK initialization handshake failed", error);
      throw new Error("Embedded SDK initialization handshake failed");
    }
  }
}
