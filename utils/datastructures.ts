import { Programme, Subscriber, Tour, TourAttendee } from './database';

export type ReducedProgramme = {
  programmeId: number | null;
  filmTitle: string | null;
  filmId: number | null;
  cinemaName: string;
  englishfriendly: boolean | null;
  date: Date | string;
  time: string;
  hostId: number;
  username: string;
  genre: string;
  tourId: number;
};

export function getReducedProgramme(programme: Programme) {
  const reducedprogramme = {
    programmeId: programme.programmeId || null,
    filmTitle: programme.filmTitle || null,
    filmId: programme.filmId || null,
    cinemaName: programme.cinemaName,
    englishfriendly: programme.englishfriendly || false,
    date: new Date(programme.date).toString().split(' ', 3).join(' '),
    time: programme.time.toString().split(':', 2).join(':'),
    hostId: programme.hostId || null,
    username: programme.username || null,
    genre: programme.genre || null,
    tourId: programme.tourId || null,
  };
  return reducedprogramme;
}

export type ReducedTour = {
  tourId: number;
  username: string;
  programmeId: number;
  filmTitle: string;
  filmId: number;
  cinemaName: string;
  date: string;
  time: string;
  hostId: number;
  genre: string;
  trailer: string;
  body: string;
  attendees: string[];
};

export function getReducedTour(tour: Tour, attendees: TourAttendee[]) {
  const reducedtour = {
    tourId: tour.tourId,
    username: tour.username,
    programmeId: tour.programmeId,
    filmTitle: tour.filmTitle,
    filmId: tour.filmId,
    cinemaName: tour.cinemaName,
    date: new Date(tour.date).toString().split(' ', 3).join(' '),
    time: tour.time.toString().split(':', 2).join(':'),
    hostId: tour.hostId,
    genre: tour.genre,
    trailer: tour.trailer,
    body: tour.body,
    attendees: attendees
      .filter((attendee: TourAttendee) => attendee.tourId === tour.tourId)
      .map((attendee: TourAttendee) => attendee.username),
  };
  return reducedtour;
}

export function getReducedSubscriber(s: Subscriber) {
  const reducedsubscriber = {
    subscriberId: s.subscriberId,
    expiryTimestamp: s.expiryTimestamp.toString(),
    qrCode: s.qrCode,
  };
  return reducedsubscriber;
}
