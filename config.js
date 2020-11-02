//cache
const {RedisOptions} = require('ioredis');

const {
     REDIS_PORT = 6379,
     REDIS_HOST = 'localhost',
     REDIS_PASSWORD = 'secret'
} = process.env

module.exports = RedisOptions ={
    port: REDIS_PORT,
    host: REDIS_HOST,
    password: REDIS_PASSWORD
}

//session
const {SessionOptions} = require('express-session');

const TWO_HOURS = 1000 * 60 * 60 * 2;

const {
    SESS_NAME = "sid",
    SESS_SECRET = 'ssh!quiet,it\'asecret!',
    SESS_LIFETIME = TWO_HOURS,
    NODE_ENV ='development'
} = process.env;


module.exports = SessionOptions ={
    name: SESS_NAME,
    resave: false,
    saveUninitialized: false,
    secret: SESS_SECRET,
    rolling: true,
    cookie: {
        maxAge:SESS_LIFETIME,
        sameSite: true,
        secure: IN_PROD
    }
}

//port

module.exports = {
    NODE_ENV = 'development',
  
    APP_PORT = 3000
    // APP_HOSTNAME = 'localhost',
    // APP_PROTOCOL = 'http',
  
    // APP_SECRET = '4d2ca599b4189f74a771f44b8a8d06f572208b5649f5ae216f8e94612a267ff0'
} = process.env

//export const APP_ORIGIN = `${APP_PROTOCOL}://${APP_HOSTNAME}:${APP_PORT}`

module.exports = IN_PROD = NODE_ENV === 'production'

//db

const { ConnectionOptions } = require('mongoose');

const {
  MONGO_USERNAME = 'admin',
  MONGO_PASSWORD = 'secret',
  MONGO_HOST = 'localhost',
  MONGO_PORT = 27017,
  MONGO_DATABASE = 'auth'
} = process.env

module.exports = MONGO_URI = `mongodb://${MONGO_USERNAME}:${
  encodeURIComponent(MONGO_PASSWORD)
}@${MONGO_HOST}:${MONGO_PORT}/${MONGO_DATABASE}`

module.exports = ConnectionOptions = {
  useNewUrlParser: true,
  useUnifiedTopology: true
}