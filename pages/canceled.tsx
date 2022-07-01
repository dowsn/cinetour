/** @jsxImportSource @emotion/react */

import { css } from '@emotion/react';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import { MemoryRouter } from 'react-router-dom';
import { Cinemas, getCinemas } from '../utils/database';

const aboutStyles = css`
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
          <div>
            <Image
              src="/card/card2.png"
              height="282px"
              width="452px"
              layout="responsive"
              alt="CineTour Pass card"
            />
          </div>
        </section>
        <section>
          <div>
            <Image
              src="/card/card3.png"
              height="677px"
              width="1013px"
              layout="responsive"
              alt="CineTour Pass card costs 25 Euros per month"
            />
          </div>
        </section>
        <section>
          <h1>What is CineTour</h1>
          <article>
            <h2>Cinemas</h2>
            <p>
              Join over 20000 cinetourists that use our programme browser to
              find their film to watch. Simply all cinemas on one place. The
              pass gives you access to all new films and you can go to previews,
              classics, specials and the most colorful film festivals. Feel free
              to experiment.
            </p>
          </article>
          <article>
            <h2>Tours</h2>
            <p>
              CineTour means community. All cinetourist can therefore add their
              own tours to the programme for others to join, meet and discuss
              films together. This is the way how Cinetour reimagines cinema as
              a social experience. Endless tour may begin!
            </p>
          </article>
        </section>
        <section>
          <h1>How does it work?</h1>
          <div>
            <Image
              src="/card/howdoesitwork.png"
              height="388px"
              width="1064px"
              layout="responsive"
              alt=""
            />
          </div>
          <div>
            <article>
              <h2>
                1. Register as a new cinetourist.
                <Link href="../register">
                  <button>Register</button>
                </Link>
              </h2>
            </article>
            <article>
              <h2>2. Subscribe for your own CineTour Pass at your profile.</h2>
              <Link href="../subscribe">
                <button>Subscribe</button>
              </Link>
            </article>
            <h2>
              3. Browse through cinema programme, join tours and go straight to
              the movies.
            </h2>
            <Link href="../cinemas">
              <button>Cinemas</button>
            </Link>
            <Link href="../tours">
              <button>Tours</button>
            </Link>
          </div>
        </section>
        <section>
          <h1>CineTour Network</h1>
          <ul>
            {props.cinemas.map((cinema) => (
              <li key={`cinema_name-${cinema.id}`}>
                <div>{cinema.cinemaName}</div>
                <div>{cinema.address}</div>
                <div>{cinema.contact}</div>
                <Image
                  src={`/cinemas/${cinema.id}.jpeg`}
                  alt=""
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

export async function getServerSideProps() {
  const cinemas = await getCinemas();
  return {
    props: {
      cinemas: cinemas,
    },
  };
}
