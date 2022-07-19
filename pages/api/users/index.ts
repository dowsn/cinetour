import { NextApiRequest, NextApiResponse } from 'next';
import { getCinetourists } from '../../../utils/database';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  // if method Get
  if (req.method === 'GET') {
    // to get user from my database
    const users = await getCinetourists();

    return res.status(200).json(users);
  }

  return res.status(405).json({ errors: [{ message: 'Method not allowed' }] });
}
