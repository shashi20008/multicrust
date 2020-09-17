const { homedir } = require('os');
const { Router } = require('express');
const { getContents } = require('../fs');
const router = Router();

router.get('/contents', (req, res)  => {
  const { path, ignoreCache = false } = req.query;

  getContents(path || homedir(), ignoreCache)
    .then(contents => res.json(contents))
    .catch(err => res.json({ err: err.code }))
});

module.exports = router;
