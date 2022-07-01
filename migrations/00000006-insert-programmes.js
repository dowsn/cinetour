const programmes = [
  {
    cinema_id: 1,
    film_id: 2,
    englishfriendly: true,
    time: '12:34',
    date: '2001-04-01',
  },
  {
    cinema_id: 2,
    film_id: 1,
    englishfriendly: false,
    time: '12:34:54.1237',
    date: '2001-12-30',
  },
];

exports.up = async (sql) => {
  await sql`
INSERT INTO programmes ${sql(
    programmes,
    'film_id',
    'cinema_id',
    'englishfriendly',
    'time',
    'date',
  )}
 `;
};

exports.down = async (sql) => {
  for (const programme of programmes) {
    await sql`
      DELETE FROM
        programmes
      WHERE
        time=${programme.time} AND
        date=${programme.date}`;
  }
};
