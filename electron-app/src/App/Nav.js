import React from "react";
import _noop from "lodash/noop";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowLeft,
  faArrowRight,
  faArrowUp,
  faTh,
  faThList,
} from "@fortawesome/free-solid-svg-icons";
import { ViewTypes } from "./ViewManagers";

import "./Nav.css";

function NavBar({
  curPath,
  curView,
  navigate,
  goBack,
  goForward,
  goUp,
  hasBack,
  hasForward,
}) {
  return (
    <div className="nav-bar">
      <div
        {...(hasBack ? { tabIndex: 0 } : {})}
        className={`nav-icon ${hasBack ? "" : "disabled"}`}
        onClick={hasBack ? goBack : _noop}
      >
        <FontAwesomeIcon icon={faArrowLeft} />
      </div>
      <div
        {...(hasForward ? { tabIndex: 0 } : {})}
        className={`nav-icon ${hasForward ? "" : "disabled"}`}
      >
        <FontAwesomeIcon icon={faArrowRight} />
      </div>
      <div className="nav-icon" tabIndex={0} onClick={goUp}>
        <FontAwesomeIcon icon={faArrowUp} />
      </div>
      <div className="v-divider" />
      <div
        className={`nav-icon ${curView === ViewTypes.GRID ? "active" : ""}`}
        tabIndex={0}
      >
        <FontAwesomeIcon icon={faTh} />
      </div>
      <div
        className={`nav-icon ${curView === ViewTypes.LIST ? "active" : ""}`}
        tabIndex={0}
      >
        <FontAwesomeIcon icon={faThList} />
      </div>
      <input
        className="nav-location-field"
        placeholder="Type path to navigate..."
        value={curPath || ""}
        spellCheck={false}
      />
    </div>
  );
}

export default NavBar;
