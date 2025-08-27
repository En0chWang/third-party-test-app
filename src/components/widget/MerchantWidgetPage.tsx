import React, { useEffect, useState } from "react";
import { Container, Row, Col, Spinner, Card, Button } from "react-bootstrap";
import { EmbeddedAppSDK } from "../sdk/embeddedAppSDK";
import { Metrics } from "../sdk/models/structure/metrics";
import {
  MetricNameConstants,
  MetricType,
} from "../sdk/models/types/telemetryTypes";
import { AuthContext } from "../sdk/models/structure/authContext";

const MerchantWidgetPage: React.FC = () => {
  const [authContext, setAuthContext] = useState<AuthContext | null>(null);
  const [loading, setLoading] = useState(true);

  const handleErrorMetric = (metricName: MetricNameConstants) => {
    const embeddedAppSDK = EmbeddedAppSDK.getInstance();
    const errorMetrics: Metrics = {
      metricName: metricName,
      metricsType: MetricType.ERROR,
      timestamp: Date.now(),
      value: 1,
      isRetryable: true,
    };
    console.log("Generating SDK Error Metric: " + metricName);
    embeddedAppSDK.telemetryModule.captureMetrics(errorMetrics);
  };

  useEffect(() => {
    const getAuthData = async () => {
      try {
        // Get the singleton instance of the Embedded App SDK
        const embeddedAppSDK: EmbeddedAppSDK = EmbeddedAppSDK.getInstance();

        // Initialize the SDK once
        await embeddedAppSDK.initialize();
        console.log("[3P] Embedded App SDK initialized successfully");

        // Retrieve both auth context and auth code concurrently
        const [context] = await Promise.all([
          embeddedAppSDK.authorizationModule.getAuthContext({})
        ]);

        console.log("[3P] Auth Context:", context);

        setAuthContext(context ?? null);

        // Capture custom metrics and logs
        const metricsToRecord: Metrics = {
          metricName: MetricNameConstants.WIDGET_LOAD,
          metricsType: MetricType.SUCCESS,
          timestamp: Date.now(),
          value: 1,
          isRetryable: true,
        };
        embeddedAppSDK.telemetryModule.captureMetrics(metricsToRecord);
      } catch (error) {
        console.error(
          "[3P] Error during SDK initialization or data retrieval:",
          error
        );
      } finally {
        setLoading(false);
      }
    };

    getAuthData();
  }, []);

  return (
    <Container className="justify-content-center align-items-center">
      <Row className="justify-content-md-center mt-5">
        <Col className="d-flex align-items-center justify-content-center">
          <h1 className="text-center">Amazon Merchant Management Widget</h1>
        </Col>
      </Row>
      <Row className="mt-3">
        <Col className="d-flex justify-content-center align-items-center">
          {loading ? (
            <Spinner animation="border" role="status">
              <span className="visually-hidden">Loading...</span>
            </Spinner>
          ) : (
            <div>
              <Card>
                <Card.Body>
                  <Card.Title>Auth Context</Card.Title>
                  <Card.Text>
                    {authContext
                      ? JSON.stringify(authContext, null, 2)
                      : "No Auth Context available"}
                  </Card.Text>
                </Card.Body>
              </Card>
              <div className="mb-3 d-flex gap-2">
                <Button 
                  variant="danger" 
                  onClick={() => handleErrorMetric(MetricNameConstants.USER_LINKING)}
                >
                  User Linking Error
                </Button>
                <Button 
                  variant="danger" 
                  onClick={() => handleErrorMetric(MetricNameConstants.ACCOUNT_LINKING)}
                >
                  Account Linking Error
                </Button>
                <Button 
                  variant="danger" 
                  onClick={() => handleErrorMetric(MetricNameConstants.USER_AND_ACCOUNT_LINKING)}
                >
                  User and Account Linking Error
                </Button>
              </div>
            </div>
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default MerchantWidgetPage;
