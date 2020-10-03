import React from 'react';
import _omit from 'lodash/omit';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faFolder,
  faFolderOpen,
  faFile,
} from '@fortawesome/free-solid-svg-icons';

function getLogoFromType(type, selected) {
  if (type === 'DIR') {
    return selected ? faFolderOpen : faFolder;
  }
  return faFile;
}

export default function FSEntry(props) {
  const logo = getLogoFromType(props.type, props.selected);

  const restProps = _omit(props, [
    'selected',
    'name',
    'type',
    'logo',
    'fullPath',
  ]);
  return (
    <div
      className={`fs-entry ${props.selected ? 'selected' : ''}`}
      onClick={props.onSelect}
      {...restProps}
    >
      <div className="fs-entry-logo">
        <FontAwesomeIcon icon={logo} />
      </div>
      <div className="fs-entry-name">{props.name}</div>
    </div>
  );
}
