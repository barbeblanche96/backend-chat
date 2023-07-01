import '@feathersjs/transport-commons'
import { logger } from './logger.js'

export const channels = (app) => {
  logger.warn(
    'Publishing all events to all authenticated users. See `channels.js` and https://dove.feathersjs.com/api/channels.html for more information.'
  )

  app.on('connection', (connection) => {
    // On a new real-time connection, add it to the anonymous channel
    app.channel('anonymous').join(connection)
  })

  app.on('login', (authResult, { connection }) => {
    // connection can be undefined if there is no
    // real-time connection, e.g. when logging in via REST
    const user = authResult.user;

    if (connection) {
      // The connection is no longer anonymous, remove it
      app.channel(`userIds/${user._id.toString()}`).join(connection);

    }
  })


  app.service('discussions').publish((data, context) => {
    let returnChannels = [];

    if(data.participants) {
      data.participants.forEach(participant => {
        returnChannels.push(app.channel(`userIds/${participant.userId.toString()}`));
      });
    }

    return returnChannels;
  })

  app.service('messages').publish((data, context) => {
    let returnChannels = [];

    if (data.discussion) {
      for (let i = 0; i < data.discussion.participants.length; i++) {
        returnChannels.push(app.channel(`userIds/${data.discussion.participants[i].userId.toString()}`));
      }
    }

    return returnChannels
  })




}
