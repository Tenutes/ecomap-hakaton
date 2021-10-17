import { BaseApi } from './BaseApi';

class StationApi extends BaseApi {
  constructor() {
    super('/stations');
  }

  get() {
    return this.http.get();
  }

  post(coords) {
    return this.http.post('', coords);
  }

  read(id) {
    return this.http.get('/' + id);
  }
}

export default new StationApi();
