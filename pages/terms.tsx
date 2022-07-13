/** @jsxImportSource @emotion/react */

import { css } from '@emotion/react';
import { GoogleMap, MarkerF, useLoadScript } from '@react-google-maps/api';
import Head from 'next/head';
import Link from 'next/link';
import { colors } from '../styles/constants';
import mapStyles from '../utils/mapStyles';

const termsStyles = css`
  section {
    border-bottom: 3px solid white;
  }

  .contact {
    border-bottom: none;
  }

  a {
    color: ${colors.blue};

    :hover {
      color: white;
    }
  }

  iframe {
    border-radius: 0px;
    width: 100vw;
  }

  strong {
    margin-right: 10px;
  }

  .map-container {
    margin: auto;
    width: 60%;
    height: 40vw;
    border-radius: 20px;
  }
`;

const options = {
  styles: mapStyles,
  disableDefaultUI: true,
  zoomControl: true,
};

type Props = {
  apiKey: string;
};

export default function Terms(props: Props) {
  // Google Maps
  //checking google maps api key
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: props.apiKey,
  });

  const center = { lat: 48.246239221589306, lng: 16.3749789405296 };

  return (
    <div>
      <Head>
        <title>Terms</title>
        <meta name="description" content="Terms & Conditions" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main css={termsStyles}>
        <Link href="/about">
          <button>About</button>
        </Link>
        <section className="violet">
          <h1>Legal Notices</h1>
          <p>
            The CineTour service, including all content provided on the CineTour
            service, is protected by copyright, trademark, trade secret or other
            intellectual property laws and treaties.
          </p>
          <h2>Copyright</h2>
          <p>
            The copyrights in the shows and movies on our service are owned by
            many great producers. If you believe your or someone else’s
            copyrights are being infringed upon through the CineTour service,
            let us know.
          </p>
          <h2>Trademarks</h2>
          <p>CineTour and the CineTour Logo are trademarks of CineTour, Inc.</p>
          <p>
            If you haven’t received our permission, do not use the CineTour
            marks as your own or in any manner that implies sponsorship or
            endorsement by CineTour.
          </p>
          <p>
            A product branded with the CineTour name or logo is a reflection of
            CineTour. Unless you are one of our licensees, we don’t allow others
            to make, sell, or give away anything with our name or logo on it.
          </p>
          <br />
        </section>
        <section className="blue">
          <h1>Newsletter</h1>
          <p>
            {' '}
            In order to receive our newsletter, you can sign up in the footer on
            our website. Any personal data provided by you will be used
            exclusively for the purpose of sending you our newsletter, which may
            include information or offers.
          </p>
          <p>
            We send our newsletters using the Mailchimp service. Your data will
            therefore be transmitted to the company Mailchimp, which is
            prohibited from using your data for any other purposes than that of
            sending you our newsletter. Mailchimp is not authorized to transfer
            or sell your data. At any time, you can revoke your consent to the
            storage of your data and its use for the purpose of sending you our
            newsletter, for example via the "unsubscribe" link in the
            newsletter.
          </p>
          <br />
        </section>
        <section className="contact">
          <h1>Contact</h1>
          <h2>CineTour Inc.</h2>
          <p>
            <strong>Address:</strong>Leystrasse 13, 1200 Wien
          </p>
          <p>
            <strong>E-mail:</strong>
            <a href="mailto:fritz.eierschale@example.org">
              fritz.eierschale@example.org
            </a>
          </p>
          <p>
            <strong>Tel: </strong>
            <a href="tel:068120268674">068120268674</a>
          </p>
        </section>
        <GoogleMap
          zoom={15}
          center={center}
          options={options}
          mapContainerClassName="map-container"
        >
          <MarkerF
            position={{
              lat: 48.246239221589306,
              lng: 16.3749789405296,
            }}
            icon={{
              url: '/nav/icon.png',
              scaledSize: new window.google.maps.Size(16, 16),
            }}
          />
        </GoogleMap>
      </main>
    </div>
  );
}

export async function getServerSideProps() {
  const baseUrl = await process.env.BASE_URL;
  const ApiKey = await process.env.NEXT_APP_GOOGLE_MAPS_API_KEY;

  return {
    // making data about the user available at the page in props
    props: {
      apiKey: ApiKey,
    },
  };
}
