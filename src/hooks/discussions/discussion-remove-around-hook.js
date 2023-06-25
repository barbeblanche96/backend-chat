import { BadRequest } from "@feathersjs/errors";

export const discussionRemoveAroundHook = async (context, next) => {

  if (context.params?.user) {

    var discussion = await context.app.service('discussions').get(context.id);

    if (!discussion) {
      throw new BadRequest("This discussion not exist");
    }

    const finduser = discussion.participants.find( participant => participant.userId.toString() == context.params.user._id.toString() && participant.isAdmin);

    if (!finduser) {
      throw new BadRequest("You can not delete this discussion");
    }
  
  }

   await next()

  context.app.service('messages').remove(null, { query : {discussionId : context.result._id}});
}
