/** @jsxImportSource @emotion/react */

import { css } from '@emotion/react';
import { cp } from 'fs/promises';
import { produceWithPatches } from 'immer';
import { GetServerSidePropsContext } from 'next';
import { AppContextType } from 'next/dist/shared/lib/utils';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import YouTube, { YouTubeProps } from 'react-youtube';
import { productionBrowserSourceMaps } from '../../next.config';
import { Tour } from '../../utils/database';

const toursStyles = css`
  color: white;
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
  refreshUserProfile: () => Promise<void>;
  tours: Tour[];
};

export default function Tours(props: Props) {
  const [tourList, setTourList] = useState<Tour[]>(props.tours);
  const [friends, SetFriends] = useState(false);

  return (
    <div>
      <Head>
        <title>Tours</title>
        <meta name="description" content="Tours" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main css={toursStyles}>
        <ul>
          <label>
            {' '}
            Friends
            <input
              type="checkbox"
              checked={friends}
              onChange={(event) => event.currentTarget.checked}
            />
          </label>
          {tourList.map((tour) => (
            <li key={`tour_id-${tour.tour_id}`} id={`{tour.tour_id}`}>
              <div className="youtube">
                <YouTube
                  videoId={getYoutubeId(tour.trailer)}
                  opts={opts}
                  onReady={onPlayerReady}
                />
              </div>
              <div>{tour.filmTitle}</div>
              <div>{tour.cinemaName}</div>
              <div>#{tour.genre}</div>
              <div>{tour.username}</div>
            </li>
          ))}
        </ul>
      </main>
    </div>
  );
}

export async function getServerSideProps() {
  const baseUrl = await process.env.BASE_URL;
  const request = await fetch(`${baseUrl}/api/tours`);

  const tours = await request.json();

  return {
    props: {
      tours: tours,
    },
  };
}
