/** @jsxImportSource @emotion/react */

import { css } from '@emotion/react';
import { GetServerSidePropsContext } from 'next';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import {
  Cinemas,
  createSubscriber,
  getUserByValidSessionToken,
} from '../utils/database';

const successStyles = css`
  img {
    filter: contrast(0.912);
    position: relative;
  }
`;

type Props = {
  cinemas: Cinemas[];
};

export default function About(props: Props) {
  // background: linear-gradient(90deg, rgba(38,38,38,1) 0%, rgba(98,9,165,1) 44%, rgba(38,38,38,1) 100%);
  return (
    <div>
      <Head>
        <title>Success</title>
        <meta name="description" content="Your subscription was successful" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main css={successStyles}>
        <section>Your subscription was successful</section>
      </main>
    </div>
  );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const user = await getUserByValidSessionToken(
    context.req.cookies.sessionToken,
  );

  if (user) {
    createSubscriber(user.id);
    return {
      props: {
        user: user,
      },
    };
  }
}
