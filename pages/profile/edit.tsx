/** @jsxImportSource @emotion/react */

import { css } from '@emotion/react';
import { GetServerSidePropsContext } from 'next';
import Head from 'next/head';
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

type Props = {
  user: User;
  profile: Profile;
};

export default function Register(props: Props) {
  const [username, setUsername] = useState(props.user.username);
  const [firstName, setFirstName] = useState(props.profile.firstName);
  const [lastName, setLastName] = useState(props.profile.lastName);
  const [email, setEmail] = useState(props.profile.email);
  const [selfDescription, setSelfDescription] = useState(
    props.profile.selfDescription,
  );
  const [errors, setErrors] = useState<{ message: string }[]>([]);

  const router = useRouter();

  async function updateHandler() {
    const updateResponse = await fetch('/api/profile', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: username,
        firstName: firstName,
        lastName: lastName,
        email: email,
        selfDescription: selfDescription,
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

  async function deleteHandler() {
    const response = await fetch(`/api/profile`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    const deletedUser = await response.json();

    if ('errors' in deletedUser) {
      setErrors(deletedUser.errors);
      return;
    }

    await router.push(`/login`);
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
            username:{' '}
            <input
              value={username}
              onChange={(event) => {
                setUsername(event.currentTarget.value);
              }}
            />
          </label>
          <label>
            First Name:
            <input
              value={firstName}
              onChange={(event) => {
                setFirstName(event.currentTarget.value);
              }}
            />
          </label>
          <label>
            Last Name:
            <input
              value={lastName}
              onChange={(event) => {
                setLastName(event.currentTarget.value);
              }}
            />
          </label>
          <label>
            E-Mail:
            <input
              type="email"
              value={email}
              onChange={(event) => {
                setEmail(event.currentTarget.value);
              }}
            />
          </label>
        </div>
        <br />
        <label htmlFor="selfdescription">Self-description:</label>
        <br />
        <textarea
          id="selfdescription"
          value={selfDescription}
          rows={4}
          cols={25}
          maxLength={100}
          onChange={(event) => {
            setSelfDescription(event.currentTarget.value);
          }}
        />
        <br />
        <button onClick={() => updateHandler()}>Update</button>
        <button onClick={() => deleteHandler()}>Delete Profile</button>
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

  if (user) {
    const profile = await getProfile(user.id);
    return {
      props: {
        user: user,
        profile: profile,
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
