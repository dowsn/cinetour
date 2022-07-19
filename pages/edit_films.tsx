/** @jsxImportSource @emotion/react */

import { css } from '@emotion/react';
import Axios from 'axios';
import { GetServerSidePropsContext } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { Fragment, useState } from 'react';
import { colors } from '../styles/constants';
import { createCsrfToken } from '../utils/auth';
import {
  Film,
  getAdmin,
  getSessionByValidToken,
  getUserByValidSessionToken,
  SessionWithCSRF,
} from '../utils/database';
import { errorStyles } from './register';

const editFilmsstyles = css`
  .top {
    background-color: ${colors.blue};
  }
`;

type Props = { films: Film[]; csrfToken: SessionWithCSRF };

export default function EditFilms(props: Props) {
  // list of units
  const [filmList, setFilmList] = useState<Film[]>(props.films);

  // possible errors
  const [errors, setErrors] = useState<
    {
      message: string;
    }[]
  >([]);

  // enable or disable
  const [activeFilmId, setActiveFilmId] = useState<Film['id'] | undefined>(
    undefined,
  );

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
        csrfToken: props.csrfToken,
      }),
    });
    const createdFilm = await response.json();

    if ('errors' in createdFilm) {
      setErrors(createdFilm.errors);
      return;
    }
    // new state
    const filmsRequest = await fetch(`/api/films`);
    const films = await filmsRequest.json();

    // use setState func

    setFilmList(films);
    setActiveFilmId(undefined);
    setNewFilm('');
    setNewGenre('');
    setNewDirector('');
    setNewSynopsis('');
    setNewTrailer('');
    setNewYear(2022);
    setNewCountry('');
    setNewTopFilm(false);
  }

  async function deleteFilmHandler(id: number) {
    const response = await fetch(`api/films/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        csrfToken: props.csrfToken,
      }),
    });
    const deletedFilm = await response.json();

    if ('errors' in deletedFilm) {
      setErrors(deletedFilm.errors);
      return;
    }

    // new state
    const filmsRequest = await fetch(`/api/films`);
    const films = await filmsRequest.json();

    // use setState func
    setFilmList(films);
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
        csrfToken: props.csrfToken,
      }),
    });
    const updatedFilm = await response.json();

    if ('errors' in updatedFilm) {
      setErrors(updatedFilm.errors);
      return;
    }

    // new state
    const filmsRequest = await fetch(`/api/films`);
    const films = await filmsRequest.json();

    // use setState func
    setFilmList(films);
    setActiveFilmId(undefined);
  }

  // uploading top film image
  // selected file
  const [imageSelected, SetImageSelected] = useState<File | undefined>(
    undefined,
  );

  // uploading profile image
  const uploadImage = async () => {
    const formData: any = new FormData();
    formData.append('file', imageSelected);

    // how to set the folder and name to save
    formData.append('upload_preset', 'top_film');
    formData.append('public_id]', 'top_tour/tour_film');
    Axios.post(
      'https://api.cloudinary.com/v1_1/dkiienrq4/image/upload',
      formData,
    ).then((response: any) => {
      console.log(response);
    });

    setSuccess('Success');
  };

  const [success, setSuccess] = useState('');

  return (
    <>
      <Head>
        <title>Edit Films</title>
        <meta name="description" content="Edit Films" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main css={editFilmsstyles}>
        <Link href="/../profile">
          <button>Back</button>
        </Link>
        <br />
        <br />
        <label>
          {' '}
          Film title:
          <input
            placeholder="The Best Film"
            value={newFilm}
            onChange={(event) => setNewFilm(event.currentTarget.value)}
          />
        </label>
        <label>
          {' '}
          Genre:
          <input
            placeholder="comedy"
            value={newGenre}
            onChange={(event) => setNewGenre(event.currentTarget.value)}
          />
        </label>
        <label>
          {' '}
          Director:
          <input
            placeholder="Christopher Nolan"
            value={newDirector}
            onChange={(event) => setNewDirector(event.currentTarget.value)}
          />
        </label>
        <br />
        <label>
          {' '}
          Synopsis:
          <br />
          <textarea
            placeholder="This movie is about..."
            rows={4}
            cols={50}
            value={newSynopsis}
            onChange={(event) => setNewSynopsis(event.currentTarget.value)}
          />
        </label>
        <br />
        <label>
          {' '}
          Trailer:
          <input
            placeholder="https://www.youtube.com/watch?v=wBDLRvjHVOY"
            value={newTrailer}
            onChange={(event) => setNewTrailer(event.currentTarget.value)}
          />
        </label>
        <label>
          {' '}
          Year:
          <input
            placeholder="2022"
            value={newYear}
            onChange={(event) => setNewYear(Number(event.currentTarget.value))}
          />
        </label>
        <label>
          {' '}
          Country:
          <input
            placeholder="US"
            value={newCountry}
            onChange={(event) => setNewCountry(event.currentTarget.value)}
          />
        </label>
        <label>
          {' '}
          Top Film (only one):
          {filmList.some((e) => e.topFilm === true) ? (
            <input type="checkbox" disabled />
          ) : (
            <input
              type="checkbox"
              checked={newTopFilm}
              onChange={(event) => setNewTopFilm(event.currentTarget.checked)}
            />
          )}
        </label>
        <br />
        <button
          onClick={() => {
            createFilmHandler().catch(() => {
              console.log('film request fails');
            });
          }}
        >
          Add
        </button>
        <br />
        <br />
        <div className="whiteLine" />
        <div className="inputFile">
          <div>
            <h2>Change Top Film Image</h2>
            <p>* best result with resolution 1920x1080</p>
          </div>
          <input
            type="file"
            onChange={(event) => {
              SetImageSelected(event.currentTarget.files?.[0]);
            }}
          />
          <br />
          <button onClick={() => uploadImage()}>Upload Top Film Image</button>
          {success ? <h3>{success}</h3> : ''}
        </div>
        <br />
        <div className="whiteLine" />
        <br />
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
                <br />
                <label>
                  {' '}
                  Synopsis:
                  <br />
                  <textarea
                    rows={4}
                    cols={50}
                    value={editSynopsis}
                    onChange={(event) =>
                      setEditSynopsis(event.currentTarget.value)
                    }
                  />
                </label>
                <br />
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
                  {editTopFilm ? (
                    <div className="top">This is the top film</div>
                  ) : (
                    ''
                  )}{' '}
                  Top Film:
                  <input
                    type="checkbox"
                    checked={editTopFilm}
                    onChange={(event) =>
                      setEditTopFilm(event.currentTarget.checked)
                    }
                  />
                </label>
                <br />
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
                {errors.map((error) => (
                  <div css={errorStyles} key={`error-${error.message}`}>
                    {error.message}
                  </div>
                ))}
                <button
                  onClick={() =>
                    deleteFilmHandler(film.id).catch(() => {
                      console.log('film request fails');
                    })
                  }
                >
                  X
                </button>
                {errors.map((error) => (
                  <div css={errorStyles} key={`error-${error.message}`}>
                    {error.message}
                  </div>
                ))}
                <br />
                <div className="whiteLine" />
                <br />
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
                <br />
                <label>
                  {' '}
                  Synopsis:
                  <br />
                  <textarea rows={4} cols={50} value={film.synopsis} disabled />
                </label>
                <br />
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
                  {film.topFilm ? (
                    <div className="top">This is the top film</div>
                  ) : (
                    ''
                  )}{' '}
                  Top Film:
                  <input type="checkbox" checked={film.topFilm} disabled />
                </label>
                <br />
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
                {errors.map((error) => (
                  <div css={errorStyles} key={`error-${error.message}`}>
                    {error.message}
                  </div>
                ))}
                <button
                  onClick={() =>
                    deleteFilmHandler(film.id).catch(() => {
                      console.log('film request fails');
                    })
                  }
                >
                  X
                </button>
                {errors.map((error) => (
                  <div css={errorStyles} key={`error-${error.message}`}>
                    {error.message}
                  </div>
                ))}
                <br />
                <div className="whiteLine" />
                <br />
              </Fragment>
            );
          })}
      </main>
    </>
  );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const baseUrl = await process.env.BASE_URL;

  // validation
  const user = await getUserByValidSessionToken(
    context.req.cookies.sessionToken,
  );

  if (user) {
    const admin = await getAdmin(user.id);

    if (!admin) {
      return {
        redirect: {
          destination: `/login?returnTo=/profile`,
          permanent: false,
        },
      };
    }
    const session = await getSessionByValidToken(
      context.req.cookies.sessionToken,
    );

    if (session) {
      const csrfToken = await createCsrfToken(session.csrfSecret);
      const filmsRequest = await fetch(`${baseUrl}/api/films`);
      const films = await filmsRequest.json();

      return {
        // making data about the user available at the page in props
        props: { films: films, csrfToken: csrfToken },
      };
    }
  }

  return {
    redirect: {
      destination: `/login?returnTo=/profile`,
      permanent: false,
    },
  };
}
