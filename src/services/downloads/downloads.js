// For more information about this file see https://dove.feathersjs.com/guides/cli/service.html
import { authenticate } from '@feathersjs/authentication'
import { DownloadsService, getOptions } from './downloads.class.js'
import { downloadFileMiddleware } from '../../middlewares/download-files-middleware.js'
import { BadRequest } from '@feathersjs/errors'

export const downloadsPath = 'downloads'
export const downloadsMethods = ['find']

export * from './downloads.class.js'

// A configure function that registers the service and its hooks via `app.configure`
export const downloads = (app) => {
  // Register our service on the Feathers application
  app.use(downloadsPath, new DownloadsService(getOptions(app)), {
    // A list of all methods this service exposes externally
    methods: downloadsMethods,
    // You can add additional custom events to be sent to clients here
    events: [],
    koa: {
      after: [downloadFileMiddleware]
    }
  })
  // Initialize hooks
  app.service(downloadsPath).hooks({
    around: {
      all: [authenticate('jwt')]
    },
    before: {
      all: [],
      find: [
        async (context, next) => {
          const { messageId } = context.params.query

          if (!messageId) {
            throw new BadRequest("You have to provide message id")
          }

          const message = await context.app.service('messages').get(messageId);

          if (!message.file?.originalName) {
            throw new BadRequest("Any file is not associate to this message")
          }

          if (context.params?.user) {
            if (message.discussionId) {
              const discussion = await context.app.service('discussions').get(message.discussionId);
              const findUser = discussion.participants.find(
                (participant) => participant.userId.toString() == context.params.user._id.toString()
              )
              if (!findUser) {
                throw new BadRequest("You can not access to this file")
              }
            }

          }

          context.params.file = message.file
        }

      ],
    },
  })
}
