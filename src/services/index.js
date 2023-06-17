import { messages } from './messages/messages.js'

import { discussions } from './discussions/discussions.js'

import { contacts } from './contacts/contacts.js'

import { requests } from './requests/requests.js'

import { user } from './users/users.js'

export const services = (app) => {
  app.configure(messages)

  app.configure(discussions)

  app.configure(contacts)

  app.configure(requests)

  app.configure(user)

  // All services will be registered here
}
