import { GetServerSidePropsContext } from 'next';
import Link from 'next/link';
import { Fragment, useEffect, useState } from 'react';
import {
  Film,
  getAdmin,
  getFilms,
  getUserByValidSessionToken,
  User,
} from '../utils/database';

type Props = { user: User };

export default function EditFilms(props: Props) {
  // list of units
  const [filmList, setFilmList] = useState<Film[]>([]);

  // enable or disable
  const [activeFilmId, setActiveFilmId] = useState<Film['id'] | undefined>(
    undefined,
  );

  console.log(filmList);
  console.log(activeFilmId);

  // states for new unit
  const [newFilm, setNewFilm] = useState('');
  const [newGenre, setNewGenre] = useState('');
  const [newDirector, setNewDirector] = useState('');
  const [newSynopsis, setNewSynopsis] = useState('');
  const [newTrailer, setNewTrailer] = useState('');
  const [newYear, setNewYear] = useState<number | undefined>(undefined);
  const [newCountry, setNewCountry] = useState('');
  const [newTopFilm, setNewTopFilm] = useState(false);

  // states for updated unit

  const [editFilm, setEditFilm] = useState('');
  const [editGenre, setEditGenre] = useState('');
  const [editDirector, setEditDirector] = useState('');
  const [editSynopsis, setEditSynopsis] = useState('');
  const [editTrailer, setEditTrailer] = useState('');
  const [editYear, setEditYear] = useState<number | undefined>(undefined);
  const [editCountry, setEditCountry] = useState('');
  const [editTopFilm, setEditTopFilm] = useState(false);

  // getting animals via api

  useEffect(() => {
    async function getFilmsList() {
      const request = await fetch('/api/films');
      const films = await request.json();
      setFilmList(films);
    }
    getFilmsList().catch(() => {
      console.log('films request fails');
    });
  }, []);

  async function createFilmHandler() {
    const response = await fetch('/api/films', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        filmTitle: newFilm,
        genre: newGenre,
        director: newDirector,
        synopsis: newSynopsis,
        trailer: newTrailer,
        year: newYear,
        country: newCountry,
        topFilm: newTopFilm,
      }),
    });
    const createdFilm = await response.json();
    console.log(createdFilm);
    // copy state
    // update copy of the state
    const newState = [...filmList, createdFilm];
    // use setState func

    setFilmList(newState);
    setActiveFilmId(1);
    setNewFilm('');
    setNewGenre('');
    setNewDirector('');
    setNewSynopsis('');
    setNewTrailer('');
    setNewYear(undefined);
    setNewCountry('');
    setNewTopFilm(false);
  }

  async function deleteFilmHandler(id: number) {
    const response = await fetch(`api/films/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    const deletedFilm = await response.json();

    // copy state
    // update copy of the state
    const newState = filmList.filter((film) => film.id !== deletedFilm.id);
    // use setState func
    setFilmList(newState);
  }

  async function updateFilmHandler(id: number) {
    const response = await fetch(`api/films/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        filmTitle: editFilm,
        genre: editGenre,
        director: editDirector,
        synopsis: editSynopsis,
        trailer: editTrailer,
        year: editYear,
        country: editCountry,
        topFilm: editTopFilm,
      }),
    });
    const updatedFilm = await response.json();

    // copy state
    // update copy of the state
    const newState = filmList.map((film) => {
      if (film.id === updatedFilm.id) {
        return updatedFilm;
      } else {
        return film;
      }
    });
    // use setState func
    setFilmList(newState);
  }

  return (
    <>
      <main>
        <Link href="/../profile">
          <button>Back</button>
        </Link>
        <label>
          {' '}
          Film title:
          <input
            value={newFilm}
            onChange={(event) => setNewFilm(event.currentTarget.value)}
          />
        </label>
        <label>
          {' '}
          Genre:
          <input
            value={newGenre}
            onChange={(event) => setNewGenre(event.currentTarget.value)}
          />
        </label>
        <label>
          {' '}
          Director:
          <input
            value={newDirector}
            onChange={(event) => setNewDirector(event.currentTarget.value)}
          />
        </label>
        <label>
          {' '}
          Synopsis:
          <textarea
            rows={4}
            cols={50}
            value={newSynopsis}
            onChange={(event) => setNewSynopsis(event.currentTarget.value)}
          ></textarea>
        </label>
        <label>
          {' '}
          Trailer:
          <input
            value={newTrailer}
            onChange={(event) => setNewTrailer(event.currentTarget.value)}
          />
        </label>
        <label>
          {' '}
          Year:
          <input
            value={newYear}
            onChange={(event) => setNewYear(Number(event.currentTarget.value))}
          />
        </label>
        <label>
          {' '}
          Country:
          <input
            value={newCountry}
            onChange={(event) => setNewCountry(event.currentTarget.value)}
          />
        </label>
        <label>
          {' '}
          Top Film:
          <input
            type="checkbox"
            checked={newTopFilm}
            onChange={(event) => setNewTopFilm(event.currentTarget.checked)}
          />
        </label>
        <button
          onClick={() => {
            createFilmHandler().catch(() => {
              console.log('film request fails');
            });
          }}
        >
          Add
        </button>
        <hr />
        {filmList
          .sort((a, b) => a.filmTitle.localeCompare(b.filmTitle))
          .map((film) => {
            return film.id === activeFilmId ? (
              <Fragment key={film.id}>
                <label>
                  {' '}
                  Film title:
                  <input
                    value={editFilm}
                    onChange={(event) => setEditFilm(event.currentTarget.value)}
                  />
                </label>
                <label>
                  {' '}
                  Genre:
                  <input
                    value={editGenre}
                    onChange={(event) =>
                      setEditGenre(event.currentTarget.value)
                    }
                  />
                </label>
                <label>
                  {' '}
                  Director:
                  <input
                    value={editDirector}
                    onChange={(event) =>
                      setEditDirector(event.currentTarget.value)
                    }
                  />
                </label>
                <label>
                  {' '}
                  Synopsis:
                  <textarea
                    rows={4}
                    cols={50}
                    value={editSynopsis}
                    onChange={(event) =>
                      setEditSynopsis(event.currentTarget.value)
                    }
                  ></textarea>
                </label>
                <label>
                  {' '}
                  Trailer:
                  <input
                    value={editTrailer}
                    onChange={(event) =>
                      setEditTrailer(event.currentTarget.value)
                    }
                  />
                </label>
                <label>
                  {' '}
                  Year:
                  <input
                    value={editYear}
                    onChange={(event) =>
                      setEditYear(Number(event.currentTarget.value))
                    }
                  />
                </label>
                <label>
                  {' '}
                  Country:
                  <input
                    value={editCountry}
                    onChange={(event) =>
                      setEditCountry(event.currentTarget.value)
                    }
                  />
                </label>
                <label>
                  {' '}
                  Top Film:
                  <input
                    type="checkbox"
                    checked={editTopFilm}
                    onChange={(event) =>
                      setEditTopFilm(event.currentTarget.checked)
                    }
                  />
                </label>
                <button
                  onClick={() => {
                    setActiveFilmId(undefined);
                    updateFilmHandler(film.id).catch(() => {
                      console.log('film request fails');
                    });
                  }}
                >
                  Save
                </button>
                <button
                  onClick={() =>
                    deleteFilmHandler(film.id).catch(() => {
                      console.log('film request fails');
                    })
                  }
                >
                  X
                </button>
                <hr />
              </Fragment>
            ) : (
              <Fragment key={film.id}>
                <label>
                  {' '}
                  Film title:
                  <input value={film.filmTitle} disabled />
                </label>
                <label>
                  {' '}
                  Genre:
                  <input value={film.genre} disabled />
                </label>
                <label>
                  {' '}
                  Director:
                  <input value={film.director} disabled />
                </label>
                <label>
                  {' '}
                  Synopsis:
                  <textarea
                    rows={4}
                    cols={50}
                    value={film.synopsis}
                    disabled
                  ></textarea>
                </label>
                <label>
                  {' '}
                  Trailer:
                  <input value={film.trailer} disabled />
                </label>
                <label>
                  {' '}
                  Year:
                  <input value={film.year} disabled />
                </label>
                <label>
                  {' '}
                  Country:
                  <input value={film.country} disabled />
                </label>
                <label>
                  {' '}
                  Top Film:
                  <input type="checkbox" checked={film.topFilm} disabled />
                </label>
                <button
                  onClick={() => {
                    setActiveFilmId(film.id);
                    setEditFilm(film.filmTitle);
                    setEditDirector(film.director);
                    setEditSynopsis(film.synopsis);
                    setEditGenre(film.genre);
                    setEditTrailer(film.trailer);
                    setEditYear(film.year);
                    setEditCountry(film.country);
                    setEditTopFilm(film.topFilm);
                  }}
                >
                  Edit
                </button>
                <button
                  onClick={() =>
                    deleteFilmHandler(film.id).catch(() => {
                      console.log('film request fails');
                    })
                  }
                >
                  X
                </button>
                <hr />
              </Fragment>
            );
          })}
      </main>
    </>
  );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  // validation
  const user = await getUserByValidSessionToken(
    context.req.cookies.sessionToken,
  );

  if (user) {
    const admin = await getAdmin(user.id);

    if (!admin) {
      return {
        redirect: {
          destination: `/login?returnTO=/profile`,
          permanent: false,
        },
      };
    }
  }
  return {
    // making data about the user available at the page in props
    props: { user: user },
  };
}
