/** @jsxImportSource @emotion/react */

import { css } from '@emotion/react';
import { GetServerSidePropsContext } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { colors } from '../styles/constants';
import {
  createSubscriber,
  getSubscriberByExistingCheckoutSession,
  getSubscriberByValidSubscription,
  getUserByValidSessionToken,
  User,
} from '../utils/database';

const stripe = require('stripe')(
  'sk_test_51LGekFES7FeuI2Gq9GrLnrZuTYSt5FGW8raRYumChsAGytijcKJoubDxDfPzxFbEg4fNZrgXCItL7AixuDeyjg7d00bHy2Dtbl',
);

const successStyles = css`
  background: ${colors.blue};
`;

type Props = {
  user: User;
};

export default function Success(props: Props) {
  return (
    <div>
      <Head>
        <title>Success</title>
        <meta name="description" content="Your subscription was successful" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main css={successStyles}>
        <section>
          <h2>Welcome to the club {props.user.username}!</h2>
          <br />
          <div className="button">
            <Link href="/">Back Home</Link>
          </div>
        </section>
      </main>
    </div>
  );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const sessionId = context.query.session_id;

  if (sessionId && typeof sessionId === 'string') {
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (session) {
      const user = await getUserByValidSessionToken(
        context.req.cookies.sessionToken,
      );
      if (user) {
        // check if current account is already among subscribers
        const subscriber = await getSubscriberByValidSubscription(user.id);

        if (!subscriber) {
          // check if someone already had current checkout session
          const checkSession = await getSubscriberByExistingCheckoutSession(
            sessionId,
          );

          if (!checkSession) {
            createSubscriber(user.id, sessionId);
            return {
              props: {
                user: user,
              },
            };
          }
        }
      }
    }
    return {
      redirect: {
        destination: `/canceled`,
        permanent: false,
      },
    };
  }
  return {
    redirect: {
      destination: `/canceled`,
      permanent: false,
    },
  };
}
