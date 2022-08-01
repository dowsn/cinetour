import { NextApiRequest, NextApiResponse } from 'next';
import {
  deleteTourById,
  getSessionByValidToken,
  getTourByProgrammeId,
  getTourByTourId,
  getUserByValidSessionToken,
  updateTourById,
} from '../../../utils/database';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const tourId = Number(req.query.tourId);
  const programmeId = Number(req.query.tourId);

  if (!tourId || !programmeId) {
    return res.status(400).json({ errors: [{ message: 'Id is not valid.' }] });
  }

  // if method GET
  if (req.method === 'GET') {
    // get a tour for this programme from database
    const tour = await getTourByProgrammeId(programmeId);
    if (tour) {
      return res.status(200).json(tour);
    }

    return res
      .status(400)
      .json({ errors: [{ message: 'Item/s do not exist' }] });
  }

  // authentication by concrete user by session token for POST and DELETE methods
  const sessionToken = req.cookies.sessionToken;

  const session = await getSessionByValidToken(sessionToken);

  if (!session) {
    return res.status(403).json({ errors: [{ message: 'Unauthorized' }] });
  }

  const tour = await getTourByTourId(tourId);
  const user = await getUserByValidSessionToken(sessionToken);

  // checkin if the current user is not already a host of this tour
  if (user?.id !== tour.hostId) {
    return res
      .status(403)
      .json({ errors: [{ message: 'You are already hosting this event.' }] });
  }

  // if method PUT
  if (req.method === 'PUT') {
    const body = req.body.body;

    // checking if description is present and not too long
    if (!req.body.body || body.length > 100) {
      return res.status(400).json({
        error: [
          {
            message:
              'Please, provide all required information. Check also the length of your description.',
          },
        ],
      });
    }

    // updating the description of current tour
    const updatedTour = await updateTourById(tourId, req.body.body);

    if (!updatedTour) {
      return res
        .status(400)
        .json({ errors: [{ message: 'Something went wrong.' }] });
    }

    return res.status(200).json(updatedTour);
  }

  // if the method delete
  if (req.method === 'DELETE') {
    // deleting current tour
    const deletedTour = await deleteTourById(tourId);

    if (!deletedTour) {
      return res
        .status(400)
        .json({ errors: [{ message: 'Something went wrong.' }] });
    }

    return res.status(200).json(deletedTour);
  }

  return res.status(405).json({ errors: [{ message: 'Method not allowed.' }] });
}
