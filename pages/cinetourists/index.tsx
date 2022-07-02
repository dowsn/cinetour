/** @jsxImportSource @emotion/react */

import { css } from '@emotion/react';
import { GetServerSidePropsContext } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { useState } from 'react';
import { getCinetourists, Username } from '../../utils/database';

const filmsStyles = css`
  div {
  }
`;

type Props = { users: Username[] };

export default function Cinetourists(props: Props) {
  const [cinetouristList, setCinetouristList] = useState<
    Username[] | undefined
  >(props.users);
  console.log(cinetouristList);
  return (
    <div>
      <Head>
        <title>Cinetourists</title>
        <meta name="description" content="All Cinetourists" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main css={filmsStyles}>
        <div>search</div>
        {/* cinetourists search for */}
        <ul>
          {cinetouristList
            ? cinetouristList.map((cinetourist) => (
                <li key={`tour_id-${cinetourist.id}`}>
                  <Link href={`/${cinetourist.username}`}>
                    {cinetourist.username}
                  </Link>
                </li>
              ))
            : ''}
        </ul>
      </main>
    </div>
  );
}

export async function getServerSideProps() {
  const baseUrl = await process.env.BASE_URL;
  const request = await fetch(`${baseUrl}/api/users`);

  const users = await request.json();

  return {
    props: {
      users: users,
    },
  };
}
