import { defineFunction } from "@aws-amplify/backend";

export const lwaFunction = defineFunction({
  name: "lwa-function",
  timeoutSeconds: 300,
});