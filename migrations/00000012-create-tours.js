exports.up = async (sql) => {
  await sql`
  CREATE TABLE tours (
    id integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    programme_id integer REFERENCES programmes (id)  ON DELETE CASCADE,
    host_id integer REFERENCES users (id)  ON DELETE CASCADE,
    body varchar(100) NOT NULL,
    UNIQUE (host_id, programme_id)
   )
 `;
};

exports.down = async (sql) => {
  await sql`
    DROP TABLE tours
  `;
};
