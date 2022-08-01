import { NextApiRequest, NextApiResponse } from 'next';
import { verifyCsrfToken } from '../../../utils/auth';
import {
  deleteFilmById,
  getAdmin,
  getFilmById,
  getFilms,
  getSessionByValidToken,
  getUserByValidSessionToken,
  updateFilmById,
} from '../../../utils/database';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const filmId = Number(req.query.filmId);

  // if method GET
  if (req.method === 'GET') {
    const film = await getFilmById(filmId);

    if (!film) {
      return res
        .status(400)
        .json({ errors: [{ message: 'Id is not valid.' }] });
    }

    return res.status(200).json(film);
  }

  const synopsis = req.body.synopsis;
  const country = req.body.country;

  // if method PUT
  if (req.method === 'PUT') {
    if (
      !filmId ||
      !req.body.filmTitle ||
      !req.body.genre ||
      !req.body.director ||
      !req.body.synopsis ||
      // checking for max length of synopsis
      synopsis.length > 300 ||
      !req.body.year ||
      !req.body.country ||
      // country is accepted in two digit format
      country.length > 2 ||
      !req.body.trailer
    ) {
      return res.status(400).json({
        errors: [
          {
            message: 'Please, provide all required data. Check also a length.',
          },
        ],
      });
    }

    const films: any = await getFilms();

    if (!films) {
      return res
        .status(400)
        .json({ errors: [{ message: 'There are no films.' }] });
    }

    const film = await getFilmById(filmId);

    if (
      // in case admin wants to select the current film as a top film
      req.body.topFilm &&
      // checking in the database of films if there exist already one top film
      films.some((e: any) => e.topFilm === true) &&
      // and that current film is not the top film
      film?.topFilm === false
    ) {
      return res.status(400).json({
        errors: [
          {
            message:
              'One film is already selected as top film. Please deselect this film first.',
          },
        ],
      });
    }

    const updatedFilm = await updateFilmById(
      filmId,
      req.body.filmTitle,
      req.body.genre,
      req.body.director,
      req.body.synopsis,
      req.body.trailer,
      req.body.year,
      req.body.topFilm,
      req.body.country,
    );

    if (!updatedFilm) {
      return res
        .status(400)
        .json({ errors: [{ message: 'Something went wrong.' }] });
    }

    // check for csrf token
    if (!req.body.csrfToken) {
      return res
        .status(400)
        .json({ errors: [{ message: 'No Csrf token found.' }] });
    }

    // 1. we get the sessionToken from req.body
    const csrfToken = req.body.csrfToken;

    // 2. we get the session for this session token
    const sessionToken = req.cookies.sessionToken;

    // 3. we get the session for this session Token
    const session = await getSessionByValidToken(sessionToken);

    if (!session) {
      return res.status(403).json({ errors: [{ message: 'Unauthorized.' }] });
    }

    // 4. validates the csrf token against the seed we have in the database
    if (!(await verifyCsrfToken(session.csrfSecret, csrfToken))) {
      return res
        .status(403)
        .json({ errors: [{ message: 'Csrf is not valid.' }] });
    }

    // authenticating admin
    const user = await getUserByValidSessionToken(req.cookies.sessionToken);
    if (!user) {
      return res.status(403).json({ errors: [{ message: 'Unauthorized.' }] });
    }

    const admin = await getAdmin(user.id);

    if (!admin) {
      return res.status(403).json({ errors: [{ message: 'Unauthorized.' }] });
    }

    return res.status(200).json(updatedFilm);
  }

  // if method DELETE
  if (req.method === 'DELETE') {
    const deletedFilm = await deleteFilmById(filmId);

    if (!deletedFilm) {
      return res
        .status(400)
        .json({ errors: [{ message: 'Id is not valid.' }] });
    }

    // check for csrf token
    if (!req.body.csrfToken) {
      return res
        .status(400)
        .json({ errors: [{ message: 'No Csrf token found.' }] });
    }

    // 1. we get the sessionToken from req.body
    const csrfToken = req.body.csrfToken;

    // 2. we get the session for this session token
    const sessionToken = req.cookies.sessionToken;

    // 3. we get the session for this session Token
    const session = await getSessionByValidToken(sessionToken);

    if (!session) {
      return res.status(403).json({ errors: [{ message: 'Unauthorized.' }] });
    }

    // 4. validates the csrf token against the seed we have in the database
    if (!(await verifyCsrfToken(session.csrfSecret, csrfToken))) {
      return res
        .status(403)
        .json({ errors: [{ message: 'Csrf is not valid.' }] });
    }

    // authenticating admin
    const user = await getUserByValidSessionToken(req.cookies.sessionToken);
    if (!user) {
      return res.status(403).json({ errors: [{ message: 'Unauthorized.' }] });
    }

    const admin = await getAdmin(user.id);

    if (!admin) {
      return res.status(403).json({ errors: [{ message: 'Unauthorized.' }] });
    }

    return res.status(200).json(deletedFilm);
  }

  return res
    .status(405)
    .json({ errors: [{ message: 'Method is not allowed.' }] });
}
