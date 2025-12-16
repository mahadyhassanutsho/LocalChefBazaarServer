import { stripeSecret } from "./env.js";

import Stripe from "stripe";

const stripe = new Stripe(stripeSecret);

export default stripe;
