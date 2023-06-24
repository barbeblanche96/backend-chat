import { BadRequest } from "@feathersjs/errors";

export const contactFindAroundHook = async (context, next) => {

  if(context.params?.user) {
    context.params.query['$or'] = [
      {userId1 : context.params.user._id},
      {userId2 : context.params.user._id}
    ]; 
  }

  await next()
}
