import type { APIGatewayProxyHandler } from "aws-lambda";
import { SellingPartner } from "amazon-sp-api";
import axios from "axios";

const handleSpApi = async (refresh_token: string) => {
    try {
        const spClient = new SellingPartner({
            credentials: {
                SELLING_PARTNER_APP_CLIENT_ID: 'amzn1.application-oa2-client.88846d85be274c5aa0908fc926d5e6ee',
                SELLING_PARTNER_APP_CLIENT_SECRET: 'amzn1.oa2-cs.v1.4c7bcb74753059bb35b48a05386516a128158dbf39c7036e82ef9080f9c5f89a',
            },
            region: 'na',
            refresh_token: refresh_token,
        });

        let res = await spClient.callAPI({
            operation: 'getMarketplaceParticipations',
            endpoint: 'sellers'
        })
        console.log(res);
        return res;
    } catch (err) {
        console.log(err);
    }
};

const handleAuthCode = async (spapi_oauth_code: string, mcid: string) => {
    try {
      // Call LWA to exchange Auth Code for refresh token
      const response = await axios.post(
        'https://api.amazon.com/auth/o2/token',
        new URLSearchParams({
            grant_type: 'authorization_code',
            code: spapi_oauth_code,
            redirect_uri: 'https://dev.d1r2ngivcf6m4r.amplifyapp.com/landing/',
            client: 'amzn1.application-oa2-client.88846d85be274c5aa0908fc926d5e6ee',
            client_secrect: 'amzn1.oa2-cs.v1.4c7bcb74753059bb35b48a05386516a128158dbf39c7036e82ef9080f9c5f89a',
        }),
        {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
        }
      );

      console.log(response);

      // Save refresh token for mcid + user id


      
      return {
        statusCode: 200,
        // Modify the CORS settings below to match your specific requirements
        headers: {
          "Access-Control-Allow-Origin": "*", // Restrict this to domains you trust
          "Access-Control-Allow-Headers": "*", // Specify only the headers you need to allow
          "Access-Control-Allow-Methods": "*",
        },
        body: JSON.stringify("Hello from myFunction!"),
      };

    } catch (err) {
        console.log(err);
        throw err;
    }

};


export const handler: APIGatewayProxyHandler = async (event) => {
  console.log("event", event);

  if (event.path === '/auth-code-path') {

    // Extract query parameters from the event object
    const queryParams = event.queryStringParameters || {};

    // Access specific query parameters
    const spapiOauthCode = queryParams['spapi_oauth_code'] ?? '';
    const mcid = queryParams['mcid'] ?? '';
    
    const res = await handleAuthCode(spapiOauthCode, mcid);
    return res;
  }


  return {
    statusCode: 200,
    // Modify the CORS settings below to match your specific requirements
    headers: {
      "Access-Control-Allow-Origin": "*", // Restrict this to domains you trust
      "Access-Control-Allow-Headers": "*", // Specify only the headers you need to allow
      "Access-Control-Allow-Methods": "*",
    },
    body: JSON.stringify("Hello from myFunction!"),
  };
};