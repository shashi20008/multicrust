import React from 'react';
import _omit from 'lodash/omit';
import {
  FaFolder,
  FaFolderOpen,
  FaFile
} from 'react-icons/fa';

function getLogoFromType(type, selected) {
  if(type === 'DIR') {
    return selected ? FaFolderOpen : FaFolder;
  }
  return FaFile;
}

export default function FSEntry(props) {
  const Logo = getLogoFromType(props.type, props.selected);

  const restProps = _omit(props, ['selected', 'name', 'type', 'logo']);
  return (
    <div className={`fs-entry ${props.selected ? 'selected' : ''}`} onClick={props.onSelect} {...restProps}>
      <div className="fs-entry-logo">
        <Logo />
      </div>
      <div className="fs-entry-name">
        {props.name}
      </div>
    </div>
  );
};
