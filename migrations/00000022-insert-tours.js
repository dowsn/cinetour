const tours = [
  {
    programme_id: 2,
    body: 'I just wanna have fun and meet new people. Let us meet in front of the cinema 10 minutes before.',
    host_id: 1,
  },
  {
    programme_id: 6,
    body: 'One or two drinks after the film? We meet at 30 minutes before already.',
    host_id: 1,
  },
  {
    programme_id: 4,
    body: "Let's watch this. You will recognize me - I wear a red hat.",
    host_id: 1,
  },
];

exports.up = async (sql) => {
  await sql`
INSERT INTO tours ${sql(tours, 'programme_id', 'body', 'host_id')}
 `;
};

exports.down = async (sql) => {
  for (const tour of tours) {
    await sql`
      DELETE FROM
        tours
      WHERE
      programme_id=${tour.programme_id} AND
      body=${tour.body}`;
  }
};
