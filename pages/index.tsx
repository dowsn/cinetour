/** @jsxImportSource @emotion/react */

import { css } from '@emotion/react';
import { GetServerSidePropsContext } from 'next';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
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
  subscriber?: Subscriber | undefined;
  tours: any;
  user: User;
  programmes: any;
  filmoftheweek: Film;
};

export default function Home(props: Props) {
  const [tourList, setTourList] = useState<any>(props.tours);
  const [programmes, setProgrammes] = useState(props.programmes);
  // const ToggleItem = ({ discription, id }) => {
  //   const [join, setJoin] = useState(false);
  const [join, setJoin] = useState<string | undefined>('');
  const today = new Date(Date.now()).toString().split(' ', 3).join(' ');
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
    const createdTourAttendee = await response.json();
  }

  async function handleLeave(tourId: number) {
    const response = await fetch(`/api/tour_attendees/${tourId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    const deletedTourAttendee = await response.json();
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
            <div className="flex">
              <div>#{item.genre}</div>
              {item.englishfriendly ? <div>English Friendly</div> : ''}
              <div>
                Tours:{' '}
                {item.username ? (
                  <Link href={`../tours#${item.tourId}`}>
                    <button>{item.username}</button>
                  </Link>
                ) : props.user ? (
                  <Link href={`/tours/create/${item.programmeId}`}>
                    <button>+</button>
                  </Link>
                ) : (
                  <Link href={`../tours#${item.tourId}`}>
                    <button disabled>+</button>
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
            <Image
              src="/topgun.jpeg"
              height="720px"
              width="1920px"
              layout="responsive"
              alt="film of the week"
              priority
            />
          </div>
          <Link href={`/films/${[props.filmoftheweek.id]}`}>
            <button className="watch">
              Watch {props.filmoftheweek.filmTitle}
            </button>
          </Link>
        </section>
        <section className="full">
          <div className="date">
            <h2>Showing Today</h2>
          </div>
          <div>
            {!!renderData.length ? (
              renderData(programmes)
            ) : (
              <p>Nothing found</p>
            )}
          </div>
        </section>
        <section className="full tours ">
          <div className="buttontours">
            <Link href="/tours">
              <button>Tours</button>
            </Link>
          </div>
          <ul>
            {tourList
              .sort(function (a: any, b: any) {
                if (a.date > b.date) return +1;
                if (a.date < b.date) return -1;
                if (a.time > b.time) return +1;
                if (a.time < b.time) return -1;
              })
              .slice(0, 3)
              .map((tour: any) => (
                <li key={`tour_id-${tour.tourId}`} id={`tour-${tour.tourId}`}>
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
                    {tour.attendees.length ? (
                      <>
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
                          {join === 'joined' ? (
                            <div>
                              <Link
                                href={`/cinetourists/${props.user.username}`}
                                key={`username-${props.user.username}`}
                              >
                                {props.user.username}
                              </Link>
                            </div>
                          ) : (
                            ''
                          )}
                        </div>
                      </>
                    ) : !tour.attendees.length && join === 'joined' ? (
                      <>
                        <div>Going:</div>
                        <div>
                          <Link
                            href={`/cinetourists/${props.user.username}`}
                            key={`username-${props.user.username}`}
                          >
                            {props.user.username}
                          </Link>
                        </div>
                      </>
                    ) : (
                      ''
                    )}
                  </div>
                  {props.user ? (
                    tour.hostId === props.user.id ? (
                      <div className="relative">
                        <Link
                          href={`/tours/edit/${tour.programmeId}?returnTO=login`}
                        >
                          <button>Edit</button>
                        </Link>
                      </div>
                    ) : tour.attendees.includes(props.user.username) ? (
                      <button
                        className="relative"
                        value={join}
                        onClick={() => {
                          setJoin('unjoined');
                          handleLeave(props.user.id);
                        }}
                      >
                        Leave
                      </button>
                    ) : (
                      <button
                        className="relative"
                        onClick={() => {
                          setJoin('joined');
                          handleJoin(tour.tourId, props.user.id).catch(() => {
                            console.log('Request fails');
                          });
                        }}
                      >
                        Join
                      </button>
                    )
                  ) : (
                    <button className="relative" disabled>
                      Join
                    </button>
                  )}
                </li>
              ))}
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

  //getting a better datastructure
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
          user: user || null,
          subscriber: reducedSubscriber,
          tours: tours,
          programmes: programmes,
          filmoftheweek: filmoftheweek,
        },
      };
    }
  }
  return {
    props: {
      user: user || null,
      tours: tours,
      programmes: programmes,
      filmoftheweek: filmoftheweek,
    },
  };
}
