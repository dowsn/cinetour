import { css } from '@emotion/react';
import axios from 'axios';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { colors } from '../styles/constants';

const footerStyles = css`
  background-color: white;
  color: ${colors.dark};
  border-top: 3px solid #6209a5;
  bottom: 0;
  z-index: 999;
  color: #000c07;
  display: flex;
  justify-content: center;
  flex-direction: column;
  gap: 30px;

  a {
    color: ${colors.violet};
    text-decoration: none;
    cursor: pointer;

    :hover {
      color: ${colors.blue};
    }
  }

  p {
    color: ${colors.dark};
    text-align: center;
  }

  img {
    cursor: pointer;
  }

  .newsletter {
    padding: 10px;
    display: flex;
    justify-content: center;
    justify-self: center;
    gap: 0;
    line-height: 0rem;
  }

  label {
    color: ${colors.dark};
  }

  input {
    width: 10rem;
    margin: 0;
    margin-top: 2px;
    border-top-right-radius: 0;
    border-bottom-right-radius: 0;
  }

  .button {
    border: solid ${colors.dark} 2px;
    margin: 0;
    margin-bottom: 2px;
    height: 36px;
    max-width: 300px;
    border-top-left-radius: 0;
    border-bottom-left-radius: 0;
  }

  nav {
    margin-top: 1rem;
    display: flex;
    justify-content: center;
    flex-direction: row;
    gap: 10px;
  }
`;

export default function Footer() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [state, setState] = useState('');

  const [mail, setMail] = useState(false);
  const [facebook, setFacebook] = useState(false);
  const [instagram, setInstagram] = useState(false);

  const onMouseEnter1 = () => setFacebook(true);
  const onMouseLeave1 = () => setFacebook(false);

  const onMouseEnter2 = () => setInstagram(true);
  const onMouseLeave2 = () => setInstagram(false);

  const onMouseEnter3 = () => setMail(true);
  const onMouseLeave3 = () => setMail(false);

  const subscribe = async () => {
    setError('');
    try {
      const response = await axios.post('/api/newsletter', { email });
      setState('success');
    } catch (e) {
      setError(e.response.data.error);
      setState('error');
    }
  };

  return (
    <footer css={footerStyles}>
      <div>
        <div className="newsletter">
          <input
            id="newsletter"
            placeholder="lukas@gmail.com"
            value={email}
            onChange={(event) => setEmail(event.currentTarget.value)}
          />
          <button type="button" className="button" onClick={subscribe}>
            ✓ Newsletter
          </button>
        </div>
        {state === 'error' && <p>{error}</p>}
        {state === 'success' && <p>Success!</p>}
        <nav>
          <div onMouseEnter={onMouseEnter1} onMouseLeave={onMouseLeave1}>
            <Link href="https://www.facebook.com/CineTour_Vienna">
              {facebook ? (
                <Image
                  src="/contact/facebook2.png"
                  alt="mail"
                  width="32px"
                  layout="fixed"
                  height="32px"
                />
              ) : (
                <Image
                  src="/contact/facebook1.png"
                  alt="mail"
                  width="32px"
                  layout="fixed"
                  height="32px"
                />
              )}
            </Link>
          </div>
          <div onMouseEnter={onMouseEnter2} onMouseLeave={onMouseLeave2}>
            <Link href="https://www.instagram.com/cinetour_vienna/">
              {instagram ? (
                <Image
                  src="/contact/instagram2.png"
                  alt="mail"
                  width="32px"
                  layout="fixed"
                  height="32px"
                />
              ) : (
                <Image
                  src="/contact/instagram1.png"
                  alt="mail"
                  width="32px"
                  layout="fixed"
                  height="32px"
                />
              )}
            </Link>
          </div>
          <div onMouseEnter={onMouseEnter3} onMouseLeave={onMouseLeave3}>
            <Link href="mailto:fritz.eierschale@example.org">
              {mail ? (
                <Image
                  src="/contact/mail2.png"
                  alt="mail"
                  width="32px"
                  layout="fixed"
                  height="32px"
                />
              ) : (
                <Image
                  src="/contact/mail1.png"
                  alt="mail"
                  width="32px"
                  layout="fixed"
                  height="32px"
                />
              )}
            </Link>
          </div>
        </nav>
      </div>
    </footer>
  );
}
