import { NextApiRequest, NextApiResponse } from 'next';
import { joinTourbyUserId, unjoinTourbyUserId } from '../../../utils/database';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const tourId = Number(req.query.tourId);

  if (!tourId) {
    return res.status(400).json({ error: 'Valid Id is required' });
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
      return res.status(400).json({ error: 'Id is not valid' });
    }

    return res.status(200).json(tourAttendee);
  }

  // if the method delete
  if (req.method === 'DELETE') {
    const deletedTour = await unjoinTourbyUserId(tourId);

    if (!deletedTour) {
      return res.status(400).json({ error: 'Id is not valid' });
    }

    return res.status(200).json(deletedTour);
  }

  res.status(405).json({ error: 'Method not allowed' });
}
