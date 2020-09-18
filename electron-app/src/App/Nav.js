import React from 'react'
import _noop from 'lodash/noop';
import {
  FontAwesomeIcon
} from '@fortawesome/react-fontawesome';
import {
  faArrowLeft,
  faArrowRight,
  faArrowUp
} from '@fortawesome/free-solid-svg-icons';

import './Nav.css';

function NavBar({ curPath, navigate, goBack, goForward, goUp, hasBack, hasForward }) {
  return (
    <div className="nav-bar">
      <div
        tabIndex={0}
        className={`nav-icon ${hasBack ? '' : 'disabled'}`}
        onClick={hasBack ? goBack : _noop}
      >
        <FontAwesomeIcon icon={faArrowLeft} />
      </div>
      <div
        tabIndex={0}
        className={`nav-icon ${hasForward ? '' : 'disabled'}`}
      >
        <FontAwesomeIcon icon={faArrowRight} />
      </div>
      <div className="nav-icon" tabIndex={0} onClick={goUp}>
        <FontAwesomeIcon icon={faArrowUp} />
      </div>
    </div>
  );
}

export default NavBar;

