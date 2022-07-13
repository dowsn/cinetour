import {
  GetServerSidePropsContext,
  NextApiRequest,
  NextApiResponse,
} from 'next';
import {
  createFriend,
  deleteFriendById,
  deleteUserById,
  getFriends,
  getProfile,
  getUserByValidSessionToken,
  updateUser,
} from '../../../utils/database';

// get the cookie from the request
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  // getting the user from query

  const userId = Number(req.query.userId);

  if (!userId || typeof userId !== 'number') {
    return res.status(400).json({ errors: [{ message: 'No User' }] });
  }

  // checking the method
  if (req.method === 'GET') {
    const friends = await getFriends(userId);

    if (!friends) {
      res
        .status(400)
        .json({ errors: [{ message: 'No session token passed' }] });
    }

    res.status(200).json(friends);
  }

  //  if method POST
  if (req.method === 'DELETE') {
    if (typeof req.body.friendId !== 'number' || !req.body.friendId) {
      return res.status(400).json({
        errors: [{ message: 'Please, provide all required data' }],
      });
    }

    const deletedFriend = await deleteFriendById(userId, req.body.friendId);

    if (deletedFriend) {
      res.status(200).json(deletedFriend);
    }
  }

  res.status(405).json({ errors: [{ message: 'Method is not allowed' }] });
}
