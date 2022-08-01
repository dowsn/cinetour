exports.up = async (sql) => {
  await sql`
  CREATE TABLE films (
    id serial NOT NULL,
    film_title varchar(30) NOT NULL,
    director varchar(40),
    year integer,
    country varchar(3),
    genre varchar(20) NOT NULL,
    synopsis varchar(300),
    top_film boolean DEFAULT false,
    CONSTRAINT films_pkey PRIMARY KEY (id),
    EXCLUDE (top_film WITH =) WHERE (top_film),
    trailer varchar(150) NOT NULL
);
 `;
};

exports.down = async (sql) => {
  await sql`
    DROP TABLE films
  `;
};
