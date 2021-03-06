import React, { useState, useEffect, useCallback } from 'react';
import _get from 'lodash/get';
import { useHistory } from '../helpers';
import { httpGet } from '../helpers/fetch';
import { ViewTypes, getViewFromType } from './ViewManagers';
import NavBar from './Nav';
import { HostContext, HostConfigContext } from '../common/contexts';

import './App.css';

const SEPARATOR_REGEX = /\/|\\/g;

function App() {
  const [host, setHost] = useState('');
  const {
    pushToHistory,
    popFromHistory,
    getTopItem,
    getStackHeight,
  } = useHistory();
  const [err, setErr] = useState(null);
  const [contents, setContents] = useState('fetching...');
  const [view /*, setView*/] = useState(ViewTypes.GRID);
  const [settings, setSettings] = useState({});
  const curPath = getTopItem();

  useEffect(() => {
    const query = new URLSearchParams(window.location.search);
    setHost(query.get('host'));

    (async () => {
      const settingsResp = await httpGet(`${host}/settings`);
      if (!settingsResp || settingsResp.err) {
        throw new Error('FS_CONFIG_CALL_FAILED');
      }
      setSettings(settingsResp);
      pushToHistory(_get(settingsResp, 'commonLocations.HOME', ''));
    })().catch((e) => {
      setErr(e.message);
      pushToHistory('');
    });
  }, []);

  useEffect(() => {
    if (!host || curPath === undefined) {
      return;
    }

    httpGet(`${host}/fs/contents/?path=${encodeURIComponent(curPath)}`)
      .then(({ body }) => {
        if (!body || body.err || !body.contents) {
          throw new Error();
        }
        setContents(body.contents);
        if (body.path && getTopItem() !== body.path) {
          popFromHistory();
          pushToHistory(body.path); // This will cause a second request back to server; Arrrrrrggggh
        }
      })
      .catch((err) => {
        setErr('Could not read contents of: ' + curPath);
        setContents([]);
      });
  }, [host, curPath]);

  const changeDirectory = useCallback((entry) => {
    if (entry.type !== 'DIR') {
      return; // Not a directory
    }
    pushToHistory(entry.fullPath);
  }, []);

  const openFile = useCallback((entry) => {
    if (entry.type === 'FILE') {
      return; // Not a file, we can't do much
    }
    console.log('We do not know how to open files yet!');
  }, []);

  const goBack = useCallback(() => {
    if (getStackHeight() < 2) {
      return;
    }
    popFromHistory();
  }, [getStackHeight]);

  const navigate = useCallback(
    (entry) => {
      switch (entry.type) {
        case 'DIR':
          changeDirectory(entry);
          break;
        case 'FILE':
          openFile(entry);
          break;
        default:
          console.log('Found a new type', entry.type);
      }
    },
    [changeDirectory, openFile]
  );

  const goUp = useCallback(() => {
    const curPath = getTopItem() || '';
    const separator = curPath.match(SEPARATOR_REGEX)[0];
    const newPath =
      curPath.split(SEPARATOR_REGEX).slice(0, -1).join(separator) || '/';

    // @todo - This requires special handling in windows.
    if (newPath === curPath) {
      // We're at root.
      return;
    }
    pushToHistory(newPath);
  }, [pushToHistory, getTopItem]);

  const ViewComponent = getViewFromType(view);
  return (
    <HostConfigContext.Provider value={settings}>
      <HostContext.Provider value={host}>
        <div className="App">
          <NavBar
            curPath={curPath}
            curView={view}
            navigate={navigate}
            goBack={goBack}
            goUp={goUp}
            hasBack={getStackHeight() > 1}
            hasForward={false}
          />
          <ViewComponent
            contents={contents}
            navigate={navigate}
            goBack={goBack}
          />
        </div>
      </HostContext.Provider>
    </HostConfigContext.Provider>
  );
}

export default App;
