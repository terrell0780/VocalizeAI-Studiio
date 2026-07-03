import { loadStripe } from "@stripe/stripe-js";
import { env } from "./config";

export const stripePromise = env.stripePublishableKey
  ? loadStripe(env.stripePublishableKey)
  : null;
