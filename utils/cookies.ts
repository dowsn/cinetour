import cookie from 'cookie';
import Cookies from 'js-cookie';

export function getParsedCookie(key: string) {
  const cookieValue = Cookies.get(key); // Type is string | undefined

  if (!cookieValue) {
    return undefined;
  }

  try {
    return JSON.parse(cookieValue); // Type is string
  } catch (err) {
    return undefined;
  }
}

// setting cookie based on a value provided (for example array of objects)
export function setStringifiedCookie(key: string, value: any) {
  Cookies.set(key, JSON.stringify(value));
}

// deleting cookie based on key
export function deleteCookie(key: string) {
  Cookies.remove(key);
}

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
