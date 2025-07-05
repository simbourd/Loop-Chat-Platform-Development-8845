export const stripeConfig = {
  publishableKey: 'pk_test_your_publishable_key_here', // Replace with your actual Stripe publishable key
  paymentPlans: [
    {
      name: "Loop - Core plan",
      amount: 3.99,
      priceId: "price_1RhbQhINLQGfWHjMQqKNKaP8",
      paymentLink: "https://buy.stripe.com/test_00w7sMeZa8Ev1Us75iefC03",
      currency: "usd",
      interval: "month"
    },
    {
      name: "Loop - Yearly plan",
      amount: 35,
      priceId: "price_1RhbQhINLQGfWHjMojydHPha",
      paymentLink: "https://buy.stripe.com/test_4gM00k8AM1c37eM1KYefC02",
      currency: "usd",
      interval: "year"
    }
  ]
};