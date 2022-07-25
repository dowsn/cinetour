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

  if (!filmId) {
    return res.status(400).json({ errors: [{ message: 'Id is not valid' }] });
  }

  // if the method GET
  if (req.method === 'GET') {
    const film = await getFilmById(filmId);

    if (!film) {
      return res.status(400).json({ errors: [{ message: 'Id is not valid' }] });
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
      synopsis.length > 200 ||
      !req.body.year ||
      !req.body.country ||
      country.length > 2 ||
      !req.body.trailer
    ) {
      return res
        .status(400)
        .json({ errors: [{ message: 'Please, provide all required data' }] });
    }

    const films: any = await getFilms();

    if (!films) {
      return res
        .status(400)
        .json({ errors: [{ message: 'Item is missing.' }] });
    }

    if (req.body.topFilm && films.some((e: any) => e.topFilm === true)) {
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
      return res.status(400).json({ errors: [{ message: 'Id is not valid' }] });
    }

    // check for csrf token
    if (!req.body.csrfToken) {
      return res
        .status(400)
        .json({ errors: [{ message: 'No csrf token found' }] });
    }

    // 1. we get the sessionToken from req.body
    const csrfToken = req.body.csrfToken;

    // 2. we get the session for this session token
    const sessionToken = req.cookies.sessionToken;

    // 3. we get the session for this session Token
    const session = await getSessionByValidToken(sessionToken);

    if (!session) {
      return res.status(403).json({ errors: [{ message: 'Unauthorize' }] });
    }

    // 4. validates the csrf token against the seed we have in the database
    if (!(await verifyCsrfToken(session.csrfSecret, csrfToken))) {
      return res
        .status(403)
        .json({ errors: [{ message: 'csrf is not valid' }] });
    }

    // authenticating admin
    const user = await getUserByValidSessionToken(req.cookies.sessionToken);
    if (!user) {
      return res.status(403).json({ errors: [{ message: 'Unauthorize' }] });
    }

    const admin = await getAdmin(user.id);

    if (!admin) {
      return res.status(403).json({ errors: [{ message: 'Unauthorize' }] });
    }

    return res.status(200).json(updatedFilm);
  }

  // if the method delete
  if (req.method === 'DELETE') {
    const deletedFilm = await deleteFilmById(filmId);

    if (!deletedFilm) {
      return res.status(400).json({ errors: [{ message: 'Id is not valid' }] });
    }

    // CSRF authentication
    // check for csrf token
    if (!req.body.csrfToken) {
      return res
        .status(400)
        .json({ errors: [{ message: 'No csrf token found' }] });
    }

    // 1. we get the sessionToken from req.body
    const csrfToken = req.body.csrfToken;

    // 2. we get the session for this session token
    const sessionToken = req.cookies.sessionToken;

    // 3. we get the session for this session Token
    const session = await getSessionByValidToken(sessionToken);

    if (!session) {
      return res.status(403).json({ errors: [{ message: 'Unauthorize' }] });
    }

    // 4. validates the csrf token against the seed we have in the database
    if (!(await verifyCsrfToken(session.csrfSecret, csrfToken))) {
      return res
        .status(403)
        .json({ errors: [{ message: 'csrf is not valid' }] });
    }

    // authenticating admin
    const user = await getUserByValidSessionToken(req.cookies.sessionToken);
    if (!user) {
      return res.status(403).json({ errors: [{ message: 'Unauthorize' }] });
    }

    const admin = await getAdmin(user.id);

    if (!admin) {
      return res.status(403).json({ errors: [{ message: 'Unauthorize' }] });
    }

    return res.status(200).json(deletedFilm);
  }

  return res
    .status(405)
    .json({ errors: [{ message: 'Method is not allowed' }] });
}
