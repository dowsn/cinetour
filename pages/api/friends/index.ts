import { NextApiRequest, NextApiResponse } from 'next';
import { getFriends } from '../../../utils/database';

// get the cookie from the request
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  // getting current user from query
  const user = req.query.userId;

  if (!user) {
    return res.status(400).json({ errors: [{ message: 'No user found.' }] });
  }

  const friends = await getFriends(Number(user));

  if (!friends) {
    return res
      .status(400)
      .json({ errors: [{ message: 'No session token passed.' }] });
  }

  // if method GET
  if (req.method === 'GET') {
    // 3. return the user
    return res.status(200).json(friends);
  }

  return res
    .status(405)
    .json({ errors: [{ message: 'Method is not allowed.' }] });
}
