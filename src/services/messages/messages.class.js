import { MongoDBService } from '@feathersjs/mongodb'

// By default calls the standard MongoDB adapter service methods but can be customized with your own functionality.
export class MessagesService extends MongoDBService {}

export const getOptions = (app) => {
  return {
    paginate: app.get('paginate'),
    multi: ['remove'],
    Model: app.get('mongodbClient').then((db) => db.collection('messages'))
  }
}
