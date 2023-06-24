import { BadRequest } from "@feathersjs/errors";

export const requestGetAroundHook = async (context, next) => {

  if (context.params?.user) {

    context.params.query['$or'] = [
      {receiverId : context.params.user._id},
      {senderId : context.params.user._id}
    ]
        
  }

  await next()

}
