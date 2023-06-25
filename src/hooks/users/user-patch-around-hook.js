import { BadRequest } from "@feathersjs/errors";

import bcrypt from 'bcryptjs'

export const userPatchAroundHook = async (context, next) => {

  if(context.params?.user) {
    context.id = context.params.user._id;
  
    if(!context.data?.action || !['UPDATE_INFOS', 'CHANGE_PASSWORD'].includes(context.data.action)) {
      throw new BadRequest("You have to specified a valid action (UPDATE_INFOS, CHANGE_PASSWORD)")
    }
    
    if (context.data.action === 'UPDATE_INFOS') {
      const {username, email, firstname, lastname, updatedAt, photoUrl} = context.data;
      context.data = {
        username,
        email,
        firstname,
        lastname,
        photoUrl,
        updatedAt
      }
    }
  
    else if (context.data.action === 'CHANGE_PASSWORD') {
      const {currentPassword, newPassword} = context.data;
  
      if (!currentPassword || !newPassword) {
        throw new BadRequest("You must provide your current and new password")
      }
  
      const hash = context.params?.user?.password
  
      const result = await bcrypt.compare(currentPassword, hash)
  
      if (!result) {
        throw new BadRequest("Your current password is incorrect")
      }
  
      context.data = {
        password : newPassword
      }
    }
  
    else {
      context.data = {};    
    }

  }

  await next()
}
