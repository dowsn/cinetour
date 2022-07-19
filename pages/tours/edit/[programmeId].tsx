/** @jsxImportSource @emotion/react */

import { css } from '@emotion/react';
import { GetServerSidePropsContext } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { getUserByValidSessionToken, Tour } from '../../../utils/database';
import {
  getReducedProgramme,
  ReducedProgramme,
} from '../../../utils/datastructures';

type Props = {
  programme: ReducedProgramme;
  tour: Tour;
};

export const tourDescription = css`
  p {
    margin: 0;
    padding: 0;
  }
`;

export const errorStyles = css`
  background-color: #c24b4b;
  color: white;
  padding: 5px;
  margin-top: 5px;
`;

export default function EditTour(props: Props) {
  const [description, setDescription] = useState(props.tour.body);
  const [errors, setErrors] = useState<{ message: string }[]>([]);
  const router = useRouter();

  async function deleteTourHandler(e: any) {
    e.preventDefault();

    const response = await fetch(`/api/tours/${props.tour.tourId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    const deletedTour = await response.json();

    console.log(deletedTour);

    await router.push('/tours');
  }

  async function editTourHandler(e: any) {
    e.preventDefault();

    const response = await fetch(`/api/tours/${props.tour.tourId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        body: description,
      }),
    });

    const editedProgramme = await response.json();

    if ('error' in editedProgramme) {
      setErrors(editedProgramme.error);
      return;
    }

    const returnTo = router.query.returnTo;

    if (
      returnTo &&
      !Array.isArray(returnTo) &&
      // Security: Validate returnTo parameter against valid path
      // (because this is untrusted user input)
      /^\/[a-zA-Z0-9-?=/]*$/.test(returnTo)
    ) {
      await router.push(returnTo);
    } else {
      // redirect to main page
      await router.push(`/`);
    }
  }

  return (
    <div>
      <Head>
        <title>Create Tour</title>
        <meta name="description" content="Create a tour" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <Link href="/tours">
          <button>All Tours</button>
        </Link>
        <br />
        <br />
        <form>
          <article css={tourDescription}>
            <p>{props.programme.filmTitle}</p>
            <p>{`${props.programme.date}`}</p>
            <p>at </p>
            <p>{props.programme.time} </p>
            <p>{props.programme.cinemaName}</p>
          </article>
          <br />
          <label htmlFor="body">Description:</label>
          <br />
          <br />
          <textarea
            id="body"
            rows={4}
            cols={25}
            value={description}
            maxLength={100}
            onChange={(event) => setDescription(event.currentTarget.value)}
            placeholder="Please, describe clearly in 100 characters the most basic details
  about your tour. "
          />
          <br />
          <br />

          <button
            onClick={(e) => {
              editTourHandler(e).catch(() => {
                console.log('Request fails');
              });
            }}
          >
            Edit Tour
          </button>
          <br />
          <button
            onClick={(e) => {
              deleteTourHandler(e).catch(() => {
                console.log('Request fails');
              });
            }}
          >
            Delete Tour
          </button>
          {errors.map((error) => (
            <div css={errorStyles} key={`error-${error.message}`}>
              {error.message}
            </div>
          ))}
        </form>
      </main>
    </div>
  );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const user = await getUserByValidSessionToken(
    context.req.cookies.sessionToken,
  );

  const baseUrl = await process.env.BASE_URL;

  const programmeId = context.query.programmeId;

  const programmeResponse = await fetch(
    `${baseUrl}/api/programmes/${Number(programmeId)}`,
  );

  const programme = await programmeResponse.json();

  const reducedProgramme = getReducedProgramme(programme);

  const tourResponse = await fetch(
    `${baseUrl}/api/tours/${Number(programmeId)}`,
  );

  const tour = await tourResponse.json();

  if (!user) {
    return {
      redirect: {
        destination: `/login?returnTo=/tours/create`,
        permanent: false,
      },
    };
  }

  if (!tour) {
    return {
      redirect: {
        destination: `/tours`,
      },
    };
  }

  return {
    props: { programme: reducedProgramme, tour: tour },
  };
}
