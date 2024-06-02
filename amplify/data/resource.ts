import { type ClientSchema, a, defineData } from "@aws-amplify/backend";
import { myApiFunction } from '../functions/api-function/resource';

const schema = a.schema({
  Token: a.model({
      user_id: a.string(),
      mcid: a.string(),
      refresh_token: a.string(),
  }).authorization(allow => [allow.owner()])
}).authorization(allow => [
  allow.resource(myApiFunction).to(['mutate', 'query'])
]);

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema,
});
