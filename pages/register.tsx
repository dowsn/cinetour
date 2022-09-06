/** @jsxImportSource @emotion/react */

import { css } from '@emotion/react';
import Axios from 'axios';
import { GetServerSidePropsContext } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState } from 'react';
// import { useCallback, useState } from 'react';
import { ImageUpload } from '../components/UploadImage';
import { getUsers, User } from '../utils/database';
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

type Props = {
  users: User[];
  refreshUserProfile: () => Promise<void>;
};

export default function Register(props: Props) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [selfDescription, setSelfDescription] = useState('');
  const [errors, setErrors] = useState<{ message: string }[]>([]);

  // async function getSignature() {
  //   const response = await fetch('/api/cloudinary');
  //   const data = await response.json();
  //   const { sign, timestamp } = data;
  //   return { sign, timestamp };
  // }

  // const [uploadedFiles, setUploadedFiles] = useState([]);
  // const [loading, setLoading] = useState(false);

  // const onDrop = useCallback((acceptedFiles: any) => {
  //   const url = `https://api.cloudinary.com/v1_1/${process.env.CLOUDINARY_CLOUD_NAME}/upload`;
  //   acceptedFiles.forEach(async (acceptedFile: any) => {
  //     setLoading(true);
  //     const { sign, timestamp } = await getSignature();
  //     const formData = new FormData();
  //     formData.append('file', acceptedFile);
  //     formData.append('signature', sign);
  //     formData.append('timestamp', timestamp);
  //     formData.append('api_key', process.env.CLOUDINARY_API_KEY);

  //     const response = await fetch(url, {
  //       method: 'post',
  //       body: formData,
  //     });
  //     const data = await response.json();

  //     setUploadedFiles((old: any) => [...old, data]);
  //     setLoading(false);
  //   });
  // }, []);

  // const { getRootProps, getInputProps, isDragActive } = useDropzone({
  //   onDrop,
  //   accepts: 'image/*',
  //   multiple: false,
  // });

  // // Remove itens from uploadFiles State and DELETE file from CLOUDINARY
  // async function handleRemoveFiles(public_id) {
  //   // Here will put all arrays again in uploadFile State where the public_id is different from parameter id.
  //   const newUploadedFiles = uploadedFiles.filter(
  //     (item) => item.public_id !== public_id,
  //   );
  //   // Update STATE with new list
  //   setUploadedFiles(newUploadedFiles);
  //   // DESTROY FILE in Cloudinary
  //   const response = await fetch(`/api/destroy/${public_id}`, {
  //     method: 'post',
  //     headers: {
  //       'Content-Type': 'application/json',
  //       Accept: 'application/json',
  //     },
  //   });
  //   const data = await response.json();
  //   console.log(data);
  // }

  const router = useRouter();

  // getting the current user id
  const ids = props.users.map((user) => user.id);
  const newUser = (Math.max(...ids) + 1).toString();

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

    // if there are errors show an error message
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
      await props.refreshUserProfile();
    } else {
      // redirecting
      await router.push(`/profile`);
      await props.refreshUserProfile();
    }
  }

  // uploading profile image
  // selected file
  const [imageSelected, setImageSelected] = useState<File | undefined>(
    undefined,
  );

  const uploadImage = async () => {
    // user image not selected - uploading default profile image for this user
    if (!imageSelected) {
      const formData: any = new FormData();
      formData.append(
        'file',
        'https://res.cloudinary.com/dkiienrq4/image/upload/v1659199929/cinetour/profile_image_krhvm8.png',
      );

      // how to set the folder and name to save
      formData.append('upload_preset', 'userlist');

      // using user id as profile image identifier
      formData.append('public_id', newUser);
      await Axios.post(
        'https://api.cloudinary.com/v1_1/dkiienrq4/image/upload',
        formData,
      ).then((response: any) => {
        console.log(response);
      });
      return;
    }

    const formData: any = new FormData();
    formData.append('file', imageSelected);

    // setting a folder and a name to save
    formData.append('upload_preset', 'userlist');
    formData.append('public_id', newUser);
    await Axios.post(
      'https://api.cloudinary.com/v1_1/dkiienrq4/image/upload',
      formData,
    ).then((response: any) => {
      console.log(response);
    });
  };

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
        />
        <br />
        <br />
        <label>
          Profile Image (optional)
          <br />
          <br />
          <div className="inputFile">
            <input
              type="file"
              accept=".jpg, .png, .tiff, .jpeg"
              onChange={(event) => {
                setImageSelected(event.currentTarget.files?.[0]);
              }}
            />
          </div>
        </label>
        <br />
        <br />
        <div>
          <ImageUpload />
        </div>
        <div className="editProfile">
          <button
            onClick={() => {
              registerHandler().catch(() => {
                console.log('Request fails');
              });
              uploadImage().catch(() => {
                console.log('Request fails');
              });
            }}
          >
            Register
          </button>
          <Link href="/login">
            <button>Cancel</button>
          </Link>
        </div>
        {errors.map((error) => (
          <div css={errorStyles} key={`error-${error.message}`}>
            {error.message}
          </div>
        ))}
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
        destination: `https://${context.req.headers.host}/register`,
        permanent: true,
      },
    };
  }

  // getting a list of all users to get the last user id from them
  const users = await getUsers();

  return {
    props: {
      users,
    },
  };
}
