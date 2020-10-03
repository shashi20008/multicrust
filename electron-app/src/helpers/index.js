import { useState, useCallback } from 'react';

const NON_STANDARD_KEY_MAPPINGS = {
  Down: 'ArrowDown',
  Up: 'ArrowUp',
  Left: 'ArrowLeft',
  Right: 'ArrowRight',
  Esc: 'Escape',
};
export function normalizeKey(key) {
  return NON_STANDARD_KEY_MAPPINGS[key] || key;
}

export function getIndexBelow(curIdx, numCols, maxItems) {
  curIdx = curIdx === -1 ? 0 : curIdx;
  const newIdx = curIdx + numCols;
  if (newIdx >= maxItems) {
    return curIdx % numCols;
  }
  return newIdx;
}

export function getIndexAbove(curIdx, numCols, maxItems) {
  curIdx = curIdx === -1 ? 0 : curIdx;
  const newIdx = curIdx - numCols;
  if (newIdx < 0) {
    const numRows = Math.floor(maxItems / numCols);
    const numItemsOnLastRow = maxItems % numCols;
    return (
      (numItemsOnLastRow > curIdx ? numRows : numRows - 1) * numCols + curIdx
    );
  }
  return newIdx;
}

export function useHistory() {
  const [history, setHistory] = useState([]);

  const pushToHistory = useCallback((element) => {
    setHistory((old) => [...old, element]);
  }, []);

  const popFromHistory = useCallback(() => {
    const retVal = history[history.length - 1];
    setHistory((old) => old.slice(0, old.length - 1));
    return retVal;
  }, [history]);

  const getTopItem = useCallback(() => {
    return history[history.length - 1];
  }, [history]);

  const getStackHeight = useCallback(() => {
    return history.length;
  }, [history]);

  return {
    pushToHistory,
    popFromHistory,
    getTopItem,
    getStackHeight,
  };
}
