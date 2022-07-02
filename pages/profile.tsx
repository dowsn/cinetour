import { loadStripe } from '@stripe/stripe-js';
import { GetServerSidePropsContext } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import stripe from 'stripe';
import {
  Admin,
  getAdmin,
  getProfile,
  getSubscriberByValidSubscription,
  getUserByUsername,
  getUserByValidSessionToken,
  Profile,
  Subscriber,
  User,
} from '../utils/database';

type Props = {
  user: User;
  profile: Profile;
  admin?: Admin;
  publicKey: string;
  subscriber?: Subscriber;
};

export default function UserDetail(props: Props) {
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
        <title>{props.user.username}</title>
        <meta name="description" content="Your profile page" />
      </Head>
      <main>
        <h1>CineTourist {props.user.username}</h1>
        <section>
          {props.admin ? (
            <>
              <Link href="/edit_programme">Edit Programme</Link>
              <Link href="/edit_films">Edit Films</Link>
            </>
          ) : (
            ''
          )}
          <h2>First name:</h2>
          <p>{props.profile.firstName}</p>
          <h2>Last name:</h2>
          <p>{props.profile.lastName}</p>
          {props.subscriber ? (
            <p>{`${props.subscriber.expiryTimestamp}`}</p>
          ) : (
            ''
          )}
          <h2>E-Mail:</h2>
          <p>{props.profile.email}</p>
          <h2>Self-description:</h2>
          <p>{props.profile.selfDescription}</p>
        </section>
        {props.subscriber ? (
          ''
        ) : (
          <button onClick={() => handlePurchase()}>Subscribe</button>
        )}
        <section>{/* map with cinemas and home address */}</section>
        <section>
          <h1>Your tours</h1>
          {/* add tours based on id */}
          <h2>Hosting:</h2>
          <h2>Attending</h2>
        </section>
        <Link href="/logout">Log Out</Link>
      </main>
    </div>
  );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const user = await getUserByValidSessionToken(
    context.req.cookies.sessionToken,
  );

  if (user) {
    const admin = await getAdmin(user.id);
    const profile = await getProfile(user.id);

    if (!admin) {
      const subscriber = await getSubscriberByValidSubscription(user.id);

      if (subscriber) {
        return {
          // making data about the user available at the page in props
          props: {
            user: user,
            subscriber: subscriber,
            profile: profile,
          },
        };
      }
      return {
        props: {
          user: user,
          profile: profile,
          publicKey: process.env.STRIPE_PUBLISHABLE_KEY,
        },
      };
    }

    return {
      props: {
        user: user,
        profile: profile,
        admin: admin,
        publicKey: process.env.STRIPE_PUBLISHABLE_KEY,
      },
    };
  }

  return {
    redirect: {
      destination: `/login?returnTO=/profile`,
      permanent: false,
    },
  };
}
