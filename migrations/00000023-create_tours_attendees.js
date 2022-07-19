exports.up = async (sql) => {
  await sql`
  CREATE TABLE tours_attendees (
    id integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    tour_id integer REFERENCES tours (id)  ON DELETE CASCADE,
    attendee_id integer REFERENCES users (id)  ON DELETE CASCADE,
    UNIQUE (tour_id, attendee_id)
   )
 `;
};

exports.down = async (sql) => {
  await sql`
    DROP TABLE tours_attendees
  `;
};
