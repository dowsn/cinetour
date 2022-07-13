exports.up = async (sql) => {
  await sql`
  CREATE TABLE friends (
    id integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY,

    friend1_id integer NOT NULL REFERENCES users (id) ON DELETE CASCADE,
    friend2_id integer NOT NULL REFERENCES users (id) ON DELETE CASCADE,
    UNIQUE (friend1_id, friend2_id)
   )
 `;
};

exports.down = async (sql) => {
  await sql`
    DROP TABLE friends
  `;
};
