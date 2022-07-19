/** @jsxImportSource @emotion/react */

import { css } from '@emotion/react';
import { GetServerSidePropsContext } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { useState } from 'react';
import YouTube, { YouTubeProps } from 'react-youtube';
import {
  Film,
  getUserByValidSessionToken,
  Programme,
  User,
} from '../../utils/database';
import { getReducedProgramme } from '../../utils/datastructures';

// function to get youtube id from the complete youtube link
function getYoutubeId(link: string) {
  return link.split('=')[1];
}

// function to create youtube iframe with the ability to play the video
const onPlayerReady: YouTubeProps['onReady'] = (event) => {
  event.target.pauseVideo();
};
const opts: YouTubeProps['opts'] = {
  height: '280',
  width: '500',
  playerVars: {
    autoplay: 0,
  },
};

const filmStyles = css`
  h1,
  h2,
  p {
    max-width: 60vw;
    text-align: center;
    margin: auto;
  }

  .trailer {
    margin: auto;
  }
  iframe {
    width: 100vw;
    height: 400px;
    border: none;
    border-radius: 0;
    border-top: 3px solid white;
    border-bottom: 3px solid white;
  }
  .title {
    display: flex;
    justify-content: center;
    gap: 3rem;

    h1,
    h2 {
      margin: 0;
    }
  }
`;

type Props = { film: Film; programmes: any; loggedUser: User | null };

export default function FilmId(props: Props) {
  // getting days from now
  const today = new Date(Date.now()).toString().split(' ', 3).join(' ');
  const tomorrow = new Date(Date.now() + 1 * 24 * 60 * 60 * 1000)
    .toString()
    .split(' ', 3)
    .join(' ');
  const day2 = new Date(Date.now() + 2 * 24 * 60 * 60 * 1000)
    .toString()
    .split(' ', 3)
    .join(' ');

  const sevenDays = [today, tomorrow, day2];

  const renderData = (data: any) => (
    <ul>
      {sevenDays.map((day) => (
        <li key={day}>
          <div className="date">
            <h2>{day}</h2>
          </div>
          {data
            .filter((item: any) => item.date === day)
            .filter((item: any) => item.filmTitle === props.film.filmTitle)
            .sort((a: any, b: any) => a.time.localeCompare(b.time))
            .map((item: any) => (
              <div
                key={`programme_id-${item.programmeId}`}
                className="programme"
                id={item.programmeId}
              >
                <div>
                  <div className="flex">
                    <div>{item.time}</div>
                    <div>{item.cinemaName}</div>
                  </div>
                  <div>
                    <h3>
                      <Link href={`/films/${item.filmId}`}>
                        {item.filmTitle}
                      </Link>
                    </h3>
                  </div>
                </div>
                <div className="flex">
                  <div>#{item.genre}</div>
                  {item.englishfriendly ? <div>English Friendly</div> : ''}
                  <div>
                    Tours:{' '}
                    {item.username ? (
                      <Link href={`/tours#${item.tourId}`}>
                        <button>{item.username}</button>
                      </Link>
                    ) : props.loggedUser ? (
                      <Link href={`/tours/create/${item.programmeId}`}>
                        <button>+</button>
                      </Link>
                    ) : (
                      <Link href={`/tours#${item.tourId}`}>
                        <button disabled>+</button>
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            ))}
        </li>
      ))}
    </ul>
  );

  const data = props.programmes;

  return (
    <div>
      <Head>
        <title>{props.film.filmTitle}</title>
        <meta name="description" content={`${props.film.filmTitle}`} />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main css={filmStyles}>
        <Link href="/films">
          <button>All Films</button>
        </Link>
        <div className="title">
          <h1>{props.film.filmTitle}</h1>
          <h2 className="blue">#{props.film.genre}</h2>
        </div>
        <div className="trailer">
          <YouTube
            videoId={getYoutubeId(props.film.trailer)}
            opts={opts}
            onReady={onPlayerReady}
          />
        </div>
        <div>
          <br />
          <br />
          <p className="blue">{props.film.synopsis}</p>
          <br />

          <br />
          <p>
            {props.film.year} | {props.film.country} | {props.film.director}
          </p>
          <br />
          <br />
          <br />
          <div>{!!data.length ? renderData(data) : <p>Nothing found</p>}</div>
        </div>
      </main>
    </div>
  );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  // getting film from query and baseURL
  const filmId = context.query.filmId;
  const baseUrl = await process.env.BASE_URL;

  // getting films, programmes and tours
  const requestFilm = await fetch(`${baseUrl}/api/films/${filmId}`);
  const film = await requestFilm.json();

  const requestProgrammes = await fetch(`${baseUrl}/api/programmes`);
  const programmesRaw = await requestProgrammes.json();

  // getting a better datastructure
  const programmes = programmesRaw.map((programme: Programme) =>
    getReducedProgramme(programme),
  );

  const loggedUser = await getUserByValidSessionToken(
    context.req.cookies.sessionToken,
  );

  return {
    props: {
      film: film,
      programmes: programmes,
      loggedUser: loggedUser || null,
    },
  };
}
