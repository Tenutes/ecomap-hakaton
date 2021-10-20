import GraphApi from '../api/GraphApi';

class GraphService {
  constructor() {
    this.api = GraphApi;
  }

  get(params) {
    try {
      return this.api.get(params);
    } catch (e) {
      console.log(e);

      return null;
    }
  }
}

export default new GraphService();
