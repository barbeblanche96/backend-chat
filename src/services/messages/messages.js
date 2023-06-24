// For more information about this file see https://dove.feathersjs.com/guides/cli/service.html
import { authenticate } from '@feathersjs/authentication'

import { uploadFileMiddleware, multipartMiddlewareMessage } from '../../middlewares/upload-files-middleware.js'

import { hooks as schemaHooks } from '@feathersjs/schema'
import {
  messagesDataValidator,
  messagesPatchValidator,
  messagesQueryValidator,
  messagesResolver,
  messagesExternalResolver,
  messagesDataResolver,
  messagesPatchResolver,
  messagesQueryResolver
} from './messages.schema.js'
import { MessagesService, getOptions } from './messages.class.js'
import { messageCreateAroundHook } from '../../hooks/messages/message-create-around-hook.js'
import { messageCreateBeforeHook } from '../../hooks/messages/message-create-before-hook.js'
import { messageFindAroundHook } from '../../hooks/messages/message-find-around-hook.js'

export const messagesPath = 'messages'
export const messagesMethods = ['find', 'create']

export * from './messages.class.js'
export * from './messages.schema.js'

// A configure function that registers the service and its hooks via `app.configure`
export const messages = (app) => {
  // Register our service on the Feathers application
  app.use(messagesPath, new MessagesService(getOptions(app)), {
    // A list of all methods this service exposes externally
    methods: messagesMethods,
    // You can add additional custom events to be sent to clients here
    events: [],
    koa: {
      before: [multipartMiddlewareMessage.single('file'), uploadFileMiddleware]
    }

  })
  // Initialize hooks
  app.service(messagesPath).hooks({
    around: {
      all: [
        authenticate('jwt'),
        schemaHooks.resolveExternal(messagesExternalResolver),
        schemaHooks.resolveResult(messagesResolver)
      ],
      create : [
        messageCreateAroundHook
      ],
      find: [
        messageFindAroundHook
      ]
    },
    before: {
      all: [
        schemaHooks.validateQuery(messagesQueryValidator),
        schemaHooks.resolveQuery(messagesQueryResolver)
      ],
      find: [],
      get: [],
      create: [
        schemaHooks.validateData(messagesDataValidator),
        schemaHooks.resolveData(messagesDataResolver),
        messageCreateBeforeHook,
      ],
      patch: [
        schemaHooks.validateData(messagesPatchValidator),
        schemaHooks.resolveData(messagesPatchResolver)
      ],
      remove: []
    },
    after: {
      all: []
    },
    error: {
      all: []
    }
  })
}
