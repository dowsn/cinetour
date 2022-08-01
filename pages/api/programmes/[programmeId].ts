import { NextApiRequest, NextApiResponse } from 'next';
import {
  deleteProgrammeById,
  getAdmin,
  getCinemaByName,
  getFilmByName,
  getProgrammeById,
  getSessionByValidToken,
  getUserByValidSessionToken,
  updateProgrammeById,
} from '../../../utils/database';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const programmeId = Number(req.query.programmeId);

  if (!programmeId) {
    return res.status(400).json({ errors: [{ message: 'Id is not valid.' }] });
  }

  // if method GET
  if (req.method === 'GET') {
    const programme = await getProgrammeById(programmeId);

    if (!programme) {
      return res
        .status(400)
        .json({ errors: [{ message: 'Id is not valid.' }] });
    }

    return res.status(200).json(programme);
  }

  // if method PUT
  if (req.method === 'PUT') {
    if (
      !programmeId ||
      !req.body.filmTitle ||
      !req.body.cinemaName ||
      !req.body.date ||
      !req.body.time
    ) {
      return res
        .status(400)
        .json({ errors: [{ message: 'Please provide all required data' }] });
    }

    // authentication
    const sessionToken = req.cookies.sessionToken;

    const session = await getSessionByValidToken(sessionToken);

    if (!session) {
      return res.status(403).json({ errors: [{ message: 'Unauthorized.' }] });
    }

    // authenticating admin
    const user = await getUserByValidSessionToken(req.cookies.sessionToken);
    if (!user) {
      return res.status(403).json({ errors: [{ message: 'Unauthorized.' }] });
    }

    const admin = await getAdmin(user.id);

    if (!admin) {
      return res.status(403).json({ errors: [{ message: 'Unauthorized.' }] });
    }

    // the action
    const film = await getFilmByName(req.body.filmTitle);
    const cinema = await getCinemaByName(req.body.cinemaName);

    if (film && cinema) {
      const updatedProgramme = await updateProgrammeById(
        programmeId,
        film.id,
        cinema.id,
        req.body.date,
        req.body.time,
        req.body.englishfriendly,
      );

      if (!updatedProgramme) {
        return res
          .status(400)
          .json({ errors: [{ message: 'Id is not valid.' }] });
      }

      return res.status(200).json(updatedProgramme);
    }
    return res
      .status(400)
      .json({ errors: [{ message: 'Cinema or film do not exist.' }] });
  }

  // if method DELETE
  if (req.method === 'DELETE') {
    // authentication by session token
    const sessionToken = req.cookies.sessionToken;

    const session = await getSessionByValidToken(sessionToken);

    if (!session) {
      return res.status(403).json({ errors: [{ message: 'Unauthorized.' }] });
    }

    // authenticating admin
    const user = await getUserByValidSessionToken(req.cookies.sessionToken);
    if (!user) {
      return res.status(403).json({ errors: [{ message: 'Unauthorized.' }] });
    }

    const admin = await getAdmin(user.id);

    if (!admin) {
      return res.status(403).json({ errors: [{ message: 'Unauthorized.' }] });
    }

    // the action
    const deletedProgramme = await deleteProgrammeById(programmeId);

    if (!programmeId) {
      return res
        .status(400)
        .json({ errors: [{ message: 'Id is not valid.' }] });
    }

    return res.status(200).json(deletedProgramme);
  }

  return res.status(405).json({ errors: [{ message: 'Method not allowed.' }] });
}
