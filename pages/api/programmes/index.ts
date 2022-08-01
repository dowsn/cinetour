import { NextApiRequest, NextApiResponse } from 'next';
import {
  createProgramme,
  getAdmin,
  getCinemaByName,
  getFilmByName,
  getProgrammes,
  getSessionByValidToken,
  getUserByValidSessionToken,
} from '../../../utils/database';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  // if method GET
  if (req.method === 'GET') {
    // get programmes from my database
    const programmes = await getProgrammes();

    return res.status(200).json(programmes);
  }

  // if method POST
  if (req.method === 'POST') {
    if (
      !req.body.filmTitle ||
      !req.body.cinemaName ||
      !req.body.date ||
      !req.body.time
    ) {
      return res
        .status(400)
        .json({ errors: [{ message: 'Please, provide all required data.' }] });
    }

    // authentication by session token
    const sessionToken = req.cookies.sessionToken;

    const session = await getSessionByValidToken(sessionToken);

    if (!session) {
      return res.status(403).json({ errors: [{ message: 'Unauthorized.' }] });
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

    // the action
    const film = await getFilmByName(req.body.filmTitle);
    const cinema = await getCinemaByName(req.body.cinemaName);

    if (film && cinema) {
      const newProgramme = await createProgramme(
        film.id,
        cinema.id,
        req.body.date,
        req.body.time,
        req.body.englishfriendly,
      );

      if (newProgramme) {
        return res.status(200).json(newProgramme);
      }
    }

    return res
      .status(400)
      .json({ errors: [{ message: 'Please, provide all required data.' }] });
  }

  return res.status(405).json({ errors: [{ message: 'Method not allowed.' }] });
}
