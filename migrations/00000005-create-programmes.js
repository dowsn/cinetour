exports.up = async (sql) => {
  await sql`
  CREATE TABLE programmes (
    id integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    film_id integer REFERENCES films (id) ON DELETE CASCADE,
    cinema_id integer REFERENCES cinemas (id) ON DELETE CASCADE,
    date date NOT NULL,
    time time NOT NULL,
    englishfriendly boolean NOT NULL
   )
 `;
};

exports.down = async (sql) => {
  await sql`
    DROP TABLE programmes
  `;
};
