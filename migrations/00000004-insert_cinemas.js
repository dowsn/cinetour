const cinemas = [
  {
    cinema_name: 'AMC High Noon Cinema',
    address: '9153 W. High Noon St.South Ozone Park, NY 11420',
    longitude: 16.3599535,
    lattitude: 48.2168392,
    cinema_description:
      "Festival films and quality mainstream productions - those films are at the core of our cinema. We''re curators. Our topics resonate with modern society and we take great pride in offering you fresh and original content. We open our cinema to all, including creators, critics, and other professionals.",
    contact: 'l.ayrmer@gmail.com',
  },
  {
    cinema_name: 'Regal 16 Cinemas',
    address: '332 Water St.North Tonawanda, NY 14120',
    longitude: 16.3469223,
    lattitude: 48.2147235,
    cinema_description:
      'Along a fine selection of current distribution titles, we screen a wealth of classics, cult movies and hidden gems from the past decades of cinema history, which we present in specially curated monthly cycles, we also feature our own festivals and events like double features and marathons.',
    contact: 'l.ayrmer@gmail.com',
  },
];

exports.up = async (sql) => {
  await sql`
INSERT INTO cinemas ${sql(
    cinemas,
    'cinema_name',
    'address',
    'longitude',
    'lattitude',
    'cinema_description',
    'contact',
  )}
 `;
};

exports.down = async (sql) => {
  for (const cinema of cinemas) {
    await sql`
      DELETE FROM
        cinemas
      WHERE
        address=${cinema.address}`;
  }
};
