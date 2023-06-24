import { BadRequest } from "@feathersjs/errors";

export const discussionCreateAroundHook = async (context, next) => {

  if (context.params?.user) {

    if (!context.data?.tag || !['PRIVATE', 'GROUP'].includes(context.data.tag)){
      throw new BadRequest("Your tag is not valid(PRIVATE, GROUP)")
    }

    if(context.data.tag === 'PRIVATE') {

      const { userId } =  context.data;

      if (!userId) {
        throw new BadRequest("You have to provide userId");
      }

      // verify user can communicate with this contact

      const existContact = await context.app.service("contacts").find({ query : {
        $or : [
          {userId1 : context.params.user._id, userId2 : userId},
          {userId2 : context.params.user._id, userId1 : userId}
        ],
        blockedUser1: false,
        blockedUser2: false, 
        $limit :1 
      }});

      if (!existContact.data || existContact.data.length < 1 ) {
        throw new BadRequest("You can commnunicate with this user")
      }

      // verify if this discussion already exist
      // A revoir

      /*const existDiscussion = await context.app.service("discussions").find({ query : {
        $and : [
          {
            'participants.userId' : context.params.user._id,
          }, 
          {
            'participants.userId' : userId,
          }
        ],  
        $limit :1 
      }});

      if (!existDiscussion.data || existDiscussion.data.length < 1 ) {
        throw new BadRequest("This discussion already exist")
      }*/


      const nowDate = Date.now();

      if (context.params.user._id.toString() === userId.toString()) {
        throw new BadRequest('You can chat with yourself');
      }
      
      const discussion = {
       tag : 'PRIVATE',
       participants : [
         {
           userId: context.params.user._id,
           isAdmin: true,
           addedAt : nowDate
         },
         {
           userId: userId,
           isAdmin: true,
           addedAt : nowDate
         }
       ],
       createdAt : nowDate,
       createdById : context.params.user._id,
       updatedAt : nowDate,
      };

      context.data = discussion;
   }


   if (context.data.tag === 'GROUP') {

      var { participants } = context.data;

      if (!participants || !Array.isArray(participants)) {
        throw new BadRequest('participants must be array of id');
      }

      participants.push(context.params.user._id.toString());

      participants = [...new Set(participants)];

      if (participants < 3) {
        throw new BadRequest('Discussion group must have at least 3 participants');
      }

      const existContacts = await context.app.service("contacts").find({ query : {
        $or : [
          {userId1 : context.params.user._id},
          {userId2 : context.params.user._id}
        ], 
        blockedUser1: false,
        blockedUser2: false,
        $select: ['_id'],
        $paginate : false 
      }});

      for(var idx = 0; idx < existContacts.length; idx++) {
        if(context.params.user._id.toString() != existContacts[idx].toString() && 
        !participants.includes(existContacts[idx].toString())) {
          throw new BadRequest("You can not add participant "+existContacts[idx].toString());
        }
      }

      
      var finalParticipants = [];

      participants.forEach(element => {
        finalParticipants.push({
          userId: participants,
          isAdmin: context.params.user._id.toString() === element.toString() ? true : false,
          hasNewNotif: true,
          addedAt : nowDate,
        })
      });

      context.data.participants = finalParticipants;

      context.createdById = context.params.user._id;
   
    }

  }

  await next()
}
