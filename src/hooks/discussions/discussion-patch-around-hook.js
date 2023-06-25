import { BadRequest } from "@feathersjs/errors";

export const discussionPatchAroundHook = async (context, next) => {

  if (context.params?.user) {

    var discussion = await context.app.service('discussions').get(context.id);

    if (!discussion) {
      throw new BadRequest("This discussion not exist");
    }

    const finduser = discussion.participants.find( participant => participant.userId.toString() == context.params.user._id.toString());

    if (!finduser) {
      throw new BadRequest("You can not patch this discussion");
    }

    const possibleActions = ['ARCHIVED', 'UPDATE_GROUP_INFO', 'REMOVE_USERS_GROUP', 'ADD_USERS_GROUP', 'DEFINE_ADMINS_GROUP', 'LEAVE_GROUP']

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
      context.data.participants = discussion.participants.map((e) => { delete e.user; return e; });
      delete context.data?.isArchived;
    }

    else if (context.data.action === 'UPDATE_GROUP_INFO') {
      
      if (discussion.tag === 'PRIVATE') {
        throw new BadRequest("You can not update private discussion info");
      }

      const findUserAsAdmin = discussion.participants.find( participant => participant.userId.toString() == context.params.user._id.toString() && participant.isAdmin);
      if (!findUserAsAdmin) {
        throw new BadRequest("You can not perform this action");
      }
      const {name, description, updatedAt} = context.data;

      context.data = {name, description, updatedAt};
    }

    else if (context.data.action === 'LEAVE_GROUP') {
      
      if (discussion.tag === 'PRIVATE') {
        throw new BadRequest("You can not update private discussion info");
      }

      let filterParticipants = discussion.participants.filter(participant => participant.userId.toString() !== context.params.user._id.toString());
      
      context.data = {
        updatedAt: Date.now(),
        participants: filterParticipants.map((e) => { delete e.user; return e; })
      }

    }


    else if (context.data.action === 'REMOVE_USERS_GROUP') {

      const findUserAsAdmin = discussion.participants.find( participant => participant.userId.toString() == context.params.user._id.toString() && participant.isAdmin);
      
      if (!findUserAsAdmin) {
        throw new BadRequest("You can not perform this action");
      }

      if (!Array.isArray(context.data.removeUsers) || context.data.removeUsers.length < 1) {
        throw new BadRequest("You must give at least one user to remove")
      }

      let filterParticipants = discussion.participants.filter(participant => !context.data.removeUsers.includes(participant.userId.toString()));

      if (filterParticipants.length < 3) {
        throw new BadRequest("You have to be at least 3 members in discussion group")
      }

      context.data = {
        updatedAt: Date.now(),
        participants: filterParticipants.map((e) => { delete e.user; return e; })
      }
    }

    else if (context.data.action === 'ADD_USERS_GROUP') {
      
      if (discussion.tag === 'PRIVATE') {
        throw new BadRequest("You can not update private discussion info");
      }

      const findUserAsAdmin = discussion.participants.find( participant => participant.userId.toString() == context.params.user._id.toString() && participant.isAdmin);
      
      if (!findUserAsAdmin) {
        throw new BadRequest("You can not perform this action");
      }

      if (!Array.isArray(context.data.addUsers) || context.data.addUsers.length < 1) {
        throw new BadRequest("You must give at least one user to add")
      }

      context.data.addUsers.forEach(user => {
        const findExistParticipant = discussion.participants.find(paticipant => paticipant.userId.toString() === user.toString());
        if (!findExistParticipant) {
          discussion.participants.push({
            userId: user,
            isAdmin: false,
            hasNewNotif: true,
            isArchivedChat: false,
            addedAt : Date.now(),
          })
        }
      });

      context.data = {
        updatedAt: Date.now(),
        participants: discussion.participants.map((e) => { delete e.user; return e; })
      }
    }

    else if (context.data.action === 'DEFINE_ADMINS_GROUP') {
      
      if (discussion.tag === 'PRIVATE') {
        throw new BadRequest("You can not update private discussion info");
      }

      const findUserAsAdmin = discussion.participants.find( participant => participant.userId.toString() == context.params.user._id.toString() && participant.isAdmin);
      
      if (!findUserAsAdmin) {
        throw new BadRequest("You can not perform this action");
      }

      if (!Array.isArray(context.data.adminUsers) || context.data.adminUsers.length < 1) {
        throw new BadRequest("You must give at least one user to define as admin")
      }

      for (var idx = 0; idx < discussion.participants.length; idx++) {
        if (context.data.adminUsers.includes(discussion.participants[idx].userId.toString())) {
          discussion.participants[idx].isAdmin = true;
        }
      }

      context.data = {
        updatedAt: Date.now(),
        participants: discussion.participants.map((e) => { delete e.user; return e; })
      }
    }

    else {
      context.data = {};
    }

    delete context.data?.action;

  }

  await next()
}
