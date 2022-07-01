import { NextApiRequest, NextApiResponse } from 'next';
import {
  deleteFilmById,
  getFilmById,
  updateFilmById,
} from '../../../utils/database';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const filmId = Number(req.query.filmId);

  if (!filmId) {
    return res.status(400).json({ error: 'filmId must be a valid id' });
  }

  // if the method GET
  if (req.method === 'GET') {
    const film = await getFilmById(filmId);

    if (!film) {
      return res.status(400).json({ error: 'filmId must be a valid id' });
    }

    return res.status(200).json(film);
  }

  // if method PUT
  if (req.method === 'PUT') {
    if (
      !filmId ||
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
        .json({ error: 'Please provide all required data' });
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
      return res.status(400).json({ error: 'Id is not valid' });
    }

    return res.status(200).json(updatedFilm);
  }

  // if the method delete
  if (req.method === 'DELETE') {
    const deletedFilm = await deleteFilmById(filmId);

    if (!deletedFilm) {
      return res.status(400).json({ error: 'Id is not valid' });
    }

    return res.status(200).json(deletedFilm);
  }

  res.status(405).json({ error: 'Method not allowed' });
}
