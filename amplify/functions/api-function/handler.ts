import type { APIGatewayProxyHandler } from "aws-lambda";
import AWS, { S3 } from 'aws-sdk';
import axios from "axios";
import https from 'https';
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, PutCommand, QueryCommand } from "@aws-sdk/lib-dynamodb";

const s3 = new AWS.S3();
const client = new DynamoDBClient({ region: 'us-east-1' }); // Change to your region
const ddbDocClient = DynamoDBDocumentClient.from(client);

const getMerchants = async (user_id: string) => {
  try {
    console.log('calling get token api...');
    const params = {
      TableName: 'merchant-token',
      KeyConditionExpression: 'user_id = :user_id',
      ExpressionAttributeValues: {
        ':user_id': user_id,
      },
    };

    const get_merchants_response = await ddbDocClient.send(new QueryCommand(params));

    return {
      statusCode: 200,
      // Modify the CORS settings below to match your specific requirements
      headers: {
        "Access-Control-Allow-Origin": "*", // Restrict this to domains you trust
        "Access-Control-Allow-Headers": "*", // Specify only the headers you need to allow
        "Access-Control-Allow-Methods": "*",
      },
      body: JSON.stringify({message: get_merchants_response.Items})
    };

  } catch(error) {
      throw error;
  }
}

const handleAuthCode = async (user_id: string, mcid: string, spapi_oauth_code: string) => {
    try {
        const certs = await s3.getObject({ Bucket: 'amplify-lambda-file-bucket', Key: 'ca-certs.json'}).promise();
        const cas_string = certs.Body?.toString('utf-8');
        const cas = JSON.parse(cas_string ?? '').cacerts;

        const client_creds = await s3.getObject({ Bucket: 'amplify-lambda-file-bucket', Key: 'lwa-creds.json'}).promise();
        const client_creds_json = JSON.parse(client_creds.Body?.toString('utf-8') ?? '');

        const agent = new https.Agent({
            ca: cas
        });
        const instance = axios.create({
            httpsAgent: agent
        });
        // Call LWA to exchange Auth Code for refresh token
        console.log("Calling LWA beta");
        const response = await instance.post(
            'https://panda-service.integ.amazon.com:9081/auth/O2/token',
            new URLSearchParams({
                grant_type: 'authorization_code',
                code: spapi_oauth_code,
                client_id: client_creds_json.client_id,
                client_secret: client_creds_json.client_secret,
            }),
            {
              headers: {
                  'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
                  'x-forwarded-server': 'api.integ.amazon.com',
              },
            }
        );

        console.log("response data is" + response.data.refresh_token);

        if (response.data.refresh_token) {
          // Save refresh token for mcid + user id
          console.log('calling create token...');
          const params = {
            TableName: 'merchant-token',
            Item: {
              user_id,
              mcid,
              refresh_token: response.data.refresh_token,
              updated_time: Date.now(),
            }
          };
          const refresh_token_response = await ddbDocClient.send(new PutCommand(params));
          console.log('successfully saved the refresh_token...');
          console.log('refresh token response: ' + refresh_token_response);
        }

        return {
          statusCode: 200,
          // Modify the CORS settings below to match your specific requirements
          headers: {
            "Access-Control-Allow-Origin": "*", // Restrict this to domains you trust
            "Access-Control-Allow-Headers": "*", // Specify only the headers you need to allow
            "Access-Control-Allow-Methods": "*",
          },
          body: JSON.stringify({message: 'Successfully linked merchant'})
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
    if (event.path === '/auth-code-path') {

      // Extract query parameters from the event object
      const queryParams = event.queryStringParameters || {};
  
      // Access specific query parameters
      const userId = queryParams['user_id'] ?? '';
      const spapiOauthCode = queryParams['spapi_oauth_code'] ?? '';
      const mcid = queryParams['mcid'] ?? '';
      
      const res = await handleAuthCode(userId, mcid, spapiOauthCode);
      return res;
    }
    
    if (event.path === '/merchants-path') {
      // Extract query parameters from the event object
      const queryParams = event.queryStringParameters || {};
  
      // Access specific query parameters
      const userId = queryParams['user_id'] ?? '';
  
      const res = await getMerchants(userId);
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