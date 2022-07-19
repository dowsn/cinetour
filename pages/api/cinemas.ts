import { NextApiRequest, NextApiResponse } from 'next';
import { getCinemas } from '../../utils/database';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  // if method GET
  if (req.method === 'GET') {
    // get the films from my database
    const cinemas = await getCinemas();

    if (!cinemas) {
      return res
        .status(400)
        .json({ errors: [{ message: "Items don't exist" }] });
    }

    return res.status(200).json(cinemas);
  }

  return res.status(405).json({ errors: [{ message: 'Method not allowed' }] });
}
