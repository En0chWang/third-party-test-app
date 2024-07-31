import type { APIGatewayProxyHandler } from "aws-lambda";
import AWS, { S3 } from 'aws-sdk';
import axios from "axios";

const s3 = new AWS.S3();

const handleAuthCode = async (lwa_auth_code: string) => {
    try {
        // Call LWA to exchange Auth Code for refresh token
        console.log("Calling LWA prod");
        console.log("auth code is " + lwa_auth_code);


        const client_creds = await s3.getObject({
          Bucket: 'amplify-lambda-file-bucket', 
          Key : 'lwa-creds-prod.json'})
        .promise();
        const client_creds_json = JSON.parse(client_creds.Body?.toString('utf-8') ?? '');


        const response = await axios.post(
            'https://api.amazon.com/auth/o2/token',
            new URLSearchParams({
                grant_type: 'authorization_code',
                code: lwa_auth_code,
                client_id: client_creds_json.client_id,
                client_secret: client_creds_json.client_secret,
                redirect_uri: 'https://dev.d1r2ngivcf6m4r.amplifyapp.com/lwa',
            }),
            {
              headers: {
                  'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
              },
            }
        );

        console.log("response data is" + JSON.stringify(response.data));

        return {
          statusCode: 200,
          // Modify the CORS settings below to match your specific requirements
          headers: {
            "Access-Control-Allow-Origin": "*", // Restrict this to domains you trust
            "Access-Control-Allow-Headers": "*", // Specify only the headers you need to allow
            "Access-Control-Allow-Methods": "*",
          },
          body: JSON.stringify({message: response.data})
        }; 
        
    } catch (err) {
      console.log(err);
        return {
          statusCode: 200,
          // Modify the CORS settings below to match your specific requirements
          headers: {
              "Access-Control-Allow-Origin": "*", // Restrict this to domains you trust
              "Access-Control-Allow-Headers": "*", // Specify only the headers you need to allow
              "Access-Control-Allow-Methods": "*",
          },
          body: JSON.stringify({error: 'There is an internal error' + err})
        }
    }
};


export const handler: APIGatewayProxyHandler = async (event) => {
  console.log("event", event);
  try {
    // Extract query parameters from the event object
    const queryParams = event.queryStringParameters || {};
  
    // Access specific query parameters
    const authCode = queryParams['lwa_auth_code'] ?? '';
      
    const res = await handleAuthCode(authCode);
    return res;

  } catch (err) {
    return {
      statusCode: 500,
      // Modify the CORS settings below to match your specific requirements
      headers: {
        "Access-Control-Allow-Origin": "*", // Restrict this to domains you trust
        "Access-Control-Allow-Headers": "*", // Specify only the headers you need to allow
        "Access-Control-Allow-Methods": "*",
      },
      body: JSON.stringify("internal error"),
    };
  }
};