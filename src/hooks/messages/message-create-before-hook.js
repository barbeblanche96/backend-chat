import { uploadToLocal } from "../../helpers/uploadToLocal.js";

export const messageCreateBeforeHook = async (context) => {

    if (context.params.file) {
        var i = 0
        const { originalname, buffer, mimetype, size } = context.params.file
        let finalPath = await uploadToLocal(originalname, buffer, i.toString(), 'public/uploads')
        context.data.file = {
          originalName: originalname.normalize('NFD').replace(/\p{Diacritic}/gu, ''),
          pathUrl: finalPath,
          size: size
        }
      }
    
      if (!context.data?.text && !context.data.file) {
        throw new BadRequest(
          'Message content can not be empty!'
        )
      }

}