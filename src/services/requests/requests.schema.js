// // For more information about this file see https://dove.feathersjs.com/guides/cli/service.schemas.html
import { resolve, virtual } from '@feathersjs/schema'
import { Type, getValidator, querySyntax } from '@feathersjs/typebox'
import { ObjectIdSchema } from '@feathersjs/typebox'
import { dataPatchValidator, dataValidator, queryValidator } from '../../validators.js'
import { BadRequest } from '@feathersjs/errors'

// Main data model schema
export const requestsSchema = Type.Object(
  {
    _id: ObjectIdSchema(),
    senderId: ObjectIdSchema(),
    receiverId: ObjectIdSchema(),
    accepted: Type.Boolean({default : false}),
    createdAt: Type.Number(),
    updatedAt: Type.Number()

  },
  { $id: 'Requests', additionalProperties: false }
)
export const requestsValidator = getValidator(requestsSchema, dataValidator)
export const requestsResolver = resolve({
  sender: virtual(async (request, context) => {
    return await context.app.service('users').get(request.senderId, { query : {
      $select: ['lastname', 'firstname', 'email', 'username']
    }})
  }),
  receiver: virtual(async (request, context) => {
    return await context.app.service('users').get(request.receiverId, { query : {
      $select: ['lastname', 'firstname', 'email', 'username']
    }})
  }),
})

export const requestsExternalResolver = resolve({})

// Schema for creating new entries
export const requestsDataSchema = Type.Pick(requestsSchema, ['senderId', 'receiverId', 'accepted', 'createdAt', 'updatedAt'], {
  $id: 'RequestsData'
})
export const requestsDataValidator = getValidator(requestsDataSchema, dataValidator)
export const requestsDataResolver = resolve({
  receiverId: async (value, request, context) => {
    if (value) {
      const exitUser = await context.app.service('users').get(value);
      if(!exitUser) {
        throw new BadRequest("receiver not exist");
      }
    }
    return value
  },
  senderId: async (value, request, context) => {
    if (value) {
      const exitUser = await context.app.service('users').get(value);
      if(!exitUser) {
        throw new BadRequest("sender not exist");
      }
    }
    return value
  }

})

// Schema for updating existing entries
export const requestsPatchSchema = Type.Partial(requestsSchema, {
  $id: 'RequestsPatch'
})
export const requestsPatchValidator = getValidator(requestsPatchSchema, dataPatchValidator)
export const requestsPatchResolver = resolve({
  receiverId: async (value, request, context) => {
    if (value) {
      const exitUser = await context.app.service('users').get(value);
      if(!exitUser) {
        throw new BadRequest("receiver not exist");
      }
    }
    return value
  },
  senderId: async (value, request, context) => {
    if (value) {
      const exitUser = await context.app.service('users').get(value);
      if(!exitUser) {
        throw new BadRequest("sender not exist");
      }
    }
    return value
  }
})

// Schema for allowed query properties
export const requestsQueryProperties = Type.Pick(requestsSchema, ['_id', 'senderId', 'receiverId', 'accepted', 'updatedAt'])
export const requestsQuerySchema = Type.Intersect(
  [
    querySyntax(requestsQueryProperties),
    // Add additional query properties here
    Type.Object({}, { additionalProperties: false })
  ],
  { additionalProperties: false }
)
export const requestsQueryValidator = getValidator(requestsQuerySchema, queryValidator)
export const requestsQueryResolver = resolve({})
