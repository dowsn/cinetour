const films = [
  {
    film_title: 'No Time To Die',
    director: 'Cary Joji Fukunaga',
    year: 2021,
    country: 'US',
    genre: 'action',
    synopsis:
      'James Bond has left active service. His peace is short-lived when Felix Leiter, an old friend from the CIA, turns up asking for help.',
    top_film: false,
    trailer: 'https://www.youtube.com/watch?v=BIhNsAtPbPI',
  },
  {
    film_title: 'River',
    director: 'Jennifer Peedom, Joseph Nizeti',
    year: '2021',
    country: 'AU',
    genre: 'documentary',
    top_film: false,
    synopsis:
      'Throughout history, rivers have shaped our landscapes and our journeys; flowed through our cultures and dreams.',
    trailer: 'https://www.youtube.com/watch?v=VCTtLVw0RxE',
  },
  {
    film_title: 'Dune',
    director: 'Denis Villeneuve',
    year: '2021',
    country: 'US',
    genre: 'sci-fi',
    top_film: false,
    synopsis:
      "A noble family becomes embroiled in a war for control over the galaxy''s most valuable asset while its heir becomes troubled by visions of a dark future.",
    trailer: 'https://www.youtube.com/watch?v=8g18jFHCLXk',
  },
  {
    film_title: 'Top Gun: Maverick',
    director: 'Joseph Kosinski',
    year: '2022',
    country: 'US',
    genre: 'action',
    top_film: true,
    synopsis:
      "After more than thirty years of service as one of the Navy's top aviators, Pete Mitchell is where he belongs, pushing the envelope as a courageous test pilot and dodging the advancement in rank that would ground him.",
    trailer: 'https://www.youtube.com/watch?v=b1KJNW-iYlE',
  },
];

exports.up = async (sql) => {
  await sql`
INSERT INTO films ${sql(
    films,
    'film_title',
    'director',
    'year',
    'country',
    'genre',
    'synopsis',
    'top_film',
    'trailer',
  )}
 `;
};

exports.down = async (sql) => {
  for (const film of films) {
    await sql`
      DELETE FROM
        films
      WHERE
        film_title=${film.film_title} AND
        genre=${film.genre}`;
  }
};
