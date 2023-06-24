import { BadRequest } from "@feathersjs/errors";

export const messageFindAroundHook = async (context, next) => {

  if(context.params?.user) {

    if (!context.params?.query?.discussionId) {
      throw new BadRequest("You have to provide disccussion Id");
    }

    const discussion = await context.app.service('discussions').get(context.params.query.discussionId);

    if (!discussion) {
      throw new BadRequest("This discussion not exist");
    }

    const finduser = discussion.participants.find( participant => participant.userId.toString() == context.params.user._id.toString());

    if (!finduser) {
      throw new BadRequest("You can not retrieve messages of this discussion");
    }

  }

  await next()
}
