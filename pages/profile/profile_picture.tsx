import Axios from 'axios';
// import cloudinary from 'cloudinary';
import { GetServerSidePropsContext } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { getUserByValidSessionToken, User } from '../../utils/database';

type Props = {
  user: User;
};

export default function ProfileImage(props: Props) {
  // selected file
  const [imageSelected, setImageSelected] = useState<File | undefined>(
    undefined,
  );

  // router
  const router = useRouter();

  // uploading profile image
  const uploadImage = async () => {
    if (!imageSelected) {
      return;
    }

    // in progress:

    // cloudinary.uploader.destroy(
    //   `userlist/${props.user.id}`,
    //   function (result: any) {
    //     console.log(result);
    //   },
    // );

    const formData: any = new FormData();
    formData.append('file', imageSelected);

    // how to set the folder and name to save
    formData.append('upload_preset', 'userlist');
    formData.append('public_id', props.user.id);
    await Axios.post(
      'https://api.cloudinary.com/v1_1/dkiienrq4/image/upload',
      formData,
    ).then((response: any) => {
      console.log(response);
    });

    await router.push(`/profile`);
  };

  return (
    <>
      <Head>
        <title>Change Picture</title>
        <meta name="description" content="Change your profile image" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="inputFile">
        <h1>Change your Profile Picture</h1>
        <input
          type="file"
          accept=".jpg, .png, .tiff, .jpeg"
          onChange={(event) => {
            setImageSelected(event.currentTarget.files?.[0]);
          }}
        />
        <button disabled={!imageSelected} onClick={() => uploadImage()}>
          Upload Profile Photo
        </button>
        <Link href="/profile">
          <button>Cancel</button>
        </Link>
      </main>
    </>
  );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const user = await getUserByValidSessionToken(
    context.req.cookies.sessionToken,
  );

  if (user) {
    return {
      // making data about the user available at the page in props
      props: {
        user: user,
      },
    };
  }

  return {
    redirect: {
      destination: `/login?returnTo=/profile`,
      permanent: false,
    },
  };
}
