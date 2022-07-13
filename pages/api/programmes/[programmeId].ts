import { NextApiRequest, NextApiResponse } from 'next';
import {
  deleteProgrammeById,
  getProgrammeById,
  updateProgrammeById,
} from '../../../utils/database';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const programmeId = Number(req.query.programmeId);

  if (!programmeId) {
    return res.status(400).json({ errors: [{ message: 'Id is not valid' }] });
  }

  // if the method GET
  if (req.method === 'GET') {
    const programme = await getProgrammeById(programmeId);

    if (!programme) {
      return res.status(400).json({ errors: [{ message: 'Id is not valid' }] });
    }

    return res.status(200).json(programme);
  }

  // if method PUT
  if (req.method === 'PUT') {
    if (
      !programmeId ||
      !req.body.filmTitle ||
      !req.body.cinemaName ||
      !req.body.date ||
      !req.body.time
    ) {
      return res
        .status(400)
        .json({ errors: [{ message: 'Please provide all required data' }] });
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
      return res.status(400).json({ errors: [{ message: 'Id is not valid' }] });
    }

    return res.status(200).json(updatedProgramme);
  }

  // if the method delete
  if (req.method === 'DELETE') {
    const deletedProgramme = await deleteProgrammeById(programmeId);

    if (!programmeId) {
      return res.status(400).json({ errors: [{ message: 'Id is not valid' }] });
    }

    return res.status(200).json(deletedProgramme);
  }

  res.status(405).json({ errors: [{ message: 'Method not allowed' }] });
}
