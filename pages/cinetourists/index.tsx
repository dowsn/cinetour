import Head from 'next/head';
import Link from 'next/link';
import { useState } from 'react';

type Props = { users: any[] };

export default function Cinetourists(props: Props) {
  const [cinetourist, setCinetourist] = useState('');

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
                item.username.charAt(0) === letter ||
                item.username.charAt(0) === letter.toLowerCase(),
            )
            .sort((a: any, b: any) => a.username.localeCompare(b.username))
            .map((item: any) => (
              <div key={`cinetourist_id-${item.username}`}>
                <Link href={`/cinetourists/${item.username}`}>
                  {item.username}
                </Link>
              </div>
            ))}
        </li>
      ))}
    </ul>
  );

  const data = props.users;
  let filteredData = [...data];

  if (cinetourist) {
    filteredData = handleFilter(filteredData, 'username', cinetourist);
  }

  return (
    <div>
      <Head>
        <title>Cinetourists</title>
        <meta name="description" content="All Cinetourists" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <div>
          <label htmlFor="film">Cinetourist:</label>
          <input
            list="cinetourists"
            value={cinetourist}
            onChange={(event) => setCinetourist(event.currentTarget.value)}
          />
          <datalist id="cinetourists">
            <option />
            {props.users.map((user) => (
              <option key={`user-id-${user.id}`}>{user.username}</option>
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
  const baseUrl = await process.env.BASE_URL;
  const request = await fetch(`${baseUrl}/api/users`);

  const users = await request.json();

  return {
    props: {
      users: users,
    },
  };
}
