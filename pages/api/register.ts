import crypto from 'node:crypto';
import bcrypt from 'bcrypt';
import { NextApiRequest, NextApiResponse } from 'next';
// import { createCSRFSecret } from '../../utils/auth';
import { createSerializedRegisterSessionTokenCookie } from '../../utils/cookies';
import {
  createProfile,
  createSession,
  createUser,
  getUserByUsername,
} from '../../utils/database';

export type RegisterResponseBody =
  | {
      errors: {
        message: string;
      }[];
    }
  | { user: { id: number; username: string } };

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<RegisterResponseBody>,
) {
  // check method if post method
  if (req.method === 'POST') {
    // check if the provided data is alright = provided
    if (
      typeof req.body.username !== 'string' ||
      typeof req.body.password !== 'string' ||
      typeof req.body.firstName !== 'string' ||
      typeof req.body.lastName !== 'string' ||
      typeof req.body.email !== 'string' ||
      typeof req.body.street !== 'string' ||
      typeof req.body.streetNumber !== 'string' ||
      typeof req.body.city !== 'string' ||
      typeof req.body.email !== 'string' ||
      typeof req.body.selfDescription !== 'string' ||
      !req.body.username ||
      !req.body.password ||
      !req.body.firstName ||
      !req.body.lastName ||
      !req.body.email ||
      !req.body.street ||
      !req.body.streetNumber ||
      !req.body.city ||
      !req.body.email ||
      !req.body.selfDescription
    ) {
      res.status(400).json({
        errors: [{ message: 'Please, provide all required information' }],
      });
      return;
    }

    // checking if the user already exist
    if (await getUserByUsername(req.body.username)) {
      res
        .status(401)
        .json({ errors: [{ message: 'This username is already taken' }] });
      return;
    }
    // get the user name
    const user = req.body;
    const username = user.username;
    const firstName = user.firstName;
    const lastName = user.lastName;
    const street = user.street;
    const streetNumber = user.streetNumber;
    const city = user.city;
    const email = user.email;
    const selfDescription = user.selfDescription;

    // get the password
    const password = user.password;
    // // hash the password
    const passwordHash = await bcrypt.hash(password, 12);

    // // create a new user

    const newUser = await createUser(username, passwordHash);
    const createdProfile = await createProfile(
      newUser.id,
      firstName,
      lastName,
      email,
      street,
      streetNumber,
      city,
      selfDescription,
    );

    // creating a token
    const token = crypto.randomBytes(80).toString('base64');

    // then creating session with user id and the token
    const session = await createSession(token, newUser.id);

    // creating serialized cookie that will be passed to header, tells the browser to create a new cookie for us
    const serializedCookie = await createSerializedRegisterSessionTokenCookie(
      session.token,
    );

    // csrf
    // 1. create a secret
    // const CSRFsecret = createCSRFSecret();
    // 2. update the session create function to receive the secret

    res
      .status(200)
      .setHeader('set-Cookie', serializedCookie)
      .json({ user: { id: newUser.id, username: newUser.username } });
  } else {
    res.status(405).json({ errors: [{ message: 'method not allowed' }] });
  }
}
