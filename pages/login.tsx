/** @jsxImportSource @emotion/react */

import { css } from '@emotion/react';
import { GetServerSidePropsContext } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { colors } from '../styles/constants';
import { getUserByValidSessionToken } from '../utils/database';
import { LoginResponseBody } from './api/login';
import { errorStyles } from './register';

const loginStyles = css`
  a {
    color: ${colors.blue};

    :hover {
      color: white;
    }
  }
`;

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<
    {
      message: string;
    }[]
  >([]);
  const router = useRouter();

  const returnTo = router.query.returnTo;

  async function loginHandler() {
    const loginResponse = await fetch('/api/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: username,
        password: password,
      }),
    });

    const loginResponseBody: LoginResponseBody = await loginResponse.json();

    // if we have error show an error message
    if ('errors' in loginResponseBody) {
      setErrors(loginResponseBody.errors);
      return;
    }

    if (
      returnTo &&
      !Array.isArray(returnTo) &&
      // Security: Validate returnTo parameter against valid path
      // (because this is untrusted user input)
      /^\/[a-zA-Z0-9-?=/]*$/.test(returnTo)
    ) {
      await router.push(returnTo);
    } else {
      // redirect to user profile
      await router.push(`/profile`);
    }
  }

  return (
    <div>
      <Head>
        <title>Login</title>
        <meta name="login" content="Login a new user" />
      </Head>

      <main css={loginStyles}>
        <h1>Login</h1>
        <div className="container">
          <div className="row">
            <div className="col-auto" />
          </div>
          <label>
            username:{' '}
            <input
              placeholder="cinetourist1"
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
              placeholder="XXXXXX"
              value={password}
              onChange={(event) => {
                setPassword(event.currentTarget.value);
              }}
            />
          </label>
          <br />
          <button onClick={() => loginHandler()}>Login</button>
          {errors.map((error) => (
            <div css={errorStyles} key={`error-${error.message}`}>
              {error.message}
            </div>
          ))}
          <p>
            Not having an account yet?{' '}
            {returnTo ? (
              <Link href={`/register/?returnTo=${returnTo}`}>Register</Link>
            ) : (
              <Link href="/register">Register</Link>
            )}
          </p>
        </div>
      </main>
    </div>
  );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  // making sure we are using https
  if (
    context.req.headers.host &&
    context.req.headers['x-forwarded-proto'] &&
    context.req.headers['x-forwarded-proto'] !== 'https'
  ) {
    return {
      redirect: {
        destination: `https://${context.req.headers.host}/login`,
        permanent: true,
      },
    };
  }

  const loggedUser = await getUserByValidSessionToken(
    context.req.cookies.sessionToken,
  );

  if (loggedUser) {
    return {
      redirect: {
        destination: `/profile`,
        permanent: false,
      },
    };
  }

  return { props: {} };
}
