import { NextApiRequest, NextApiResponse } from 'next';
import {
  createTour,
  getSessionByValidToken,
  getTours,
} from '../../../utils/database';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  // if method GET
  if (req.method === 'GET') {
    // get the tours from my database
    const tours = await getTours();

    return res.status(200).json(tours);
  }

  // if method POST
  if (req.method === 'POST') {
    if (!req.body.body || !req.body.programmeId || !req.body.hostId) {
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

    const newTour = await createTour(
      req.body.programmeId,
      req.body.hostId,
      req.body.body,
    );

    return res.status(200).json(newTour);
  }

  // If we are using any method that is not allowed
  res.status(405).json({ errors: [{ message: 'Method not allowed' }] });
}
