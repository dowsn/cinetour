/** @jsxImportSource @emotion/react */

import { css } from '@emotion/react';
import Head from 'next/head';
import Link from 'next/link';

const termsStyles = css`
  color: white;
`;

export default function Terms() {
  // background: linear-gradient(90deg, rgba(38,38,38,1) 0%, rgba(98,9,165,1) 44%, rgba(38,38,38,1) 100%);
  return (
    <div>
      <Head>
        <title>Terms</title>
        <meta name="description" content="Terms & Conditions" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main css={termsStyles}>
        <section>
          <Link href="/about">
            <button>About</button>
          </Link>
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
        </section>
        <section>
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
        </section>
        <section>
          <h1>Contact</h1>
          <h2>CineTour Inc.</h2>
          <p>
            <strong>Address:</strong>Leystrasse 13, 1200 Wien
          </p>
          <p>
            <strong>E-mail:</strong>
            <a href="mailto:abc@example.com">abc@example.com</a>
          </p>
          <p>
            <strong>Tel: 0682932431234</strong>
            <a href="tel:123-456-7890">123-456-7890</a>
          </p>

          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2656.947811998939!2d16.372811715184472!3d48.246132051573696!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x476d0640d0f80201%3A0x5c80aa109f934e4e!2sLeystra%C3%9Fe%2013%2C%201200%20Wien!5e0!3m2!1sde!2sat!4v1656343227960!5m2!1sde!2sat"
            width="600"
            height="450"
          ></iframe>
        </section>
      </main>
    </div>
  );
}
