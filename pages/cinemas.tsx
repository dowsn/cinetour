/** @jsxImportSource @emotion/react */

import { css } from '@emotion/react';
import { produceWithPatches } from 'immer';
import { GetServerSidePropsContext } from 'next';
import { AppContextType } from 'next/dist/shared/lib/utils';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import YouTube, { YouTubeProps } from 'react-youtube';
import {
  Film,
  getProgrammes,
  getToursForProgrammes,
  Programme,
  TourOrganizers,
} from '../utils/database';

const cinemasStyles = css`
  .English {
    background-color: blue;
  }

  .notEnglish {
    background-color: white;
  }
`;

type Props = {
  refreshUserProfile: () => Promise<void>;
  programmes: Programme[];
};

export default function Cinemas(props: Props) {
  const [day, setDay] = useState('');
  const [cinema, setCinema] = useState('');
  const [film, setFilm] = useState('');
  const [english, setEnglish] = useState(false);

  const [programmeList, setProgrammeList] = useState<Programme[]>(
    props.programmes,
  );

  // getting 7 days from now
  const today = new Date(Date.now());
  const tomorrow = new Date(Date.now() + 1 * 24 * 60 * 60 * 1000);
  const day2 = new Date(Date.now() + 2 * 24 * 60 * 60 * 1000);
  const day3 = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000);
  const day4 = new Date(Date.now() + 4 * 24 * 60 * 60 * 1000);
  const day5 = new Date(Date.now() + 5 * 24 * 60 * 60 * 1000);
  const day6 = new Date(Date.now() + 6 * 24 * 60 * 60 * 1000);
  const day7 = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
  const sevenDays = [today, tomorrow, day2, day3, day4, day5, day6, day7];
  const sevenDaysintoDates = sevenDays.map(
    (day) =>
      String(day.getFullYear()) +
      '-' +
      String(day.getMonth() + 1) +
      '-' +
      String(day.getDate()),
  );

  // const date: Date = new Date(new Date().setDate(new Date().getDate() + 7));

  // handles for filters
  function filmHandle(film: string) {
    const newList = programmeList;
    const filteredList = newList.filter(
      (programme) => programme.filmTitle === film,
    );
    setProgrammeList(filteredList);
  }

  function cinemaHandle(cinema: any) {
    const newList = programmeList;
    const filteredList = newList.filter(
      (programme) => programme.cinemaName === cinema,
    );
    setProgrammeList(filteredList);
  }

  function dateHandle(date: string) {
    const newList = programmeList;
    const filteredList = newList.filter((programme) => programme.date === day);
    setProgrammeList(filteredList);
  }

  function englishHandle(english: boolean) {
    const newList = programmeList;
    const filteredList = newList.filter(
      (programme) => programme.englishfriendly === english,
    );
    setProgrammeList(filteredList);
  }

  return (
    <div>
      <Head>
        <title>Cinemas</title>
        <meta name="description" content="Cinemas, programme and search" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main css={cinemasStyles}>
        <div>
          <label htmlFor="day">Day:</label>
          <select
            id="day"
            value={day}
            onChange={(event) => {
              setDay(event.currentTarget.value);
              dateHandle(event.currentTarget.value);
            }}
          >
            <option>''</option>
            {sevenDaysintoDates.map((day) => (
              <option value={day}>{day}</option>
            ))}
          </select>
          <label htmlFor="cinema">Cinema:</label>
          <select
            id="cinema"
            value={cinema}
            onChange={(event) => {
              setCinema(event.currentTarget.value);
              cinemaHandle(event.currentTarget.value);
            }}
          >
            <option value=""></option>
            {props.programmes.map((programme) => (
              <option
                key={`cinema_id-${programme.programmeId}`}
                value={programme.cinemaName}
              >
                {programme.cinemaName}
              </option>
            ))}
          </select>
          <label htmlFor="film">Film:</label>
          <input
            type="text"
            list="films"
            value={film}
            onChange={(event) => setFilm(event.currentTarget.value)}
          />
          <datalist id="films">
            <option></option>
            {props.programmes.map((programme) => (
              <option key={`film_id-${programme.programmeId}`}>
                {programme.filmTitle}
              </option>
            ))}
          </datalist>
          <label htmlFor="english">English friendly:</label>
          <input
            type="checkbox"
            checked={english}
            onChange={(event) => {
              setEnglish(event.currentTarget.checked);
              englishHandle(event.currentTarget.checked);
            }}
          />
        </div>
        <div>
          <ul>
            {programmeList.map((programme) =>
              programme.englishfriendly ? (
                <li
                  key={`programme_id-${programme.programmeId}`}
                  className="English"
                >
                  <div className="programme">
                    <div>{programme.date}</div>
                    <div>{programme.time}</div>
                    <div>
                      <Link href={`/films/${programme.filmId}`}>
                        {programme.filmTitle}
                      </Link>
                    </div>
                    <div>{programme.cinemaName}</div>
                  </div>
                  <div>Tours: </div>
                  <Link href="../tours/create">
                    <button>+</button>
                  </Link>
                </li>
              ) : (
                <li
                  key={`programme_id-${programme.programmeId}`}
                  className="notEnglish"
                >
                  <div className="programme">
                    <div>{programme.date}</div>
                    <div>{programme.time}</div>
                    <div>
                      <Link href={`/films/${programme.filmId}`}>
                        {programme.filmTitle}
                      </Link>
                    </div>
                    <div>{programme.cinemaName}</div>
                  </div>
                  <div>Tours: </div>
                  <Link href="../tours/create">
                    <button>+</button>
                  </Link>
                </li>
              ),
            )}
          </ul>
        </div>
      </main>
    </div>
  );
}

export async function getServerSideProps() {
  const baseUrl = await process.env.BASE_URL;
  const request = await fetch(`${baseUrl}/api/programmes`);

  const programmes = await request.json();

  return {
    props: {
      programmes: programmes,
    },
  };
}
