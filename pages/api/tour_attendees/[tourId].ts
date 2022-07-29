import { NextApiRequest, NextApiResponse } from 'next';
import {
  getSessionByValidToken,
  getUserByValidSessionToken,
  joinTourbyUserId,
  unjoinTourbyUserId,
} from '../../../utils/database';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const tourId = Number(req.query.tourId);

  if (!tourId) {
    return res.status(400).json({ errors: [{ message: 'Id is not valid' }] });
  }

  // authentication for POST and DELETE methods
  const sessionToken = req.cookies.sessionToken;

  const session = await getSessionByValidToken(sessionToken);

  if (!session) {
    return res.status(403).json({ errors: [{ message: 'Unauthorized' }] });
  }

  const user = await getUserByValidSessionToken(sessionToken);
  if (user?.id !== Number(req.body.userId)) {
    return res.status(403).json({ errors: [{ message: 'Unauthorized' }] });
  }

  // if method POST
  if (req.method === 'POST') {
    if (!req.body.userId) {
      return res.status(400).json({
        error: [{ message: 'Please, provide all required information' }],
      });
    }

    const tourAttendee = await joinTourbyUserId(tourId, req.body.userId);

    if (!tourAttendee) {
      return res.status(400).json({ errors: [{ message: 'Id is not valid' }] });
    }

    return res.status(200).json(tourAttendee);
  }

  // if the method delete
  if (req.method === 'DELETE') {

    if (!req.body.userId) {
      return res.status(400).json({
        error: [{ message: 'Please, provide all required information' }],
      });
    }

    const deletedTour = await unjoinTourbyUserId(tourId, req.body.userId);

    if (!deletedTour) {
      return res.status(400).json({ errors: [{ message: 'Id is not valid' }] });
    }

    return res.status(200).json(deletedTour);
  }

  return res.status(405).json({ errors: [{ message: 'Method not allowed' }] });
}
