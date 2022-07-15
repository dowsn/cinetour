import { NextApiRequest, NextApiResponse } from 'next';
import { getCinetourists } from '../../../utils/database';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  // if method Get
  if (req.method === 'GET') {
    const users = await getCinetourists();

    if (!users) {
      return res.status(400).json({ errors: [{ message: 'Item missing' }] });
    }

    return res.status(200).json(users);
  }

  return res.status(405).json({ errors: [{ message: 'Method not allowed' }] });
}
