import { GetServerSidePropsContext } from 'next';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState } from 'react';
import YouTube, { YouTubeProps } from 'react-youtube';
import {
  Friend,
  getFriendByOwnId,
  getUserByValidSessionToken,
  Profile,
  Tour,
  User,
} from '../../utils/database';
import { getReducedTour } from '../../utils/datastructures';

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
  user: User;
  profile: Profile;
  loggedUser: User;
  tours?: Tour[];
  friend?: Friend;
};

export default function UserDetail(props: Props) {
  // router
  const router = useRouter();

  //tours
  const [tourList, setTourList] = useState<any[] | undefined>(props.tours);

  // handling joining and leaving tours

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
    const TourAttendee = await response.json();
    console.log(TourAttendee);

    await router.push(`/tours#${tourId}`);
  }

  async function handleLeave(tourId: number) {
    const response = await fetch(`/api/tour_attendees/${tourId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    const deletedTourAttendee = await response.json();

    await router.push(`/tours#${tourId}`);
  }

  // adding and deleting friends
  async function handleDeleteFriend() {
    const response = await fetch(`/api/friends/${props.loggedUser.id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        friendId: props.user.id,
      }),
    });
    const deletedFriend = await response.json();
    await router.push(`/cinetourists/${props.user.username}`);
  }

  async function handleAddFriend() {
    const response = await fetch(
      `/api/friends/${props.loggedUser.id}
    `,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          friendId: props.user.id,
        }),
      },
    );
    const newFriend = await response.json();

    await router.push(`/cinetourists/${props.user.username}`);
  }

  if (!props.user && !props.profile) {
    return (
      <>
        <Head>
          <title>User not found</title>
          <meta name="description" content="User not found" />
        </Head>
        <main>
          <br />
          <h1>User not found</h1>
        </main>
      </>
    );
  }

  return (
    <div>
      <Head>
        <title>{props.user.username}</title>
        <meta name="description" content="Your profile page" />
      </Head>
      <main>
        {props.loggedUser ? (
          props.friend ? (
            <button onClick={() => handleDeleteFriend()}>Delete Friend</button>
          ) : (
            <button onClick={() => handleAddFriend()}>Add Friend</button>
          )
        ) : (
          ''
        )}
        <h1>CineTourist {props.user.username}</h1>
        <Image
          className="profileImage"
          src={`/users/${props.user.id}.jpeg`}
          height="150"
          width="150"
          alt="profile picture"
        />
        <section>
          <h2>First name:</h2>
          <p>{props.profile.firstName}</p>
          <h2>Last name:</h2>
          <p>{props.profile.lastName}</p>
          <h2>Self-description:</h2>
          <p>{props.profile.selfDescription}</p>
        </section>

        <section>
          <h1>Tours</h1>
          <h2>Hosting</h2>
          <div className="full tours">
            <ul>
              {tourList
                ? tourList
                    .filter((tour) => tour.hostId == props.user.id)
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
                              <Link href={`../films/${tour.filmId}`}>
                                {tour.filmTitle}
                              </Link>
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
                                  handleLeave(props.user.id);
                                }}
                              >
                                Leave
                              </button>
                            ) : (
                              <button
                                onClick={() => {
                                  // setJoin(false);
                                  handleJoin(tour.tourId, props.user.id).catch(
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
                            <button disabled>Join</button>
                          )}
                        </div>
                      </li>
                    ))
                : ''}
            </ul>
          </div>
          <h2>Attending</h2>
          <div className="full tours">
            <ul>
              {tourList
                ? tourList
                    .filter((tour) =>
                      tour.attendees.includes(props.user.username),
                    )
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
                              <Link href={`../films/${tour.filmId}`}>
                                {tour.filmTitle}
                              </Link>
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
                                  handleLeave(props.user.id);
                                }}
                              >
                                Unjoin
                              </button>
                            ) : (
                              <button
                                onClick={() => {
                                  // setJoin(false);
                                  handleJoin(tour.tourId, props.user.id).catch(
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
                            <button disabled>Join</button>
                          )}
                        </div>
                      </li>
                    ))
                : ''}
            </ul>
          </div>
        </section>
      </main>
    </div>
  );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const userNameFromUrl = context.query.username;

  // make sure that query param is a string
  if (!userNameFromUrl || Array.isArray(userNameFromUrl)) {
    return { props: {} };
  }
  const baseUrl = await process.env.BASE_URL;

  // getting a user
  const request = await fetch(`${baseUrl}/api/users/${userNameFromUrl}`);
  const user = await request.json();

  // getting tours and attendees
  const requestTours = await fetch(`${baseUrl}/api/tours`);
  const toursRaw = await requestTours.json();

  const attendeesRaw = await fetch(`${baseUrl}/api/tour_attendees`);

  const attendees = await attendeesRaw.json();

  const tours = await toursRaw.map((tour: Tour) =>
    getReducedTour(tour, attendees),
  );

  if (!user) {
    context.res.statusCode = 404;
    return { props: {} };
  }

  const loggedUser = await getUserByValidSessionToken(
    context.req.cookies.sessionToken,
  );

  if (loggedUser) {
    if (user.user.id === loggedUser.id) {
      return {
        redirect: {
          destination: `/profile`,
          permanent: false,
        },
      };
    }

    // checking if this is my friend by selecting the user
    console.log(user.id);
    const friend = await getFriendByOwnId(user.user.id, loggedUser.id);
    if (friend) {
      return {
        props: {
          loggedUser: loggedUser,
          user: user.user,
          profile: user.profile,
          tours: tours || undefined,
          friend: friend,
        },
      };
    }
    return {
      props: {
        loggedUser: loggedUser,
        user: user.user,
        profile: user.profile,
        tours: tours || undefined,
      },
    };
  }

  return {
    props: {
      user: user.user,
      profile: user.profile,
    },
  };
}
