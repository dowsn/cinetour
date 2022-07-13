/** @jsxImportSource @emotion/react */

import { css } from '@emotion/react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { RegisterResponseBody } from './api/register';

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
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [selfDescription, setSelfDescription] = useState('');
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
      await router.push(returnTo);
    } else {
      // redirect to main page
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
        <div css={registerStyles}>
          <label>
            username:{' '}
            <input
              placeholder="cinetourist3"
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
              placeholder="Lukas"
              value={firstName}
              onChange={(event) => {
                setFirstName(event.currentTarget.value);
              }}
            />
          </label>
          <label>
            Last Name:
            <input
              placeholder="Fritzl"
              value={lastName}
              onChange={(event) => {
                setLastName(event.currentTarget.value);
              }}
            />
          </label>
          <label>
            E-Mail:
            <input
              placeholder="lukas@gmail.com"
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
          placeholder="Try to describe yourself in a few words."
          onChange={(event) => {
            setSelfDescription(event.currentTarget.value);
          }}
        ></textarea>
        <br />
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
