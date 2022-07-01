import { tsConditionalType } from '@babel/types';
import camelcaseKeys from 'camelcase-keys';
import { config } from 'dotenv-safe';
import postgres from 'postgres';
import { createCsrfToken } from './auth';
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

// getting the programme table

// export async function getProgrammeTable () {
//   const films = await sql<Film[]>`
//      SELECT
//        *
//      FROM
//        films
// };

// getting data for films, cinemas, programme, tours, profiles

// export type Film = {

// }

// export async function getFilms() {
//   const films = await sql<Film[]>`
//     SELECT * FROM films
//   `;
//   return films.map((film) => camelcaseKeys(film));
// }

// export async function getFilmByTitle(title: string | undefined) {
//   if(!title) return undefined;
//   const [film] = await sql<[Film | undefined]>`
//     SELECT
//       *
//     FROM
//       films
//     WHERE
//       title = ${title}
//   `;

//   return film && camelcaseKeys(film)
// }

// export async function insertTour(
//   title: string,
//   body: string,
//   accessory: string,
// ) {
//   const [animal] = await sql`
//     INSERT INTO animals
//       (first_name, type, accessory)
//     VALUES
//       (${firstName}, ${type}, ${accessory})
//     RETURNING *
//   `;
//   return camelcaseKeys(animal);
// }

// export async function updateAnimalById(
//   id: number,
//   firstName: string,
//   accessory: string,
// ) {
//   const [animal] = await sql`
//     UPDATE
//       animals
//     SET
//       first_name = ${firstName},
//       accessory = ${accessory}
//     WHERE
//       id = ${id}
//     RETURNING *
//   `;
//   return camelcaseKeys(animal);
// }

// export async function deleteAnimalById(id: number) {
//   const [animal] = await sql`
//     DELETE FROM
//       animals
//     WHERE
//       id = ${id}
//     RETURNING *
//   `;
//   return camelcaseKeys(animal);
// }

// register api - creates a new user - meaning putting it into the database while not making passwordHash available

// users and profiles:

export type User = {
  id: number;
  username: string;
};

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

export type Profile = {
  userId: number;
  firstName: string;
  lastName: string;
  street: string;
  streetNumber: string;
  city: string;
  email: string;
  selfDescription: string;
};

export async function createProfile(
  userId: number,
  firstName: string,
  lastName: string,
  email: string,
  street: string,
  streetNumber: string,
  city: string,
  selfDescription: string,
) {
  const [profile] = await sql<[Profile]>`
  INSERT INTO profiles
    ( user_id,
      first_name,
  last_name,
  email,
  street,
  street_number,
  city,
  self_description)
  VALUES
    (${userId}, ${firstName}, ${lastName}, ${email}, ${street}, ${streetNumber}, ${city}, ${selfDescription})
  RETURNING
    *
  `;

  return camelcaseKeys(profile);
}

export async function getProfile(ProfileId: number) {
  const [profile] = await sql<[Profile]>`
  SELECT
    *
  FROM
    profiles
  WHERE
    user_id = ${ProfileId}
  `;
  return profile && camelcaseKeys(profile);
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

// login api, registration api - creating session for specific user with his/her id, which is created during registration (api)

type Session = {
  id: number;
  token: string;
};

export async function createSession(token: string, userId: User['id']) {
  const [session] = await sql<[Session]>`
  INSERT INTO sessions
    (token, user_id)
  VALUES
    (${token}, ${userId})
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

// for checking of valid token to display the profile or other secured pages
export async function getSessionByValidToken(token: string) {
  if (!token) {
    return undefined;
  }

  const [sessionId] = await sql<[Session | undefined]>`

SELECT
  sessions.id,
  sessions.token,
  sessions.csrf_secret
 FROM
  sessions
 WHERE
  sessions.token = ${token} AND
  sessions.expiry_timestamp > now()
 `;

  await deleteExpiredSessions();

  return sessionId && camelcaseKeys(sessionId);
}

export type Admin = {
  admin_id: number;
};
export async function getAdmin(userId: number) {
  if (!userId) return undefined;

  const [admin] = await sql<[Admin]>`
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

//  profile:

// type SessionWithCSRF = Session & { csrfSecret: string };

// if ("errors" in props) {
//   return <h1>no animals for you</h1>;
// }

// const sessionToke = await getValidSessionByToken(sessionToken)

// const sessionToken =

// if(!sessionId) {
//   return {
//     props: {errors: 'not authenticated'}
//   }
// }

// const CSRFtoken = await createCsrfToken(session.csrfSecret)
// // return {
//   props: {CSRFToken: CSRFtoken}
// }

// for checking the admin

//programmes:

export type Programme = {
  programmesId: number;
  filmTitle: string;
  filmId: number;
  cinemaName: string;
  time: string;
  date: string;
  englishfriendly: boolean;
};

export async function getProgrammes() {
  const programmes = await sql<Programme[]>`
    SELECT
    programmes.id AS programme_id,
    film_title,
    film_id,
    cinema_name,
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

export type TourOrganizers = {
  programme_id: number;
  username: string;
};

export async function getToursForProgrammes() {
  const tours = await sql<TourOrganizers[]>`
    SELECT
    programme_id,
    username
     FROM
    tours,
    users
      WHERE
    users.id = host_id
  `;
  return tours && camelcaseKeys(tours);
}

// programmes
// host_id = users.id AND

export async function getProgrammeByFilm(filmTitle: string) {
  if (!filmTitle) return undefined;

  const films = await sql<Programme[]>`
    SELECT
    programme_id,
    film_title,
    cinema_name,
    date,
    time,
    englishfriendly,
    username
     FROM
    films,
    cinemas,
    programmes,
    tours,
    users
      WHERE
    cinema_id = cinemas.id AND
    film_id = films.id AND
    film_title = ${filmTitle} AND
    host_id = users.id AND
    programme_id = programmes.id
  `;
  return films && camelcaseKeys(films);
}

export async function getProgrammeByDate(date: Date) {
  if (!date) return undefined;

  const films = await sql<Programme[]>`
    SELECT
    programme_id,
    film_title,
    cinema_name,
    date,
    time,
    englishfriendly,
    username
     FROM
    films,
    cinemas,
    programmes,
    tours,
    users
      WHERE
    cinema_id = cinemas.id AND
    film_id = films.id AND
    date = ${date} AND
    host_id = users.id AND
    programme_id = programmes.id
  `;
  return films && camelcaseKeys(films);
}

export async function getProgrammeByEnglish(englishfriendly: boolean) {
  const films = await sql<Programme[]>`
    SELECT
    programme_id,
    film_title,
    cinema_name,
    date,
    time,
    englishfriendly,
    username
     FROM
    films,
    cinemas,
    programmes,
    tours,
    users
      WHERE
    cinema_id = cinemas.id AND
    film_id = films.id AND
    englishfriendly = ${englishfriendly} AND
    host_id = users.id AND
    programme_id = programmes.id
  `;
  return films && camelcaseKeys(films);
}

export async function getProgrammeByCinema(cinemaName: string) {
  const films = await sql<Programme[]>`
SELECT
programme_id,
film_title,
cinema_name,
date,
time,
englishfriendly,
username
 FROM
films,
cinemas,
programmes,
tours,
users
  WHERE
cinema_id = cinemas.id AND
film_id = films.id AND
cinema_name = ${cinemaName} AND
host_id = users.id AND
programme_id = programmes.id
`;
  return films && camelcaseKeys(films);
}

//those are for api
export async function getProgrammeById(id: number | undefined) {
  if (!id) return undefined;
  const [programme] = await sql<[Programme | undefined]>`
    SELECT
      *
    FROM
      programmes
    WHERE
      id = ${id}
  `;
  return programme && camelcaseKeys(programme);
}

export async function createProgramme(
  filmId: number,
  cinemaId: number,
  date: Date,
  time: Date,
  englishfriendly: boolean,
) {
  const [programme] = await sql<[Programme]>`
    INSERT INTO programmes
      (film_id, cinema_id, date, time, englishfriendly)
    VALUES
      (${filmId}, ${cinemaId}, ${date}, ${time}, ${englishfriendly})
    RETURNING
      film_id, cinema_id, date, time, englishfriendly
    `;

  return camelcaseKeys(programme);
}

export async function updateProgrammeById(
  programmeId: number,
  filmId: number,
  cinemaId: number,
  date: Date,
  time: Date,
  englishfriendly: boolean,
) {
  const [programme] = await sql`
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
  return camelcaseKeys(programme);
}

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

// cinemas:

export type Cinemas = {
  id: number;
  cinemaName: string;
  address: string;
  longitude: number;
  lattitude: number;
  cinema_description: string;
  contact: string;
};

export async function getCinemas() {
  const cinemas = await sql`
  SELECT
    *
  FROM
    cinemas
  `;

  return cinemas && camelcaseKeys(cinemas);
}

// films

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

export async function getFilms() {
  const films = await sql<Film[]>`
    SELECT
      *
    FROM
      films
  `;
  return films && camelcaseKeys(films);
}

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
  const [film] = await sql`
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
  return camelcaseKeys(film);
}

export async function deleteFilmById(id: number) {
  const [film] = await sql`
    DELETE FROM
      films
    WHERE
      id = ${id}
    RETURNING *
  `;

  return camelcaseKeys(film);
}

// Tours

export type Tour = {
  tour_id: number;
  username: string;
  date: string;
  time: string;
  body: string;
  cinemaName: string;
  filmTitle: string;
  trailer: string;
  genre: string;
};

export async function getTours() {
  const tours = await sql<Tour[]>`
    SELECT
    username,
    tour_id,
  date,
  time,
  cinema_name,
  film_title,
  trailer,
  genre,
  cinema_name
    FROM
      users,
      tours_attendees,
      programmes,
      films,
      tours,
      cinemas
  WHERE
    users.id = host_id AND
    programme_id = programmes.id AND
    tour_id = tours.id AND
    film_id = films.id AND
    cinemas.id = cinema_id
    `;

  return tours && camelcaseKeys(tours);
}

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

// Cinetourists

export type Username = {
  id: number;
  username: string;
};

export async function getCinetourists() {
  const users = await sql<Username[]>`
    SELECT
     id, username
    FROM
      users
    `;

  return users && camelcaseKeys(users);
}

export async function getCinetouristById(id: number | undefined) {
  if (!id) return undefined;
  const [film] = await sql<[Username | undefined]>`
      SELECT
        *
      FROM
        films
      WHERE
        id = ${id}
    `;
  return film && camelcaseKeys(film);
}

// subscribers

export type Subscriber = {
  subscriberId: number;
};
export async function createSubscriber(userId: number) {
  const [subscriber] = await sql<[Subscriber]>`
  INSERT INTO subscribers
    (subscriber_id)
  VALUES
    (${userId})
  RETURNING
    *
  `;

  return camelcaseKeys(subscriber);
}

export async function getSubscriberByValidSubscription(userId: number) {
  if (!userId) {
    return undefined;
  }

  const [subscriber] = await sql<[Subscriber | undefined]>`

  SELECT
    subscriber_id
  FROM
    subscribers
  WHERE
   subscriber_id = ${userId} AND
   expiry_timestamp > now()
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
