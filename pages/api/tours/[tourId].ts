import { NextApiRequest, NextApiResponse } from 'next';
import {
  deleteTourById,
  getSessionByValidToken,
  getTourByProgrammeId,
  updateTourById,
} from '../../../utils/database';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const tourId = Number(req.query.tourId);
  const programmeId = Number(req.query.tourId);

  if (!tourId || !programmeId) {
    return res.status(400).json({ errors: [{ message: 'Id is not valid' }] });
  }

  // if method GET
  if (req.method === 'GET') {
    // get the films from my database
    const tour = await getTourByProgrammeId(programmeId);
    if (tour) {
      return res.status(200).json(tour);
    }

    return res
      .status(400)
      .json({ errors: [{ message: 'Item/s do not exist' }] });
  }

  // if method PUT
  if (req.method === 'PUT') {
    if (!req.body.body) {
      return res.status(400).json({
        error: [{ message: 'Please, provide all required information' }],
      });
    }

    // authentication
    const sessionToken = req.cookies.sessionToken;

    const session = await getSessionByValidToken(sessionToken);

    if (!session) {
      return res.status(403).json({ errors: [{ message: 'Unauthorize' }] });
    }

    // the action

    const updatedTour = await updateTourById(tourId, req.body.body);

    if (!updatedTour) {
      return res.status(400).json({ errors: [{ message: 'Id is not valid' }] });
    }

    return res.status(200).json(updatedTour);
  }

  // if the method delete
  if (req.method === 'DELETE') {
    // authentication
    const sessionToken = req.cookies.sessionToken;

    const session = await getSessionByValidToken(sessionToken);

    if (!session) {
      return res.status(403).json({ errors: [{ message: 'Unauthorize' }] });
    }

    // the action

    const deletedTour = await deleteTourById(tourId);

    if (!deletedTour) {
      return res.status(400).json({ errors: [{ message: 'Id is not valid' }] });
    }

    return res.status(200).json(deletedTour);
  }

  return res.status(405).json({ errors: [{ message: 'Method not allowed' }] });
}
