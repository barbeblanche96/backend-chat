import { BadRequest } from "@feathersjs/errors";

export const requestPatchAroundHook = async (context, next) => {

  if (context.params?.user) {
    context.params.query.receiverId = context.params.user._id;
    const { accepted } = context.data;
    context.data = { accepted };
  }

  await next()

  if (context.data.hasOwnProperty('accepted')) {
    if (context.result.accepted) {
      context.app.service('contacts').create({ 
        userId1 : context.result.senderId,
        userId2 : context.result.receiverId, 
      })
    }
    context.app.service('requests').remove(context.result._id);
  }
}
