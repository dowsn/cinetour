import Stripe from 'stripe';
import { getSessionByValidToken } from '../../utils/database';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default async function handler(request, response) {
  const baseUrl = await process.env.BASE_URL;

  if (request.method !== 'POST') {
    return response.status(400).json({ error: 'Method not allowed' });
  }
  // get the required information for the purchase from the request
  const successUrl = `${baseUrl}/success`;
  const cancelUrl = `${baseUrl}/canceled`;

  const quantity = request.body.quantity;
  const mode = request.body.mode;
  const priceId = request.body.priceId;

  // request the creation of the session
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    mode: mode,
    line_items: [{ price: priceId, quantity: quantity }],
    success_url: successUrl + '?session_id={CHECKOUT_SESSION_ID}',
    cancel_url: cancelUrl,
  });

  // check if the session is in order
  if (!session) {
    return response.status(400).json({ error: 'Create session failed' });
  }

  // authentication
  const sessionToken = req.cookies.sessionToken;

  const sessionUser = await getSessionByValidToken(sessionToken);

  if (!sessionUser) {
    return res.status(403).json({ errors: [{ message: 'Unauthorized' }] });
  }

  // response the client with the new session or an error if no session

  response.status(200).json({ session: session });
}
