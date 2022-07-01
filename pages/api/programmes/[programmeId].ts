import { NextApiRequest, NextApiResponse } from 'next';
import {
  deleteProgrammeById,
  getProgrammeByDate,
  getProgrammeByFilm,
  getProgrammeById,
  getProgrammes,
  updateProgrammeById,
} from '../../../utils/database';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const programmeId = Number(req.query.programmeId);

  if (!programmeId) {
    return res
      .status(400)
      .json({ error: 'programmeId must be a valid number' });
  }

  // if the method GET
  if (req.method === 'GET') {
    const programme = await getProgrammeById(programmeId);

    if (!programme) {
      return res.status(400).json({ error: 'filmId must be a valid id' });
    }

    return res.status(200).json(programme);
  }

  // if method PUT
  if (req.method === 'PUT') {
    if (
      !programmeId ||
      !req.body.filmId ||
      !req.body.cinemaId ||
      !req.body.date ||
      !req.body.time
    ) {
      return res
        .status(400)
        .json({ error: 'Please provide all required data' });
    }

    const updatedProgramme = await updateProgrammeById(
      programmeId,
      req.body.filmId,
      req.body.cinemaId,
      req.body.date,
      req.body.time,
      req.body.englishfriendly,
    );

    if (!updatedProgramme) {
      return res.status(400).json({ error: 'Id is not valid' });
    }

    return res.status(200).json(updatedProgramme);
  }

  // if the method delete
  if (req.method === 'DELETE') {
    const deletedProgramme = await deleteProgrammeById(programmeId);

    if (!programmeId) {
      return res.status(400).json({ error: 'Id is not valid' });
    }

    return res.status(200).json(deletedProgramme);
  }

  res.status(405).json({ error: 'Method not allowed' });
}
