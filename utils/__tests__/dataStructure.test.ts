import { getReducedProgramme } from '../../utils/datastructures';

test('reduce programme', () => {
  const notReducedProgramme = {
    programmeId: 49,
    filmTitle: 'River',
    filmId: 2,
    cinemaName: 'Regal 16 Cinemas',
    genre: 'documentary',
    date: '2022-08-29T00:00:00.000Z',
    username: 'admin',
    tourId: 15,
    hostId: 3,
    time: '20:20:00',
    englishfriendly: false,
  };

  expect(getReducedProgramme(notReducedProgramme)).toStrictEqual({
    programmeId: 49,
    filmTitle: 'River',
    filmId: 2,
    cinemaName: 'Regal 16 Cinemas',
    englishfriendly: false,
    date: 'Mon Aug 29',
    time: '20:20',
    hostId: 3,
    username: 'admin',
    genre: 'documentary',
    tourId: 15,
  });
});
