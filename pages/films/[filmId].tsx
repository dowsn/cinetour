/** @jsxImportSource @emotion/react */

import { css } from '@emotion/react';
import { GetServerSidePropsContext } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { useState } from 'react';
import { Film, getFilmById, getFilms } from '../../utils/database';
import { queryParamsNumbers } from '../../utils/queryParams';

const filmStyles = css`
  div {
  }
`;

type Props = { film: Film };

export default function Tours(props: Props) {
  return (
    <div>
      <Head>
        <title>{props.film.filmTitle}</title>
        <meta name="description" content={`${props.film.filmTitle}`} />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main css={filmStyles}>
        <Link href="/../cinemas">
          <button>Programme</button>
        </Link>
        <Link href="/../films">
          <button>All Films</button>
        </Link>
        <div>
          <p>{props.film.filmTitle}</p>
          {/* add all films based on filter */}
        </div>
      </main>
    </div>
  );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  // function to get all films  from the table

  const filmId = context.query.filmId;

  const baseUrl = await process.env.BASE_URL;
  const request = await fetch(`${baseUrl}/api/films/${filmId}`);

  const film = await request.json();

  return {
    props: {
      film: film,
    },
  };
}
