import React, {
  useState,
  useEffect
} from 'react';
import { httpGet } from '../helpers/fetch';
import {
  ViewTypes,
  getViewFromType
} from './ViewManagers';

import './App.css';

function App() {
  const [host, setHost] = useState('');
  const [curPath, setCurPath] = useState('');
  const [err, setErr] = useState(null);
  const [contents, setContents] = useState('fetching...');
  const [view, setView] = useState(ViewTypes.GRID);

  useEffect(() => {
    const query = new URLSearchParams(window.location.search);
    setHost(query.get('host'));
  }, []);

  useEffect(() => {
    if(!host) { return; }
    httpGet(`${host}/fs/contents/?path=${encodeURIComponent(curPath)}`)
      .then(({body}) => {
        setContents(body);
      })
      .catch(err => {
        setErr('Could not read contents of: ' + curPath);
        setContents([])
      });
  }, [host, curPath]);

  const ViewComponent = getViewFromType(view);
  return (
    <div className="App">
      <ViewComponent contents={contents} />
    </div>
  );
}

export default App;
