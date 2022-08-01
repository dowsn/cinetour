import { NextApiRequest, NextApiResponse } from 'next';
import {
  createTour,
  getSessionByValidToken,
  getTours,
  getUserByValidSessionToken,
} from '../../../utils/database';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  // if method GET
  if (req.method === 'GET') {
    // get all tours from database
    const tours = await getTours();

    return res.status(200).json(tours);
  }

  // authentication by concrete user by session token for POST method
  const sessionToken = req.cookies.sessionToken;

  const session = await getSessionByValidToken(sessionToken);

  if (!session) {
    return res.status(403).json({ errors: [{ message: 'Unauthorized' }] });
  }

  const user = await getUserByValidSessionToken(sessionToken);
  if (user?.id !== Number(req.body.hostId)) {
    return res.status(403).json({ errors: [{ message: 'Unauthorized' }] });
  }

  // if method POST
  if (req.method === 'POST') {
    // adding description to current tour
    const body = req.body.body;

    if (
      !req.body.body ||
      body.length > 100 ||
      !req.body.programmeId ||
      !req.body.hostId
    ) {
      return res.status(400).json({
        error: [
          {
            message:
              'Please, provide all required information. Check also the length of description.',
          },
        ],
      });
    }

    const newTour = await createTour(
      req.body.programmeId,
      req.body.hostId,
      req.body.body,
    );

    return res.status(200).json(newTour);
  }

  return res.status(405).json({ errors: [{ message: 'Method not allowed.' }] });
}
