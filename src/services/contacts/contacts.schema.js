// // For more information about this file see https://dove.feathersjs.com/guides/cli/service.schemas.html
import { resolve, virtual } from '@feathersjs/schema'
import { Type, getValidator, querySyntax } from '@feathersjs/typebox'
import { ObjectIdSchema } from '@feathersjs/typebox'
import { dataPatchValidator, dataValidator, queryValidator } from '../../validators.js'
import { BadRequest } from '@feathersjs/errors'

// Main data model schema
export const contactsSchema = Type.Object(
  {
    _id: ObjectIdSchema(),
    userId1 : ObjectIdSchema(),
    userId2 : ObjectIdSchema(),
    blockedUser1 : Type.Boolean({default: false}),
    blockedUser2 : Type.Boolean({default: false}),
    createdAt: Type.Number(),
    updatedAt: Type.Number()
  },
  { $id: 'Contacts', additionalProperties: false }
)
export const contactsValidator = getValidator(contactsSchema, dataValidator)
export const contactsResolver = resolve({
  user1: virtual(async (contact, context) => {
    return await context.app.service('users').get(contact.userId1, { query : {
      $select: ['lastname', 'firstname', 'email', 'username']
    }})
  }),
  user2: virtual(async (contact, context) => {
    return await context.app.service('users').get(contact.userId2, { query : {
      $select: ['lastname', 'firstname', 'email', 'username']
    }})
  }),
})

export const contactsExternalResolver = resolve({})

// Schema for creating new entries
export const contactsDataSchema = Type.Pick(contactsSchema, ['userId1', 'userId2', 'blockedUser1', 'blockedUser2', 'createdAt', 'updatedAt'], {
  $id: 'ContactsData'
})
export const contactsDataValidator = getValidator(contactsDataSchema, dataValidator)
export const contactsDataResolver = resolve({
  userId1: async (value, contact, context) => {
    if (value) {
      const exitUser = await context.app.service('users').get(value);
      if(!exitUser) {
        throw new BadRequest("user 1 not exist");
      }
    }
    return value
  },
  userId2: async (value, contact, context) => {
    if (value) {
      const exitUser = await context.app.service('users').get(value);
      if(!exitUser) {
        throw new BadRequest("user 2 not exist");
      }
    }
    return value
  }
})

// Schema for updating existing entries
export const contactsPatchSchema = Type.Partial(contactsSchema, {
  $id: 'ContactsPatch'
})
export const contactsPatchValidator = getValidator(contactsPatchSchema, dataPatchValidator)
export const contactsPatchResolver = resolve({})

// Schema for allowed query properties
export const contactsQueryProperties = Type.Pick(contactsSchema, ['_id', 'userId1', 'userId2', 'blockedUser1', 'blockedUser2', 'createdAt', 'updatedAt'])
export const contactsQuerySchema = Type.Intersect(
  [
    querySyntax(contactsQueryProperties),
    // Add additional query properties here
    Type.Object({}, { additionalProperties: false })
  ],
  { additionalProperties: false }
)
export const contactsQueryValidator = getValidator(contactsQuerySchema, queryValidator)
export const contactsQueryResolver = resolve({})
