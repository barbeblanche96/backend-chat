// For more information about this file see https://dove.feathersjs.com/guides/cli/service.html
import { authenticate } from '@feathersjs/authentication'

import { hooks as schemaHooks } from '@feathersjs/schema'
import {
  contactsDataValidator,
  contactsPatchValidator,
  contactsQueryValidator,
  contactsResolver,
  contactsExternalResolver,
  contactsDataResolver,
  contactsPatchResolver,
  contactsQueryResolver
} from './contacts.schema.js'
import { ContactsService, getOptions } from './contacts.class.js'
import { contactGetAroundHook } from '../../hooks/contacts/contact-get-around-hook.js'
import { contactFindAroundHook } from '../../hooks/contacts/contact-find-around-hook.js'
import { contactPatchAroundHook } from '../../hooks/contacts/contact-patch-around-hook.js'
import { contactRemoveAroundHook } from '../../hooks/contacts/contact-remove-around-hook.js'

export const contactsPath = 'contacts'
export const contactsMethods = ['find', 'get', 'patch', 'remove']

export * from './contacts.class.js'
export * from './contacts.schema.js'

// A configure function that registers the service and its hooks via `app.configure`
export const contacts = (app) => {
  // Register our service on the Feathers application
  app.use(contactsPath, new ContactsService(getOptions(app)), {
    // A list of all methods this service exposes externally
    methods: contactsMethods,
    // You can add additional custom events to be sent to clients here
    events: []
  })
  // Initialize hooks
  app.service(contactsPath).hooks({
    around: {
      all: [
        authenticate('jwt'),
        schemaHooks.resolveExternal(contactsExternalResolver),
        schemaHooks.resolveResult(contactsResolver)
      ],
      get: [
        contactGetAroundHook
      ],
      find : [
        contactFindAroundHook
      ],
      patch : [
        contactPatchAroundHook
      ],
      remove : [
        contactRemoveAroundHook
      ]
    },
    before: {
      all: [
        schemaHooks.validateQuery(contactsQueryValidator),
        schemaHooks.resolveQuery(contactsQueryResolver)
      ],
      find: [],
      get: [],
      create: [
        schemaHooks.validateData(contactsDataValidator),
        schemaHooks.resolveData(contactsDataResolver)
      ],
      patch: [
        schemaHooks.validateData(contactsPatchValidator),
        schemaHooks.resolveData(contactsPatchResolver)
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
