import Stripe  from "stripe";

if(!process.env.STRIPE_SECRET_KEY){
    throw new Error("STRIPR_SECRET_KEY is missing in environment variables");
}

export const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY, {
    apiVersion: '2023-10-16'
});