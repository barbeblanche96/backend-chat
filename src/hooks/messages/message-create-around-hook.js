import { BadRequest } from "@feathersjs/errors";

export const messageCreateAroundHook = async (context, next) => {

  if(context.params?.user) {
    context.data.senderId = context.params.user._id;

    if (context.data.discussionId) {
      const discussion = await context.app.service('discussions').get(context.data.discussionId);

      if (!discussion) {
        throw new BadRequest("This discussion not exist");
      }

      const finduser = discussion.participants.find( participant => participant.userId.toString() == context.params.user._id.toString());

      if (!finduser) {
        throw new BadRequest("You can not send message to this discussion");
      }


    }
  }

  await next()

  const {senderId, text, file, createdAt} = context.result;

  var discussion = await context.app.service('discussions').get(context.data.discussionId);

  for (var idx = 0; idx < discussion.participants.length; idx++) {
    if (discussion.participants[idx].userId.toString() !== context.params.user._id.toString()) {
      discussion.participants[idx].hasNewNotif = true;
    }
  }

  context.app.service('discussions').patch(context.result.discussionId, {
    lastMessage : {
      senderId, 
      text, 
      file, 
      createdAt
    },
    participants : discussion.participants
  });

}
