// For more information about this file see https://dove.feathersjs.com/guides/cli/service.html
import { authenticate } from '@feathersjs/authentication'

import { hooks as schemaHooks } from '@feathersjs/schema'
import {
  requestsDataValidator,
  requestsPatchValidator,
  requestsQueryValidator,
  requestsResolver,
  requestsExternalResolver,
  requestsDataResolver,
  requestsPatchResolver,
  requestsQueryResolver
} from './requests.schema.js'
import { RequestsService, getOptions } from './requests.class.js'
import { requestCreateAroundHook } from '../../hooks/requests/request-create-around-hook.js'

export const requestsPath = 'requests'
export const requestsMethods = ['find', 'get', 'create', 'patch', 'remove']

export * from './requests.class.js'
export * from './requests.schema.js'

// A configure function that registers the service and its hooks via `app.configure`
export const requests = (app) => {
  // Register our service on the Feathers application
  app.use(requestsPath, new RequestsService(getOptions(app)), {
    // A list of all methods this service exposes externally
    methods: requestsMethods,
    // You can add additional custom events to be sent to clients here
    events: []
  })
  // Initialize hooks
  app.service(requestsPath).hooks({
    around: {
      all: [
        authenticate('jwt'),
        schemaHooks.resolveExternal(requestsExternalResolver),
        schemaHooks.resolveResult(requestsResolver)
      ],
      create : [
        requestCreateAroundHook,
      ]
    },
    before: {
      all: [
        schemaHooks.validateQuery(requestsQueryValidator),
        schemaHooks.resolveQuery(requestsQueryResolver)
      ],
      find: [],
      get: [],
      create: [
        schemaHooks.validateData(requestsDataValidator),
        schemaHooks.resolveData(requestsDataResolver)
      ],
      patch: [
        schemaHooks.validateData(requestsPatchValidator),
        schemaHooks.resolveData(requestsPatchResolver)
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
