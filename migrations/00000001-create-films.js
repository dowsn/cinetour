exports.up = async (sql) => {
  await sql`
  CREATE TABLE films (
    id integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    film_title varchar(30) NOT NULL,
    director varchar(40),
    year integer,
    country varchar(3),
    genre varchar(20) NOT NULL,
    synopsis varchar(300),
    top_film boolean DEFAULT false,
   CONSTRAINT top_film_true_or_null CHECK (top_film),
  CONSTRAINT standard_only_1_true UNIQUE (top_film),
  trailer varchar(150) NOT NULL
);
 `;
};

// still missing uploaded image path

exports.down = async (sql) => {
  await sql`
    DROP TABLE films
  `;
};
