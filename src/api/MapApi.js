import { BaseApi } from './BaseApi';

class MapApi extends BaseApi {
  constructor() {
    super('stations');
  }
}

export default new MapApi();
