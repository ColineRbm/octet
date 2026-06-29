import fs from "node:fs";
import path from "node:path";

import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import type { ErrorRequestHandler } from "express";
import router from "./router";

const app = express();

// CORS — only allow client domain, with credentials for httpOnly cookies
if (process.env.CLIENT_URL != null) {
  app.use(
    cors({
      origin: process.env.CLIENT_URL,
      credentials: true,
    }),
  );
}

// Parse cookies — required for httpOnly JWT cookie
app.use(cookieParser());
app.use(express.json());

app.use(router);

const publicFolderPath = path.join(__dirname, "../../server/public");

if (fs.existsSync(publicFolderPath)) {
  app.use(express.static(publicFolderPath));
}

const clientBuildPath = path.join(__dirname, "../../client/dist");

if (fs.existsSync(clientBuildPath)) {
  app.use(express.static(clientBuildPath));

  app.get("*", (_, res) => {
    res.sendFile("index.html", { root: clientBuildPath });
  });
}

const logErrors: ErrorRequestHandler = (err, req, res, next) => {
  console.error(err);
  console.error("on req:", req.method, req.path);

  next(err);
};

app.use(logErrors);

export default app;
