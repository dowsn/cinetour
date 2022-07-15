/** @jsxImportSource @emotion/react */

import { css } from '@emotion/react';
import { GetServerSidePropsContext } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState } from 'react';
import YouTube, { YouTubeProps } from 'react-youtube';
import {
  Friend,
  getUserByValidSessionToken,
  Tour,
  User,
} from '../../utils/database';
import { getReducedTour } from '../../utils/datastructures';

const toursStyles = css`
  .switcherFriends {
    display: flex;
    justify-content: center;
    justify-self: center;
  }

  h2 {
    padding-top: 0;
    padding-bottom: 3rem;
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
  tours: any;
  user: User;
  attendees: any;
  friends: Friend[];
};

export default function Tours(props: Props) {
  const [tourList, setTourList] = useState(props.tours);
  const [friends, setFriends] = useState(false);
  const router = useRouter();

  // handling tours
  async function handleJoin(tourId: number, userId: number) {
    const response = await fetch(`/api/tour_attendees/${tourId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId: `${userId}`,
      }),
    });
    const deletedTourAttendee = await response.json();

    await router.push(`/tours#${tourId}`);
  }

  async function handleUnjoin(tourId: number) {
    const response = await fetch(`/api/tour_attendees/${tourId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    const deletedTourAttendee = await response.json();

    await router.push(`/#${tourId}`);
  }

  //tours data
  const renderData = (data: any) => (
    <ul>
      {data
        .sort((a: any, b: any) => a.date.localeCompare(b.date))
        .sort((a: any, b: any) => a.time.localeCompare(b.time))
        .map((tour: any) => (
          <li key={`tour_id-${tour.tourId}`} id={`${tour.tourId}`}>
            <div className="videocontainer">
              <YouTube
                videoId={getYoutubeId(tour.trailer)}
                opts={opts}
                onReady={onPlayerReady}
              />
            </div>
            <div className="description">
              <div>
                <h2>
                  <Link href={`../films/${tour.filmId}`}>{tour.filmTitle}</Link>
                </h2>
              </div>
              <div>{tour.cinemaName}</div>
              <div>{tour.date}</div>
              <div>{tour.time}</div>
              <div>#{tour.genre}</div>
              <div className="blue">{tour.body}</div>
              <div>
                Hosted by{' '}
                <Link href={`/cinetourists/${tour.username}`}>
                  {tour.username}
                </Link>
              </div>
              <br />
              {tour.attendees.length ? <div>Going:</div> : ''}
              <div className="flex center">
                {tour.attendees.map((attendee: any) => (
                  <div>
                    <Link
                      href={`/cinetourists/${attendee}`}
                      key={`username-${attendee}`}
                    >
                      {attendee}
                    </Link>
                  </div>
                ))}
              </div>
              {props.user ? (
                tour.hostId === props.user.id ? (
                  <Link href={`/tours/edit/${tour.programmeId}`}>
                    <button>Edit</button>
                  </Link>
                ) : tour.attendees.includes(props.user.username) ? (
                  <button
                    onClick={() => {
                      handleUnjoin(props.user.id);
                    }}
                  >
                    Unjoin
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      // setJoin(false);
                      handleJoin(tour.tourId, props.user.id).catch(() => {
                        console.log('Request fails');
                      });
                    }}
                  >
                    Join
                  </button>
                )
              ) : (
                <button disabled>Join</button>
              )}
            </div>
          </li>
        ))}
    </ul>
  );

  // filtering the data

  const handleFilter = (
    data: any,
    key: any,
    key2: any,
    value: any,
    value2: any,
  ) => {
    return data.filter(
      (item: any) => item[key] === value || item[key2].includes(value2),
    );
  };

  const data = tourList;
  const source = [...data];

  let filteredData: any = [];
  if (friends) {
    const filter = props.friends.map((friend) => {
      const f = handleFilter(
        source,
        'hostId',
        'attendees',
        friend.friendId,
        friend.username,
      );
      filteredData = [...filteredData, ...f];
      filteredData = filteredData.filter(function (item: any, pos: any) {
        return filteredData.indexOf(item) == pos;
      });
    });
  }

  if (!friends) {
    filteredData = data;
  }

  return (
    <div>
      <Head>
        <title>Tours</title>
        <meta name="description" content="Tours" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main css={toursStyles}>
        {props.friends ? (
          <div className="switcherFriends">
            <h2>Friends</h2>
            <div>
              <label className="switch">
                <input
                  type="checkbox"
                  id="friends"
                  checked={friends}
                  onChange={(event) => {
                    setFriends(event.currentTarget.checked);
                  }}
                />
                <span className="slider round"></span>
              </label>
            </div>
          </div>
        ) : (
          ''
        )}
        <div className="full tours">
          <div>
            {!!filteredData.length ? (
              renderData(filteredData)
            ) : (
              <div>Nothing to show</div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const baseUrl = await process.env.BASE_URL;
  const requestTours = await fetch(`${baseUrl}/api/tours`);

  const toursRaw = await requestTours.json();

  // better datastructure

  const attendeesRaw = await fetch(`${baseUrl}/api/tour_attendees`);

  const attendees = await attendeesRaw.json();

  const tours = await toursRaw.map((tour: Tour) =>
    getReducedTour(tour, attendees),
  );

  if (!tours) {
    return {
      props: {},
    };
  }

  const user = await getUserByValidSessionToken(
    context.req.cookies.sessionToken,
  );

  if (!user) {
    return {
      props: {
        tours: tours,
      },
    };
  }

  // getting friends
  const friendsRequest = await fetch(`${baseUrl}/api/friends/${user.id}`);
  const friends = await friendsRequest.json();

  if (friends) {
    return {
      props: {
        tours: tours,
        user: user,
        friends: friends,
      },
    };
  }

  return {
    props: {
      tours: tours,
      user: user,
    },
  };
}
