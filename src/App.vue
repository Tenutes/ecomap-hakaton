<script>
import { format, addDays } from 'date-fns';

import GraphModal from './components/GraphModal';
import YaMap from './components/Map';
import Sidebar from './components/Sidebar';
import GraphService from './services/GraphService';
import StationService from './services/StationService';

export default {
  name: 'App',
  components: { GraphModal, Sidebar, YaMap },
  data() {
    return {
      points: [],
      selectedStation: null,
      newPointInfo: null,
      graphData: null,
      modalVisible: false,
    };
  },

  async mounted() {
    const { data } = await StationService.getStations();
    this.points = data.stations;
  },

  methods: {
    async selectStation({ point, is_new }) {
      this.modalVisible = false;
      if (is_new) {
        this.selectedStation = this.newPointInfo;
      } else {
        const { data: stationData } = await StationService.getStationById(point.id);
        this.selectedStation = stationData;
      }
    },

    async selectNewStation(coords) {
      const { data: stationInfo } = await StationService.getNewStation(coords);
      this.modalVisible = false;
      const selectedStation = { ...stationInfo, ...coords };
      this.selectedStation = selectedStation;
      this.newPointInfo = selectedStation;
    },

    async getGraph(station) {
      this.modalVisible = true;

      const params = {
        station_id: station.id,
        forecast: 0,
        lat: station.lat,
        lng: station.lng,
        from_datetime: `${ format(new Date().setFullYear(2020), 'yyyy-MM-dd') }T00:00:00.176Z`,
        to_datetime: `${ format(addDays(new Date().setFullYear(2020), 1), 'yyyy-MM-dd') }T00:00:00.176Z`,
      };

      await this.loadChartData(station, params);
    },

    async loadChartData(station, params) {
      const { data } = await GraphService.get(params);
      this.graphData = { station, substances: data.substances };
      this.modalTab = this.graphData.substances?.[0]?.name;
    },

    async updateChart({ station, data }) {
      const params = {
        station_id: station.id,
        forecast: data.forecast,
        lat: station.lat,
        lng: station.lng,
        from_datetime: data.time[0],
        to_datetime: data.time[1],
      };

      await this.loadChartData(station, params);
    },

    async getPolygon(station) {
      // eslint-disable-next-line
      alert('Хрен тобi');
      console.log(station);
    },
  },
};
</script>

<template>
<div class="app">
  <div class="app__map">
    <ya-map
      @select-station="selectStation"
      @select-new-station="selectNewStation"
      :points="points"
      :new-point="newPointInfo"
    />
  </div>
  <div class="app__info">
    <sidebar
      :station="selectedStation"
      @get-graph="getGraph"
      @get-polygon="getPolygon"
    />
  </div>
  <graph-modal :graph-data="graphData" :modal-visible.sync="modalVisible" @update-chart="updateChart"/>
</div>
</template>

<style lang="scss">
body {
  padding: 0;
  margin: 0;
  box-sizing: border-box;
  font-family: Roboto, Arial, sans-serif;
}

* {
  margin: 0;
  padding: 0;
  box-sizing: inherit;
}

.app {
  height: 100vh;
  display: flex;

  &__map {
    width: 100%;
  }

  &__info {
    flex-shrink: 0;
    position: relative;
    z-index: 2;
    width: 400px;
    transition: .25s;
  }
}
</style>
