import { NextApiRequest, NextApiResponse } from 'next';
import { getFriends } from '../../../utils/database';

// get the cookie from the request
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  // getting the user from context

  const user = req.query.userId;

  // const user = await getUserByValidSessionToken(req.cookies.sessionToken);
  // console.log(user);

  if (!user) {
    return res.status(400).json({ errors: [{ message: 'No User' }] });
  }

  const friends = await getFriends(Number(user));

  if (!friends) {
    return res
      .status(400)
      .json({ errors: [{ message: 'No session token passed' }] });
  }
  if (friends) {
    // checking the method
    if (req.method === 'GET') {
      // 3. return the user
      return res.status(200).json(friends);
    }
  }

  // // if method PUT
  // if (req.method === 'PUT') {
  //   if (
  //     !user.id ||
  //     typeof req.body.username !== 'string' ||
  //     typeof req.body.firstName !== 'string' ||
  //     typeof req.body.lastName !== 'string' ||
  //     typeof req.body.email !== 'string' ||
  //     typeof req.body.selfDescription !== 'string' ||
  //     !req.body.username ||
  //     !req.body.firstName ||
  //     !req.body.lastName ||
  //     !req.body.email ||
  //     !req.body.selfDescription
  //   ) {
  //     return res.status(400).json({
  //       errors: [{ message: 'Please, provide all required data' }],
  //     });
  //   }

  //   // get the user datails
  //   const request = req.body;
  //   const username = request.username;
  //   const firstName = request.firstName;
  //   const lastName = request.lastName;
  //   const email = request.email;
  //   const selfDescription = request.selfDescription;

  //   const updatedUser = await updateUser(
  //     user.id,
  //     username,
  //     firstName,
  //     lastName,
  //     email,
  //     selfDescription,
  //   );

  //   res.status(200).json({ user: updatedUser });
  // }

  // // if the method delete
  // if (req.method === 'DELETE') {
  //   const deletedUser = await deleteUserById(user.id);

  //   if (!deletedUser) {
  //     return res
  //       .status(400)
  //       .json({ errors: [{ message: 'Id is not valid' }] });
  //   }

  //   return res.status(200).json({ user: deletedUser });
  // }

  return res
    .status(405)
    .json({ errors: [{ message: 'Method is not allowed' }] });
}
