exports.up = async (sql) => {
  await sql`
  CREATE TABLE users (
    id integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    username varchar(30) NOT NULL UNIQUE,
    password_hash varchar(90) NOT NULL
   )
 `;
};

// still missing uploaded image path

exports.down = async (sql) => {
  await sql`
    DROP TABLE users
  `;
};
