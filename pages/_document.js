import { Head, Html, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html>
      <Head>
        <link
          href="https://fonts.googleapis.com/css2?family=Capriola&display=swap"
          rel="stylesheet"
          type="text/css"
        />
        <link rel="icon" href="/favicon.ico" />

        <script
          defer
          src="https://widget.cloudinary.com/v2.0/global/all.js"
          type="text/javascript"
        />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
