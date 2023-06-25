import { GeneralError } from '@feathersjs/errors/lib/index.js'
import { promises as fs } from 'fs'

export const uploadToLocal = async (originalname, fileBuffer, prefix = '0', folder = 'public/uploads') => {
  const ts = new Date().getTime()

  var finalPath = null;

  await fs.mkdir(folder, { recursive: true });

  if (!folder) {
    throw new GeneralError('Impossible to locate saving files folder')
  }

  const filename =
    ts +
    '_' +
    prefix +
    '_' +
    originalname
      .toLowerCase()
      .replace(/[^a-z0-9. -]/g, '') // remove invalid chars
      .replace(/\s+/g, '') // collapse whitespace and replace by -
      .replace(/-+/g, '')

  try {
    await fs.writeFile(folder + '/' + filename, fileBuffer)
    finalPath = folder.slice('public/'.length) + '/' + filename
  } catch (error) {
    console.log(error)
    return false
  }

  return finalPath
}
