// For more information about this file see https://dove.feathersjs.com/guides/cli/service.html
import { authenticate } from '@feathersjs/authentication'

import { hooks as schemaHooks } from '@feathersjs/schema'
import {
  discussionsDataValidator,
  discussionsPatchValidator,
  discussionsQueryValidator,
  discussionsResolver,
  discussionsExternalResolver,
  discussionsDataResolver,
  discussionsPatchResolver,
  discussionsQueryResolver
} from './discussions.schema.js'
import { DiscussionsService, getOptions } from './discussions.class.js'

export const discussionsPath = 'discussions'
export const discussionsMethods = ['find', 'get', 'create', 'patch', 'remove']

export * from './discussions.class.js'
export * from './discussions.schema.js'

// A configure function that registers the service and its hooks via `app.configure`
export const discussions = (app) => {
  // Register our service on the Feathers application
  app.use(discussionsPath, new DiscussionsService(getOptions(app)), {
    // A list of all methods this service exposes externally
    methods: discussionsMethods,
    // You can add additional custom events to be sent to clients here
    events: []
  })
  // Initialize hooks
  app.service(discussionsPath).hooks({
    around: {
      all: [
        authenticate('jwt'),
        schemaHooks.resolveExternal(discussionsExternalResolver),
        schemaHooks.resolveResult(discussionsResolver)
      ]
    },
    before: {
      all: [
        schemaHooks.validateQuery(discussionsQueryValidator),
        schemaHooks.resolveQuery(discussionsQueryResolver)
      ],
      find: [],
      get: [],
      create: [
        schemaHooks.validateData(discussionsDataValidator),
        schemaHooks.resolveData(discussionsDataResolver)
      ],
      patch: [
        schemaHooks.validateData(discussionsPatchValidator),
        schemaHooks.resolveData(discussionsPatchResolver)
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
