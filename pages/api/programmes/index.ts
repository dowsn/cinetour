import { NextApiRequest, NextApiResponse } from 'next';
import {
  createProgramme,
  getCinemaIdByName,
  getFilmIdByName,
  getProgrammes,
} from '../../../utils/database';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  // if method GET
  if (req.method === 'GET') {
    const programmes = await getProgrammes();

    console.log(programmes);

    if (!programmes) {
      return res
        .status(400)
        .json({ errors: [{ message: 'Items are missing' }] });
    }

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
        .json({ errors: [{ message: 'Please, provide all required data' }] });
    }

    const film = await getFilmIdByName(req.body.filmTitle);
    const cinema = await getCinemaIdByName(req.body.cinemaName);

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
      .json({ errors: [{ message: 'Please, provide all required data' }] });
  }

  return res.status(405).json({ errors: [{ message: 'Method not allowed' }] });
}
