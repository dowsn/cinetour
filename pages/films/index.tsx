/** @jsxImportSource @emotion/react */

import { css } from '@emotion/react';
import { GetServerSidePropsContext } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { useState } from 'react';
import { Film, getFilms } from '../../utils/database';

const filmsStyles = css`
  div {
  }
`;

type Props = { films: Film[] };

export default function Tours(props: Props) {
  const [filmList, setFilmList] = useState<Film[] | undefined>(props.films);

  return (
    <div>
      <Head>
        <title>Films</title>
        <meta name="description" content="All Films" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main css={filmsStyles}>
        <label>
          {' '}
          🔍
          {/* <input list=> all films */}
        </label>
        <ul>
          {filmList
            ? filmList
                .sort((a, b) => a.filmTitle.localeCompare(b.filmTitle))
                .map((film) => (
                  <li key={`tour_id-${film.id}`}>
                    <Link href={`/films/${film.id}`}>{film.filmTitle}</Link>
                  </li>
                ))
            : ''}
        </ul>
      </main>
    </div>
  );
}

export async function getServerSideProps() {
  // function to get all films  from the table
  const baseUrl = await process.env.BASE_URL;
  const request = await fetch(`${baseUrl}/api/films`);

  const films = await request.json();

  return {
    props: {
      films: films,
    },
  };
}
