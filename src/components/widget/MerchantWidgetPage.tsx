import React, { useEffect, useState } from "react";
import { Container, Row, Col, Spinner, Button, OverlayTrigger, Tooltip, Form } from "react-bootstrap";
import { EmbeddedAppSDK } from "../sdk/embeddedAppSDK";
import { Metrics } from "../sdk/models/structure/metrics";
import {
  MetricNameConstants,
  MetricType,
} from "../sdk/models/types/telemetryTypes";
import { AuthContext } from "../sdk/models/structure/authContext";
import "./MerchantWidgetPage.scss";

interface CopiedStates {
  [key: string]: boolean;
}

const MerchantWidgetPage: React.FC = () => {
  // ========================================
  // State Management
  // ========================================
  const [authContext, setAuthContext] = useState<AuthContext | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [copiedStates, setCopiedStates] = useState<CopiedStates>({});
  const [parentUrl, setParentUrl] = useState<string>('');

  // ========================================
  // Event Handlers
  // ========================================
  const handleErrorMetric = (metricName: MetricNameConstants): void => {
    const embeddedAppSDK = EmbeddedAppSDK.getInstance();
    const errorMetrics: Metrics = {
      metricName,
      metricsType: MetricType.ERROR,
      timestamp: Date.now(),
      value: 1,
      isRetryable: true,
    };
    
    console.log("Generating SDK Error Metric:", metricName);
    embeddedAppSDK.telemetryModule.captureMetrics(errorMetrics);
  };

  const handleParentUrlChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    setParentUrl(event.target.value);
  };

  const handleAddQueryParamToUrl = (errorType: string): void => {
    if (!parentUrl.trim()) {
      alert('Please enter a valid parent window URL first.');
      return;
    }

    try {
      const url = new URL(parentUrl);
      url.searchParams.set('errorType', errorType);
      const updatedUrl = url.toString();
      
      copyToClipboard(updatedUrl, `url_${errorType}`);
      console.log(`Added errorType query param (${errorType}) to parent URL:`, updatedUrl);
    } catch (error) {
      alert('Invalid URL format. Please enter a valid URL.');
      console.error('Invalid URL:', error);
    }
  };

  const copyToClipboard = (text: string, label: string): void => {
    navigator.clipboard.writeText(text).then(() => {
      console.log(`${label} copied to clipboard:`, text);
      setCopiedStates(prev => ({ ...prev, [label]: true }));
      
      setTimeout(() => {
        setCopiedStates(prev => ({ ...prev, [label]: false }));
      }, 2000);
    });
  };

  // ========================================
  // Helper Functions
  // ========================================
  const getAuthValue = (key: string): string => {
    if (!authContext || typeof authContext !== 'object') return 'N/A';
    return (authContext as any)[key] || 'N/A';
  };

  // ========================================
  // Component Renderers
  // ========================================
  const renderAuthContextItem = (label: string, key: string) => (
    <div className="auth-context__item">
      <span className="auth-context__label">{label}:</span>
      <OverlayTrigger
        placement="top"
        overlay={<Tooltip>{getAuthValue(key)}</Tooltip>}
      >
        <Button 
          variant="outline-secondary" 
          size="sm"
          className="auth-context__hover-btn"
        >
          Hover to view
        </Button>
      </OverlayTrigger>
      <Button 
        variant="outline-primary" 
        size="sm"
        onClick={() => copyToClipboard(getAuthValue(key), key)}
        className="auth-context__copy-btn"
      >
        {copiedStates[key] ? 'Copied!' : 'Copy'}
      </Button>
    </div>
  );

  const renderTelemetryButton = (label: string, metricName: MetricNameConstants) => (
    <OverlayTrigger
      placement="top"
      overlay={<Tooltip>Generate {label} error telemetry within the SDK</Tooltip>}
    >
      <Button 
        variant="danger" 
        className="error-buttons__button"
        onClick={() => handleErrorMetric(metricName)}
      >
        {label}
      </Button>
    </OverlayTrigger>
  );

  const renderQueryParamButton = (label: string, queryParam: string) => (
    <OverlayTrigger
      placement="top"
      overlay={<Tooltip>Add {queryParam} error parameter to the URL and copy to clipboard</Tooltip>}
    >
      <Button 
        variant="outline-danger" 
        className="url-query-section__button"
        onClick={() => handleAddQueryParamToUrl(queryParam)}
        disabled={!parentUrl.trim()}
      >
        {copiedStates[`url_${queryParam}`] ? 'Copied!' : label}
      </Button>
    </OverlayTrigger>
  );

  const renderAuthContextSection = () => (
    <div className="auth-context">
      <h5 className="auth-context__title">Auth Context</h5>
      <div className="auth-context__items">
        {renderAuthContextItem('USER_AUTH_CODE', 'USER_AUTH_CODE')}
        {renderAuthContextItem('SC_CONTEXT_TOKEN', 'SC_CONTEXT_TOKEN')}
      </div>
    </div>
  );

  const renderTelemetryButtonsSection = () => (
    <div className="error-buttons">
      <h5 className="error-buttons__title">SDK Error Simulation</h5>
      <div className="error-buttons__telemetry-container">
        {renderTelemetryButton('User Linking Error', MetricNameConstants.USER_LINKING)}
        {renderTelemetryButton('Account Linking Error', MetricNameConstants.ACCOUNT_LINKING)}
        {renderTelemetryButton('User & Account Linking Error', MetricNameConstants.USER_AND_ACCOUNT_LINKING)}
      </div>
    </div>
  );

  const renderUrlQuerySection = () => (
    <div className="url-query-section">
      <h5 className="url-query-section__title">Query Param Error Simulation</h5>
      <div className="url-query-section__help-text">
        <OverlayTrigger
          placement="top"
          overlay={
            <Tooltip>
              Since this widget runs in an iFrame, copy the parent window's URL here. 
              Click an error button below to add the error parameter and copy the modified URL to your clipboard.
            </Tooltip>
          }
        >
          <span style={{ textDecoration: 'underline', cursor: 'help' }}>
            📝 Copy and paste the parent window URL below, then click an error button to generate a URL with error parameters:
          </span>
        </OverlayTrigger>
      </div>
      
      <div className="url-query-section__input-container">
        <OverlayTrigger
          placement="top"
          overlay={<Tooltip>Paste the parent window URL here (e.g., https://example.com/page)</Tooltip>}
        >
          <Form.Control
            type="text"
            placeholder="https://example.com/your-page"
            value={parentUrl}
            onChange={handleParentUrlChange}
            className="url-query-section__input"
          />
        </OverlayTrigger>
      </div>
      
      <div className="url-query-section__buttons-container">
        {renderQueryParamButton('User Linking Error', 'USER_LINKING_ERROR')}
        {renderQueryParamButton('Account Linking Error', 'ACCOUNT_LINKING_ERROR')}
        {renderQueryParamButton('User & Account Linking Error', 'USER_AND_ACCOUNT_LINKING_ERROR')}
      </div>
    </div>
  );

  const renderLoadingSpinner = () => (
    <Spinner animation="border" role="status" className="merchant-widget__loading">
      <span className="visually-hidden">Loading...</span>
    </Spinner>
  );

  const renderMainContent = () => (
    <div>
      {renderAuthContextSection()}
      {renderTelemetryButtonsSection()}
      {renderUrlQuerySection()}
    </div>
  );

  // ========================================
  // Effects
  // ========================================
  useEffect(() => {
    const initializeSDKAndFetchData = async (): Promise<void> => {
      try {
        const embeddedAppSDK = EmbeddedAppSDK.getInstance();
        
        await embeddedAppSDK.initialize();
        console.log("[3P] Embedded App SDK initialized successfully");

        const [context] = await Promise.all([
          embeddedAppSDK.authorizationModule.getAuthContext({})
        ]);

        console.log("[3P] Auth Context:", context);
        setAuthContext(context ?? null);

        const successMetrics: Metrics = {
          metricName: MetricNameConstants.WIDGET_LOAD,
          metricsType: MetricType.SUCCESS,
          timestamp: Date.now(),
          value: 1,
          isRetryable: true,
        };
        
        embeddedAppSDK.telemetryModule.captureMetrics(successMetrics);
      } catch (error) {
        console.error("[3P] Error during SDK initialization or data retrieval:", error);
      } finally {
        setLoading(false);
      }
    };

    initializeSDKAndFetchData();
  }, []);

  // ========================================
  // Main Render
  // ========================================
  return (
    <Container className="merchant-widget__container">
      <Row className="merchant-widget__header">
        <Col className="d-flex align-items-center justify-content-center">
          <h1 className="merchant-widget__header-title">
            Amazon Merchant Management Widget
          </h1>
        </Col>
      </Row>
      
      <Row className="merchant-widget__content">
        <Col className="d-flex justify-content-center align-items-center">
          {loading ? renderLoadingSpinner() : renderMainContent()}
        </Col>
      </Row>
    </Container>
  );
};

export default MerchantWidgetPage;
