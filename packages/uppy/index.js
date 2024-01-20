#!/usr/bin/env node

import dotenv from 'dotenv'
dotenv.config()
import express from 'express'
import bodyParser from 'body-parser'
import session from 'express-session'
import companion from '@uppy/companion'
import $MemoryStore from 'memorystore'
import cors from 'cors'
import jwt from 'jsonwebtoken'


const appEnv = new Array(
  'SESSION_SECRET',
  'PORT',
  'FILEPATH',
  'UPLOAD_URLS',
  'SECRET',
  'B2_KEY',
  'B2_SECRET',
  'B2_BUCKET',
  'B2_ENDPOINT',
  'DRIVE_KEY',
  'DRIVE_SECRET',
  'DROPBOX_KEY',
  'DROPBOX_SECRET',
  'JWT_SECRET',
  'NEXT_PUBLIC_SITE_URL'
)

const appContext = {
  env: appEnv.reduce((acc, ev) => {
    if (typeof process.env[ev] === 'undefined') throw new Error(`${ev} is undefined in env`);
    acc[ev] = process.env[ev];
    return acc;
  }, {})
};


const MemoryStore = $MemoryStore(session)

console.log(`NEXT_PUBLIC_SITE_URL=${process.env.NEXT_PUBLIC_SITE_URL}`);
const corsOptions = {
  origin: process.env.NEXT_PUBLIC_SITE_URL,
  methods: ['POST','OPTIONS'],
  allowedHeaders: ['Authorization', 'X-Easter-Egg', 'Content-Type', 'Uppy-Versions', 'Accept'],
  exposedHeaders: ['Access-Control-Allow-Headers']
}


const app = express();
app.use(cors(corsOptions))
app.use(bodyParser.json())
app.use(
  session({
    store: new MemoryStore({
      checkPeriod: 86400000 // prune expired entries every 24h
    }),
    saveUninitialized: false,
    secret: process.env.SESSION_SECRET,
    resave: false,
  })
)

function verifyToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.sendStatus(401);
  }

  jwt.verify(token, new Buffer.from(process.env.JWT_SECRET, 'base64'), (err, user) => {
    if (err) {
      return res.sendStatus(403);
    }
    req.user = user;
    next();
  });
}


const config = {
  debug: true,
  logClientVersion: true,
  secret: process.env.SECRET,
  filePath: process.env.FILEPATH,
  server: {
    host: process.env.HOST
  },
  uploadUrls: process.env.UPLOAD_URLS,
  s3: {
    key: process.env.B2_KEY,
    secret: process.env.B2_SECRET,
    bucket: process.env.B2_BUCKET,
    region: process.env.B2_REGION,
    endpoint: process.env.B2_ENDPOINT,
    getAccelerateEndpoint: false
  },
  // providerOptions: {
  //   drive: {
  //     key: process.env.DRIVE_KEY,
  //     secret: process.env.DRIVE_SECRET,
  //   },
  //   dropbox: {
  //     key: process.env.DROPBOX_KEY,
  //     secret: process.env.DROPBOX_SECRET,
  //   },
  // }
}


const { app: companionApp, emitter } = companion.app(config);


app.use(verifyToken, companionApp);


const server = app.listen(process.env.PORT)

companion.socket(server)


