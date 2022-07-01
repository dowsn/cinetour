const tours = [
  {
    programme_id: 2,
    body: 'I just wanna have fun and meet new people',
    host_id: 1,
  },
  {
    programme_id: 1,
    body: 'I just wanna sadfasdfasdffdsafasdf fun and meet new people',
    host_id: 1,
  },
  {
    programme_id: 1,
    body: 'asdf',
    host_id: 2,
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
