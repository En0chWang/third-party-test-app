import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { Container, Row, Col, Table, Spinner } from "react-bootstrap";
import { fetchAuthSession, getCurrentUser } from "aws-amplify/auth";
import { get } from "aws-amplify/api";
import { EmbeddedAppSDK } from "../sdk/embeddedAppSDK";
import { Metrics } from "../sdk/models/structure/metrics";
import {
  MetricNameConstants,
  MetricType,
} from "../sdk/models/types/telemetryTypes";

interface MerchantItem {
  mcid: string;
  updated_time: number;
}
interface ApiData {
  message: MerchantItem[];
  error: string;
}

const MerchantWidgetPage: React.FC = () => {
  const [apiData, setApiData] = useState<ApiData | null>(null);
  const [loading, setLoading] = useState(true);

  const location = useLocation();

  useEffect(() => {
    const getMerchants = async () => {
      // const session = await fetchAuthSession();
      // const token = session.tokens?.idToken?.toString() ?? '';

      // const currentUser = await getCurrentUser();
      // const user_id = currentUser.userId;

      const embeddedAppSDK: EmbeddedAppSDK = EmbeddedAppSDK.getInstance();

      // Initialize the Embedded App SDK
      embeddedAppSDK
        .initialize()
        .then(() => {
          console.log("[3P] Embedded App SDK initialized successfully");
          embeddedAppSDK.authorizationModule
            .getAuthContext({})
            .then((authContext) => {
              console.log("[3P] Auth Context:", authContext);
              const user_auth_code = authContext?.USER_AUTH_CODE;
              const sc_context_token = authContext?.SC_CONTEXT_TOKEN;
              console.log("[3P] User auth code:", user_auth_code);
              console.log("[3P] SC context token:", sc_context_token);
            });

          // Capture custom metrics and logs
          const metricsToRecord: Metrics = {
            metricName: MetricNameConstants.WIDGET_LOAD,
            metricsType: MetricType.SUCCESS,
            timestamp: 123456789,
            value: 1,
            isRetryable: true,
          };
          embeddedAppSDK.telemetryModule.captureMetrics(metricsToRecord);
        })
        .catch((error) => {
          console.error(
            "[3P] Error during Embedded App SDK initialization:",
            error
          );
        });
    };

    getMerchants();
  }, [location]);

  return (
    <Container className="justify-content-center align-items-center">
      <Row className="justify-content-md-center mt-5">
        <Col className="d-flex align-items-center justify-content-center">
          <h1 className="text-center">Amazon Merchant Management Widget</h1>
        </Col>
      </Row>
      <Row className="mt-5">
        <Col className="d-flex justify-content-center align-items-center">
          {loading && (
            <Spinner animation="border" role="status">
              <span className="visually-hidden">Loading...</span>
            </Spinner>
          )}
        </Col>
      </Row>

      <Row className="mt-5">
        <Col>
          {apiData && apiData.message.length > 0 && (
            <Table responsive bordered className="text-center">
              <thead>
                <tr>
                  <th>Amazon Merchant ID</th>
                  <th>Last Updated</th>
                </tr>
              </thead>
              <tbody>
                {apiData.message.map((item, index) => (
                  <tr key={index}>
                    <td>{item.mcid}</td>
                    <td>{new Date(item.updated_time).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default MerchantWidgetPage;
