import { NextApiRequest, NextApiResponse } from 'next';
import {
  createFriend,
  deleteFriendById,
  getFriends,
  getSessionByValidToken,
  getUserByValidSessionToken,
} from '../../../utils/database';

// get the cookie from the request
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  // getting current user from query
  const userId = Number(req.query.userId);
  if (!userId || typeof userId !== 'number') {
    return res.status(400).json({ errors: [{ message: 'No User selected.' }] });
  }

  // if method GET
  if (req.method === 'GET') {
    const friends = await getFriends(userId);

    if (!friends) {
      return res
        .status(400)
        .json({ errors: [{ message: 'You have no friends.' }] });
    }

    return res.status(200).json(friends);
  }

  // authentication of concrete user for POST and DELETE methods
  const sessionToken = req.cookies.sessionToken;

  const session = await getSessionByValidToken(sessionToken);

  if (!session) {
    return res.status(403).json({ errors: [{ message: 'Unauthorized.' }] });
  }

  const user = await getUserByValidSessionToken(sessionToken);
  if (user?.id !== Number(req.query.userId)) {
    return res.status(403).json({ errors: [{ message: 'Unauthorized.' }] });
  }

  //  if method POST
  if (req.method === 'POST') {
    if (typeof req.body.friendId !== 'number' || !req.body.friendId) {
      return res
        .status(400)
        .json({ errors: [{ message: 'No friend available.' }] });
    }

    const friendship = await createFriend(userId, req.body.friendId);
    if (!friendship) {
      return res
        .status(400)
        .json({ errors: [{ message: 'Something went wrong.' }] });
    }

    return res.status(200).json(friendship);
  }

  // if method DELETE
  if (req.method === 'DELETE') {
    if (typeof req.body.friendId !== 'number' || !req.body.friendId) {
      return res.status(400).json({
        errors: [{ message: 'No friend to delete.' }],
      });
    }

    const deletedFriend = await deleteFriendById(userId, req.body.friendId);

    if (deletedFriend) {
      return res.status(200).json(deletedFriend);
    }
  }

  return res
    .status(405)
    .json({ errors: [{ message: 'Method is not allowed.' }] });
}
