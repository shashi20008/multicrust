const { Router } = require("express");
const { getCommonLocs } = require("../fs");

const SettingsRouter = Router();

SettingsRouter.get("/", async (req, res) => {
  const result = await getCommonLocs();
  res.json(result);
});

module.exports = SettingsRouter;
