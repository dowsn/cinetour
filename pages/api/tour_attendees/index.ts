import { NextApiRequest, NextApiResponse } from 'next';
import { getAttendees } from '../../../utils/database';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  // if method GET
  if (req.method === 'GET') {
    const tours = await getAttendees();

    if (!tours) {
      return res
        .status(400)
        .json({ errors: [{ message: 'Items are missing' }] });
    }

    return res.status(200).json(tours);
  }

  return res.status(405).json({ errors: [{ message: 'Method not allowed' }] });
}
