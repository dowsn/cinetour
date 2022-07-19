import Head from 'next/head';
import Link from 'next/link';
import { useState } from 'react';
import { Film } from '../../utils/database';

type Props = { films: Film[] };

export default function Films(props: Props) {
  const [film, setFilm] = useState('');

  // getting alphabet
  const alpha = Array.from(Array(26)).map((e, i) => i + 65);
  const alphabet = alpha.map((x) => String.fromCharCode(x));

  const handleFilter = (data: any, key: any, value: any) => {
    return data.filter((item: any) => item[key] === value);
  };

  const renderData = (data: any) => (
    <ul className="longList">
      {alphabet.map((letter) => (
        <li key={letter}>
          <div>
            <h2>{letter}</h2>
          </div>
          {data
            .filter(
              (item: any) =>
                item.filmTitle.charAt(0) === letter ||
                item.filmTitle.charAt(0) === letter.toLowerCase(),
            )
            .sort((a: any, b: any) => a.filmTitle.localeCompare(b.filmTitle))
            .map((item: any) => (
              <div key={`film_id-${item.id}`}>
                <Link href={`/films/${item.id}`}>{item.filmTitle}</Link>
              </div>
            ))}
        </li>
      ))}
    </ul>
  );

  const data = props.films;
  let filteredData = [...data];

  if (film) {
    filteredData = handleFilter(filteredData, 'filmTitle', film);
  }

  return (
    <div>
      <Head>
        <title>Films</title>
        <meta name="description" content="All Films" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <div>
          <label htmlFor="film">Film:</label>
          <input
            list="films"
            value={film}
            onChange={(event) => setFilm(event.currentTarget.value)}
          />
          <datalist id="films">
            <option />
            {props.films.map((selectedFilm) => (
              <option key={selectedFilm.filmTitle}>
                {selectedFilm.filmTitle}
              </option>
            ))}
          </datalist>
        </div>
        <div>
          {!!filteredData.length ? (
            renderData(filteredData)
          ) : (
            <p>Nothing found</p>
          )}
        </div>
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
