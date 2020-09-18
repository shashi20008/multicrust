const { homedir } = require("os");
const { Router } = require("express");
const { getContents } = require("../fs");
const router = Router();

router.get("/contents", (req, res) => {
  const { ignoreCache = false } = req.query;
  let { path } = req.query;

  if (!path) {
    path = homedir();
  }

  getContents(path, ignoreCache)
    .then((contents) =>
      res.json({
        path,
        contents,
      })
    )
    .catch((err) => res.json({ err: err.code }));
});

module.exports = router;
