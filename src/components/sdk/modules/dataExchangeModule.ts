import { SdkModule } from "./sdkModule";
import { AbstractMessage } from "../models/messages/abstractMessage";
import { AbstractPayload } from "../models/payloads/abstractPayload";
import { logDebug, logInfo } from "../utilityHelper";

/**
 * Data exchange Module serves as a secure foundation for all communications between SDK and the Bridge.
 *
 * Note: This module is not exposed to the clients of SDK, only to be used within the SDK package.
 */
export class DataExchangeModule implements SdkModule {
  private static readonly VALID_ORIGIN_URL_PATTERN: RegExp =
    /^(?:https:\/\/)?(?:www\.)?sellercentral(?:-europe|-japan|-mena)?\.amazon\.(?:dev|com(?:\.co|\.br|\.mx|\.ng|\.be)?|ca|cl|sa|eg|co\.za|de|fr|nl|com\.tr|se|pl|es|ae|co\.uk|it|in|ie|com\.au|co\.jp|sg)$/;

  // Map to track pending promises for requests
  private pendingPromises: Map<
    string,
    {
      resolve: (value: unknown) => void;
      reject: (reason?: unknown) => void;
      timeoutId?: number;
    }
  > = new Map();

  initialize(): void {
    // Listen for incoming messages from the parent window
    window.addEventListener("message", this.receiveMessage.bind(this), false);
  }

  /**
   * Sends a message to the parent window and returns a Promise that resolves/rejects based on the response.
   * Also implements retry logic with exponential backoff in case of failure or timeout.
   * @param message - The message object to send.
   */
  public sendMessage(
    message: AbstractMessage<AbstractPayload>
  ): Promise<unknown> {
    console.log("Sending message to parent window: ", message);

    return new Promise((resolve, reject) => {
      const requestId = message.requestId!;

      // Store the resolve/reject functions using the message requestId
      const promiseHandlers = { resolve, reject };
      this.pendingPromises.set(requestId, promiseHandlers);

      // Function to send message with retry
      const sendFunction = () => {
        // amazonq-ignore-next-line
        window.parent.postMessage(message, "*");
      };

      // Retry sending the message using retryWithExponentialBackoff
      this.retryWithExponentialBackoff(
        sendFunction,
        requestId,
        promiseHandlers
      );
    });
  }

  /**
   * Receives incoming messages from the parent window.
   * Resolves or rejects the pending promise based on the message received.
   * @param event - The MessageEvent from the parent window.
   */
  private receiveMessage(event: MessageEvent) {
    logInfo(`Received message event from origin: ${origin}, data:`, event.data);

    // Ensure the message comes from the correct origin
    if (!this.isValidOrigin(event.origin)) {
      // amazonq-ignore-next-line
      console.warn("Ignoring message from invalid origin:", event.origin);
      return;
    }
    const responseMessage = event.data;
    const { traceId } = responseMessage;

    // Find the pending promise using traceId
    const pending = this.pendingPromises.get(traceId);

    if (pending) {
      // amazonq-ignore-next-line
      console.log(
        `Promise found for traceId: ${traceId}, resolving or rejecting...`
      );

      // Remove the request from the pendingPromises map
      this.pendingPromises.delete(traceId);

      // Clear the retry timeout if a response is received
      if (pending.timeoutId !== undefined) {
        clearTimeout(pending.timeoutId);
      }

      // Resolve or reject the promise based on the response payload
      if (responseMessage.success) {
        logDebug(
          `Success response received for traceId: ${traceId}, response:`,
          responseMessage
        );
        pending.resolve(responseMessage);
      } else {
        logDebug(
          `Error response received for traceId: ${traceId}, response:`,
          responseMessage.error
        );
        pending.reject(responseMessage.error);
      }
    } else {
      // amazonq-ignore-next-line
      console.warn(`No pending promise found for traceId: ${traceId}`);
    }
  }

  /**
   * Function to check if an incoming origin is valid
   * @param origin URL
   */
  private isValidOrigin(origin: string): boolean {
    return (
      DataExchangeModule.VALID_ORIGIN_URL_PATTERN.test(origin) ||
      origin.includes("rainier-m1k.integ.amazon.com")
    );
  }

  /**
   * Retries a given function with exponential backoff.
   * @param func - The function to retry.
   * @param requestId - The request identifier used to keep track of the request.
   * @param promiseHandlers - The resolve/reject functions for the Promise.
   * @param maxRetries - The maximum number of retry attempts.
   */
  private retryWithExponentialBackoff(
    func: () => void,
    requestId: string,
    promiseHandlers: {
      resolve: (value: unknown) => void;
      reject: (reason?: unknown) => void;
    },
    maxRetries: number = 3
  ) {
    let attempt = 0;

    const tryFunc = () => {
      // Invoke the function
      func();

      // Set up a timeout to retry if no response is received
      const timeoutId = window.setTimeout(() => {
        if (this.pendingPromises.has(requestId)) {
          if (attempt < maxRetries) {
            attempt++;
            console.warn(`Retry attempt ${attempt} for request: ${requestId}`);
            tryFunc();
          } else {
            console.error(`Max retries reached for requestId: ${requestId}`);
            promiseHandlers.reject(
              new Error("Response timed out after maximum retry attempts.")
            );
            this.pendingPromises.delete(requestId); // Clean up after reaching max retries
          }
        }
      }, this.getBackoffDelay(attempt));

      // Store timeout reference to allow cancelling it if a response arrives
      this.pendingPromises.set(requestId, { ...promiseHandlers, timeoutId });
    };

    // Initial attempt
    tryFunc();
  }

  /**
   * Get the backoff delay for retrying messages.
   * Uses exponential backoff with jitter to avoid thundering herd issues.
   * @param attempt - The current retry attempt number.
   */
  private getBackoffDelay(attempt: number): number {
    const baseDelay = 2000; // Base delay of 2 seconds
    const jitter = Math.random() * 1000; // Add random jitter up to 1 second
    return baseDelay * Math.pow(2, attempt) + jitter;
  }
}
