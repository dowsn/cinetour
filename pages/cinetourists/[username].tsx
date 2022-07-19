import { AdvancedImage } from '@cloudinary/react';
import { Cloudinary } from '@cloudinary/url-gen';
import { GetServerSidePropsContext } from 'next';
import Head from 'next/head';
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
import { getReducedTour, ReducedTour } from '../../utils/datastructures';

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
  user?: User;
  profile?: Profile;
  loggedUser?: User;
  tours?: ReducedTour[];
  friend?: Friend;
};

export default function UserDetail(props: Props) {
  // displaying profile picture
  // Create a Cloudinary instance and set your cloud name.
  const cld = new Cloudinary({
    cloud: {
      cloudName: 'dkiienrq4',
    },
  });

  // cld.image returns a CloudinaryImage with the configuration set.
  const myImage = cld.image(`userlist/${props.user?.id}`);

  // router
  const router = useRouter();

  // handling tours
  const [tourList, setTourList] = useState(props.tours);

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

  // adding and deleting friends
  async function handleDeleteFriend() {
    if (!props.loggedUser) {
      return;
    }
    const response = await fetch(`/api/friends/${props.loggedUser.id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        friendId: props.user?.id,
      }),
    });
    const deletedFriend = await response.json();
    console.log(deletedFriend);

    await router.push(`/cinetourists/${props.user?.username}`);
  }

  async function handleAddFriend() {
    if (!props.loggedUser) {
      return;
    }
    const response = await fetch(
      `/api/friends/${props.loggedUser.id}
    `,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          friendId: props.user?.id,
        }),
      },
    );
    const newFriend = await response.json();
    console.log(newFriend);

    await router.push(`/cinetourists/${props.user?.username}`);
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
        <title>{props.user?.username}</title>
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
        <h1>CineTourist {props.user?.username}</h1>
        <div className="profileImage">
          <AdvancedImage cldImg={myImage} />
        </div>
        <br />
        <section>
          <h2>First name:</h2>
          <p>{props.profile?.firstName}</p>
          <h2>Last name:</h2>
          <p>{props.profile?.lastName}</p>
          <h2>Self-description:</h2>
          <p>{props.profile?.selfDescription}</p>
        </section>

        <section>
          <h1>Tours</h1>
          <h2>Hosting</h2>
          <section className="full tours">
            <ul>
              {tourList
                ? tourList
                    .filter((tour) => tour.hostId === props.user?.id)
                    .sort(function (a: ReducedTour, b: ReducedTour) {
                      if (a.date > b.date) return +1;
                      if (a.date < b.date) return -1;
                      if (a.time > b.time) return +1;
                      if (a.time < b.time) return -1;
                      return 0;
                    })
                    .map((tour) => (
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
                              <Link href={`/films/${tour.filmId}`}>
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
                          {tour.attendees.length ? (
                            <div className="flex center">
                              <div>Going:</div>
                              <div className="flex center">
                                {tour.attendees.map((attendee: any) => (
                                  <div key={`attendee-${attendee}`}>
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
                          ) : (
                            ''
                          )}
                        </div>
                        {props.loggedUser ? (
                          tour.attendees.includes(props.loggedUser.username) ? (
                            <button
                              className="relative"
                              onClick={() => {
                                handleLeave(
                                  tour.tourId,
                                  props.loggedUser?.id as number,
                                ).catch(() => {
                                  console.log('Request fails');
                                });
                              }}
                            >
                              Leave
                            </button>
                          ) : (
                            <button
                              className="relative"
                              onClick={() => {
                                handleJoin(
                                  tour.tourId,
                                  props.loggedUser?.id as number,
                                ).catch(() => {
                                  console.log('Request fails');
                                });
                              }}
                            >
                              Join
                            </button>
                          )
                        ) : (
                          <button disabled className="relative">
                            Join
                          </button>
                        )}
                      </li>
                    ))
                : ''}
            </ul>
          </section>
          <h2>Attending</h2>
          <section className="full tours">
            <ul>
              {tourList
                ? tourList
                    .sort(function (a: ReducedTour, b: ReducedTour) {
                      if (a.date > b.date) return +1;
                      if (a.date < b.date) return -1;
                      if (a.time > b.time) return +1;
                      if (a.time < b.time) return -1;
                      return 0;
                    })
                    .filter((tour) =>
                      tour.attendees.includes(props.user?.username as string),
                    )
                    .map((tour) => (
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
                              <Link href={`/films/${tour.filmId}`}>
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
                          {tour.attendees.length ? (
                            <div className="flex center">
                              <div>Going:</div>
                              <div className="flex center">
                                {tour.attendees.map((attendee: any) => (
                                  <div key={`attendee-${attendee}`}>
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
                          ) : (
                            ''
                          )}
                        </div>
                        {props.loggedUser && props.loggedUser.id ? (
                          tour.attendees.includes(props.loggedUser.username) ? (
                            <button
                              className="relative"
                              onClick={() => {
                                handleLeave(
                                  tour.tourId,
                                  props.loggedUser?.id as number,
                                ).catch(() => {
                                  console.log('Request fails');
                                });
                              }}
                            >
                              Leave
                            </button>
                          ) : (
                            <button
                              className="relative"
                              onClick={() => {
                                handleJoin(
                                  tour.tourId,
                                  props.loggedUser?.id as number,
                                ).catch(() => {
                                  console.log('Request fails');
                                });
                              }}
                            >
                              Join
                            </button>
                          )
                        ) : (
                          <button disabled className="relative">
                            Join
                          </button>
                        )}
                      </li>
                    ))
                : ''}
            </ul>
          </section>
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
      tours: tours || undefined,
    },
  };
}
