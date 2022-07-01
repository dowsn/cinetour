import { GetServerSidePropsContext } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { useState } from 'react';
import { getUserByValidSessionToken } from '../../utils/database';

export function Create() {

  const [description, setDescription] = useState('')
  const router = useRouter();


  // the selection is mandatory
  handleSelect()
  // the description is mandatory
  handleCreate() {

    await router.push('../index')
  }

  return (
    <div>
      <Head>
        <title>Create Tour</title>
        <meta name="description" content="Create tour" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main css={createStyles}>
        <Link href='../tours'><button>All Tours</button></Link>
        <Link href="../index;">Return to Tours</Link>
        <form>
          <label>Please select the screening:</label>
          {/* same as cinema po upravach please a v kazdem button pridat*/}
          <label htmlFor="body">Description</label>
          <textarea
            id="body"
            rows={4}
            cols={25}
            value={description}
            maxLength={100}
            onChange={(event)=> setDescription(event.currentTarget.value)}
            placeholder="Please, describe clearly in 100 characters the most basic details
  about your tour. Where, when and how do you meet other cinetourists?
  Do you go directly to a cinema or do you plan something before or
  after."
          ></textarea>
          <button onClick={() => handleCreate()}>Create Tour</button>
        </form>
      </main>
    </div>
  );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const user = await getUserByValidSessionToken(
    context.req.cookies.sessionToken,
  );

  if (user) {
    return {
      // making data about the user available at the page in props
      props: { user: user },
    };
  }

  return {
    redirect: {
      destination: `/login?returnTO=/tours/create`,
      permanent: false,
    },
  };
}
