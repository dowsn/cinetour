import { NextApiRequest, NextApiResponse } from 'next';
import { verifyCsrfToken } from '../../../utils/auth';
import {
  createFilm,
  getAdmin,
  getFilms,
  getSessionByValidToken,
  getUserByValidSessionToken,
} from '../../../utils/database';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  // if method GET
  if (req.method === 'GET') {
    // get the films from my database
    const films = await getFilms();

    return res.status(200).json(films);
  }

  const synopsis = req.body.synopsis;
  const country = req.body.country;

  // if method POST
  if (req.method === 'POST') {
    if (
      !req.body.filmTitle ||
      !req.body.genre ||
      !req.body.director ||
      !req.body.synopsis ||
      // checking for max length of synopsis
      synopsis.length > 200 ||
      // country is accepted in two digit format
      country.length > 2 ||
      !req.body.year ||
      !req.body.country ||
      !req.body.trailer
    ) {
      return res.status(400).json({
        errors: [
          {
            message:
              'Please, provide all required data. Check also the length.',
          },
        ],
      });
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

    // action
    const newFilm = await createFilm(
      req.body.filmTitle,
      req.body.genre,
      req.body.director,
      req.body.synopsis,
      req.body.trailer,
      req.body.year,
      req.body.country,
      req.body.topFilm,
    );

    return res.status(200).json(newFilm);
  }

  // If we are using any method that is not allowed
  return res.status(405).json({ errors: [{ message: 'Method not allowed.' }] });
}
