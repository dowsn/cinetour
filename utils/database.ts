import camelcaseKeys from 'camelcase-keys';
import { config } from 'dotenv-safe';
import postgres from 'postgres';
import setPostgresDefaultsOnHeroku from './setPostgresDefaultsOnHeroku';

setPostgresDefaultsOnHeroku();

config();

// Type needed for the connection function below
declare module globalThis {
  let postgresSqlClient: ReturnType<typeof postgres> | undefined;
}

// Connect only once to the database
// https://github.com/vercel/next.js/issues/7811#issuecomment-715259370
function connectOneTimeToDatabase() {
  let sql;

  if (process.env.NODE_ENV === 'production' && process.env.DATABASE_URL) {
    // Heroku needs SSL connections but
    // has an "unauthorized" certificate
    // https://devcenter.heroku.com/changelog-items/852
    sql = postgres({ ssl: { rejectUnauthorized: false } });
  } else {
    if (!globalThis.postgresSqlClient) {
      globalThis.postgresSqlClient = postgres();
    }
    sql = globalThis.postgresSqlClient;
  }

  return sql;
}

// Connect to PostgreSQL
const sql = connectOneTimeToDatabase();

//
// User
//
export type User = {
  id: number;
  username: string;
};

// getting all users for getting some data from the whole table
export async function getUsers() {
  const users = await sql<[User[]]>`
  SELECT
    id,
    username
  FROM
    users
    `;
  return camelcaseKeys(users);
}

// creating a new user
export async function createUser(username: string, passwordHash: string) {
  const [user] = await sql<[User]>`
  INSERT INTO users
    (username, password_hash)
  VALUES
    (${username}, ${passwordHash})
  RETURNING
    id,
    username
  `;

  return camelcaseKeys(user);
}

// deleting user
export async function deleteUserById(userId: number) {
  if (!userId) return undefined;

  const [user] = await sql<[User]>`
  DELETE FROM users WHERE
     users.id = ${userId}
  RETURNING
    *
  `;

  return camelcaseKeys(user);
}

// updating data about a user
export async function updateUser(
  userId: number,
  username: string,
  firstName: string,
  lastName: string,
  email: string,
  selfDescription: string,
) {
  const [user] = await sql<[User]>`
UPDATE
  users
SET
  username = ${username}
WHERE
id = ${userId}
RETURNING *
`;

  const [profile] = await sql<[Profile | undefined]>`
  UPDATE
    profiles
  SET
  first_name = ${firstName},
    last_name = ${lastName},
    email = ${email},
    self_description = ${selfDescription}
  WHERE
    user_id = ${userId}
  RETURNING *
  `;

  const superUser = {
    ...user,
    ...profile,
  };

  return camelcaseKeys(superUser);
}

// register api, user page - gets user by its username in order to use the data on the website, or to check if the user already exist
export async function getUserByUsername(username: string) {
  if (!username) return undefined;

  const [user] = await sql<[User | undefined]>`
    SELECT
      id,
      username
    FROM
      users
    WHERE
      username = ${username}
  `;

  return user && camelcaseKeys(user);
}

// login api - getting the user this time also with the pw hash, for login purpose in api

type UserWithPasswordHash = User & {
  passwordHash: string;
};

export async function getUserWithPasswordHashByUsername(username: string) {
  if (!username) return undefined;

  const [user] = await sql<[UserWithPasswordHash | undefined]>`
    SELECT
      *
    FROM
      users
    WHERE
      username = ${username}
  `;
  return user && camelcaseKeys(user);
}

export async function updateUserPasswordHash(
  userId: number,
  passwordHash: string,
) {
  if (!userId || !passwordHash) return undefined;

  const [user] = await sql<[UserWithPasswordHash | undefined]>`
    UPDATE
      users
    SET
      password_hash = ${passwordHash}
    WHERE
      id = ${userId}
    RETURNING *
  `;
  return user && camelcaseKeys(user);
}

// login api, registration api - creating session for specific user with his/her id, which is created during registration (api)

type Session = {
  id: number;
  token: string;
};

export async function createSession(
  token: string,
  userId: User['id'],
  CSRFSecret: string,
) {
  const [session] = await sql<[Session]>`
  INSERT INTO sessions
    (token, user_id, csrf_secret)
  VALUES
    (${token}, ${userId}, ${CSRFSecret})
  RETURNING
    id,
    token
  `;

  await deleteExpiredSessions();

  return camelcaseKeys(session);
}

// profile api - getting user by valid session token, checking if the token in the cookie matches the concrete user
export async function getUserByValidSessionToken(token: string) {
  if (!token) {
    return undefined;
  }

  const [user] = await sql<[User | undefined]>`

  SELECT
    users.id,
    users.username
    -- selecting only from table users in this query, it is going to be just two columns
  FROM
    users,
    sessions
  WHERE
   sessions.token = ${token} AND
    -- those are same because session is working in user_id with users.id
   sessions.user_id = users.id AND
   sessions.expiry_timestamp > now()
  `;

  await deleteExpiredSessions();

  return user && camelcaseKeys(user);
}

// deleting session upon logout
export async function deleteSessionByToken(token: string) {
  const [session] = await sql<[Session | undefined]>`
  DELETE FROM
    sessions
  WHERE
    sessions.token = ${token}
  RETURNING *
  `;

  return session && camelcaseKeys(session);
}

// deleting expired sessions after getting user by valid session token and after creating new session

export async function deleteExpiredSessions() {
  const sessions = await sql<[Session[]]>`
    DELETE FROM sessions
  WHERE
    expiry_timestamp < now()
  RETURNING *
  `;

  return sessions.map((session) => camelcaseKeys(session));
}

//
// Profile
//

export type Profile = {
  userId: number;
  firstName: string;
  lastName: string;
  email: string;
  selfDescription: string;
};

// creating a profile for new user
export async function createProfile(
  userId: number,
  firstName: string,
  lastName: string,
  email: string,
  selfDescription: string,
) {
  const [profile] = await sql<[Profile]>`
  INSERT INTO profiles
    ( user_id,
      first_name,
  last_name,
  email,
  self_description)
  VALUES
    (${userId}, ${firstName}, ${lastName}, ${email}, ${selfDescription})
  RETURNING
    *
  `;

  return camelcaseKeys(profile);
}

// getting a profile information
export async function getProfile(ProfileId: number) {
  if (!ProfileId) return undefined;
  const [profile] = await sql<[Profile | undefined]>`
  SELECT
    *
  FROM
    profiles
  WHERE
    user_id = ${ProfileId}
  `;
  return profile && camelcaseKeys(profile);
}

//
// Admin
//

export type Admin = {
  admin_id: number;
};

// getting an admin to check if he is logged
export async function getAdmin(userId: number) {
  if (!userId) return undefined;

  const [admin] = await sql<[Admin | undefined]>`
      SELECT
    admin_id
      FROM
    admins,
    users
       WHERE
       admin_id = ${userId}
  `;
  return admin && camelcaseKeys(admin);
}

//
//  csrf - Cross-site request forgery prevention
//

export type SessionWithCSRF = Session & { csrfSecret: string };

export async function getSessionByValidToken(token: string) {
  if (!token) return undefined;

  const [session] = await sql<[SessionWithCSRF | undefined]>`
  SELECT
      sessions.id,
      sessions.token,
      sessions.csrf_secret
   FROM
      sessions
   WHERE
    sessions.token = ${token} AND
    sessions.expiry_timestamp > NOW();
  `;
  await deleteExpiredSessions();

  return session && camelcaseKeys(session);
}

//
// Programmes
//

export type Programme = {
  programmeId: number;
  tourId?: number | null;
  filmTitle: string;
  filmId?: number;
  cinemaName: string;
  time: string;
  genre?: string;
  date: string;
  username?: string | undefined;
  hostId?: number | null;
  englishfriendly: boolean;
};

// getting all programmes - with tours, without tours and those where tours are not defined as an option
export async function getProgrammes() {
  const programmesWithTours = await sql<[Programme[]]>`
      SELECT
      programme_id,
      film_title,
      film_id,
      cinema_name,
      genre,
      date,
      username,
      tours.id AS tour_id,
      host_id,
      time,
      englishfriendly
       FROM
      films,
      tours,
      cinemas,
      programmes,
      users
        WHERE
      cinema_id = cinemas.id AND
      programmes.id = programme_id AND
      film_id = films.id AND
      users.id = host_id
    `;

  const programmesWithoutTours = await sql<Programme[]>`
    SELECT
    distinct programmes.id AS programme_id,
     film_title,
    film_id,
    cinema_name,
    genre,
    date,
    time,
    englishfriendly
     FROM
    films,
    cinemas,
    programmes,
    tours
      WHERE
    cinema_id = cinemas.id AND
    film_id = films.id AND
     programmes.id NOT IN (SELECT DISTINCT tours.programme_id FROM tours);
  `;

  await deleteExpiredProgrammes();

  if (!programmesWithoutTours.length) {
    const programmes = await sql<Programme[]>`
    SELECT
    programmes.id AS programme_id,
     film_title,
    film_id,
    cinema_name,
    genre,
    date,
    time,
    englishfriendly
     FROM
    films,
    cinemas,
    programmes
    WHERE
    cinema_id = cinemas.id AND
    film_id = films.id
  `;

    return camelcaseKeys(programmes);
  }

  const programmes = [...programmesWithTours, ...programmesWithoutTours];
  return camelcaseKeys(programmes);
}

// getting current programme by its id
export async function getProgrammeById(id: number | undefined) {
  if (!id) return undefined;
  const [programme] = await sql<[Programme | undefined]>`
    SELECT
      programmes.id AS programme_id,
      film_title,
      cinema_name,
      date,
      time
    FROM
      programmes,
      films,
      cinemas
    WHERE
      programmes.id = ${id} AND
      programmes.film_id = films.id AND
      programmes.cinema_id = cinemas.id
  `;
  return programme && camelcaseKeys(programme);
}

// creating a new programme
export async function createProgramme(
  filmId: number,
  cinemaId: number,
  date: Date | string,
  time: Date | string,
  englishfriendly: boolean,
) {
  const [programme] = await sql<[Programme | undefined]>`
    INSERT INTO programmes
      (film_id, cinema_id, date, time, englishfriendly)
    VALUES
      (${filmId}, ${cinemaId}, ${date}, ${time}, ${englishfriendly})
    RETURNING
      film_id, cinema_id, date, time, englishfriendly
    `;

  await deleteExpiredProgrammes();

  return programme && camelcaseKeys(programme);
}

// updating current programme
export async function updateProgrammeById(
  programmeId: number,
  filmId: number,
  cinemaId: number,
  date: Date,
  time: Date,
  englishfriendly: boolean,
) {
  const [programme] = await sql<[Programme | undefined]>`
    UPDATE
      programmes
    SET
      film_id = ${filmId},
      cinema_id = ${cinemaId},
      date = ${date},
      time = ${time},
      englishfriendly = ${englishfriendly}
    WHERE
      id = ${programmeId}
    RETURNING *
  `;
  return programme && camelcaseKeys(programme);
}

// deleting current programme
export async function deleteProgrammeById(programmeId: number) {
  const [programme] = await sql`
  DELETE FROM
    programmes
  WHERE
    id = ${programmeId}
  RETURNING *
`;

  return camelcaseKeys(programme);
}

//
// Tour attendees
//

export type TourAttendee = {
  programmeId: number;
  username: string;
  tourId: number;
};

export type TourAttendeeSimple = {
  attendeeId: number;
  tourId: number;
};

// getting all attendees for current tour
export async function getAttendees() {
  const tourAttendees = await sql<[TourAttendee[]]>`
    SELECT
    programme_id,
    username,
    tour_id
     FROM
    tours,
    users,
    tours_attendees
      WHERE
    users.id = attendee_id AND
    tours.id = tour_id
  `;
  return camelcaseKeys(tourAttendees);
}

//
// Cinemas
//

export type Cinema = {
  id: number;
  cinemaName: string;
  address: string;
  longitude: number;
  lattitude: number;
  cinemaDescription: string;
  contact: string;
};

// getting all cinemas
export async function getCinemas() {
  const cinemas = await sql<[Cinema[]]>`
  SELECT
    *
  FROM
    cinemas
  `;

  return camelcaseKeys(cinemas);
}

// getting cinema id in api for creating the programme
export async function getCinemaByName(cinemaName: string) {
  if (!cinemaName) {
    return undefined;
  }
  const [cinema] = await sql<[Cinema | undefined]>`
  SELECT
    *
  FROM
    cinemas
  WHERE
    cinema_name = ${cinemaName}
  `;

  return cinema && camelcaseKeys(cinema);
}

//
// Films
//

export type Film = {
  id: number;
  filmTitle: string;
  genre: string;
  director: string;
  synopsis: string;
  trailer: string;
  year: number;
  topFilm: boolean;
  country: string;
};

// getting all films
export async function getFilms() {
  const films = await sql<[Film[]]>`
    SELECT
      *
    FROM
      films
  `;
  return camelcaseKeys(films);
}

// getting film of the week to work with its data
export async function getFilmOfTheWeek() {
  const [film] = await sql<[Film | undefined]>`
    SELECT
      *
    FROM
      films
    WHERE
    top_film IS TRUE
  `;
  return film && camelcaseKeys(film);
}

// creating a new film
export async function createFilm(
  filmTitle: string,
  genre: string,
  director: string,
  synopsis: string,
  trailer: string,
  year: number,
  country: string,
  topFilm: boolean,
) {
  const [film] = await sql<[Film]>`
  INSERT INTO films
    (film_title, genre, director, synopsis, trailer, year, country, top_film)
  VALUES
    (${filmTitle}, ${genre}, ${director}, ${synopsis}, ${trailer}, ${year}, ${country}, ${topFilm})
  RETURNING
   film_title, genre, director, synopsis, trailer, year, country, top_film
  `;

  return camelcaseKeys(film);
}

// getting film by id
export async function getFilmById(id: number | undefined) {
  if (!id) return undefined;
  const [film] = await sql<[Film | undefined]>`
    SELECT
      *
    FROM
      films
    WHERE
      id = ${id}
  `;
  return film && camelcaseKeys(film);
}

// updating current film
export async function updateFilmById(
  id: number,
  filmTitle: string,
  genre: string,
  director: string,
  synopsis: string,
  trailer: string,
  year: number,
  topFilm: boolean,
  country: string,
) {
  const [film] = await sql<[Film | undefined]>`
    UPDATE
      films
    SET
      film_title = ${filmTitle},
      genre = ${genre},
      director = ${director},
      synopsis = ${synopsis},
      trailer = ${trailer},
      year = ${year},
      top_film = ${topFilm},
      country = ${country}
    WHERE
      id = ${id}
    RETURNING *
  `;
  return film && camelcaseKeys(film);
}

// deleting current film
export async function deleteFilmById(id: number) {
  const [film] = await sql<[Film | undefined]>`
    DELETE FROM
      films
    WHERE
      id = ${id}
    RETURNING *
  `;

  return film && camelcaseKeys(film);
}

// getting film id in api for creating the programme
export async function getFilmByName(filmTitle: string) {
  if (!filmTitle) {
    return undefined;
  }
  const [film] = await sql<[Film | undefined]>`
  SELECT
    *
  FROM
    films
  WHERE
    film_title = ${filmTitle}
  `;

  return film && camelcaseKeys(film);
}

//
// Tours
//

export type Tour = {
  tourId: number;
  filmId: number;
  username: string;
  date: string;
  time: string;
  body: string;
  hostId: number;
  cinemaName: string;
  programmeId: number;
  filmTitle: string;
  trailer: string;
  genre: string;
};

// getting all tours
export async function getTours() {
  const tours = await sql<[Tour[]]>`
    SELECT
    username,
    tours.id AS tour_id,
    host_id,
    film_id,
    body,
    programme_id,
  date,
  time,
  cinema_name,
  film_title,
  trailer,
  genre,
  cinema_name
    FROM
      users,
      programmes,
      films,
      tours,
      cinemas
  WHERE
    users.id = host_id AND
    programme_id = programmes.id AND
    film_id = films.id AND
    cinemas.id = cinema_id
    `;

  await deleteExpiredProgrammes();

  return camelcaseKeys(tours);
}

// creating a tour for current programme id
export async function createTour(
  programmeId: number,
  hostId: number,
  body: string,
) {
  const [tour] = await sql<[Tour]>`
  INSERT INTO tours
    (programme_id, host_id, body)
  VALUES
    (${programmeId}, ${hostId}, ${body})
  RETURNING
    *
  `;

  return camelcaseKeys(tour);
}

// getting tour for current programme id
export async function getTourByProgrammeId(programmeId: number) {
  const [tour] = await sql<[any]>`
  SELECT
    tours.id AS tour_id,
    body,
    programme_id,
    host_id
  FROM
    tours
  WHERE
    programme_id = ${programmeId}
  `;

  return camelcaseKeys(tour);
}

// getting current tour
export async function getTourByTourId(tourId: number) {
  const [tour] = await sql<[any]>`
  SELECT
    tours.id AS tour_id,
    body,
    programme_id,
    host_id
  FROM
    tours
  WHERE
    id = ${tourId}
  `;

  return camelcaseKeys(tour);
}

// updating current tour's description
export async function updateTourById(tourId: number, body: string) {
  const [tour] = await sql<[Tour | undefined]>`
    UPDATE
      tours
    SET
      body = ${body}
    WHERE
      id = ${tourId}
    RETURNING *
  `;
  return tour && camelcaseKeys(tour);
}

// deleting current tour
export async function deleteTourById(tourId: number) {
  const [tour] = await sql<[Tour | undefined]>`
  DELETE FROM
    tours
  WHERE
    id = ${tourId}
  RETURNING *
`;

  return tour && camelcaseKeys(tour);
}

// joining current tour
export async function joinTourbyUserId(tourId: number, userId: number) {
  const [tourAttendee] = await sql<[TourAttendeeSimple | undefined]>`
  INSERT INTO tours_attendees
    (tour_id, attendee_id)
  VALUES
    (${tourId}, ${userId})
  RETURNING
    *
  `;

  return tourAttendee && camelcaseKeys(tourAttendee);
}

// leaving current tour
export async function unjoinTourbyUserId(tourId: number, attendeeId: number) {
  const [tourAttendee] = await sql<[TourAttendeeSimple | undefined]>`
  DELETE FROM
  tours_attendees
  WHERE
    attendee_id = ${attendeeId} AND
    tour_id = ${tourId}
  RETURNING *
  `;

  return tourAttendee && camelcaseKeys(tourAttendee);
}

// deleting programmes that are older then today
export async function deleteExpiredProgrammes() {
  const programmes = await sql<[Programme[]]>`
    DELETE FROM programmes
  WHERE
    date < now()::date
  RETURNING *
  `;

  return programmes.map((programme) => camelcaseKeys(programme));
}

//
// Cinetourists
//

export async function getCinetourists() {
  const users = await sql<[User[]]>`
    SELECT
     id, username
    FROM
      users
    `;

  return camelcaseKeys(users);
}

export async function getCinetouristById(id: number | undefined) {
  if (!id) return undefined;
  const [film] = await sql<[User | undefined]>`
      SELECT
        *
      FROM
        films
      WHERE
        id = ${id}
    `;
  return film && camelcaseKeys(film);
}

//
// Subscribers
//

export type Subscriber = {
  subscriberId: number;
  expiryTimestamp: string;
  checkoutSession: string;
  qrCode: string;
};
export async function createSubscriber(
  userId: number,
  checkoutSession: string,
  qr_code: string,
) {
  const [subscriber] = await sql<[Subscriber]>`
  INSERT INTO subscribers
    (subscriber_id, checkout_session, qr_code)
  VALUES
    (${userId}, ${checkoutSession}, ${qr_code})
  RETURNING
    *
  `;

  return camelcaseKeys(subscriber);
}

export async function getSubscriberByValidSubscription(userId: number) {
  if (!userId) {
    return undefined;
  }

  const [subscriber] = await sql<[Subscriber]>`

  SELECT
   *
  FROM
    subscribers
  WHERE
   subscriber_id = ${userId} AND
   expiry_timestamp > now()
  `;

  await deleteExpiredSubscribers();

  return camelcaseKeys(subscriber);
}

export async function getSubscriberByExistingCheckoutSession(
  sessionId: string,
) {
  if (!sessionId) {
    return undefined;
  }

  const [subscriber] = await sql<[Subscriber | undefined]>`

SELECT
 *
FROM
  subscribers
WHERE
checkout_session= ${sessionId}
`;

  await deleteExpiredSubscribers();

  return subscriber && camelcaseKeys(subscriber);
}

export async function deleteExpiredSubscribers() {
  const subscribers = await sql<[Subscriber[]]>`
    DELETE FROM subscribers
  WHERE
    expiry_timestamp < now()
  RETURNING *
  `;

  return subscribers.map((subscriber) => camelcaseKeys(subscriber));
}

//
// Friends
//

export type Friend = {
  username: string;
  friendId: number;
};

export async function getFriends(userId: number) {
  if (!userId) return undefined;
  const friends = await sql<Friend[]>`
    SELECT
    friend1_id AS friend_id,
    username
    FROM
    friends,
    users
  WHERE
    friend2_id = ${userId} AND
    users.id = friend1_id
  `;

  const friends2 = await sql<Friend[]>`
SELECT
friend2_id AS friend_id,
username
FROM
friends,
users
WHERE
friend1_id = ${userId} AND
users.id = friend2_id
`;

  const superFriends = [...friends, ...friends2];

  return camelcaseKeys(superFriends);
}

export async function getFriendByOwnId(userId: number, friendId: number) {
  if (!userId) return undefined;
  const [friend] = await sql<[Friend | undefined]>`
    SELECT
    *
    FROM
    friends
  WHERE
    (friend1_id = ${userId} AND
    friend2_id = ${friendId}) or
    (friend1_id = ${friendId} AND
    friend2_id = ${userId})
  `;
  return friend && camelcaseKeys(friend);
}

export async function createFriend(userId: number, friendId: number) {
  const [friend] = await sql<[Friend | undefined]>`
  INSERT INTO friends
    (friend1_id, friend2_id)
  VALUES
    (${userId}, ${friendId})
  RETURNING
    *
  `;

  return friend && camelcaseKeys(friend);
}

export async function deleteFriendById(userId: number, friendId: number) {
  if (!friendId) return undefined;
  const [friend] = await sql<[Friend | undefined]>`
    DELETE FROM friends
  WHERE
    (friend1_id = ${userId} and
    friend2_id = ${friendId}) or
    (friend1_id = ${friendId} and
    friend2_id = ${userId})
  RETURNING *
  `;

  return friend && camelcaseKeys(friend);
}
