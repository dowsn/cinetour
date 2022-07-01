exports.up = async (sql) => {
  await sql`
  CREATE TABLE subscribers (
    id integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    subscriber_id integer,
    expiry_timestamp timestamp NOT NULL DEFAULT NOW() + INTERVAL '1 year'
   )
 `;
};

exports.down = async (sql) => {
  await sql`
    DROP TABLE subscribers
  `;
};
