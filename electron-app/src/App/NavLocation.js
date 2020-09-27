import React, {
  useState,
  useEffect,
  useLayoutEffect,
  useCallback,
  useContext,
  useRef,
} from "react";
import { httpGet } from "../helpers/fetch";
import { baseDir, relativePath } from "../helpers/utils";
import { HostContext } from "../common/contexts";
import { normalizeKey } from "../helpers";

import "./NavLocation.css";

function NavLocation({ curPath }) {
  const host = useContext(HostContext);
  const [localPath, setLocalPath] = useState(curPath || "");
  const [curDir, setCurDir] = useState(() => baseDir(curPath));
  const dirContents = useRef([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [selected, setSelected] = useState(0);

  useEffect(() => {
    setLocalPath(curPath);
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
          ({ type }) => type === "DIR"
        );
        dirContents.current = allDirs;
        setFilteredItems(allDirs);
      })
      .catch((err) => {
        dirContents.current = [];
        setFilteredItems([]);
      });
  }, [curDir]);

  useLayoutEffect(() => {
    const suggestions = document.querySelector(".nav-loc-suggestions");
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
      elem.scrollIntoView({ block: "center" });
    }
  }, [selected]);

  const onUserInput = useCallback((e) => {
    console.log("user input detected", e.key);
    setLocalPath(e.target.value);
    setCurDir(baseDir(e.target.value));
  }, []);

  const onKeyDown = useCallback(
    (e) => {
      const key = normalizeKey(e.key);
      const maxLen = filteredItems.length;
      switch (key) {
        case "ArrowUp":
          setSelected((old) => (old - 1 + maxLen) % maxLen);
          e.preventDefault();
          break;
        case "ArrowDown":
          setSelected((old) => (old + 1) % maxLen);
          e.preventDefault();
          break;
        default:
          break;
      }
    },
    [filteredItems]
  );

  return (
    <div className="nav-location-container">
      <input
        className="nav-location-field"
        placeholder="Type path to navigate..."
        value={localPath || ""}
        onChange={onUserInput}
        onKeyDown={onKeyDown}
        spellCheck={false}
      />
      <div className="nav-loc-suggestions">
        {filteredItems
          .filter(({ type }) => type === "DIR")
          .map((item, idx) => (
            <div
              className={`suggestion-item ${selected === idx ? "focused" : ""}`}
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
