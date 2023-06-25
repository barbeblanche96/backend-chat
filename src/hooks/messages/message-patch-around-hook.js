import { BadRequest } from "@feathersjs/errors";

export const messagePatchAroundHook = async (context, next) => {

  if(context.params?.user) {

    const message = await context.app.service('messages').get(context.id);
    
    const discussion = await context.app.service('discussions').get(message.discussionId);

    if (!discussion) {
      throw new BadRequest("This discussion not exist");
    }

    const finduser = discussion.participants.find( participant => participant.userId.toString() == context.params.user._id.toString());

    if (!finduser) {
      throw new BadRequest("You can not perform this action");
    }

    const possibleActions = ['EMOJI_REACTION'];

    if (!context.data.action || !possibleActions.includes(context.data.action)) {
      throw new BadRequest("Invalid action");
    }

    if ( context.data.action === 'EMOJI_REACTION' ) {
      const findExistReactionIndex = message.reactions.findIndex(reatcion => reatcion.userId.toString()  === context.params.user._id.toString());
      if (findExistReactionIndex < 0) {
        message.reactions.push({
          userId : context.params.user._id,
          emoji : context.data.emoji
        });
      } else {
        message.reactions[findExistReactionIndex].emoji = context.data.emoji;
      }

      context.data = {
        updatedAt : Date.now(),
        reactions: message.reactions
      }
    }

    else {
      context.data = {};
    }

  }

  await next()

}
