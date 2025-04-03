import { SdkModule } from "./sdkModule";
import { Log } from "../models/structure/log";
import { Metrics } from "../models/structure/metrics";
import { TelemetryRequestMessage } from "../models/messages/telemetryRequestMessage";
import { TelemetryRequestPayload } from "../models/payloads/telemetryRequestPayload";

import { DataExchangeModule } from "./dataExchangeModule";
import { logInfo, logError } from "../utilityHelper";
import {
  LogType,
  MetricNameConstants,
  MetricType,
} from "../models/types/telemetryTypes";
import { Version } from "../models/types/version";

export interface TelemetryInput {
  metrics?: Metrics;
  log?: Log;
}

/**
 * Telemetry Module responsible for capturing and publishing custom/pre-defined metrics and logs.
 */
export class TelemetryModule implements SdkModule {
  private dataExchangeModule: DataExchangeModule;

  constructor(dataExchangeModule: DataExchangeModule) {
    // Use the existing data exchange module instance from the singleton SDK class
    this.dataExchangeModule = dataExchangeModule;
  }

  initialize(): void {
    this.initiateTelemetryAutoCapture();
  }

  /**
   * Method to capture the client log event and publish it to the Amazon Embedded SDK Bridge.
   * @param log
   */
  captureLog(log: Log): Promise<boolean> {
    return this.captureTelemetry({ log });
  }

  /**
   * Method to capture the client metrics event and publish it to the Amazon Embedded SDK Bridge.
   * @param metrics
   */
  captureMetrics(metrics: Metrics): Promise<boolean> {
    return this.captureTelemetry({ metrics });
  }

  /**
   * Method to capture the client telemetry event and publish it to the Amazon Embedded SDK Bridge.
   * @param telemetryInput
   */
  captureTelemetry(telemetryInput: TelemetryInput): Promise<boolean> {
    logInfo(
      "Received request to capture following telemetry info:",
      telemetryInput
    );

    const telemetryRequestPayload: TelemetryRequestPayload = {
      ...telemetryInput,
      version: Version.V1,
    };

    const telemetryRequestMessage = new TelemetryRequestMessage(
      telemetryRequestPayload
    );

    return this.dataExchangeModule
      .sendMessage(telemetryRequestMessage)
      .then((response) => {
        logInfo("Telemetry sent successfully:", response);
        return true;
      })
      .catch((error) => {
        logError("Failed to capture telemetry:", error.message);
        return false;
      });
  }

  /**
   * Method to automatically capture telemetry events.
   */
  private initiateTelemetryAutoCapture(): void {
    // Capture all window crash or error events
    window.addEventListener("error", (event: ErrorEvent) => {
      const currentTime = Date.now();
      const log: Log = {
        logType: LogType.ERROR,
        message: `Widget page crash error event occurred: ${event.message}`,
        timestamp: currentTime,
        isRetryable: false,
      };

      const metrics: Metrics = {
        metricName: MetricNameConstants.WIDGET_LOAD,
        metricsType: MetricType.FAULT,
        timestamp: currentTime,
        value: 1,
        isRetryable: false,
      };

      this.captureTelemetry({ log, metrics }).then((result) => {
        if (result) {
          logInfo("Telemetry for error event captured successfully.");
        } else {
          logError("Failed to capture telemetry for error event.");
        }
      });
    });

    // Capture page load latency
    window.addEventListener("load", () => {
      if (window.performance && performance.getEntriesByType) {
        const [navigationEntry] = performance.getEntriesByType(
          "navigation"
        ) as PerformanceNavigationTiming[];

        if (navigationEntry) {
          // Total page load time in ms
          const pageLoadTime =
            navigationEntry.loadEventEnd - navigationEntry.startTime;

          const metrics: Metrics = {
            metricName: MetricNameConstants.WIDGET_LOAD,
            metricsType: MetricType.LATENCY_IN_MILLIS,
            timestamp: Date.now(),
            value: pageLoadTime,
            isRetryable: false,
          };

          this.captureMetrics(metrics).then((result) => {
            if (result) {
              logInfo("Telemetry for page load latency captured successfully.");
            } else {
              logError("Failed to capture telemetry for page load latency.");
            }
          });
        }
      }
    });

    logInfo(
      "Telemetry auto-capture initialized for window crash, error events, and page load latency."
    );
  }
}
