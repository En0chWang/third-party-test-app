import { type ClientSchema, a, defineData } from "@aws-amplify/backend";
import { myApiFunction } from '../functions/api-function/resource';

const schema = a.schema({
  Token: a.model({
      user_id: a.id().required(),
      mcid: a.string().required(),
      refresh_token: a.string(),
  })
  .identifier(['user_id', 'mcid'])
  .authorization(allow => [allow.owner()])
}).authorization(allow => [
  allow.resource(myApiFunction).to(['mutate', 'query'])
]);

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema,
});
