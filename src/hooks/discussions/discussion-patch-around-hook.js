import { BadRequest } from "@feathersjs/errors";

export const discussionPatchAroundHook = async (context, next) => {

  if (context.params?.user) {

    var discussion = await context.app.service('discussions').get(context.id);

    if (!discussion) {
      throw new BadRequest("This discussion not exist");
    }

    const finduser = discussion.participants.find( participant => participant.userId.toString() == context.params.user._id.toString());

    if (!finduser) {
      throw new BadRequest("You can not send message to this discussion");
    }

    const possibleActions = ['ARCHIVED', 'UPDATE_GROUP_INFO']

    if (!context.data.action || !possibleActions.includes(context.data.action)) {
      throw new BadRequest("Invalid action");
    }

    if (context.data.action === 'ARCHIVED') {
      for (var idx = 0; idx < discussion.participants.length; idx++) {
        if (discussion.participants[idx].userId.toString() == context.params.user._id.toString()) {
          discussion.participants[idx].isArchivedChat = context.data.isArchived
          break;
        }
      }
      context.data.participants = discussion.participants;
      delete context.data?.isArchived;
    }

    if (context.data.action === 'UPDATE_GROUP_INFO') {
      const findUserAsAdmin = discussion.participants.find( participant => participant.userId.toString() == context.params.user._id.toString() && participant.isAdmin);
      if (!findUserAsAdmin) {
        throw new BadRequest("You can not perform this action");
      }
      const {name, description, updatedAt} = context.data;

      context.data = {name, description, updatedAt};
    }

    delete context.data?.action;

  }

  await next()
}
