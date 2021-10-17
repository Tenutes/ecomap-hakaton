import { BaseApi } from './BaseApi';

class GraphApi extends BaseApi {
  constructor() {
    super('graph');
  }

  get(params) {
    return this.http.post('', params);
  }
}

export default new GraphApi();
