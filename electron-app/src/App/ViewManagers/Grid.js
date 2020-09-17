import React, {
  useState,
  useEffect,
  useRef,
  useCallback
} from 'react';
import _get from 'lodash/get';
import FSEntry from '../Entry';
import {
  normalizeKey,
  getIndexBelow,
  getIndexAbove
}  from '../../helpers';

import './Grid.css';

function GridView({ contents, navigate, goBack }) {
  const [selected, setSelected] = useState(-1);
  const container = useRef(null);
  const numColumns = useRef(0);

  // Make it recalculate on resize.
  useEffect(() => {
    if(!container.current || !container.current.children.length) {
      numColumns.current = 0;
      return;
    }

    let columns = 0;
    const allChildren = Array.from(container.current.children);
    const topRow = allChildren[0].offsetTop;
    numColumns.current = allChildren.findIndex(child => child.offsetTop !== topRow);
    if(numColumns.current < 0) {
      numColumns.current = allChildren.length;
    }
  }, [
    _get(container, 'current.offsetWidth', 0),
    _get(container, 'current.children.length', 0)
  ]);

  const onSelect = useCallback((e) => {
    const {currentTarget} = e;
    let {target} = e;
    while(target !== currentTarget && !target.classList.contains('fs-entry')) {
      target = target.parentElement;
    }
    if(target.classList.contains('fs-entry')) {
      setSelected(Number(target.getAttribute('data-idx')));
    }
    else {
      setSelected(-1);
    }
  }, []);

  const onDoubleClick = useCallback((e) => {
    // This is not gonna work if click doesn't fire before hand.
    navigate(contents[selected]);
  }, [ contents, selected, onSelect, navigate ]);

  const onKeyPress = useCallback((e) => {
    const key = normalizeKey(e.key);
    switch(key) {
      case 'ArrowLeft':
        setSelected(old => (Math.max(old, 0) - 1 + contents.length) % contents.length);
        break;
      case 'ArrowRight':
        setSelected(old => (old + 1) % contents.length)
        break;
      case 'ArrowUp':
        setSelected(old => getIndexAbove(old, numColumns.current, contents.length));
        break;
      case 'ArrowDown':
          setSelected(old => getIndexBelow(old, numColumns.current, contents.length));
        break;
      case 'Enter':
        navigate(contents[selected]);
        break;
      case 'Backspace':
        goBack();
        break;
    }
  }, [contents, selected, navigate, goBack]);

  return (
    <div
      className="fs-view-container fs-grid-container"
      tabIndex={-1}
      onClick={onSelect}
      onDoubleClick={onDoubleClick}
      onKeyDown={onKeyPress}
    >
      <div ref={container} className="fs-view grid-view" >
        { mapContents(contents, selected) }
      </div>
    </div>
  );
}

function mapContents(contents, selected, onSelect) {
  if(!Array.isArray(contents)) {
    return contents;
  }
  else if(!contents.length) {
    return <NoContents />;
  }
  else {
    return contents.map((entry, idx) =>
      <div key={idx}><FSEntry {...entry} selected={idx === selected} onSelect={onSelect} data-idx={idx} /></div>);
  }
}

function NoContents() {
  return (
    <span className="grid-view-empty">'This folder is empty'</span>
  );
}

export default GridView;

