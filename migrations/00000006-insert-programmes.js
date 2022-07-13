const today = new Date(Date.now());
const tomorrow = new Date(Date.now() + 1 * 24 * 60 * 60 * 1000);

const day2 = new Date(Date.now() + 2 * 24 * 60 * 60 * 1000);


const programmes = [
  {
    cinema_id: 1,
    film_id: 2,
    englishfriendly: true,
    time: '18:30',
    date: today,
  },
  {
    cinema_id: 2,
    film_id: 4,
    englishfriendly: false,
    time: '20:30',
    date: today,
  },
  {
    cinema_id: 1,
    film_id: 1,
    englishfriendly: true,
    time: '14:00',
    date: today,
  },
  {
    cinema_id: 2,
    film_id: 1,
    englishfriendly: false,
    time: '16:00',
    date: today,
  },
  {
    cinema_id: 1,
    film_id: 3,
    englishfriendly: true,
    time: '12:30',
    date: tomorrow,
  },
  {
    cinema_id: 2,
    film_id: 1,
    englishfriendly: false,
    time: '18:00',
    date: tomorrow,
  },
  {
    cinema_id: 1,
    film_id: 4,
    englishfriendly: true,
    time: '20:00',
    date: tomorrow,
  },
  {
    cinema_id: 2,
    film_id: 2,
    englishfriendly: false,
    time: '12:30',
    date: day2,
  },
  {
    cinema_id: 1,
    film_id: 2,
    englishfriendly: true,
    time: '21:00',
    date: tomorrow,
  },
  {
    cinema_id: 2,
    film_id: 4,
    englishfriendly: false,
    time: '15:00',
    date: day2,
  },
  {
    cinema_id: 1,
    film_id: 1,
    englishfriendly: true,
    time: '17:00',
    date: day2,
  },
  {
    cinema_id: 2,
    film_id: 4,
    englishfriendly: false,
    time: '22:00',
    date: day2,
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
