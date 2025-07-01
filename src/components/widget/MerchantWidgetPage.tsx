import React, { useEffect, useState } from "react";
import { Container, Row, Col, Spinner, Card } from "react-bootstrap";
import { EmbeddedAppSDK } from "../sdk/embeddedAppSDK";
import { Metrics } from "../sdk/models/structure/metrics";
import {
  MetricNameConstants,
  MetricType,
} from "../sdk/models/types/telemetryTypes";
import { AuthContext } from "../sdk/models/structure/authContext";
import { AuthCode } from "../sdk/models/structure/authCode";
import { AuthUser, fetchAuthSession, getCurrentUser } from "aws-amplify/auth";
import { post } from "aws-amplify/api";

const MerchantWidgetPage: React.FC = () => {
  const [authCode, setAuthCode] = useState<AuthCode | null>(null);
  const [authContext, setAuthContext] = useState<AuthContext | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getAuthData = async () => {
      try {
        // Get the singleton instance of the Embedded App SDK
        const embeddedAppSDK: EmbeddedAppSDK = EmbeddedAppSDK.getInstance();

        // Initialize the SDK once
        await embeddedAppSDK.initialize();
        console.log("[3P] Embedded App SDK initialized successfully");

        // Retrieve both auth context and auth code concurrently
        const [context, code] = await Promise.all([
          embeddedAppSDK.authorizationModule.getAuthContext({
            pkce: {
              codeChallenge: "S8_sERwOg1LKsD2u5IHxsbmh0o2w8yBx53PqVGbncr4",
              codeChallengeMethod: "S256",
            },
          }),

          // TODO: to be deprecated
          embeddedAppSDK.authorizationModule.getAuthCode(),
        ]);

        const session = await fetchAuthSession();
        const token = session.tokens?.idToken?.toString() ?? "";

        const userAuthCode = context?.USER_AUTH_CODE || "";
        const restOperation = post({
          apiName: "myRestApi",
          path: "auth-code-path",
          options: {
            headers: {
              Authorization: token,
            },
            queryParams: {
              spapi_oauth_code: userAuthCode,
              mcid: "test_mcid",
              user_id: "test_user_id",
              code_verifier: "jSIYNE4d3f8Km_n0NR9X0MnJC_rGM5ggCxt1YazGzKM",
            },
          },
        });
        const { body } = await restOperation.response;
        const str = await body.text();
        console.log("[3P] Access Token: ", JSON.parse(str));

        console.log("[3P] Auth Context:", context);
        console.log("[3P] Auth Code:", code);

        setAuthContext(context ?? null);
        setAuthCode(code ?? null);

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
              <Card className="mb-3">
                <Card.Body>
                  <Card.Title>Auth Code</Card.Title>
                  <Card.Text>
                    {authCode
                      ? JSON.stringify(authCode, null, 2)
                      : "No Auth Code available"}
                  </Card.Text>
                </Card.Body>
              </Card>
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
            </div>
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default MerchantWidgetPage;
