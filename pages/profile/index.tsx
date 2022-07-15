import {
  GoogleMap,
  InfoWindow,
  MarkerF,
  useLoadScript,
} from '@react-google-maps/api';
import { loadStripe } from '@stripe/stripe-js';
import { GetServerSidePropsContext } from 'next';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import QRCode from 'qrcode';
import { useEffect, useState } from 'react';
import YouTube, { YouTubeProps } from 'react-youtube';
import {
  Admin,
  Cinemas,
  Friend,
  getAdmin,
  getCinemas,
  getProfile,
  getSubscriberByValidSubscription,
  getUserByValidSessionToken,
  Profile,
  Subscriber,
  Tour,
  User,
} from '../../utils/database';
import {
  getReducedSubscriber,
  getReducedTour,
} from '../../utils/datastructures';
import mapStyles from '../../utils/mapStyles';

type Props = {
  user: User;
  profile: Profile;
  admin?: Admin;
  publicKey: string;
  subscriber: Subscriber;
  apiKey: string;
  cinemas: Cinemas[];
  tours: any[];
  friends: any;
};

// options for the map
const options = {
  styles: mapStyles,
  disableDefaultUI: true,
  zoomControl: true,
};

export default function UserDetail(props: Props) {
  //states: database of cinemas and windowinf for google maps
  const [map, setMap] = useState<Cinemas[]>(props.cinemas);
  const [selected, SetSelected] = useState<Cinemas | null>(null);

  //getting QR Code for user
  const [src, setSrc] = useState('');

  if (props.subscriber) {
    useEffect(() => {
      QRCode.toDataURL(props.subscriber.qrCode).then((data: any) => {
        setSrc(data);
      });
    }, []);
  }
  // router
  const router = useRouter();

  // tours
  const [tourList, setTourList] = useState<any[]>(props.tours);

  // profile image
  // const [setImgsrc];

  // async function handleOnSubmit(event) {
  //   event.preventDefault();
  //   const form = event.currentTarget;
  //   const fileInput = Array.from(form.elements).find(
  //     ({ name }) => name === 'file',
  //   );

  //   const formData = new FormData();

  //   for (const file of fileInput.files) {
  //     FormData.append('file', file);

  //     formData.append('upload_preset', 'cinetour');

  //     const data = await fetch(
  //       'htttps://api.cloudinary.com/v1_1/dkiienrq4/image/upload',
  //       { method: 'POST', body: formData },
  //     ).then((r) => r.json());

  //     console.log(data);
  //   }
  // }

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
    const TourAttendee = await response.json();
    console.log(TourAttendee);

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

    await router.push(`/tours#${tourId}`);
  }

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

  // Google Maps
  //checking google maps api key
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: props.apiKey,
  });
  // center of the map
  const center = { lat: 48.210033, lng: 16.363449 };

  // Stripe Subscription
  async function handlePurchase() {
    // 1. connect with stripe
    // auth with stripe client
    const stripeClient: any = await loadStripe(props.publicKey);

    // 2. Send order information
    const response = await fetch('/api/subscribe', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        quantity: '1',
        mode: 'payment',
        priceId: 'price_1LH5k0ES7FeuI2GqdUFUUipn',
      }),
    });

    const { session } = await response.json();

    // 2. Redirect customer to url from Checkout session
    stripeClient.redirectToCheckout({ sessionId: session.id });
  }

  return (
    <div>
      <Head>
        <title>{props.user.username}</title>
        <meta name="description" content="Your profile page" />
      </Head>
      <main>
        <Link href="/logout">
          <button>Log Out</button>
        </Link>
        <h1>CineTourist {props.user.username}</h1>
        <Image
          className="profileImage"
          src={`/users/${props.user.id}.jpeg`}
          height="150"
          width="150"
          alt="profile picture"
        />
        <br />
        <section>
          {props.admin ? (
            <>
              <div className="button a">
                <h2>Admin Tools</h2>
                <Link href="/edit_programme">Edit Programme</Link>
                <br />
                <Link href="/edit_films">Edit Films</Link>
              </div>
            </>
          ) : (
            ''
          )}
          <h2>First name:</h2>
          <p>{props.profile.firstName}</p>
          <h2>Last name:</h2>
          <p>{props.profile.lastName}</p>
          <div></div>
          {props.subscriber ? (
            <>
              <h2>Subscribed member till</h2>
              <p>{`${props.subscriber.expiryTimestamp}`}</p>
              <img src={src} className="qr" alt="Girl in a jacket" />
            </>
          ) : (
            <button onClick={() => handlePurchase()}>Subscribe</button>
          )}
          {!isLoaded ? (
            <div>Loading map...</div>
          ) : (
            <>
              <h2>Your CineTour Map</h2>
              <GoogleMap
                zoom={11}
                center={center}
                options={options}
                mapContainerClassName="map-container"
              >
                {map.map((cinema) => (
                  <>
                    <MarkerF
                      key={`cinema-id-${cinema.id}`}
                      position={{
                        lat: Number(cinema.lattitude),
                        lng: Number(cinema.longitude),
                      }}
                      icon={{
                        url: '/nav/icon.png',
                        scaledSize: new window.google.maps.Size(16, 16),
                      }}
                      onClick={() => {
                        SetSelected(cinema);
                      }}
                    />
                    {/* */}
                  </>
                ))}
                {selected ? (
                  <InfoWindow
                    position={{
                      lat: Number(selected.lattitude),
                      lng: Number(selected.longitude),
                    }}
                    onCloseClick={() => {
                      SetSelected(null);
                    }}
                  >
                    <div>
                      <h2>{selected.cinemaName}</h2>
                      <p>{selected.address}</p>
                      <p>{selected.cinemaDescription}</p>
                    </div>
                  </InfoWindow>
                ) : null}
              </GoogleMap>
            </>
          )}
          <h2>E-Mail:</h2>
          <p>{props.profile.email}</p>
          <h2>Self-description:</h2>
          <p>{props.profile.selfDescription}</p>
        </section>
        <section>
          <h1>Friends</h1>
          {props.friends
            ? props.friends.map((friend: Friend) => (
                <div key={`friend-id-${friend.friendId}`}>
                  <Link href={`/cinetourists/${friend.username}`}>
                    {friend.username}
                  </Link>
                </div>
              ))
            : ''}
        </section>

        <section>
          <h1>Tours</h1>
          <h2>Hosting</h2>
          <div className="full tours">
            <ul>
              {tourList
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
                              handleUnjoin(props.user.id);
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
                ))}
            </ul>
          </div>
          <h2>Attending</h2>
          <div className="full tours">
            <ul>
              {tourList
                .filter((tour) => tour.attendees.includes(props.user.username))
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
                              handleUnjoin(props.user.id);
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
                ))}
            </ul>
          </div>
        </section>
        <Link href={`/profile/edit`}>
          <button>Edit Profile</button>
        </Link>
        <br />
        <Link href="/logout">
          <button>Log Out</button>
        </Link>
      </main>
    </div>
  );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const user = await getUserByValidSessionToken(
    context.req.cookies.sessionToken,
  );

  const baseUrl = await process.env.BASE_URL;
  const requestTours = await fetch(`${baseUrl}/api/tours`);

  const toursRaw = await requestTours.json();

  // better datastructure

  const attendeesRaw = await fetch(`${baseUrl}/api/tour_attendees`);

  const attendees = await attendeesRaw.json();

  const tours = await toursRaw.map((tour: Tour) =>
    getReducedTour(tour, attendees),
  );

  if (user) {
    const admin = await getAdmin(user.id);
    const profile = await getProfile(user.id);

    // getting friends
    const friendsRequest = await fetch(`${baseUrl}/api/friends/${user.id}`);
    const friends = await friendsRequest.json();

    const ApiKey = await process.env.NEXT_APP_GOOGLE_MAPS_API_KEY;
    const cinemas = await getCinemas();

    if (!admin) {
      const subscriber = await getSubscriberByValidSubscription(user.id);

      if (subscriber) {
        const reducedSubscriber = getReducedSubscriber(subscriber);

        return {
          // making data about the user available at the page in props
          props: {
            user: user,
            subscriber: reducedSubscriber,
            profile: profile,
            apiKey: ApiKey,
            cinemas: cinemas,
            tours: tours || undefined,
            friends: friends || undefined,
          },
        };
      }
      return {
        props: {
          user: user,
          profile: profile,
          publicKey: process.env.STRIPE_PUBLISHABLE_KEY,
          apiKey: ApiKey,
          cinemas: cinemas,
          tours: tours || undefined,
          friends: friends || undefined,
        },
      };
    }

    return {
      props: {
        user: user,
        profile: profile,
        admin: admin,
        publicKey: process.env.STRIPE_PUBLISHABLE_KEY,
        apiKey: ApiKey,
        cinemas: cinemas,
        tours: tours || undefined,
        friends: friends || undefined,
      },
    };
  }

  return {
    redirect: {
      destination: `/login?returnTO=/profile`,
      permanent: false,
    },
  };
}
