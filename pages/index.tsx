/** @jsxImportSource @emotion/react */

import { AdvancedImage } from '@cloudinary/react';
import { Cloudinary } from '@cloudinary/url-gen';
import { css } from '@emotion/react';
import { GetServerSidePropsContext } from 'next';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import YouTube, { YouTubeProps } from 'react-youtube';
import {
  Film,
  getFilmOfTheWeek,
  getSubscriberByValidSubscription,
  getUserByValidSessionToken,
  Programme,
  Subscriber,
  Tour,
  User,
} from '../utils/database';
import {
  getReducedProgramme,
  getReducedSubscriber,
  getReducedTour,
  ReducedProgramme,
  ReducedTour,
} from '../utils/datastructures';

const indexStyles = css`
  padding-top: 2rem;

  .start {
    margin-top: 2rem;
  }

  img {
    filter: contrast(0.912);
    margin: 0;
    padding: 0;
  }

  // advertisement
  .ad {
    display: flex;
    justify-content: space-between;
    margin-left: -5px;
    margin-right: 20%;
    margin-bottom: 40px;
    padding: 0;

    div {
      padding: 5px;
      padding-bottom: 0px;
    }

    article {
      align-self: center;
    }
  }

  @media only screen and (max-width: 800px) {
    .ad {
      max-width: 100vw;
      margin-right: 1rem;
      margin-bottom: 0;
    }
  }

  .filmoftheweek {
    position: relative;
    width: 100%;
  }

  .watch {
    position: absolute;
    top: 50%;
    min-height: 41px;
    left: 50%;
    transform: translate(-50%, -50%);
    -ms-transform: translate(-50%, -50%);
  }

  .buttontours {
    margin-bottom: 40px;
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
  subscriber?: Subscriber;
  tours?: ReducedTour[];
  user?: User;
  programmes?: ReducedProgramme[];
  filmoftheweek?: Film;
};

export default function Home(props: Props) {
  // displaying top-film image
  // Create a Cloudinary instance and set your cloud name.
  const cld = new Cloudinary({
    cloud: {
      cloudName: 'dkiienrq4',
    },
  });
  // cld.image returns a CloudinaryImage with the configuration set.
  const myImage = cld.image(`top_image/top_image`);

  // showing just today
  const today = new Date(Date.now()).toString().split(' ', 3).join(' ');

  // tours
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

  const renderData = (data: any) => (
    <ul>
      {data
        .filter((item: any) => item.date === today)
        .sort((a: any, b: any) => a.time.localeCompare(b.time))
        .map((item: any) => (
          <li
            key={`programme_id-${item.programmeId}`}
            className="programme"
            id={item.programmeId}
          >
            <div>
              <div className="flex">
                <div>{item.time}</div>
                <div>{item.cinemaName}</div>
              </div>
              <div>
                <h3>
                  <Link href={`/films/${item.filmId}`}>{item.filmTitle}</Link>
                </h3>
              </div>
            </div>
            <div className="flex second">
              <div>#{item.genre}</div>
              {item.englishfriendly ? <div>English Friendly</div> : ''}
              <div>
                Tours:{' '}
                {item.username ? (
                  <Link href={`/tours#${item.tourId}`}>
                    <button>{item.username}</button>
                  </Link>
                ) : props.user ? (
                  <Link href={`/tours/create/${item.programmeId}?returnTo=/`}>
                    <button>+</button>
                  </Link>
                ) : (
                  <Link href="/login?returnTo=/">
                    <button>+</button>
                  </Link>
                )}
              </div>
            </div>
          </li>
        ))}
    </ul>
  );

  return (
    <div>
      <Head>
        <title>CineTour</title>
        <meta name="description" content="Homepage" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main css={indexStyles}>
        {props.subscriber ? (
          ''
        ) : (
          <>
            <div className="start">
              <Link href="/about">
                <button>Start Here</button>
              </Link>
            </div>
            <section className="ad full">
              <div>
                <Image
                  src="/card/card1.png"
                  height="200px"
                  width="400px"
                  layout="intrinsic"
                  alt="CineTour Pass"
                />
              </div>
              <article>
                <h1>One card, unlimited access to all cinemas.</h1>
              </article>
            </section>
          </>
        )}
        <section className="filmoftheweek full">
          <div>
            <AdvancedImage cldImg={myImage} alt="film of the week" />
          </div>
          {props.filmoftheweek ? (
            <Link href={`/films/${[props.filmoftheweek.id]}`}>
              <button className="watch">
                Watch {props.filmoftheweek.filmTitle}
              </button>
            </Link>
          ) : (
            ''
          )}
        </section>
        <section className="full">
          <div className="date">
            <h2>Showing Today</h2>
          </div>
          <div>
            {!!renderData.length ? (
              renderData(props.programmes)
            ) : (
              <p>Nothing found</p>
            )}
          </div>
        </section>
        <section className="full tours">
          <div className="buttontours">
            <Link href="/tours">
              <button>Tours</button>
            </Link>
          </div>
          <ul>
            {tourList
              ? tourList
                  .sort(function (a: any, b: any) {
                    if (a.date > b.date) return +1;
                    if (a.date < b.date) return -1;
                    if (a.time > b.time) return +1;
                    if (a.time < b.time) return -1;
                    return 0;
                  })
                  .slice(0, 3)
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
                          <Link
                            href={`/tours/edit/${tour.programmeId}?returnTo=/`}
                          >
                            <button className="relative">Edit</button>
                          </Link>
                        ) : tour.attendees.includes(props.user.username) ? (
                          <button
                            className="relative"
                            onClick={() => {
                              handleLeave(
                                tour.tourId,
                                props.user?.id as number,
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
                                props.user?.id as number,
                              ).catch(() => {
                                console.log('Request fails');
                              });
                            }}
                          >
                            Join
                          </button>
                        )
                      ) : (
                        <Link href="/login?returnTo=/">
                          <button className="relative">Join</button>
                        </Link>
                      )}
                    </li>
                  ))
              : ''}
          </ul>
        </section>
      </main>
    </div>
  );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const baseUrl = await process.env.BASE_URL;
  const request = await fetch(`${baseUrl}/api/tours`);

  const toursRaw = await request.json();

  const requestProgrammes = await fetch(`${baseUrl}/api/programmes`);
  const programmesRaw = await requestProgrammes.json();
  const filmoftheweek = await getFilmOfTheWeek();

  // getting a better datastructure

  const programmes = programmesRaw.map((programme: Programme) =>
    getReducedProgramme(programme),
  );

  // attendees
  const attendeesRaw = await fetch(`${baseUrl}/api/tour_attendees`);

  const attendees = await attendeesRaw.json();

  // getting a better datastructure
  const tours = await toursRaw.map((tour: Tour) =>
    getReducedTour(tour, attendees),
  );

  const user = await getUserByValidSessionToken(
    context.req.cookies.sessionToken,
  );

  if (user) {
    const subscriber = await getSubscriberByValidSubscription(user.id);

    if (subscriber) {
      const reducedSubscriber = getReducedSubscriber(subscriber);

      return {
        props: {
          user: user,
          subscriber: reducedSubscriber,
          tours: tours,
          programmes: programmes,
          filmoftheweek: filmoftheweek || null,
        },
      };
    }

    return {
      props: {
        user: user,
        tours: tours,
        programmes: programmes,
        filmoftheweek: filmoftheweek || null,
      },
    };
  }
  return {
    props: {
      tours: tours,
      programmes: programmes,
      filmoftheweek: filmoftheweek || null,
    },
  };
}
