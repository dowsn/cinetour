/** @jsxImportSource @emotion/react */

import { css } from '@emotion/react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { unstable_HistoryRouter } from 'react-router-dom';
import { RegisterResponseBody } from './api/register';

export const errorStyles = css`
  background-color: #c24b4b;
  color: white;
  padding: 5px;
  margin-top: 5px;
`;

type Props = {
  refreshUserProfile: () => Promise<void>;
};

export default function Register(props: Props) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [selfDescription, setSelfDescription] = useState('');
  const [street, setStreet] = useState('');
  const [streetNumber, setStreetNumber] = useState('');
  const [city, setCity] = useState('');

  const [errors, setErrors] = useState<{ message: string }[]>([]);

  const router = useRouter();

  async function registerHandler() {
    const registerResponse = await fetch('/api/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: username,
        password: password,
        firstName: firstName,
        lastName: lastName,
        email: email,
        street: street,
        streetNumber: streetNumber,
        city: city,
        selfDescription: selfDescription,
      }),
    });

    const registerResponseBody: RegisterResponseBody =
      await registerResponse.json();

    //if we have error show an error message
    if ('errors' in registerResponseBody) {
      setErrors(registerResponseBody.errors);
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
      await props.refreshUserProfile();
      await router.push(returnTo);
    } else {
      // redirect to main page
      await props.refreshUserProfile();
      await router.push(`/profile`);
    }
  }

  return (
    <div>
      <Head>
        <title>Register</title>
        <meta name="registration" content="register new user" />
      </Head>

      <main>
        <h1>Register</h1>
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
          password:{' '}
          <input
            type="password"
            value={password}
            onChange={(event) => {
              setPassword(event.currentTarget.value);
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
            value={email}
            onChange={(event) => {
              setEmail(event.currentTarget.value);
            }}
          />
        </label>
        <label>
          Street:
          <input
            value={streetNumber}
            onChange={(event) => {
              setStreet(event.currentTarget.value);
            }}
          />
        </label>
        <label>
          Street nr.:
          <input
            value={streetNumber}
            onChange={(event) => {
              setStreetNumber(event.currentTarget.value);
            }}
          />
        </label>
        <label>
          City
          <input
            value={city}
            onChange={(event) => {
              setCity(event.currentTarget.value);
            }}
          />
        </label>
        <label>
          Self-description:
          <textarea
            value={selfDescription}
            maxLength={100}
            placeholder="Try to describe yourself in a few words"
            onChange={(event) => {
              setSelfDescription(event.currentTarget.value);
            }}
          ></textarea>
        </label>
        <button onClick={() => registerHandler()}>Register</button>
        {errors.map((error) => (
          <div css={errorStyles} key={`error-${error.message}`}>
            {error.message}
          </div>
        ))}
      </main>
    </div>
  );
}
