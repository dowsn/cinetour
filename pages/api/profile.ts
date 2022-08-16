import crypto from 'node:crypto';
import bcrypt from 'bcrypt';
import { NextApiRequest, NextApiResponse } from 'next';
import { createCSRFSecret } from '../../utils/auth';
import { createSerializedRegisterSessionTokenCookie } from '../../utils/cookies';
import {
  createSession,
  deleteUserById,
  getProfile,
  getSessionByValidToken,
  getUserByUsername,
  getUserByValidSessionToken,
  getUserWithPasswordHashByUsername,
  updateUser,
  updateUserPasswordHash,
} from '../../utils/database';

// get the cookie from the request
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  // getting the user from context
  const sessionToken = req.cookies.sessionToken;

  const user = await getUserByValidSessionToken(sessionToken);

  if (!user) {
    return res
      .status(400)
      .json({ errors: [{ message: 'No session token passed' }] });
  }

  const profile = await getProfile(user.id);

  // checking the method
  if (req.method === 'GET') {
    // 3. return the user
    return res.status(200).json({ user: user, profile: profile });
  }

  // if method PUT
  if (req.method === 'PUT') {
    // checking also for length of description
    const selfDescription = req.body.selfDescription;
    if (
      req.body.currentPassword &&
      req.body.newPassword &&
      typeof req.body.newPassword === 'string' &&
      typeof req.body.currentPassword === 'string'
    ) {
      // check hash for current password

      // Make sure you don't expose this variable, thi takes the user from our database based on username
      const userWithPasswordHashUseWithCaution =
        await getUserWithPasswordHashByUsername(user.username);

      // if the user isn't found throw an error
      if (!userWithPasswordHashUseWithCaution) {
        return res.status(401).json({
          errors: [{ message: "Username or password doesn't match" }],
        });
      }

      // compare password with hash
      const passwordMatches = await bcrypt.compare(
        req.body.currentPassword,
        userWithPasswordHashUseWithCaution.passwordHash,
      );

      // for case the password is wrong
      if (!passwordMatches) {
        return res.status(401).json({
          errors: [{ message: 'Username or password does not match' }],
        });
      }

      // set a new password

      // 1. hash the password

      const passwordHash = await bcrypt.hash(req.body.newPassword, 12);

      // 2. update passwordhash for the user
      await updateUserPasswordHash(user.id, passwordHash);

      // creating a token
      const token = crypto.randomBytes(80).toString('base64');

      // csrf
      // 1. create a secret
      const csrfSecret = createCSRFSecret();

      // then creating a new session with user id, secret and the token
      const newSession = await createSession(token, user.id, csrfSecret);

      // creating serialized cookie that will be passed to header, tells the browser to create a new cookie for us
      const serializedCookie = await createSerializedRegisterSessionTokenCookie(
        newSession.token,
      );

      return res
        .status(200)
        .setHeader('set-Cookie', serializedCookie)
        .json({ user: { id: user.id, username: user.username } });
    } else if (
      !user.id ||
      typeof req.body.username !== 'string' ||
      typeof req.body.firstName !== 'string' ||
      typeof req.body.lastName !== 'string' ||
      typeof req.body.email !== 'string' ||
      typeof selfDescription !== 'string' ||
      selfDescription.length > 100 ||
      !req.body.username ||
      !req.body.firstName ||
      !req.body.lastName ||
      !req.body.email ||
      !selfDescription
    ) {
      return res.status(400).json({
        errors: [
          {
            message: 'Please, provide all required data.',
          },
        ],
      });
    }

    // authentication
    const session = await getSessionByValidToken(sessionToken);

    if (!session) {
      return res.status(403).json({ errors: [{ message: 'Unauthorized' }] });
    }

    // the action

    // get the user datails
    const request = req.body;
    const username = request.username;
    const firstName = request.firstName;
    const lastName = request.lastName;
    const email = request.email;

    const userTaken = await getUserByUsername(username);

    if (userTaken && !(user.id === userTaken.id)) {
      return res
        .status(401)
        .json({ errors: [{ message: 'This username is already taken' }] });
    }

    const updatedUser = await updateUser(
      user.id,
      username,
      firstName,
      lastName,
      email,
      selfDescription,
    );

    return res.status(200).json({ user: updatedUser });
  }

  // if the method delete
  if (req.method === 'DELETE') {
    const deletedUser = await deleteUserById(user.id);

    if (!deletedUser) {
      return res.status(400).json({ errors: [{ message: 'Id is not valid' }] });
    }

    return res.status(200).json({ user: deletedUser });
  }

  return res
    .status(405)
    .json({ errors: [{ message: 'Method is not allowed' }] });
}
