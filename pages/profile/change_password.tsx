/** @jsxImportSource @emotion/react */

import { css } from '@emotion/react';
import { GetServerSidePropsContext } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState } from 'react';
import {
  getProfile,
  getUserByValidSessionToken,
  Profile,
  User,
} from '../../utils/database';

export const errorStyles = css`
  background-color: #c24b4b;
  color: white;
  padding: 5px;
  margin-top: 5px;
`;

const registerStyles = css`
  display: flex;
  flex-direction: column;
  align-items: center;

  label {
    width: 300px;
    display: flex;
    justify-content: space-between;
    align-content: center;
  }
`;

export default function Register() {
  const [newPassword, setNewPassword] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [errors, setErrors] = useState<{ message: string }[]>([]);

  const router = useRouter();

  async function updateHandler() {
    const updateResponse = await fetch('/api/profile/', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        currentPassword: currentPassword,
        newPassword: newPassword,
      }),
    });

    const updateResponseBody = await updateResponse.json();

    // if we have error show an error message
    if ('errors' in updateResponseBody) {
      setErrors(updateResponseBody.errors);
      return;
    }

    await router.push(`/profile`);
  }

  return (
    <div>
      <Head>
        <title>Edit Profile</title>
        <meta name="edit" content="edit or delete your profile" />
      </Head>
      <main>
        <h1>Edit Profile</h1>
        <div css={registerStyles}>
          <label>
            Current Password:
            <input
              value={currentPassword}
              onChange={(event) => {
                setCurrentPassword(event.currentTarget.value);
              }}
            />
          </label>
          <label>
            New Password:
            <input
              value={newPassword}
              onChange={(event) => {
                setNewPassword(event.currentTarget.value);
              }}
            />
          </label>
        </div>
        <button onClick={() => updateHandler()}>Create New Password</button>
        <Link href="/profile">
          <button>Cancel</button>
        </Link>
        {errors.map((error) => (
          <div css={errorStyles} key={`error-${error.message}`}>
            {error.message}
          </div>
        ))}
      </main>
    </div>
  );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const user = await getUserByValidSessionToken(
    context.req.cookies.sessionToken,
  );

  if (!user) {
    return {
      redirect: {
        destination: `/login?returnTo=/profile`,
        permanent: false,
      },
    };
  }

  return {
    props: {},
  };
}
