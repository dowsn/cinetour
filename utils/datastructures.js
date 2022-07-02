const programmes = [
  {
    programmeId: 2,
    filmTitle: 'River',
    hostId: 1,
    username: 'admin',
    cinemaName: 'Regal 16 Cinemas',
    date: '2001-12-30T00:00:00.000Z',
    time: '12:34:54.1237',
    englishfriendly: false,
  },
  {
    programmeId: 1,
    filmTitle: 'River',
    hostId: 1,
    username: 'admin',
    cinemaName: 'AMC High Noon Cinema',
    date: '2001-04-01T00:00:00.000Z',
    time: '12:34:00',
    englishfriendly: true,
  },
  {
    programmeId: 1,
    filmTitle: 'River',
    hostId: 2,
    username: 'rado',
    cinemaName: 'AMC High Noon Cinema',
    date: '2001-04-01T00:00:00.000Z',
    time: '12:34:00',
    englishfriendly: true,
  },
];

export function getReducedProgramme(programme) {
  const reducedprogramme = {
    id: programme[0].programmeId,
    filmTitle: programme[0].filmTitle,
    cinemaName: programme[0].cinemaName,
    englishfriendly: programme[0].englishfriendly,
    date: programme[0].date,
    time: programme[0].time,
    tours: programme.map((progr) => {
      return {
        id: progr.hostId,
        username: progr.username,
      };
    }),
  };
  return reducedprogramme;
}

export function getReducedSubscriber(s) {
  if (!s) {
    return undefined;
  }
  const reducedsubscriber = {
    subcriberId: s.subcriberId,
    expiryTimestamp: s.expiryTimestamp.toString(),
  };
  return reducedsubscriber;
}
