import crypto from 'node:crypto';
import bcrypt from 'bcrypt';
import { NextApiRequest, NextApiResponse } from 'next';
import { createCSRFSecret } from '../../utils/auth';
import { createSerializedRegisterSessionTokenCookie } from '../../utils/cookies';
import {
  createSession,
  getUserWithPasswordHashByUsername,
} from '../../utils/database';

export type LoginResponseBody =
  | {
      errors: {
        message: string;
      }[];
    }
  | { user: { id: number; username: string } };

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<LoginResponseBody>,
) {
  if (req.method === 'POST') {
    if (
      typeof req.body.username !== 'string' ||
      typeof req.body.password !== 'string' ||
      !req.body.username ||
      !req.body.password
    ) {
      return res
        .status(400)
        .json({ errors: [{ message: 'Username or password not provided' }] });
    }

    // Make sure you don't expose this variable, thi takes the user from our database based on username
    const userWithPasswordHashUseWithCaution =
      await getUserWithPasswordHashByUsername(req.body.username);

    // if the user isn't found throw an error
    if (!userWithPasswordHashUseWithCaution) {
      return res
        .status(401)
        .json({ errors: [{ message: "Username or password doesn't match" }] });
    }

    // compare password with hash
    const passwordMatches = await bcrypt.compare(
      req.body.password,
      userWithPasswordHashUseWithCaution.passwordHash,
    );

    // for case the password is wrong
    if (!passwordMatches) {
      return res
        .status(401)
        .json({ errors: [{ message: 'Username or password does not match' }] });
    }
    const userId = userWithPasswordHashUseWithCaution.id;
    const username = userWithPasswordHashUseWithCaution.username;

    // creating a token
    const token = crypto.randomBytes(80).toString('base64');

    // csrf
    // 1. create a secret
    const csrfSecret = createCSRFSecret();
    // 2.
    // then creating session with user id, secret and the token
    const session = await createSession(token, userId, csrfSecret);

    // creating serialized cookie that will be passed to header
    const serializedCookie = await createSerializedRegisterSessionTokenCookie(
      session.token,
    );
    console.log(serializedCookie);

    return res
      .status(200)
      .setHeader('set-Cookie', serializedCookie)
      .json({ user: { id: userId, username: username } });
  } else {
    return res
      .status(405)
      .json({ errors: [{ message: 'Method not allowed' }] });
  }
}
