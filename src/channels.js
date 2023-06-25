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
    if (connection) {
      // The connection is no longer anonymous, remove it
      app.channel(`userIds/${user._id.toString()}`).join(connection);

    }
  })

  // eslint-disable-next-line no-unused-vars
  app.publish((data, context) => {
    // Here you can add event publishers to channels set up in `channels.js`
    // To publish only for a specific event use `app.publish(eventname, () => {})`

    // e.g. to publish all service events to all authenticated users use
    return app.channel('authenticated')
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
