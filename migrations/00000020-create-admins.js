exports.up = async (sql) => {
  await sql`
  CREATE TABLE admins (
    id integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    admin_id integer
   )
 `;
};

exports.down = async (sql) => {
  await sql`
    DROP TABLE admins
  `;
};
