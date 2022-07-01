import 'bootstrap/dist/css/bootstrap.css';
import { css, Global } from '@emotion/react';
import Head from 'next/head';
import { useCallback, useEffect, useState } from 'react';
import Layout from '../components/Layout';
import { colors } from '../styles/constants';

function MyApp({ Component, pageProps }) {
  const [user, setUser] = useState();

  // hooks stores a functions for callback

  const refreshUserProfile = useCallback(async () => {
    const profileResponse = await fetch('/api/profile');
    const profileResponseBody = await profileResponse.json();
    if (!('errors' in profileResponseBody)) {
      setUser(profileResponseBody.user);
    } else {
      profileResponseBody.errors.forEach((error) => console.log(error.message));
      setUser(undefined);
    }
  }, []);

  useEffect(() => {
    refreshUserProfile().catch(() => console.log('fetch api failed'));
  }, [refreshUserProfile]);

  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      ;
      <Global
        styles={css`
          html,
          body {
            /* padding: 0;
            margin: 0; */
            font-family: 'Capriola', sans-serif;
            background-color: ${colors.dark};
            color: ${colors.dark};
          }

          * {
            box-sizing: border-box;
          }

          footer {
            min-height: 20vh;
          }

          a {
            :hover {
              cursor: pointer;
            }
          }

          h1,
          h2,
          h3,
          p,
          label {
            color: white;
          }

          main {
            margin-top: 6rem;
            margin-bottom: 6rem;
            height: 100vw;
          }

          /* .box {
            border-radius: 20px;
          } */

          iframe {
            border-top-left-radius: 20px;
            border-top-right-radius: 20px;
          }

          /* p {
            font-weight: 300;
          }

          h1 {
            margin: 40px auto 70px;
            text-align: center;
          }

          h2 {
            margin: 40px auto 40px;
            text-align: center;
          } */

          img {
            width: 100%;
            display: block;
          }

          input {
            font-family: 'Capriola', sans-serif;
            margin-right: 10px;
            padding: 10px;
            margin-left: 10px;
            border-radius: 10px;
            outline: solid ${colors.dark} 2px;
            border: solid white 2px;

            padding: 10px;

            :focus {
              border: solid ${colors.blue} 2px;
            }
          }

          footer {
            margin-bottom: 0;
          }

          button {
            font-family: 'Capriola', sans-serif;
            padding-right: 30px;
            padding-left: 30px;
            padding-top: 10px;
            padding-bottom: 10px;
            border-radius: 10px;
            background-color: ${colors.violet};
            color: white;
            border: solid white 4px;

            :hover {
              background-color: ${colors.blue};
              cursor: pointer;
            }

            :disabled {
              background-color: ${colors.dark};
            }
          }
        `}
      />
      <Layout user={user}>
        <Component {...pageProps} refreshUserProfile={refreshUserProfile} />
      </Layout>
    </>
  );
}

export default MyApp;
