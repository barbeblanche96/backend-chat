// // For more information about this file see https://dove.feathersjs.com/guides/cli/service.schemas.html
import { resolve } from '@feathersjs/schema'
import { Type, getValidator, querySyntax } from '@feathersjs/typebox'
import { ObjectIdSchema } from '@feathersjs/typebox'
import { dataPatchValidator, dataValidator, queryValidator } from '../../validators.js'

// Main data model schema
export const discussionsSchema = Type.Object(
  {
    _id: ObjectIdSchema(),
    tag: Type.Enum({PRIVATE : 'PRIVATE', GROUP: 'GROUP'}, {default : 'PRIVATE'}),
    name: Type.Union([Type.Null(), Type.String()], {default: null}),
    description : Type.Union([Type.Null(), Type.String()], {default: null}),
    createdById : ObjectIdSchema(),
    participants: Type.Array(Type.Object({
      userId: ObjectIdSchema(),
      isAdmin: Type.Boolean({default: false}),
      hasNewNotif: Type.Boolean({default: false}),
      isArchivedChat: Type.Boolean({default: false}),
      addedAt : Type.Number()
    }), {minItems : 2}),
    lastMessage: Type.Union([Type.Null(), Type.Any()], {default: null}),
    createdAt : Type.Number(),
    updatedAt : Type.Number(),
  },
  { $id: 'Discussions', additionalProperties: false }
)
export const discussionsValidator = getValidator(discussionsSchema, dataValidator)
export const discussionsResolver = resolve({
  participants : async (value, discussion, context) => {
    if(value) {
      for (var idx = 0; idx < value.length; idx++) {
        const user = await context.app.service('users').get(value[idx].userId, { query : {$select : ['_id', 'username', 'firstname', 'lastname', 'email']} });
        value[idx].user = user;
      }
    }
    return value;
  }
})

export const discussionsExternalResolver = resolve({})

// Schema for creating new entries
export const discussionsDataSchema = Type.Pick(discussionsSchema, ['tag', 'name', 'description', 'participants', 'lastMessage', 'createdAt', 'updatedAt', 'createdById'], {
  $id: 'DiscussionsData'
})
export const discussionsDataValidator = getValidator(discussionsDataSchema, dataValidator)
export const discussionsDataResolver = resolve({
  participants : async (value, discussion, context) => {
    if(value) {
      for (let participant of value) {
        const exitUser = await context.app.service('users').get(participant.userId);
        if(!exitUser) {
          throw new BadRequest("user "+ participant.userId +" not exist");
        }
      }
    }
    return value;
  }
})

// Schema for updating existing entries
export const discussionsPatchSchema = Type.Partial(discussionsSchema, {
  $id: 'DiscussionsPatch'
})
export const discussionsPatchValidator = getValidator(discussionsPatchSchema, dataPatchValidator)
export const discussionsPatchResolver = resolve({
  participants : async (value, discussion, context) => {
    if(value) {
      for (let participant of value) {
        const exitUser = await context.app.service('users').get(participant.userId);
        if(!exitUser) {
          throw new BadRequest("user "+ participant.userId +" not exist");
        }
      }
    }
    return value;
  }
})

// Schema for allowed query properties
export const discussionsQueryProperties = Type.Pick(discussionsSchema, ['_id', 'tag', 'name', 'participants', 'lastMessage', 'updatedAt', 'createdById'])
export const discussionsQuerySchema = Type.Intersect(
  [
    querySyntax(discussionsQueryProperties, {
      participants: {
        $elemMatch: Type.Object({
          userId: Type.Optional(ObjectIdSchema()),
          isAdmin: Type.Optional(Type.Boolean()),
          hasNewNotif: Type.Optional(Type.Boolean()),
          isArchivedChat: Type.Optional(Type.Boolean()),
        }),
      }
    }),
    // Add additional query properties here
    Type.Object({
      'participants.userId' : Type.Optional(ObjectIdSchema())
    }, { additionalProperties: false })
  ],
  { additionalProperties: false }
)
export const discussionsQueryValidator = getValidator(discussionsQuerySchema, queryValidator)
export const discussionsQueryResolver = resolve({})
