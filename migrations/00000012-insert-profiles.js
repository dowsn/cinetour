const profiles = [
  {
    user_id: 1,
    first_name: 'Lukas',
    last_name: 'Fritzl',
    self_description: 'I like films from Steven Spielberg',
    email: 'lukas@gmail.com',
  },
  {
    user_id: 2,
    first_name: 'Paul',
    last_name: 'Atreides',
    self_description: 'I like Frank Herbert',
    email: 'paul@gmail.com',
  },
];

exports.up = async (sql) => {
  await sql`
INSERT INTO profiles ${sql(
    profiles,
    'user_id',
    'first_name',
    'last_name',
    'self_description',
    'email',
  )}
 `;
};

exports.down = async (sql) => {
  for (const profile of profiles) {
    await sql`
      DELETE FROM
        profiles
      WHERE
        first_name=${profile.first_name} AND
        self_description=${profile.self_description}`;
  }
};
