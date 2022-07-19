/** @jsxImportSource @emotion/react */

import { css } from '@emotion/react';
import { loadStripe } from '@stripe/stripe-js';
import { GetServerSidePropsContext } from 'next';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import { colors } from '../styles/constants';
import {
  Cinemas,
  getProfile,
  getSubscriberByValidSubscription,
  getUserByValidSessionToken,
  Subscriber,
} from '../utils/database';
import { getReducedSubscriber } from '../utils/datastructures';

const aboutStyles = css`
  color: white;
  img {
    filter: contrast(0.912);
    position: relative;
    border-radius: 20px;
  }

  main {
    display: flex;
    justify-content: space-around;
    flex-wrap: wrap;
  }

  ul {
    display: flex;
    justify-content: center;
    gap: 60px;
  }

  li {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
  }

  .column {
    h2 {
      padding: 10px;
    }
  }

  a {
    color: ${colors.blue};

    :hover {
      color: white;
    }
  }
`;

type Props = {
  cinemas: Cinemas[];
  profile?: string;
  publicKey: string;
  subscriber?: Subscriber;
};

export default function About(props: Props) {
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
        <title>About</title>
        <meta name="description" content="Cinetour project, Cinetour Pass" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main css={aboutStyles}>
        {/* blue black gradient */}
        <section>
          <div>
            <h1>Unlimited cinema experience for a fixed monthly fee</h1>
            <p>
              With CineTour Pass you can watch an infinite number of films
              whenever you like and you can start your tour through the cinemas
              with your friends.
            </p>
            <p>Enjoy!</p>
          </div>
        </section>
        <section>
          <Image
            src="/card/card3.png"
            height="677px"
            width="1013px"
            layout="responsive"
            alt="CineTour Pass card costs 25 Euros per month"
          />
        </section>
        <section>
          <h1>What is CineTour?</h1>
          <div className="twocolumns">
            <article>
              <h2>Cinemas</h2>
              <p>
                Join over 20000 cinetourists that use our programme browser to
                find their film to watch. Simply all cinemas on one place. The
                pass gives you access to all new films and you can go to
                previews, classics, specials and the most colorful film
                festivals. Feel free to experiment.
              </p>
            </article>
            <article>
              <h2>Tours</h2>
              <p>
                CineTour means community. All cinetourist can therefore add
                their own tours to the programme for others to join, meet and
                discuss films together. This is the way how Cinetour reimagines
                cinema as a social experience. Endless tour may begin!
              </p>
            </article>
          </div>
        </section>
        <section>
          <br />
          <h1>How does it work?</h1>
          <br />
          <div className="twocolumns column">
            <article>
              <div>
                <Image
                  src="/card/howdoesitwork 1.jpeg"
                  layout="fixed"
                  height="200px"
                  width="200px"
                />
              </div>
              <br />
              {props.profile ? (
                <div>
                  <Link href="/../register">
                    <button disabled>Register</button>
                  </Link>
                  <h2>or</h2>
                  <Link href="/login">
                    <button disabled>Login</button>
                  </Link>
                </div>
              ) : (
                <div>
                  <Link href="/register">
                    <button>Register</button>
                  </Link>
                  <h2>or</h2>
                  <Link href="/login">
                    <button>Login</button>
                  </Link>
                </div>
              )}
            </article>
            <article>
              <Image
                src="/card/howdoesitwork 2.jpeg"
                alt=""
                layout="fixed"
                height="200px"
                width="200px"
              />
              <br />
              <br />
              {!props.subscriber && props.profile ? (
                <button onClick={() => handlePurchase()}>Subscribe</button>
              ) : (
                <button type="button" disabled>
                  Subscribe
                </button>
              )}
              <h2>for your own CineTour Pass</h2>
            </article>
            <article>
              <Image
                src="/card/howdoesitwork 3.jpeg"
                alt=""
                layout="fixed"
                height="200px"
                width="200px"
              />
              <br />
              <br />
              <h2>Explore</h2>
              <div>
                <Link href="/cinemas">
                  <button>Cinemas</button>
                </Link>
              </div>
              <h2>&</h2>
              <div>
                <Link href="/tours">
                  <button>Tours</button>
                </Link>
              </div>
              <h2>with other Cinetourists</h2>
            </article>
          </div>
        </section>
        <section>
          <br />
          <h1>CineTour Network</h1>
          <ul>
            {props.cinemas.map((cinema) => (
              <li key={`cinema_name-${cinema.id}`}>
                <h2>{cinema.cinemaName}</h2>
                <div>{cinema.address}</div>
                <br />
                <a href={`mailto:${cinema.contact}`}>{cinema.contact}</a>
                <br />
                <br />
                <Image
                  src={`/cinemas/${cinema.id}.jpeg`}
                  alt=""
                  layout="fixed"
                  height="300px"
                  width="300px"
                />
              </li>
            ))}
            {/* add map after learning api */}
          </ul>
        </section>
      </main>
    </div>
  );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const baseUrl = await process.env.BASE_URL;

  const cinemasRequest = await fetch(`${baseUrl}/api/cinemas`);

  const cinemas = await cinemasRequest.json();

  const user = await getUserByValidSessionToken(
    context.req.cookies.sessionToken,
  );

  if (!user) {
    return {
      props: {
        cinemas: cinemas,
      },
    };
  }
    const subscriber = await getSubscriberByValidSubscription(user.id);
    const profile = await getProfile(user.id);

    if (subscriber) {
      const reducedSubscriber = getReducedSubscriber(subscriber);

      return {
        props: {
          subscriber: reducedSubscriber,
          profile: profile,
          cinemas: cinemas,
        },
      };
    }

    return {
      props: {
        profile: profile,
        cinemas: cinemas,
        publicKey: process.env.STRIPE_PUBLISHABLE_KEY,
      },
    };
  }
