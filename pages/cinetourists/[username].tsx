import { GetServerSidePropsContext } from 'next';
import Head from 'next/head';
import {
  getUserByUsername,
  getUserByValidSessionToken,
  User,
} from '../../utils/database';

type Props = {
  user?: User;
};

export default function UserDetail(props: Props) {
  if (!props.user) {
    return (
      <>
        <Head>
          <title>User not found</title>
          <meta name="description" content="User not found" />
        </Head>
        <main>
          <br />
          <h1>User not found</h1>
        </main>
      </>
    );
  }

  return (
    <div>
      <title>{props.user.username}</title>
      <meta name="description" content="Cinetourist" />

      <main>
        <br />
        <h1>CineTourist {props.user.username}</h1>
        {/* copy without mail and map from profile */}
      </main>
    </div>
  );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const userNameFromUrl = context.query.username;

  // make sure that query param is a string
  if (!userNameFromUrl || Array.isArray(userNameFromUrl)) {
    return { props: {} };
  }
  const baseUrl = await process.env.BASE_URL;
  const request = await fetch(`${baseUrl}/api/users/${userNameFromUrl}`);

  const user = await request.json();

  if (!user) {
    context.res.statusCode = 404;
    return { props: {} };
  }

  const profile = await getUserByValidSessionToken(
    context.req.cookies.sessionToken,
  );

  if (profile && profile.username === user.username) {
    return {
      redirect: {
        destination: `/profile`,
        permanent: false,
      },
    };
  }

  return {
    props: {
      user: user,
    },
  };
}
