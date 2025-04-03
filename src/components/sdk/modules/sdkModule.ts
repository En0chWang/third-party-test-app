/**
 * Generic interface used to implement various SDK modules
 */
export interface SdkModule {
  /**
   * Method to initialize SDK module for making it ready for interaction
   */
  initialize(): void;
}
