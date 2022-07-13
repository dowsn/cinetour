import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const baseUrl = await process.env.BASE_URL;

  res.status(200).json({
    programmes: `${baseUrl}/api/programmes`,
    films: `${baseUrl}/api/films`,
    tours: `${baseUrl}/api/tours`,
    users: `${baseUrl}/api/users`,
    login: `${baseUrl}/api/login`,
    profile: `${baseUrl}/api/profile`,
    register: `${baseUrl}/api/register`,
    subscribe: `${baseUrl}/api/subscribe`,
    newsletter: `${baseUrl}/api/newsletter`,
    tour_attendees: `${baseUrl}/api/tour_attendees`,
    cinemas: `${baseUrl}/api/cinemas`,
    friends: `${baseUrl}/api/friends`,
  });
}
