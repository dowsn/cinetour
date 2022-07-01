import { NextApiRequest, NextApiResponse } from 'next';
import { getUserByValidSessionToken } from '../../utils/database';

// get the cookie from the request
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  // checking the method
  if (req.method === 'GET') {
    // 1. getting the cookie from the request
    const token = req.cookies.sessionToken;

    if (!token) {
      res
        .status(400)
        .json({ errors: [{ message: 'No session token passed' }] });
    }

    // 2. get the user from the token and check if it is in the database
    const user = await getUserByValidSessionToken(token);

    if (!user) {
      res
        .status(400)
        .json({ errors: [{ message: 'Session token not valid' }] });
    }

    // 3. return the user
    res.status(200).json({ user: user });
  } else {
    res.status(405).json({ errors: [{ message: 'method not allowed' }] });
  }
}
