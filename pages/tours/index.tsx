/** @jsxImportSource @emotion/react */

import { css } from '@emotion/react';
import { GetServerSidePropsContext } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { useState } from 'react';
import YouTube, { YouTubeProps } from 'react-youtube';
import {
  Friend,
  getUserByValidSessionToken,
  Tour,
  User,
} from '../../utils/database';
import { getReducedTour, ReducedTour } from '../../utils/datastructures';

const toursStyles = css`
  .switcherFriends {
    display: flex;
    justify-content: center;
    justify-self: center;
    padding: 0;
    border-bottom: 3px solid white;
    margin-bottom: 10px;
  }

  h2 {
    padding-top: 0;
    padding-bottom: 1rem;
  }

  .noline {
    border-top: none;
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
  tours: ReducedTour[] | [];
  user?: User;
  friends?: Friend[];
};

export default function Tours(props: Props) {
  const [friends, setFriends] = useState(false);

  // handling tours
  const [tourList, setTourList] = useState<ReducedTour[]>(props.tours);

  // handling joining and leaving tours

  async function handleJoin(tourId: number, userId: number | undefined) {
    if (!userId) {
      return;
    }
    const response = await fetch(`/api/tour_attendees/${tourId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId: userId,
      }),
    });
    const tourAttendee = await response.json();
    console.log(tourAttendee);

    // updating the tourList
    const requestTours = await fetch(`/api/tours`);
    const toursRaw = await requestTours.json();

    const attendeesRaw = await fetch(`/api/tour_attendees`);

    const attendees = await attendeesRaw.json();

    const tours = await toursRaw.map((tour: Tour) =>
      getReducedTour(tour, attendees),
    );

    setTourList(tours);
  }

  async function handleLeave(tourId: number, userId: number) {
    if (!userId) {
      return;
    }
    const response = await fetch(`/api/tour_attendees/${tourId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId: userId,
      }),
    });
    const deletedTourAttendee = await response.json();
    console.log(deletedTourAttendee);

    // updating the tourList
    const requestTours = await fetch(`/api/tours`);
    const toursRaw = await requestTours.json();

    const attendeesRaw = await fetch(`/api/tour_attendees`);

    const attendees = await attendeesRaw.json();

    const tours = await toursRaw.map((tour: Tour) =>
      getReducedTour(tour, attendees),
    );

    setTourList(tours);
  }

  // tours data
  // will be updated as well as functions
  const renderData = (data: any) => (
    <ul>
      {data
        .sort(function (a: ReducedTour, b: ReducedTour) {
          if (a.date > b.date) return +1;
          if (a.date < b.date) return -1;
          if (a.time > b.time) return +1;
          if (a.time < b.time) return -1;
          return 0;
        })
        .map((tour: ReducedTour) => (
          <li key={`tour_id-${tour.tourId}`}>
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
                  <Link href={`/films/${tour.filmId}`}>{tour.filmTitle}</Link>
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
                  <div key={attendee}>
                    <Link
                      href={`/cinetourists/${attendee}`}
                      key={`username-${attendee}`}
                    >
                      {attendee}
                    </Link>
                  </div>
                ))}
              </div>
            </div>
            {props.user ? (
              tour.hostId === props.user.id ? (
                <Link href={`/tours/edit/${tour.programmeId}?returnTo=/tours`}>
                  <button className="relative">Edit</button>
                </Link>
              ) : tour.attendees.includes(props.user.username) ? (
                <button
                  className="relative"
                  onClick={() => {
                    handleLeave(tour.tourId, props.user?.id as number).catch(
                      () => {
                        console.log('Request fails');
                      },
                    );
                  }}
                >
                  Leave
                </button>
              ) : (
                <button
                  className="relative"
                  onClick={() => {
                    handleJoin(tour.tourId, props.user?.id as number).catch(
                      () => {
                        console.log('Request fails');
                      },
                    );
                  }}
                >
                  Join
                </button>
              )
            ) : (
              <Link href={'/login?returnTo=/tours'}>
                <button className="relative">Join</button>
              </Link>
            )}
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
    props.friends?.map((friend) => {
      const f = handleFilter(
        source,
        'hostId',
        'attendees',
        friend.friendId,
        friend.username,
      );
      filteredData = [...filteredData, ...f];
      return (filteredData = filteredData.filter(function (
        item: any,
        pos: any,
      ) {
        return filteredData.indexOf(item) === pos;
      }));
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
                  checked={friends}
                  onChange={(event) => {
                    setFriends(event.currentTarget.checked);
                  }}
                />
                <span className="slider round" />
              </label>
            </div>
          </div>
        ) : (
          ''
        )}
        <section className="full tours noline">
          {!!filteredData.length ? (
            renderData(filteredData)
          ) : (
            <div>Nothing to show</div>
          )}
        </section>
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
