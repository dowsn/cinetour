const admins = [
  {
    admin_id: 1,
    admin_id: 2,
    admin_id: 3,
    admin_id: 4,
  },
];
exports.up = async (sql) => {
  await sql`
INSERT INTO admins ${sql(admins, 'admin_id')}
 `;
};
