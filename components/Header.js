/** @jsxImportSource @emotion/react */

import { css } from '@emotion/react';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { colors } from '../styles/constants';

const headerStyles = css`
  font-size: 1.5rem;
  position: fixed;
  top: 0;
  background-color: white;
  z-index: 999;
  width: 100%;
  height: 60px;
  border-bottom: 3px solid ${colors.violet};

  .header {
    display: flex;
    justify-content: space-between;
    z-index: 100;
    align-self: center;
    padding-bottom: 10px;
    padding-right: 1rem;
    padding-left: 1rem;
  }

  .logo {
    justify-self: center;
    cursor: pointer;
    height: 60px;

    :hover {
      border-bottom: solid ${colors.blue} 3px;
    }
  }

  nav {
    display: flex;
    justify-content: center;
    gap: 2rem;

    > div {
      margin: 0 auto 0;
    }
  }

  .and {
    color: ${colors.dark};
    padding-top: 14px;
  }

  .select {
    cursor: pointer;
    color: ${colors.violet};
    :hover {
      color: ${colors.blue};
    }
  }

  .option {
    cursor: pointer;
    display: flex;
    gap: 10px;
    padding-top: 14px;
    height: 60px;

    :hover {
      border-bottom: solid ${colors.blue} 3px;
    }
  }

  .profile {
    margin-right: 40px;
    margin-left: 80px;
  }

  body {
    margin: 0;
    padding: 0;
    color: ${colors.violet};
    background: white;
  }

  #menuToggle {
    display: block;
    position: relative;
    top: -2.6rem;
    left: 50%;

    -webkit-user-select: none;
    user-select: none;
  }

  #menuToggle a {
    text-decoration: none;
    color: ${colors.violet};

    transition: color 0.3s ease;
  }

  #menuToggle a:hover {
    color: ${colors.blue};
  }

  #menuToggle input {
    display: block;
    width: 40px;
    height: 32px;
    position: absolute;
    top: -7px;
    left: -5px;

    cursor: pointer;

    opacity: 0; /* hide this */
    z-index: 2; /* and place it over the hamburger */

    -webkit-touch-callout: none;
  }

  #menuToggle span {
    display: block;
    width: 33px;
    height: 4px;
    margin-bottom: 5px;
    position: relative;

    background: ${colors.dark};
    border-radius: 3px;

    z-index: 1;

    transform-origin: 4px 0px;

    transition: transform 0.5s cubic-bezier(0.77, 0.2, 0.05, 1),
      background 0.5s cubic-bezier(0.77, 0.2, 0.05, 1), opacity 0.55s ease;

    :hover {
      background: ${colors.violet};
    }
  }

  #menuToggle span:first-child {
    transform-origin: 0% 0%;
  }

  #menuToggle span:nth-last-child(2) {
    transform-origin: 0% 100%;
  }

  #menuToggle input:checked ~ span {
    opacity: 1;
    transform: rotate(45deg) translate(-1px, -1px);
    background: ${colors.blue};
  }

  #menuToggle input:checked ~ span:nth-last-child(3) {
    opacity: 0;
    transform: rotate(0deg) scale(0.2, 0.2);
  }

  #menuToggle input:checked ~ span:nth-last-child(2) {
    transform: rotate(-45deg) translate(0, -1px);
  }

  #menu {
    text-align: center;
    position: absolute;
    width: 400px;
    margin: 15px 0 0 50px;
    padding: 50px;
    padding-top: 10px;
    padding-bottom: 10px;
    background: white;
    list-style-type: none;
    -webkit-font-smoothing: antialiased;

    transform-origin: 0% 0%;
    transform: none;

    transition: transform 0.5s cubic-bezier(0.77, 0.2, 0.05, 1);
  }

  #menu li {
    padding: 10px 0;
    font-size: 22px;
  }

  #menuToggle input:checked ~ ul {
    transform: translate(-100%, 0);
  }
`;

export default function Header(props) {
  const [isExplore, setIsExplore] = useState(false);
  const [isMeet, setIsMeet] = useState(false);
  const [isProfile, setIsProfile] = useState(false);

  const onMouseEnter1 = () => setIsExplore(true);
  const onMouseLeave1 = () => setIsExplore(false);

  const onMouseEnter2 = () => setIsMeet(true);
  const onMouseLeave2 = () => setIsMeet(false);

  const onMouseEnter3 = () => setIsProfile(true);
  const onMouseLeave3 = () => setIsProfile(false);

  return (
    <header css={headerStyles} className="container-fluid align-items-center">
      <div className="header row">
        <div className="logo col-auto">
          <Link href="/">
            <Image
              src="/cinetour_logo.jpg"
              width="190px"
              height="50px"
              layout="fixed"
              alt="cinetour"
            />
          </Link>
        </div>
        <nav className="col-auto">
          <div
            onMouseEnter={onMouseEnter1}
            onMouseLeave={onMouseLeave1}
            className="select"
          >
            <Link href="/cinemas">
              {isExplore ? (
                <div className="option">
                  <Image
                    src="/nav/cinemas2.png"
                    alt="explore"
                    width="32px"
                    layout="fixed"
                    height="32px"
                  />
                  <span>Cinemas</span>
                </div>
              ) : (
                <div className="option">
                  <Image
                    src="/nav/cinemas1.png"
                    alt="explore"
                    layout="fixed"
                    width="32px"
                    height="32px"
                  />
                  <span>Cinemas</span>
                </div>
              )}
            </Link>
          </div>
          <span className="and"> & </span>
          <div
            onMouseEnter={onMouseEnter2}
            onMouseLeave={onMouseLeave2}
            className="select"
          >
            <Link href="/tours">
              {isMeet ? (
                <div className="option">
                  <Image
                    src="/nav/tours2.png"
                    alt="explore"
                    width="32px"
                    layout="fixed"
                    height="32px"
                  />
                  <span>Tours</span>
                </div>
              ) : (
                <div className="option">
                  <Image
                    src="/nav/tours1.png"
                    alt="explore"
                    layout="fixed"
                    width="32px"
                    height="32px"
                  />
                  <span>Tours</span>
                </div>
              )}
            </Link>
          </div>
        </nav>
        <div
          className="col-auto"
          onMouseEnter={onMouseEnter3}
          onMouseLeave={onMouseLeave3}
        >
          <Link href={props.user ? '/profile' : '/login'}>
            {isProfile ? (
              <div className="option profile">
                <Image
                  src="/nav/profile2.png"
                  alt="explore"
                  layout="fixed"
                  width="32px"
                  height="32px"
                />
              </div>
            ) : (
              <div className="option profile">
                <Image
                  src="/nav/profile1.png"
                  alt="explore"
                  layout="fixed"
                  width="32px"
                  height="32px"
                />
              </div>
            )}
          </Link>
        </div>
        <div>
          <nav role="navigation">
            <div id="menuToggle">
              <input type="checkbox" />

              <span></span>
              <span></span>
              <span></span>

              <ul id="menu">
                <li>
                  <Link href="/about">About</Link>
                </li>
                <li>
                  <Link href="/films">Films</Link>
                </li>
                <li>
                  <Link href="/cinetourists">Cinetourists</Link>
                </li>
                <li>
                  <Link href="/terms">Terms</Link>
                </li>
              </ul>
            </div>
          </nav>
        </div>
      </div>
    </header>
  );
}
