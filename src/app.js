// For more information about this file see https://dove.feathersjs.com/guides/cli/application.html
import { feathers } from '@feathersjs/feathers'
import configuration from '@feathersjs/configuration'
import { koa, rest, bodyParser, errorHandler, parseAuthentication, cors, serveStatic } from '@feathersjs/koa'
import socketio from '@feathersjs/socketio'

import { configurationValidator } from './configuration.js'
import { logError } from './hooks/log-error.js'
import { mongodb } from './mongodb.js'

import { authentication } from './authentication.js'

import { services } from './services/index.js'
import { channels } from './channels.js'
import { defaultValue } from './hooks/default-value.js'

const app = koa(feathers())

// Load our app configuration (see config/ folder)
app.configure(configuration(configurationValidator))

// Set up Koa middleware
app.use(cors())
app.use(function (ctx, next) {
  const folderToAccess = ctx.originalUrl.toString().split('/')
  if (Array.isArray(folderToAccess) && folderToAccess.length >= 2) {
    if (['uploads'].includes(folderToAccess[1])) {
      return ctx.throw(401, 'You can not access this resources')
    }
  }
  return next()
})
app.use(serveStatic(app.get('public')))
app.use(errorHandler())
app.use(parseAuthentication())
app.use(bodyParser())

// Configure services and transports
app.configure(rest())
app.configure(
  socketio({
    cors: {
      origin: '*'
    }
  })
)

// configure sync for scaling
/*app.configure(
  sync({
    uri: process.env.REDIS_URI,
    redisOptions: { return_buffers: true },
    serialize: stringify,
    deserialize: parse
  })
)*/


app.configure(mongodb)

app.configure(authentication)

app.configure(services)

app.configure(channels)

// Register hooks that run on all service methods
app.hooks({
  around: {
    all: [defaultValue, logError]
  },
  before: {
    all: [
      (context) => {
        if (context.params?.query?.$paginate != null && context.params?.query?.$paginate != undefined) {
          context.params.paginate =
            context.params.query.$paginate === 'false' || context.params.query.$paginate === false
          delete context.params.query.$paginate
          return context
        }
      }
    ]
  },
  after: {},
  error: {}
})
// Register application setup and teardown hooks here
app.hooks({
  setup: [],
  teardown: []
})

export { app }
