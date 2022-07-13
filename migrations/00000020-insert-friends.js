const friends = [
  {
    friend1_id: 2,
    friend2_id: 3,
  },
  {
    friend1_id: 3,
    friend2_id: 1,
  },
];
exports.up = async (sql) => {
  await sql`
INSERT INTO friends ${sql(friends, 'friend1_id', 'friend2_id')}
 `;
};
