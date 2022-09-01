import { createSerializedRegisterSessionTokenCookie } from '../cookies';

const maxAge = 60 * 60 * 22;
let expiry = new Date(Date.now() + maxAge * 1000).toString().split('+');
expiry = expiry[0].split(' ');
const copy = [...expiry];
expiry[1] = expiry[2];
expiry[2] = copy[1];
expiry = expiry.join(' ');
expiry = expiry.split('');
expiry.splice(3, 0, ',');
expiry = expiry.join('');

test('creation of session token', () => {
  const token =
    'nYJ0tw0JQbbEKTkGsndC3TW%2BXnIl0vWdDRlUrkSIy7z6PNwug3keJOF2vFuzjTtbPvNOI7h7Xye9xFwE0kIup8VxJJ8TL5iKlp%2BxTDeYVyo%253DD';

  expect(createSerializedRegisterSessionTokenCookie(token)).toStrictEqual(
    `sessionToken=nYJ0tw0JQbbEKTkGsndC3TW%252BXnIl0vWdDRlUrkSIy7z6PNwug3keJOF2vFuzjTtbPvNOI7h7Xye9xFwE0kIup8VxJJ8TL5iKlp%252BxTDeYVyo%25253DD; Max-Age=${86400}; Path=/; Expires=${expiry}; HttpOnly; SameSite=Lax`,
  );
});
