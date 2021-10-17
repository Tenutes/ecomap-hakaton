import StationApi from '../api/StationApi';

class StationService {
  constructor() {
    this.api = StationApi;
  }

  async getStations() {
    try {
      return this.api.get();
    } catch (e) {
      console.log(e);
      return null;
    }
  }

  async getStationById(id) {
    try {
      return this.api.read(id);
    } catch (e) {
      console.log(e);
      return null;
    }
  }

  async getNewStation(coords) {
    try {
      return this.api.post(coords);
    } catch (e) {
      console.log(e);
      return null;
    }
  }
}

export default new StationService();
