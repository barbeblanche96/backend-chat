import fs from 'fs'

export async function downloadFileMiddleware(ctx, next) {
  await next()

  if (!Array.isArray(ctx.response?.body) && ctx.response?.body?.pathUrl && ctx.response?.body?.originalName) {
    const file = fs.createReadStream('./public/' + ctx.response.body.pathUrl)

    ctx.response.set('Content-disposition', `attachment; filename=${ctx.response.body.originalName}`)
    ctx.body = file
  }
}
