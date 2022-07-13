import { NextApiRequest, NextApiResponse } from 'next';
import { createFilm, getFilms } from '../../../utils/database';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  // if method GET
  if (req.method === 'GET') {
    // get the films from my database
    const films = await getFilms();

    if (!films) {
      return res
        .status(400)
        .json({ errors: [{ message: 'Item is missing.' }] });
    }

    return res.status(200).json(films);
  }

  // if method POST
  if (req.method === 'POST') {
    if (
      !req.body.filmTitle ||
      !req.body.genre ||
      !req.body.director ||
      !req.body.synopsis ||
      !req.body.year ||
      !req.body.country ||
      !req.body.trailer
    ) {
      return res
        .status(400)
        .json({ errors: [{ message: 'Please, provide all required data' }] });
    }

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
  res.status(405).json({ errors: [{ message: 'Method not allowed.' }] });
}
