import { NextApiRequest, NextApiResponse } from 'next';
import { getAttendees } from '../../../utils/database';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  // if method GET
  if (req.method === 'GET') {
    // to get attendees from my database
    const attendees = await getAttendees();

    return res.status(200).json(attendees);
  }

  return res.status(405).json({ errors: [{ message: 'Method not allowed' }] });
}
