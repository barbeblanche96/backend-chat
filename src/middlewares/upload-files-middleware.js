import { BadRequest } from '@feathersjs/errors/lib/index.js'

import multer from '@koa/multer'
import path from 'path'

export const multipartMiddlewareImage = multer({
  fileFilter: function (req, file, cb) {
    var allowMimeTypes = [
      'image/png',
      'image/jpeg',
      'image/jpg'
    ]
    var allowExtensions = ['.png', '.jpg', '.jpeg']

    if (!req.body?.errors || !Array.isArray(req.body?.errors)) {
      req.body.errors = []
    }

    if (
      !allowMimeTypes.includes(file.mimetype) ||
      !allowExtensions.includes(path.extname(file.originalname).toLowerCase())
    ) {
      req.body.errors.push('Type file of ' + file.originalname + ' is incorrect')
      return cb(null, true)
    }

    return cb(null, true)
  }
})

export const multipartMiddlewareMessage = multer({
  fileFilter: function (req, file, cb) {
    var allowMimeTypes = [
      'image/png',
      'image/jpeg',
      'image/jpg',
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    ]
    var allowExtensions = ['.png', '.jpg', '.jpeg', '.pdf', '.doc', '.dot', '.docx', '.xls', '.xlsx']

    if (!req.body?.errors || !Array.isArray(req.body?.errors)) {
      req.body.errors = []
    }

    if (
      !allowMimeTypes.includes(file.mimetype) ||
      !allowExtensions.includes(path.extname(file.originalname).toLowerCase())
    ) {
      req.body.errors.push('Type file of ' + file.originalname + ' is incorrect')
      return cb(null, true)
    }

    return cb(null, true)
  }
})


export async function uploadFileMiddleware(ctx, next) {
  let currentFile = ctx.request?.file

  if (currentFile) {
    if (currentFile.size > 1024 * 1024 * 3) {
      ctx.request.body.errors.push(
        'Your file can not exceed 3 MB'
      )
    }

    if (ctx.request.body.errors && ctx.request.body.errors.length > 0) {
      throw new BadRequest({
        errors: ctx.request.body.errors
      })
    }

    delete ctx.request.body?.errors

    ctx.feathers.file = ctx.file
  }

  await next()
}
