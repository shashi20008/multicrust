const express = require("express");
const { isPrivate, isLocalhost } = require("is-in-subnet");

const fsRouter = require("./fs-router");
const settingsRouter = require("./settings-router");

const LOCAL_MODE = !!process.env.LOCAL_MODE;
const PORT = LOCAL_MODE ? 0 : 7411; // get it from config, once we have those.
const app = express();

/**
 * In local mode reject connections from non-local IPs.
 * For now lets reject all out of subnet connections.
 */
app.use((req, res, next) => {
  const remoteIP = req.socket.remoteAddress;
  console.log("remote IP", remoteIP);
  const localhost = isLocalhost(remoteIP);
  if (LOCAL_MODE && !localhost) {
    return res.status(403).end();
  }

  if (!localhost && !isPrivate(remoteIP)) {
    return res.status(403).end();
  }

  if (LOCAL_MODE) {
    res.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");
  }
  next();
});

app.use("/fs", fsRouter);
app.use("/settings", settingsRouter);

const srv = app.listen(PORT, () => {
  const realPort = srv.address().port;
  console.log(`Server started on ${realPort}`);
  if (LOCAL_MODE) {
    process.send(realPort);
  }
});
