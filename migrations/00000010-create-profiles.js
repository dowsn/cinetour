exports.up = async (sql) => {
  await sql`
  CREATE TABLE profiles (
    id integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    user_id integer NOT NULL REFERENCES users (id) ON DELETE CASCADE,
    first_name varchar(30) NOT NULL,
    last_name varchar(30) NOT NULL,
    self_description varchar(100),
    street varchar(40) NOT NULL,
    street_number varchar(40) NOT NULL,
    city varchar(40) NOT NULL,
    email varchar(100) NOT NULL
  )
 `;
};

exports.down = async (sql) => {
  await sql`
    DROP TABLE profiles
  `;
};
