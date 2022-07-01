exports.up = async (sql) => {
  await sql`
  CREATE TABLE films (
    id integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    film_title varchar(30) NOT NULL,
    director varchar(40),
    year integer,
    country varchar(3),
    genre varchar(20) NOT NULL,
    synopsis varchar(200),
    top_film boolean,
    trailer varchar(150) NOT NULL
   )
 `;
};

// still missing uploaded image path

exports.down = async (sql) => {
  await sql`
    DROP TABLE films
  `;
};
