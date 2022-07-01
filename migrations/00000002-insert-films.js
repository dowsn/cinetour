const films = [
  {
    film_title: 'River',
    director: 'Riddley Scott',
    year: 2021,
    country: 'US',
    genre: 'documentary',
    synopsis:
      'A cinematic and musical odyssey that explores the remarkable relationship between humans and rivers.',
    top_film: true,
    trailer: 'https://www.youtube.com/watch?v=VCTtLVw0RxE',
  },
  {
    film_title: 'River',
    director: 'Riddley Scott',
    year: 2022,
    country: 'US',
    genre: 'documentary',
    top_film: false,
    synopsis:
      'A cinematic and musical odyssey that explores the remarkable relationship between humans and rivers.',
    trailer: 'https://www.youtube.com/watch?v=VCTtLVw0RxE',
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
