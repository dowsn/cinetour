const admins = [
  {
    admin_id: 3,
  },
];
exports.up = async (sql) => {
  await sql`
INSERT INTO admins ${sql(admins, 'admin_id')}
 `;
};
