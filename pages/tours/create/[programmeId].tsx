/** @jsxImportSource @emotion/react */

import { css } from '@emotion/react';
import { GetServerSidePropsContext } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState } from 'react';
import {
  getProgrammeById,
  getUserByValidSessionToken,
  User,
} from '../../../utils/database';
import { getReducedProgramme } from '../../../utils/datastructures';

type Props = {
  programme: any;
  user: User;
};

export const errorStyles = css`
  background-color: #c24b4b;
  color: white;
  padding: 5px;
  margin-top: 5px;
`;

export default function CreateTour(props: Props) {
  const [description, setDescription] = useState('');
  const [errors, setErrors] = useState<{ message: string }[]>([]);
  const router = useRouter();

  async function createTourHandler(e: any) {
    e.preventDefault();

    const response = await fetch('/api/tours', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        programmeId: props.programme.programmeId,
        body: description,
        hostId: props.user.id,
      }),
    });

    const createdTour = await response.json();

    if ('error' in createdTour) {
      setErrors(createdTour.error);
      return;
    }

    await router.push(`/tours#${createdTour.id}`);
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
        <form>
          <div>
            <h2>
              {props.programme.filmTitle} <br /> at <br />{' '}
              {props.programme.date},
              <br />
              {props.programme.time} <br />
              {props.programme.cinemaName}
            </h2>
          </div>
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
          ></textarea>
          <br />
          <br />

          <button
            onClick={(e) => {
              createTourHandler(e).catch(() => {
                console.log('film request fails');
              });
            }}
          >
            Create Tour
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

  const programmeId = context.query.programmeId;

  const programme = await getProgrammeById(Number(programmeId));

  const reducedProgramme = getReducedProgramme(programme);

  if (!user) {
    return {
      redirect: {
        destination: `/login?returnTO=/tours/create`,
        permanent: false,
      },
    };
  }

  return {
    props: { user: user, programme: reducedProgramme },
  };
}
