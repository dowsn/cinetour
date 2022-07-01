import { NextApiRequest, NextApiResponse } from 'next';
import {
  createProgramme,
  getCinetourists,
  getProgrammeByDate,
  getProgrammeByFilm,
  getProgrammes,
  Programme,
} from '../../../utils/database';
import { getReducedProgramme } from '../../../utils/datastructures';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  // if method Get
  if (req.method === 'GET') {
    const users = await getCinetourists();

    return res.status(200).json(users);
  }

  return res.status(405).json('Method not allowed');
}
