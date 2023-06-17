import { BadRequest } from "@feathersjs/errors";

export const userPatchAroundHook = async (context, next) => {

  if(context.params?.user) {
    context.id = context.params.user._id;
  }

  if(!context.data?.action || !['UPDATE_INFOS'].includes(context.data.action)) {
    throw new BadRequest("You have to specified a valid action (UPDATE_INFOS)")
  }
  
  if (context.data.action === 'UPDATE_INFOS') {
    const {username, email, firstname, lastname, updatedAt} = context.data;
    context.data = {
      username,
      email,
      firstname,
      lastname,
      updatedAt
    }
  }

  await next()
}
