/**
 * Telemetry Log type definition
 */
export enum LogType {
    DEBUG = "DEBUG",
    WARN = "WARN",
    ERROR = "ERROR",
    INFO = "INFO",
}

/**
 * Telemetry metric type definition
 */
export enum MetricType {
    FAULT = "Fault",
    ERROR = "Error",
    //TODO: Introduce MetricUnit once we have different units to capture     
    LATENCY_IN_MILLIS = "Latency",
    SUCCESS = "Success"
}

/**
 * Telemetry metric name constants
 */
export enum MetricNameConstants {
    /*
    Not every metric name need to be configured part of this type and primarily is intended
    for key standard metric names that are commonly used across all embedded applications
    */
    WIDGET_LOAD = "WidgetLoad",
    USER_LINKING = "UserLinking",
    ACCOUNT_LINKING = "AccountLinking",
    USER_AND_ACCOUNT_LINKING = "UserAndAccountLinking",
    NEW_ACCOUNT_LINKED = "NewSellerAccountLinked"
}