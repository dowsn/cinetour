const users = [
  {
    username: 'admin',
    password_hash: 'getPassword',
  },
  {
    username: 'rado',
    password_hash: 'getPassword',
  },
  {
    username: 'baba',
    password_hash: 'getPassword',
  },
];

exports.up = async (sql) => {
  await sql`
INSERT INTO users ${sql(users, 'username', 'password_hash')}
 `;
};

exports.down = async (sql) => {
  for (const user of users) {
    await sql`
      DELETE FROM
        users
      WHERE
        username=${user.username} AND
        password_hash=${user.password_hash}`;
  }
};
