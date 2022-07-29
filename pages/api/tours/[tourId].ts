import { NextApiRequest, NextApiResponse } from 'next';
import {
  deleteTourById,
  getSessionByValidToken,
  getTourByProgrammeId,
  getTourByTourId,
  getUserByValidSessionToken,
  updateTourById,
} from '../../../utils/database';
import Tours from '../../tours';

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

  // authentication for PUT and DELETE methods
  const sessionToken = req.cookies.sessionToken;

  const session = await getSessionByValidToken(sessionToken);

  if (!session) {
    return res.status(403).json({ errors: [{ message: 'Unauthorized' }] });
  }

  const tour = await getTourByTourId(tourId);
  const user = await getUserByValidSessionToken(sessionToken);

  if (user?.id !== tour.hostId) {
    return res.status(403).json({ errors: [{ message: 'Unauthorized' }] });
  }

  // if method PUT
  if (req.method === 'PUT') {
    const body = req.body.body;

    if (!req.body.body || body.length > 100) {
      return res.status(400).json({
        error: [
          {
            message:
              'Please, provide all required information. Check also a length of input.',
          },
        ],
      });
    }

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
