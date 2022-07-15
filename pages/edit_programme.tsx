/** @jsxImportSource @emotion/react */

import { css } from '@emotion/react';
import { GetServerSidePropsContext } from 'next';
import Link from 'next/link';
import { Fragment, useState } from 'react';
import {
  Cinemas,
  Film,
  getAdmin,
  getUserByValidSessionToken,
  Programme,
} from '../utils/database';
import { errorStyles } from './register';

type Props = { films: Film[]; cinemas: Cinemas[]; programmes: Programme[] };

export default function EditProgrammes(props: Props) {
  // list of units
  const [programmeList, setProgrammeList] = useState<Programme[]>(
    props.programmes,
  );

  //possible errors
  const [errors, setErrors] = useState<
    {
      message: string;
    }[]
  >([]);

  // enable or disable
  const [activeProgrammeId, setActiveProgrammeId] = useState<
    Programme['programmeId'] | undefined
  >(undefined);

  // states for new unit
  const [newFilm, setNewFilm] = useState('');
  const [newCinema, setNewCinema] = useState('');
  const [newDate, setNewDate] = useState<any>(null);
  const [newTime, setNewTime] = useState('');
  const [newEnglish, setNewEnglish] = useState(false);

  // states for updated unit
  const [editFilm, setEditFilm] = useState('');
  const [editCinema, setEditCinema] = useState('');
  const [editDate, setEditDate] = useState<any>(null);
  const [editTime, setEditTime] = useState<any>('');
  const [editEnglish, setEditEnglish] = useState(false);

  async function createProgrammeHandler() {
    const response = await fetch('/api/programmes', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        filmTitle: newFilm,
        cinemaName: newCinema,
        date: newDate,
        time: newTime,
        englishfriendly: newEnglish,
      }),
    });
    const createdProgramme = await response.json();

    if ('errors' in createdProgramme) {
      setErrors(createdProgramme.errors);
      return;
    }
    // copy state
    // update copy of the state
    const newState = [...programmeList, createdProgramme];
    // use setState func

    setProgrammeList(newState);
    setActiveProgrammeId(1);
    setNewFilm('');
    setNewCinema('');
    setNewDate(null);
    setNewTime('');
    setNewEnglish(false);
  }

  async function deleteProgrammeHandler(id: number) {
    const response = await fetch(`api/programmes/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    const deletedProgramme = await response.json();

    if ('errors' in deletedProgramme) {
      setErrors(deletedProgramme.errors);
      return;
    }

    // copy state
    // update copy of the state
    const newState = programmeList.filter(
      (programme) => programme.programmeId !== deletedProgramme.id,
    );
    // use setState func
    setProgrammeList(newState);
  }

  async function updateProgrammeHandler(id: number) {
    const response = await fetch(`api/programmes/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        filmTitle: editFilm,
        cinemaName: editCinema,
        date: editDate,
        time: editTime,
        englishfriendly: editEnglish,
      }),
    });
    const updatedProgramme = await response.json();

    if ('errors' in updatedProgramme) {
      setErrors(updatedProgramme.errors);
      return;
    }

    // copy state
    // update copy of the state
    const newState = programmeList.map((programme) => {
      if (programme.programmeId === updatedProgramme.id) {
        return updatedProgramme;
      } else {
        return programme;
      }
    });
    // use setState func
    setProgrammeList(newState);
  }

  return (
    <>
      <main>
        <Link href="/../profile">
          <button>Back</button>
        </Link>
        <br />
        <br />

        <div>
          <label htmlFor="film">Film:</label>
          <input
            type="text"
            list="films"
            value={newFilm}
            onChange={(event) => setNewFilm(event.currentTarget.value)}
          />
          <datalist id="films">
            <option></option>
            {props.films.map((film) => (
              <option>{film.filmTitle}</option>
            ))}
          </datalist>
        </div>
        <div>
          <label htmlFor="film">Cinema:</label>
          <input
            type="text"
            list="cinemas"
            value={newCinema}
            onChange={(event) => setNewCinema(event.currentTarget.value)}
          />
          <datalist id="cinemas">
            <option></option>
            {props.cinemas.map((cinema) => (
              <option>{cinema.cinemaName}</option>
            ))}
          </datalist>
        </div>

        <label>
          {' '}
          Date:
          <input
            type="date"
            value={newDate}
            onChange={(event) => setNewDate(event.currentTarget.value)}
          />
        </label>
        <label>
          {' '}
          Time:
          <input
            type="time"
            value={newTime}
            onChange={(event) => setNewTime(event.currentTarget.value)}
          />
        </label>

        <label>
          {' '}
          English Friendly:
          <input
            type="checkbox"
            checked={newEnglish}
            onChange={(event) => setNewEnglish(event.currentTarget.checked)}
          />
        </label>
        <br />
        <button
          onClick={() => {
            createProgrammeHandler().catch(() => {
              console.log('programme request fails');
            });
          }}
        >
          Add
        </button>
        {errors.map((error) => (
          <div css={errorStyles} key={`error-${error.message}`}>
            {error.message}
          </div>
        ))}
        <br />
        <div className="whiteLine"></div>
        <br />
        {programmeList
          .sort(function (a: Programme, b: Programme) {
            let c: any = new Date(a.date);
            let d: any = new Date(b.date);
            return c - d;
          })
          .sort((a, b) => a.time.localeCompare(b.time))
          .map((programme) => {
            return programme.programmeId === activeProgrammeId ? (
              <Fragment key={programme.programmeId}>
                <div>
                  <label htmlFor="film">Film:</label>
                  <input
                    type="text"
                    list="films"
                    value={editFilm}
                    onChange={(event) => setEditFilm(event.currentTarget.value)}
                  />
                  <datalist id="films">
                    <option></option>
                    {props.films.map((film) => (
                      <option>{film.filmTitle}</option>
                    ))}
                  </datalist>
                </div>
                <div>
                  <label htmlFor="film">Cinema:</label>
                  <input
                    type="text"
                    list="cinemas"
                    value={editCinema}
                    onChange={(event) =>
                      setEditCinema(event.currentTarget.value)
                    }
                  />
                  <datalist id="cinemas">
                    <option></option>
                    {props.cinemas.map((cinema) => (
                      <option>{cinema.cinemaName}</option>
                    ))}
                  </datalist>
                </div>

                <label>
                  {' '}
                  Date:
                  <input
                    type="date"
                    value={editDate}
                    onChange={(event) => setEditDate(event.currentTarget.value)}
                  />
                </label>
                <label>
                  {' '}
                  Time:
                  <input
                    type="time"
                    value={editTime}
                    onChange={(event) => setEditTime(event.currentTarget.value)}
                  />
                </label>
                <label>
                  {' '}
                  English Friendly:
                  <input
                    type="checkbox"
                    checked={newEnglish}
                    onChange={(event) =>
                      setNewEnglish(event.currentTarget.checked)
                    }
                  />
                </label>
                <br />
                <button
                  onClick={() => {
                    setActiveProgrammeId(undefined);
                    updateProgrammeHandler(programme.programmeId).catch(() => {
                      console.log('programme request fails');
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
                    deleteProgrammeHandler(programme.programmeId).catch(() => {
                      console.log('programme request fails');
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
                <div className="whiteLine"></div>
                <br />
              </Fragment>
            ) : (
              <Fragment key={programme.programmeId}>
                <label>
                  {' '}
                  Film title:
                  <input value={programme.filmTitle} disabled />
                </label>
                <label>
                  {' '}
                  Cinema:
                  <input value={programme.cinemaName} disabled />
                </label>
                <label>
                  {' '}
                  Date:
                  <input type="text" value={programme.date} disabled />
                </label>
                <label>
                  {' '}
                  Date:
                  <input value={programme.time} disabled />
                </label>
                <label>
                  {' '}
                  English Friendly:
                  <input
                    type="checkbox"
                    checked={programme.englishfriendly}
                    disabled
                  />
                </label>
                <br />
                <button
                  onClick={() => {
                    setActiveProgrammeId(programme.programmeId);
                    setEditFilm(programme.filmTitle);
                    setEditCinema(programme.cinemaName);
                    setEditDate(programme.date);
                    setEditTime(programme.time);
                    setEditEnglish(programme.englishfriendly);
                  }}
                >
                  Edit
                </button>
                <button
                  onClick={() =>
                    deleteProgrammeHandler(programme.programmeId).catch(() => {
                      console.log('programme request fails');
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
                <div className="whiteLine"></div>
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
          destination: `/login?returnTO=/profile`,
          permanent: false,
        },
      };
    }

    const cinemasRequest = await fetch(`${baseUrl}/api/cinemas`);
    const filmsRequest = await fetch(`${baseUrl}/api/films`);
    const programmesRequest = await fetch(`${baseUrl}/api/programmes`);

    const films = await filmsRequest.json();
    const cinemas = await cinemasRequest.json();
    const programmes = await programmesRequest.json();

    return {
      props: {
        films: films,
        cinemas: cinemas,
        programmes: programmes,
      },
    };
  }

  return {
    redirect: {
      destination: `/login?returnTO=/profile`,
      permanent: false,
    },
  };
}
