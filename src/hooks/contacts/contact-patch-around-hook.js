import { BadRequest } from "@feathersjs/errors";

export const contactPatchAroundHook = async (context, next) => {

  if(context.params?.user) {
    context.params.query['$or'] = [
      {userId1 : context.params.user._id},
      {userId2 : context.params.user._id}
    ];
    const contact = await context.app.service("contacts").get(context.id, {query : context.params.query});

    if (contact.userId1.toString() === context.params.user._id.toString()) {
      if (context.data.hasOwnProperty('blockedUser2')) {
        throw new BadRequest('You can not perform this action')
      }
      if (context.data.hasOwnProperty('blockedUser1')) {
        var { blockedUser1 } = context.data;
      }
      context.data = { blockedUser1 }
    }

    if (contact.userId2.toString() === context.params.user._id.toString()) {
      if (context.data.hasOwnProperty('blockedUser1')) {
        throw new BadRequest('You can not perform this action')
      }
      if (context.data.hasOwnProperty('blockedUser2')) {
        var { blockedUser2 } = context.data;
      }
      context.data = { blockedUser2 };
    }
  }

  await next()
}
