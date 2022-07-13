import { NextApiRequest, NextApiResponse } from 'next';
import { createTour, getTours } from '../../../utils/database';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  // if method GET
  if (req.method === 'GET') {
    // get the films from my database
    const tours = await getTours();

    if (tours) {
      return res.status(200).json(tours);
    }

    return res.status(400).json({ error: 'Item/s does not exist.' });
  }

  // if method POST
  if (req.method === 'POST') {
    if (!req.body.body || !req.body.programmeId || !req.body.hostId) {
      return res.status(400).json({
        error: [{ message: 'Please, provide all required information' }],
      });
    }

    const newTour = await createTour(
      req.body.programmeId,
      req.body.hostId,
      req.body.body,
    );

    return res.status(200).json(newTour);
  }

  // If we are using any method that is not allowed
  res.status(405).json({
    error: 'Method not allowed',
  });
}
