import { uploadToLocal } from "../../helpers/uploadToLocal.js";

export const userPatchBeforeHook = async (context) => {

    if (context.params.file) {
        const { originalname, buffer } = context.params.file
        let finalPath = await uploadToLocal(originalname, buffer, '0', 'public/profils')
        context.data.photoUrl = finalPath;
      }

}