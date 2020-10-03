import React, {
  useState,
  useEffect,
  useLayoutEffect,
  useCallback,
  useContext,
  useRef,
} from 'react';
import { httpGet } from '../helpers/fetch';
import { baseDir, relativePath, filterSuggestions } from '../helpers/utils';
import { HostContext } from '../common/contexts';
import { normalizeKey } from '../helpers';

import './NavLocation.css';

function NavLocation({ curPath, navigate }) {
  const host = useContext(HostContext);
  const [localPath, setLocalPath] = useState(curPath || '');
  const [curDir, setCurDir] = useState(() => baseDir(curPath));
  const dirContents = useRef([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [selected, setSelected] = useState(0);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLocalPath(curPath);
    setCurDir(baseDir(curPath));
    setSelected(0);
    dirContents.current = [];
    setFilteredItems([]);
  }, [curPath]);

  useEffect(() => {
    if (!curDir || !host) {
      return;
    }

    dirContents.current = [];
    setFilteredItems([]);

    httpGet(`${host}/fs/contents/?path=${encodeURIComponent(curDir)}`)
      .then(({ body }) => {
        if (!body || body.err || !body.contents) {
          throw new Error();
        }
        const allDirs = (body.contents || []).filter(
          ({ type }) => type === 'DIR'
        );
        dirContents.current = allDirs;
        setFilteredItems(filterSuggestions(allDirs, localPath));
      })
      .catch((err) => {
        dirContents.current = [];
        setFilteredItems([]);
      });
  }, [curDir]);

  useLayoutEffect(() => {
    const suggestions = document.querySelector('.nav-loc-suggestions');
    if (
      !suggestions ||
      !suggestions.children.length ||
      !suggestions.children[selected]
    ) {
      return;
    }
    const elem = suggestions.children[selected];
    if (elem.scrollIntoViewIfNeeded) {
      elem.scrollIntoViewIfNeeded();
    } else {
      elem.scrollIntoView({ block: 'center' });
    }
  }, [selected]);

  const onUserInput = useCallback((e) => {
    const { value } = e.target;
    setLocalPath(value);
    setCurDir(baseDir(value));
    setFilteredItems(filterSuggestions(dirContents.current, value));
    setError(null);
  }, []);

  const onKeyDown = useCallback(
    (e) => {
      const key = normalizeKey(e.key);
      const maxLen = filteredItems.length;
      switch (key) {
        case 'ArrowUp':
          setSelected((old) => (old - 1 + maxLen) % maxLen);
          e.preventDefault();
          break;
        case 'ArrowDown':
          setSelected((old) => (old + 1) % maxLen);
          e.preventDefault();
          break;
        case 'Enter':
          if (!filteredItems[selected]) {
            return setError(new Error('NO_SELECT'));
          }
          navigate(filteredItems[selected]);
          break;
        case 'Escape':
          document.querySelector('.fs-view-container').focus();
          break;
        default:
          break;
      }
    },
    [filteredItems, selected]
  );

  const animationEnd = useCallback(() => {
    setError(null);
  });

  return (
    <div className="nav-location-container">
      <input
        className={`nav-location-field ${error ? 'error-animation' : ''}`}
        placeholder="Type path to navigate..."
        value={localPath || ''}
        onChange={onUserInput}
        onKeyDown={onKeyDown}
        spellCheck={false}
        onAnimationEnd={animationEnd}
      />
      <div className="nav-loc-suggestions">
        {filteredItems
          .filter(({ type }) => type === 'DIR')
          .map((item, idx) => (
            <div
              className={`suggestion-item ${selected === idx ? 'focused' : ''}`}
              key={item.fullPath}
            >
              {item.name}
            </div>
          ))}
      </div>
    </div>
  );
}

export default NavLocation;
