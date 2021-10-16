import { BaseApi } from './BaseApi';

class StationApi extends BaseApi {
  constructor() {
    super('/stations');
  }
}

export default new StationApi();
