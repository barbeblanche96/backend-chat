// // For more information about this file see https://dove.feathersjs.com/guides/cli/service.schemas.html
import { resolve } from '@feathersjs/schema'
import { Type, getValidator, querySyntax } from '@feathersjs/typebox'
import { ObjectIdSchema } from '@feathersjs/typebox'
import { passwordHash } from '@feathersjs/authentication-local'
import { dataPatchValidator, dataValidator, queryValidator } from '../../validators.js'
import { BadRequest } from '@feathersjs/errors'

// Main data model schema
export const userSchema = Type.Object(
  {
    _id: ObjectIdSchema(),
    email: Type.String({ format : "email"}),
    username: Type.String(),
    firstname : Type.String(),
    lastname : Type.String(),
    photoUrl : Type.Union([Type.Null(), Type.String()], { default: null }),
    password: Type.String( {minLength: 8} ),
    createdAt: Type.Number(),
    updatedAt: Type.Number()
  },
  { $id: 'User', additionalProperties: false }
)
export const userValidator = getValidator(userSchema, dataValidator)
export const userResolver = resolve({})

export const userExternalResolver = resolve({
  // The password should never be visible externally
  password: async () => undefined
})

// Schema for creating new entries
export const userDataSchema = Type.Pick(userSchema, ['email', 'username', 'password', 'firstname', 'lastname', 'photoUrl', 'createdAt', 'updatedAt'], {
  $id: 'UserData'
})
export const userDataValidator = getValidator(userDataSchema, dataValidator)
export const userDataResolver = resolve({
  password: async (value, user, context) => {
    if (value) {
      const strongRegex = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})");
      if (!strongRegex.test(value)) {
        throw new BadRequest('Password must contains at least one 1 uppercase character, 1 lowercase character, 1 numeric character and 1 special character.')
      }
    }
    return await passwordHash({ strategy: 'local' })(value, user, context)
  },
  email: async (value, user, context) => {
    if(value) {
      const retrieveUser = await context.app.service('users').find({query : {email : value, $limit: 1} });
      if (retrieveUser && retrieveUser.data.length > 0) {
        throw new BadRequest("Email is already used")
      }  
    }
    return value; 
  },
  username: async (value, user, context) => {
    if (value) {
      const retrieveUser = await context.app.service('users').find({query : {username : value, $limit: 1} });
      if (retrieveUser && retrieveUser.data.length > 0) {
        throw new BadRequest("Username is already used")
      } 
    }
    return value;
  }
})

// Schema for updating existing entries
export const userPatchSchema = Type.Partial(userSchema, {
  $id: 'UserPatch'
})
export const userPatchValidator = getValidator(userPatchSchema, dataPatchValidator)
export const userPatchResolver = resolve({
  password: async (value, user, context) => {
    if (value) {
      const strongRegex = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})");
      if (!strongRegex.test(value)) {
        throw new BadRequest('Password must contains at least one 1 uppercase character, 1 lowercase character, 1 numeric character and 1 special character.')
      }
    }
    return await passwordHash({ strategy: 'local' })(value, user, context)
  },
  email: async (value, user, context) => {
    if(value) {
      const retrieveUser = await context.app.service('users').find({query : {email : value, _id: {$ne : context.id}, $limit: 1} });
      if (retrieveUser && retrieveUser.data.length > 0) {
        throw new BadRequest("Email is already used")
      }  
    }
    return value; 
  },
  username: async (value, user, context) => {
    if (value) {
      const retrieveUser = await context.app.service('users').find({query : {username : value, _id: {$ne : context.id}, $limit: 1} });
      if (retrieveUser && retrieveUser.data.length > 0) {
        throw new BadRequest("Username is already used")
      } 
    }
    return value;
  }
})

// Schema for allowed query properties
export const userQueryProperties = Type.Pick(userSchema, ['_id', 'email', 'username', 'photoUrl', 'lastname', 'firstname', 'createdAt', 'updatedAt'])
export const userQuerySchema = Type.Intersect(
  [
    querySyntax(userQueryProperties, {
      username: {
        $regex: Type.String({minLength: 3}),
        $options : Type.String()
      },
      email: {
        $regex: Type.String({minLength: 3}),
        $options : Type.String()
      },
    }),
    // Add additional query properties here
    Type.Object({}, { additionalProperties: false })
  ],
  { additionalProperties: false }
)
export const userQueryValidator = getValidator(userQuerySchema, queryValidator)
export const userQueryResolver = resolve({

})
