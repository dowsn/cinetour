/** @jsxImportSource @emotion/react */

import { css } from '@emotion/react';
import { loadStripe } from '@stripe/stripe-js';
import Head from 'next/head';
import { colors } from '../styles/constants';
import { Cinemas, getCinemas } from '../utils/database';

const canceledStyles = css`
  background: ${colors.violet};
`;

type Props = {
  cinemas: Cinemas[];
  publicKey: string;
};

export default function Canceled(props: Props) {
  async function handlePurchase() {
    // 1. connect with stripe
    // auth with stripe client
    const stripeClient: any = await loadStripe(props.publicKey);

    // 2. Send order information
    const response = await fetch('/api/subscribe', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        quantity: '1',
        mode: 'payment',
        priceId: 'price_1LH5k0ES7FeuI2GqdUFUUipn',
      }),
    });

    const { session } = await response.json();

    // 2. Redirect customer to url from Checkout session
    stripeClient.redirectToCheckout({ sessionId: session.id });
  }

  return (
    <div>
      <Head>
        <title>Success</title>
        <meta name="description" content="Your subscription was successful" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main css={canceledStyles}>
        <section>
          <h2>Something went wrong</h2>
          <br />
          <div className="button">
            <button onClick={() => handlePurchase()}>Try again</button>
          </div>
        </section>
      </main>
    </div>
  );
}

export async function getServerSideProps() {
  const cinemas = await getCinemas();
  return {
    props: {
      cinemas: cinemas,
      publicKey: process.env.STRIPE_PUBLISHABLE_KEY,
    },
  };
}
