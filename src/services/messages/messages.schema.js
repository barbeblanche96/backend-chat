// // For more information about this file see https://dove.feathersjs.com/guides/cli/service.schemas.html
import { resolve, virtual } from '@feathersjs/schema'
import { Type, getValidator, querySyntax } from '@feathersjs/typebox'
import { ObjectIdSchema } from '@feathersjs/typebox'
import { dataPatchValidator, dataValidator, queryValidator } from '../../validators.js'

// Main data model schema
export const messagesSchema = Type.Object(
  {
    _id: ObjectIdSchema(),
    senderId: ObjectIdSchema(),
    discussionId: ObjectIdSchema(),
    text: Type.Union([Type.Null(), Type.String()], {default: null}),
    reactions: Type.Array(Type.Object({
        userId : ObjectIdSchema(),
        emoji : Type.String()
    }), {default : [], minItems: 0}),
    file: Type.Union ([Type.Null(), Type.Object({
      originalName : Type.String(),
      pathUrl : Type.String(),
      size : Type.Number()
    })], {default : null}),
    responseToMessageId : Type.Union([Type.Null(), ObjectIdSchema()], {default: null}),
    createdAt : Type.Number(),
    updatedAt : Type.Number(),
  },
  { $id: 'Messages', additionalProperties: false }
)
export const messagesValidator = getValidator(messagesSchema, dataValidator)
export const messagesResolver = resolve({
  sender: virtual(async (message, context) => {
    return await context.app.service('users').get(message.senderId, { query : {
      $select: ['_id', 'lastname', 'firstname', 'email', 'username', 'photoUrl']
    }})
  }),
  responseToMessage: virtual(async (message, context) => {
    return message.responseToMessageId ? await context.app.service('messages').get(message.responseToMessageId, { query : {
      $select: ['_id','text', 'file']
    }}) : null;
  }),
})

export const messagesExternalResolver = resolve({})

// Schema for creating new entries
export const messagesDataSchema = Type.Pick(messagesSchema, ['senderId', 'discussionId', 'text', 'reactions', 'file', 'responseToMessageId', 'createdAt', 'updatedAt'], {
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
    return value;
  },
  responseToMessageId : async (value, message, context) => {
    if(value) {
      const exitMessage = await context.app.service('messages').get(value);
      if(!exitMessage) {
        throw new BadRequest("message "+ value +" not exist");
      }
    }
    return value;
  },
  discussionId : async (value, message, context) => {
    if(value) {
      const exitDiscussion = await context.app.service('discussions').get(value);
      if(!exitDiscussion) {
        throw new BadRequest("discussion "+ value +" not exist");
      }
    }
    return value;
  }
})

// Schema for updating existing entries
export const messagesPatchSchema = Type.Partial(messagesSchema, {
  $id: 'MessagesPatch'
})
export const messagesPatchValidator = getValidator(messagesPatchSchema, dataPatchValidator)
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
    return value;
  },
  responseToMessageId : async (value, message, context) => {
    if(value) {
      const exitMessage = await context.app.service('messages').get(value);
      if(!exitMessage) {
        throw new BadRequest("message "+ value +" not exist");
      }
    }
    return value;
  },
  discussionId : async (value, message, context) => {
    if(value) {
      const exitDiscussion = await context.app.service('discussions').get(value);
      if(!exitDiscussion) {
        throw new BadRequest("discussion "+ value +" not exist");
      }
    }
    return value;
  }
})

// Schema for allowed query properties
export const messagesQueryProperties = Type.Pick(messagesSchema, ['_id', 'senderId', 'text', 'file', 'responseToMessageId', 'discussionId', 'createdAt', 'updatedAt'])
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
