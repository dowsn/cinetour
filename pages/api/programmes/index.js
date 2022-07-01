import { NextApiRequest, NextApiResponse } from 'next';
import {
  createProgramme,
  getProgrammeByDate,
  getProgrammeByFilm,
  getProgrammes,
  Programme,
} from '../../../utils/database';
import { getReducedProgramme } from '../../../utils/datastructures';

export default async function handler(req, res) {
  // if method Get
  if (req.method === 'GET') {
    // if (req.body.filmTitle) {
    //   const programmes = await getProgrammeByFilm(req.body.filmTitle);
    // }

    const programmes = await getProgrammes();

    // const reducedprogrammes = programmes.map((programme) =>
    //   getReducedProgramme(test),
    // );

    return res.status(200).json(programmes);
  }

  // if method POST
  if (req.method === 'POST') {
    if (
      !req.body.filmId ||
      !req.body.cinemaId ||
      !req.body.date ||
      !req.body.time
    ) {
      return res
        .status(400)
        .json({ error: 'Please provide all required data' });
    }

    const newProgramme = await createProgramme(
      req.body.filmId,
      req.body.cinemaId,
      req.body.date,
      req.body.time,
      req.body.englishfriendly,
    );

    return res.status(405).json('Method not allowed');
  }
}
