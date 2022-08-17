import 'react-toastify/dist/ReactToastify.css';
import { GetServerSidePropsContext } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { Fragment, useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import {
  Cinema,
  Film,
  getAdmin,
  getUserByValidSessionToken,
  Programme,
} from '../utils/database';

type Props = { films: Film[]; cinemas: Cinema[]; programmes: Programme[] };

export default function EditProgrammes(props: Props) {
  // list of units
  const [programmeList, setProgrammeList] = useState<Programme[]>(
    props.programmes,
  );

  // confirm success
  const confirm = () => toast('Success!');

  // possible errors

  const notify = () => errors.map((error) => toast.error(error.message));

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

    // notify, if there are errors
    if ('errors' in createdProgramme) {
      setErrors(createdProgramme.errors);
      notify();
      return;
    }

    // get the new programme list
    const programmesRequest = await fetch(`/api/programmes`);
    const programmes = await programmesRequest.json();

    // update the state of the programme list
    setProgrammeList(programmes);
    // update input fields
    setActiveProgrammeId(undefined);
    setNewFilm('');
    setNewCinema('');
    setNewTime('');
    setNewEnglish(false);

    // confirm success
    confirm();
  }

  async function deleteProgrammeHandler(id: number) {
    const response = await fetch(`api/programmes/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    const deletedProgramme = await response.json();

    // notify, if there are errors
    if ('errors' in deletedProgramme) {
      setErrors(deletedProgramme.errors);
      notify();
      return;
    }

    // get the new programme list
    const programmesRequest = await fetch(`/api/programmes`);
    const programmes = await programmesRequest.json();

    // update the state of the programme list
    setProgrammeList(programmes);

    // deactivate current programme
    setActiveProgrammeId(0);

    // confirm success
    confirm();
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

    // notify, if there are errors
    if ('errors' in updatedProgramme) {
      setErrors(updatedProgramme.errors);
      notify();
      return;
    }

    // get the new programme list
    const programmesRequest = await fetch(`/api/programmes`);
    const programmes = await programmesRequest.json();

    // update the state of the programme list
    setProgrammeList(programmes);

    // deactivate current programme
    setActiveProgrammeId(0);

    // confirm success
    confirm();
  }

  return (
    <>
      <Head>
        <title>Edit Films</title>
        <meta name="description" content="Edit Films" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <Link href="/profile">
          <button>Back</button>
        </Link>
        <ToastContainer
          position="bottom-center"
          autoClose={800}
          hideProgressBar
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />
        <br />
        <br />
        <div>
          <label htmlFor="film">Film:</label>
          <input
            list="films"
            value={newFilm}
            onChange={(event) => setNewFilm(event.currentTarget.value)}
          />
          <datalist id="films">
            <option />
            {props.films.map((film) => (
              <option key={`film-id-${film.id}`}>{film.filmTitle}</option>
            ))}
          </datalist>
        </div>
        <div>
          <label htmlFor="film">Cinema:</label>
          <input
            list="cinemas"
            value={newCinema}
            onChange={(event) => setNewCinema(event.currentTarget.value)}
          />
          <datalist id="cinemas">
            <option />
            {props.cinemas.map((cinema) => (
              <option key={`cinema-id-${cinema.id}`}>
                {cinema.cinemaName}
              </option>
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
        <br />
        <div className="whiteLine" />
        <br />
        {programmeList
          .sort(function (a: Programme, b: Programme) {
            const c: any = new Date(a.date);
            const d: any = new Date(b.date);
            return c - d;
          })
          .sort((a, b) => a.time.localeCompare(b.time))
          .map((programme) => {
            return programme.programmeId === activeProgrammeId ? (
              <Fragment key={`programme-id-${programme.programmeId}`}>
                <div>
                  <label htmlFor="film">Film:</label>
                  <input
                    list="films"
                    value={editFilm}
                    onChange={(event) => setEditFilm(event.currentTarget.value)}
                  />
                  <datalist id="films">
                    <option />
                    {props.films.map((film) => (
                      <option key={`film-id-${film.id}`}>
                        {film.filmTitle}
                      </option>
                    ))}
                  </datalist>
                </div>
                <div>
                  <label htmlFor="film">Cinema:</label>
                  <input
                    list="cinemas"
                    value={editCinema}
                    onChange={(event) =>
                      setEditCinema(event.currentTarget.value)
                    }
                  />
                  <datalist id="cinemas">
                    <option />
                    {props.cinemas.map((cinema) => (
                      <option key={`cinema-id${cinema.cinemaName}`}>
                        {cinema.cinemaName}
                      </option>
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
                    checked={editEnglish}
                    onChange={(event) =>
                      setEditEnglish(event.currentTarget.checked)
                    }
                  />
                </label>
                <br />
                <div className="editProfile">
                  <button
                    onClick={() => {
                      updateProgrammeHandler(programme.programmeId).catch(
                        () => {
                          console.log('programme request fails');
                        },
                      );
                    }}
                  >
                    Save
                  </button>
                  <button
                    onClick={() =>
                      deleteProgrammeHandler(programme.programmeId).catch(
                        () => {
                          console.log('programme request fails');
                        },
                      )
                    }
                  >
                    X
                  </button>
                </div>
                <br />
                <div className="whiteLine" />
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
                  <input value={programme.date} disabled />
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
                <div className="editProfile">
                  <button
                    onClick={() => {
                      setActiveProgrammeId(programme.programmeId);
                      setEditFilm(programme.filmTitle);
                      setEditCinema(programme.cinemaName);
                      setEditDate(new Date(programme.date));
                      setEditTime(programme.time);
                      setEditEnglish(programme.englishfriendly);
                    }}
                  >
                    Edit
                  </button>
                  <button
                    onClick={() =>
                      deleteProgrammeHandler(programme.programmeId).catch(
                        () => {
                          console.log('programme request fails');
                        },
                      )
                    }
                  >
                    X
                  </button>
                </div>
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
      destination: `/login?returnTo=/profile`,
      permanent: false,
    },
  };
}
