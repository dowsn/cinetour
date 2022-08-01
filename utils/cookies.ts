import cookie from 'cookie';

// login api - turns token into a cookie with certain parameters
export function createSerializedRegisterSessionTokenCookie(token: string) {
  // check if we are in production e. g. Heroku
  const isProduction = process.env.NODE_ENV === 'production';

  // 24 hours in seconds
  const maxAge = 60 * 60 * 24;

  return cookie.serialize('sessionToken', token, {
    // new browsers
    maxAge: maxAge,
    // for explorer, Date works in miliseconds
    expires: new Date(Date.now() + maxAge * 1000),
    httpOnly: true,
    secure: isProduction,
    // available on root
    path: '/',
    // makes it a little bit more secured
    sameSite: 'lax',
  });
}
