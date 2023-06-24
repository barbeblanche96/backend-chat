import { BadRequest } from "@feathersjs/errors";

export const discussionFindAroundHook = async (context, next) => {

  if (context.params?.user) {
    context.params.query['participants.userId'] = context.params.user._id;
  }

  await next()
}
