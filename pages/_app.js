import 'bootstrap/dist/css/bootstrap.css';
import { css, Global } from '@emotion/react';
import Head from 'next/head';
import Layout from '../components/Layout';
import { colors } from '../styles/constants';

function MyApp({ Component, pageProps }) {
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
            padding: 0;
            margin: 0;
            font-family: 'Capriola', sans-serif;
            color: ${colors.dark};
            text-align: center;
          }

          * {
            box-sizing: border-box;
          }

          footer {
            min-height: 20vh;
          }

          a {
            color: ${colors.violet};
            :hover {
              color: ${colors.blue};
              cursor: pointer;
            }
          }

          .a {
          }
          a {
            color: ${colors.blue};
            :hover {
              color: white;
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

          h1,
          h2 {
            padding-top: 20px;
            padding-bottom: 20px;
          }

          main {
            padding-top: 5rem;
            padding-bottom: 4rem;
            min-height: 75vh;
            background-color: ${colors.dark};
          }

          textarea {
            border-radius: 10px;
            padding: 10px;
          }

          .blue {
            margin-top: 10px;
            margin-bottom: 10px;
            color: ${colors.blue};
          }

          // youtube trailers
          iframe {
            border-top-left-radius: 20px;
            border-top-right-radius: 20px;
            margin-bottom: 0;
            border: 3px solid white;
            border-bottom: none;
            border-bottom: 0;
          }

          .map-container {
            margin: auto;
            width: 80%;
            height: 40vw;
            border-radius: 20px;

            h2 {
              color: ${colors.dark};
            }

            p {
              color: ${colors.dark};
            }
          }

          section {
            max-width: 60%;
            margin: auto;
          }

          .twocolumns {
            display: flex;
            justify-content: center;
            gap: 60px;
            margin: auto;
          }

          img {
            width: 100%;
            display: block;
          }

          ul {
            list-style: none;
            padding-left: 0;
            margin-left: 0;
          }

          input,
          select {
            font-family: 'Capriola', sans-serif;
            margin-right: 10px;
            padding: 3px;
            text-align: center;
            margin-left: 10px;
            margin-bottom: 10px;
            height: 32px;
            border-radius: 10px;
            outline: solid ${colors.dark} 2px;
            border: solid white 2px;

            :focus {
              border: solid ${colors.blue} 2px;
            }
          }

          footer {
            margin-bottom: 0;
          }

          button {
            font-family: 'Capriola', sans-serif;
            border-radius: 10px;
            min-height: 41px;
            background-color: ${colors.violet};
            color: white;
            padding: 5px;
            padding-right: 10px;
            margin-top: 10px;
            margin-bottom: 10px;
            padding-left: 10px;
            border: solid white 4px;

            :hover {
              background-color: ${colors.blue};
              cursor: pointer;
            }

            :disabled {
              background-color: ${colors.dark};
            }
          }

          .full {
            max-width: 100vw;
            margin: 0;
            padding: 0;
          }

          /* slider */
          .switch {
            position: relative;
            margin-left: 10px;
            display: inline-block;
            width: 60px;
            height: 34px;
          }

          .switch input {
            opacity: 0;
            width: 0;
            height: 0;
          }

          .slider {
            position: absolute;
            cursor: pointer;
            top: -6px;
            left: 0;
            right: 0;
            bottom: 5px;
            background-color: white;
            -webkit-transition: 0.4s;
            transition: 0.4s;
          }

          .slider:before {
            position: absolute;
            content: '';
            height: 26px;
            width: 26px;
            left: 4px;
            bottom: 5px;
            background-color: ${colors.dark};
            -webkit-transition: 0.4s;
            transition: 0.4s;
          }

          input:checked + .slider {
            background-color: ${colors.blue};
          }

          input:focus + .slider {
            box-shadow: 0 0 1px #2196f3;
          }

          input:checked + .slider:before {
            -webkit-transform: translateX(26px);
            -ms-transform: translateX(26px);
            transform: translateX(26px);
          }

          /* Rounded sliders */
          .slider.round {
            border-radius: 34px;
          }

          .slider.round:before {
            border-radius: 50%;
          }

          //programme display
          .date {
            background-color: ${colors.violet};
            margin-bottom: 0;
            border-top: 3px solid white;

            h2 {
              margin: 0;
            }
          }

          .programme {
            color: white;
            width: 100 vw;
            padding: 10px;
            border-top: 3px solid white;
            margin: 0;
          }

          // flex
          .flex {
            display: flex;
            gap: 5rem;
            justify-content: space-between;

            div {
              align-self: center;
              flex-wrap: wrap;
            }
          }

          .center {
            justify-content: center;
            gap: 1rem;
          }

          .profileImage {
            img {
              border-radius: 20px;
              height: 150px;
              width: 150px;
              margin: auto;
            }
          }

          // importing images
          .inputFile {
            input {
              color: white;
              padding: 10px;
              width: 20rem;
              height: 4rem;
            }
          }

          // profile changing buttons
          .editProfile {
            display: flex;
            gap: 20px;
            justify-content: center;
          }

          //tours

          .tours {
            color: white;
            text-align: center;
            margin-top: -15px;
            margin-bottom: 0;
            border-top: 3px solid white;
            width: 100%;
            padding-top: 35px;

            .videocontainer {
              margin: 0;
              padding-bottom: 0;
              height: 240px;
            }
            .description {
              width: 21.88rem;
              height: 32rem;
              background-color: black;
              border: 3px solid white;
              border-top: none;
              margin-top: 0;
              border-bottom-left-radius: 20px;
              border-bottom-right-radius: 20px;
            }

            .blue {
              margin-top: 10px;
              margin-bottom: 10px;
              color: ${colors.blue};
            }

            ul {
              display: flex;
              justify-content: center;
              margin: auto;
              gap: 20px;
              flex-wrap: wrap;
              width: 100%;
            }
            li {
              width: 350px;
            }
          }

          // buttons for tours
          .relative {
            position: relative;
            bottom: 70px;
            margin-bottom: 0;
          }

          // qr code
          .qr {
            height: 120px;
            width: 120px;
            margin: auto;
          }

          // white line to divided editable elements
          .whiteLine {
            height: 3px;
            background-color: white;
            width: 100%;
          }

          // long lists of films and users
          .longList {
            columns: 100px 3;
            ul {
            }
          }

          // responsiveness

          @media only screen and (max-width: 800px) {
            section {
              max-width: 100vw;
              margin: 1rem;
            }

            ul {
              flex-direction: column;
              align-items: center;
              margin: auto;
            }

            // second line of flex
            .second {
              flex-direction: column;
              gap: 10px;
            }

            .twocolumns {
              flex-direction: column;
              gap: 20px;
            }

            .filter {
              flex-direction: column;
              align-items: center;
              gap: 2px;
              margin: auto;
              padding: 0;

              input,
              select {
                width: 15rem;
                align-self: center;
              }

              .switch {
                margin-top: 10px;
                margin-left: 45%;
              }
            }

            .tours {
              margin-top: 0;
            }
          }
        `}
      />
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </>
  );
}

export default MyApp;
