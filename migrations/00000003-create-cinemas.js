exports.up = async (sql) => {
  await sql`
  CREATE TABLE cinemas (
    id integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    cinema_name varchar(40) NOT NULL,
    address varchar(80) NOT NULL,
    longitude NUMERIC NOT NULL,
    lattitude NUMERIC NOT NULL,
    cinema_description varchar(500) NOT NULL,
    contact varchar(20) NOT NULL
   )
 `;
};

exports.down = async (sql) => {
  await sql`
    DROP TABLE cinemas
  `;
};
