// This is a skeleton for a custom service class. Remove or add the methods you need here
export class DownloadsService {
  constructor(options) {
    this.options = options
  }

  async find(_params) {
    return _params.file;
  }
}

export const getOptions = (app) => {
  return { app }
}
