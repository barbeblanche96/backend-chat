// // For more information about this file see https://dove.feathersjs.com/guides/cli/service.schemas.html
import { resolve } from '@feathersjs/schema'
import { Type, getValidator, querySyntax } from '@feathersjs/typebox'
import { ObjectIdSchema } from '@feathersjs/typebox'
import { dataValidator, queryValidator } from '../../validators.js'

// Main data model schema
export const messagesSchema = Type.Object(
  {
    _id: ObjectIdSchema(),
    senderId: ObjectIdSchema(),
    text: Type.Union([Type.Null(), Type.String()], {default: null}),
    reactions: Type.Array([
      Type.Optional(Type.Object({
        userId : ObjectIdSchema(),
        emoji : Type.String()
      }))
    ], {default : []}),
    file: Type.Union ([Type.Null(), Type.Object({
      originalName : Type.String(),
      pathUrl : Type.String(),
      size : Type.Number()
    })], {default : null}),
    responseToMessageId : Type.Union([Type.Null(), ObjectIdSchema()]),
    createdAt : Type.Number(),
    updatedAt : Type.Number(),
  },
  { $id: 'Messages', additionalProperties: false }
)
export const messagesValidator = getValidator(messagesSchema, dataValidator)
export const messagesResolver = resolve({})

export const messagesExternalResolver = resolve({})

// Schema for creating new entries
export const messagesDataSchema = Type.Pick(messagesSchema, ['senderId', 'text', 'reactions', 'file', 'responseToMessageId', 'createdAt', 'updatedAt'], {
  $id: 'MessagesData'
})
export const messagesDataValidator = getValidator(messagesDataSchema, dataValidator)
export const messagesDataResolver = resolve({
  reactions : async (value, message, context) => {
    if(value && value.length > 0) {
      for (let reaction of value) {
        const exitUser = await context.app.service('users').get(reaction.userId);
        if(!exitUser) {
          throw new BadRequest("user "+ reaction.userId +" not exist");
        }
      }
    }
    return reactions;
  },
  responseToMessageId : async (value, message, context) => {
    if(value) {
      const exitMessage = await context.app.service('messages').get(value);
      if(!exitMessage) {
        throw new BadRequest("message "+ value +" not exist");
      }
    }
    return responseToMessageId;
  }
})

// Schema for updating existing entries
export const messagesPatchSchema = Type.Partial(messagesSchema, {
  $id: 'MessagesPatch'
})
export const messagesPatchValidator = getValidator(messagesPatchSchema, dataValidator)
export const messagesPatchResolver = resolve({
  reactions : async (value, message, context) => {
    if(value && value.length > 0) {
      for (let reaction of value) {
        const exitUser = await context.app.service('users').get(reaction.userId);
        if(!exitUser) {
          throw new BadRequest("user "+ reaction.userId +" not exist");
        }
      }
    }
    return reactions;
  },
  responseToMessageId : async (value, message, context) => {
    if(value) {
      const exitMessage = await context.app.service('messages').get(value);
      if(!exitMessage) {
        throw new BadRequest("message "+ value +" not exist");
      }
    }
    return responseToMessageId;
  }
})

// Schema for allowed query properties
export const messagesQueryProperties = Type.Pick(messagesSchema, ['senderId', 'responseToMessageId', 'createdAt', 'updatedAt'])
export const messagesQuerySchema = Type.Intersect(
  [
    querySyntax(messagesQueryProperties),
    // Add additional query properties here
    Type.Object({}, { additionalProperties: false })
  ],
  { additionalProperties: false }
)
export const messagesQueryValidator = getValidator(messagesQuerySchema, queryValidator)
export const messagesQueryResolver = resolve({})
