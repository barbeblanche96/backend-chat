import { BadRequest } from "@feathersjs/errors";

export const requestCreateAroundHook = async (context, next) => {

  if(context.params?.user) {
    context.data.senderId = context.params.user._id;
  }

  if(context.data.senderId.toString() == context.data.receiverId.toString()) {
    throw new BadRequest("You can not send request to yourself");
  }

  const existRequest = await context.app.service("requests").find({ query : {
    senderId : {
      $in : [context.data.senderId, context.data.receiverId]
    },
    receiverId : {
      $in : [context.data.senderId, context.data.receiverId]
    },
    $limit :1 
  }})

  if (existRequest && existRequest.data.length > 0) {
    context.app.service('requests').patch(existRequest.data[0]._id, {updatedAt : Date.now()});
    if (existRequest.data[0].senderId.toString() == context.data.senderId) {
      throw new BadRequest("You have already send request to this receiver")
    }
    if (existRequest.data[0].senderId.toString() == context.data.receiverId) {
      throw new BadRequest("This receiver is already send to you a request")
    }
  }

  await next()
}
