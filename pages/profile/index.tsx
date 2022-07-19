import { AdvancedImage } from '@cloudinary/react';
import { Cloudinary } from '@cloudinary/url-gen';
import {
  GoogleMap,
  InfoWindow,
  MarkerF,
  useLoadScript,
} from '@react-google-maps/api';
import { loadStripe } from '@stripe/stripe-js';
import { GetServerSidePropsContext } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import QRCode from 'qrcode';
import React, { useEffect, useState } from 'react';
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
  ReducedTour,
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
  tours?: ReducedTour[];
  friends?: Friend[];
};

// options for the map
const options = {
  styles: mapStyles,
  disableDefaultUI: true,
  zoomControl: true,
};

export default function UserDetails(props: Props) {
  // states: database of cinemas and windowinf for google maps
  const [selected, setSelected] = useState<Cinemas | null>(null);

  // displaying profile picture
  // Create a Cloudinary instance and set your cloud name.
  const cld = new Cloudinary({
    cloud: {
      cloudName: 'dkiienrq4',
    },
  });

  // cld.image returns a CloudinaryImage with the configuration set.
  const myImage = cld.image(`userlist/${props.user.id}`);

  // getting QR Code for user
  const [src, setSrc] = useState('');

  if (props.subscriber) {
    useEffect(() => {
      QRCode.toDataURL(props.subscriber.qrCode)
        .catch(() => {
          console.log('film request fails');
        })
        .then((data: any) => {
          setSrc(data);
        });
    }, []);
  }

  // router
  const router = useRouter();

  // tours
  // handling tours
  const [tourList, setTourList] = useState<ReducedTour[] | undefined>(
    props.tours,
  );

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

    //updating the tourList
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

    //updating the tourList
    const requestTours = await fetch(`/api/tours`);
    const toursRaw = await requestTours.json();

    const attendeesRaw = await fetch(`/api/tour_attendees`);

    const attendees = await attendeesRaw.json();

    const tours = await toursRaw.map((tour: Tour) =>
      getReducedTour(tour, attendees),
    );

    setTourList(tours);
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
  // checking google maps api key
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
        <div className="profileImage">
          <AdvancedImage cldImg={myImage} />
        </div>
        <br />
        <section>
          {props.admin ? (
            <div className="button a">
              <h2>Admin Tools</h2>
              <Link href="/edit_programme">Edit Programme</Link>
              <br />
              <Link href="/edit_films">Edit Films</Link>
            </div>
          ) : (
            ''
          )}
          <h2>First name:</h2>
          <p>{props.profile.firstName}</p>
          <h2>Last name:</h2>
          <p>{props.profile.lastName}</p>
          <br />
          {props.subscriber ? (
            <>
              <h2>Subscribed member till</h2>
              <p>{props.subscriber.expiryTimestamp}</p>
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
                {props.cinemas.map((cinema) => (
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
                      setSelected(cinema);
                    }}
                  />
                ))}
                {selected ? (
                  <InfoWindow
                    position={{
                      lat: Number(selected.lattitude),
                      lng: Number(selected.longitude),
                    }}
                    onCloseClick={() => {
                      setSelected(null);
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
          <section className="full tours">
            <ul>
              {tourList
                ? tourList
                    .filter((tour) => tour.hostId === props.user.id)
                    .sort(function (a: ReducedTour, b: ReducedTour) {
                      if (a.date > b.date) return +1;
                      if (a.date < b.date) return -1;
                      if (a.time > b.time) return +1;
                      if (a.time < b.time) return -1;
                      return 0;
                    })
                    .map((tour) => (
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
                        <div className="relative">
                          <Link
                            href={`/tours/edit/${tour.programmeId}?returnTo=/profile`}
                          >
                            <button>Edit</button>
                          </Link>
                        </div>
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
                      tour.attendees.includes(props.user.username),
                    )
                    .map((tour) => (
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
                        <button
                          className="relative"
                          onClick={() => {
                            handleLeave(tour.tourId, props.user.id).catch(
                              () => {
                                console.log('Request fails');
                              },
                            );
                          }}
                        >
                          Leave
                        </button>
                      </li>
                    ))
                : ''}
            </ul>
          </section>
        </section>
        <div className="editProfile">
          <Link href={`/profile/edit`}>
            <button>Edit Profile</button>
          </Link>
          <Link href="/profile/profile_picture">
            <button>Change Picture</button>
          </Link>
        </div>
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

    const apiKey = await process.env.NEXT_APP_GOOGLE_MAPS_API_KEY;
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
            apiKey: apiKey,
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
          apiKey: apiKey,
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
        apiKey: apiKey,
        cinemas: cinemas,
        tours: tours || undefined,
        friends: friends || undefined,
      },
    };
  }

  return {
    redirect: {
      destination: `/login?returnTo=/profile`,
      permanent: false,
    },
  };
}
