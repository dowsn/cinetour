import { NextApiRequest, NextApiResponse } from 'next';
import {
  deleteTourById,
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
    return res.status(400).json({ error: 'Valid Id is required' });
  }

  // if method GET
  if (req.method === 'GET') {
    // get the films from my database
    const tour = await getTourByProgrammeId(programmeId);
    if (tour) {
      return res.status(200).json(tour);
    }

    return res.status(400).json({ error: 'Item/s does not exist.' });
  }

  // if method PUT
  if (req.method === 'PUT') {
    if (!req.body.body) {
      return res.status(400).json({
        error: [{ message: 'Please, provide all required information' }],
      });
    }

    const updatedTour = await updateTourById(tourId, req.body.body);

    if (!updatedTour) {
      return res.status(400).json({ error: 'Id is not valid' });
    }

    return res.status(200).json(updatedTour);
  }

  // if the method delete
  if (req.method === 'DELETE') {
    const deletedTour = await deleteTourById(tourId);

    if (!deletedTour) {
      return res.status(400).json({ error: 'Id is not valid' });
    }

    return res.status(200).json(deletedTour);
  }

  res.status(405).json({ error: 'Method not allowed' });
}
