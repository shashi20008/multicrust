const NON_STANDARD_KEY_MAPPINGS = {
  Down: 'ArrowDown',
  Up: 'ArrowUp',
  Left: 'ArrowLeft',
  Right: 'ArrowRight',
  Esc: 'Escape'
};
export function normalizeKey(key) {
  return NON_STANDARD_KEY_MAPPINGS[key] || key;
}

export function getIndexBelow(curIdx, numCols, maxItems) {
  curIdx = curIdx === -1 ? 0 : curIdx;
  const newIdx = curIdx + numCols;
  if(newIdx >= maxItems) {
    return (curIdx % numCols);
  }
  return newIdx;
}

export function getIndexAbove(curIdx, numCols, maxItems) {
  curIdx = curIdx === -1 ? 0 : curIdx;
  const newIdx = (curIdx - numCols);
  if(newIdx < 0) {
    const numRows = Math.floor(maxItems / numCols);
    const numItemsOnLastRow = maxItems % numCols;
    return ((numItemsOnLastRow > curIdx) ? numRows : (numRows - 1) ) * numCols + curIdx;
  }
  return newIdx;
}

