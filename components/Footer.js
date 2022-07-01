import { css } from '@emotion/react';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { colors } from '../styles/constants';

const footerStyles = css`
  background-color: white;
  color: ${colors.dark};
  border-top: 3px solid #6209a5;
  bottom: 0;
  height: 20vh;
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
    border-top-right-radius: 0;
    border-bottom-right-radius: 0;
  }

  .button {
    padding: 18px;
    outline: solid ${colors.dark} 2px;
    margin: 0;
    border: none;
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
  const [mail, setMail] = useState(false);
  const [facebook, setFacebook] = useState(false);
  const [instagram, setInstagram] = useState(false);

  const onMouseEnter1 = () => setFacebook(true);
  const onMouseLeave1 = () => setFacebook(false);

  const onMouseEnter2 = () => setInstagram(true);
  const onMouseLeave2 = () => setInstagram(false);

  const onMouseEnter3 = () => setMail(true);
  const onMouseLeave3 = () => setMail(false);

  return (
    <footer css={footerStyles}>
      <div>
        <div className="newsletter">
          <input id="newsletter" placeholder="john@gmail.com" />
          <button type="submit" className="button">
            Join newsletter
          </button>
        </div>
        <nav>
          <div onMouseEnter={onMouseEnter1} onMouseLeave={onMouseLeave1}>
            <Link href="https://www.facebook.com/">
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
            <Link href="https://www.instagram.com/">
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
