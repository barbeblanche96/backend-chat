import { BadRequest } from "@feathersjs/errors";

export const requestRemoveAroundHook = async (context, next) => {

  if (context.params?.user) {
    context.params.query.senderId = context.params.user._id;
  }

  await next();

}
