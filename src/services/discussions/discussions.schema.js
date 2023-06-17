// // For more information about this file see https://dove.feathersjs.com/guides/cli/service.schemas.html
import { resolve } from '@feathersjs/schema'
import { Type, getValidator, querySyntax } from '@feathersjs/typebox'
import { ObjectIdSchema } from '@feathersjs/typebox'
import { dataValidator, queryValidator } from '../../validators.js'

// Main data model schema
export const discussionsSchema = Type.Object(
  {
    _id: ObjectIdSchema(),
    tag: Type.Enum({PRIVATE : 'PRIVATE', GROUP: 'GROUP'}, {default : 'PRIVATE'}),
    name: Type.Union([Type.Null(), Type.String()], {default: null}),
    description : Type.String(),
    participants: Type.Array(Type.Object({
      userId: ObjectIdSchema(),
      isAdmin: Type.Boolean({default: false}),
      hasNewNotif: Type.Boolean({default: false}),
      isArchivedChat: Type.Boolean({default: false}),
      addedAt : Type.Number()
    }), {minItems : 2}),
    lastMessage: Type.Any(),
    createdAt : Type.Number(),
    updatedAt : Type.Number(),
  },
  { $id: 'Discussions', additionalProperties: false }
)
export const discussionsValidator = getValidator(discussionsSchema, dataValidator)
export const discussionsResolver = resolve({})

export const discussionsExternalResolver = resolve({})

// Schema for creating new entries
export const discussionsDataSchema = Type.Pick(discussionsSchema, ['tag', 'name', 'description', 'participants', 'lastMessage', 'createdAt', 'updatedAt'], {
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
    return participants;
  }
})

// Schema for updating existing entries
export const discussionsPatchSchema = Type.Partial(discussionsSchema, {
  $id: 'DiscussionsPatch'
})
export const discussionsPatchValidator = getValidator(discussionsPatchSchema, dataValidator)
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
    return participants;
  }
})

// Schema for allowed query properties
export const discussionsQueryProperties = Type.Pick(discussionsSchema, ['tag', 'name', 'participants', 'updatedAt'])
export const discussionsQuerySchema = Type.Intersect(
  [
    querySyntax(discussionsQueryProperties),
    // Add additional query properties here
    Type.Object({}, { additionalProperties: false })
  ],
  { additionalProperties: false }
)
export const discussionsQueryValidator = getValidator(discussionsQuerySchema, queryValidator)
export const discussionsQueryResolver = resolve({})
