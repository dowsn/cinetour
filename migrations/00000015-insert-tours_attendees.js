const tours_attendees = [
  {
    tour_id: 1,
    attendee_id: 2,
  },
  {
    tour_id: 2,
    attendee_id:2,
  },
  {
    tour_id: 3,
    attendee_id: 2,
  },
];
exports.up = async (sql) => {
  await sql`
INSERT INTO tours_attendees ${sql(tours_attendees, 'attendee_id', 'tour_id')}
 `;
};

exports.down = async (sql) => {
  for (const tours_attendee of tours_attendees) {
    await sql`
      DELETE FROM
      tours_attendees
      WHERE
        tour_id=${tours_attendee.tour_id} AND
        attendee_id=${tours_attendee.attendee_id}`;
  }
};
