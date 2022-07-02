/** @jsxImportSource @emotion/react */

import { css } from '@emotion/react';
import { GetServerSidePropsContext } from 'next';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect } from 'react';
import YouTube, { YouTubeProps } from 'react-youtube';
import {
  getSubscriberByValidSubscription,
  getUserByValidSessionToken,
  Subscriber,
} from '../utils/database';
import { getReducedSubscriber } from '../utils/datastructures';

const indexStyles = css`
  img {
    filter: contrast(0.912);
  }

  .youtube {
  }
`;

// function to get youtube id from the complete youtube link
function getYoutubeId(link: string) {
  return link.split('=')[1];
}

// function to create youtube iframe with the ability to play the video
const onPlayerReady: YouTubeProps['onReady'] = (event) => {
  event.target.pauseVideo();
};
const opts: YouTubeProps['opts'] = {
  height: '240',
  width: '350',
  playerVars: {
    autoplay: 0,
  },
};

type Props = {
  reducedSubscriber?: Subscriber | undefined;
  refreshUserProfile: () => Promise<void>;
};

export default function Home(props: Props) {
  useEffect(() => {
    props.refreshUserProfile().catch(() => console.log('fetch api failed'));
  }, [props.refreshUserProfile]);

  // background: linear-gradient(90deg, rgba(38,38,38,1) 0%, rgba(98,9,165,1) 44%, rgba(38,38,38,1) 100%);
  return (
    <div>
      <Head>
        <title>CineTour</title>
        <meta
          name="description"
          content="What is CineTour and how does it work"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main css={indexStyles}>
        {props.subscriber ? (
          ''
        ) : (
          <section>
            <Image
              src="/card/card1.png"
              height="200px"
              width="120px"
              alt="CineTour Pass"
            />
            <article>
              <h1>One card for unlimited access to all cinemas in town.</h1>
              <Link href="/about">
                <button>Start Here</button>
              </Link>
            </article>
          </section>
        )}
        <section>
          {/* image for the film of the week alt='film of the week {films.film_title'*/}
          {/* <Link href={`/films/${films.film_title}`}>
            <button>{films.film_title}</button>
          </Link> */}
        </section>
        <section>
          {/* same as cinemas filter today */}
          <Link href="/cinemas">
            <button>Watch</button>
          </Link>
        </section>
        <section>
          <h1>Now Showing</h1>
        </section>
        <section>
          {/* same as tours filter first 3 */}
          <Link href="/tours">
            <button>Tours</button>
          </Link>
        </section>

        <div className="youtube">
          <YouTube
            videoId={getYoutubeId(
              'https://www.youtube.com/watch?v=iP3DnhCUIsE',
            )}
            opts={opts}
            onReady={onPlayerReady}
          />
        </div>
      </main>
    </div>
  );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const user = await getUserByValidSessionToken(
    context.req.cookies.sessionToken,
  );

  if (user) {
    const subscriber = await getSubscriberByValidSubscription(user.id);
    const reducedSubscriber = getReducedSubscriber(subscriber);

    if (reducedSubscriber) {
      return {
        props: {
          reducedSubscriber: reducedSubscriber,
        },
      };
    }
  }
  return {
    props: {},
  };
}
