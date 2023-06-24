import { GeneralError } from '@feathersjs/errors/lib/index.js'
import { promises as fs } from 'fs'

export const uploadToLocal = async (originalname, fileBuffer, prefix = '0') => {
  const ts = new Date().getTime()

  var uploadFolderPath = 'public/uploads';

  var finalPath = null;

  await fs.mkdir(uploadFolderPath, { recursive: true });

  if (!uploadFolderPath) {
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
    await fs.writeFile(uploadFolderPath + '/' + filename, fileBuffer)
    finalPath = uploadFolderPath.slice('public/'.length) + '/' + filename
  } catch (error) {
    console.log(error)
    return false
  }

  return finalPath
}
