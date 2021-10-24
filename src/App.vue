<script>
import { format } from 'date-fns';

import GraphModal from './components/GraphModal';
import YaMap from './components/Map';
import Sidebar from './components/Sidebar';
import { DEFAULT_FORECAST_AMOUNT } from './components/constants';
import { END_DATE, GRAPH_FORMAT, LAST_DATA_UPDATE, PDK_VALUES, START_DATE } from './config';
import GraphService from './services/GraphService';
import StationService from './services/StationService';

export default {
  name: 'App',
  components: { GraphModal, Sidebar, YaMap },
  data() {
    return {
      points: [],
      newPoints: [],
      selectedStation: null,
      graphData: null,
      modalVisible: false,
    };
  },
  LAST_DATA_UPDATE,
  PDK_VALUES,
  async mounted() {
    const { data } = await StationService.getStations();
    this.points = data.stations;
  },
  computed: {
    pdks() {
      return Array.from(Object.entries(this.$options.PDK_VALUES).map(([key, value]) => ({ key, value })));
    },
  },

  methods: {
    async selectStation({ point, is_new }) {
      this.modalVisible = false;
      if (is_new) {
        this.selectedStation = this.newPoints[point.id];
      } else {
        const { data: stationData } = await StationService.getStationById(point.id);
        this.selectedStation = stationData;
      }
    },

    async selectNewStation(coords) {
      const { data: stationInfo } = await StationService.getNewStation(coords);
      this.modalVisible = false;
      const pointId = this.newPoints.length;

      const selectedStation = {
        ...stationInfo, ...coords,
        id: pointId,
        name: `Произвольная станция #${ pointId + 1 }`,
        is_new_station: true,
      };
      this.selectedStation = selectedStation;
      this.newPoints.push(selectedStation);
    },

    async getGraph(station) {
      this.modalVisible = true;

      const params = {
        station_id: station.id,
        forecast: DEFAULT_FORECAST_AMOUNT,
        lat: station.lat,
        lng: station.lng,
        from_datetime: START_DATE,
        to_datetime: END_DATE,
      };

      await this.loadChartData(station, params);
    },

    async loadChartData(station, params) {
      const { data } = await GraphService.get(params);
      this.graphData = {
        station,
        substances: data.substances,
        pdk: Object.fromEntries(station.substances.map(({ name, value }) => [name, value])),
      };
      this.modalTab = this.graphData.substances?.[0]?.name;
    },

    async updateChart({ station, data }) {
      const params = {
        station_id: station.id,
        forecast: data.forecast,
        lat: station.lat,
        lng: station.lng,
        from_datetime: format(data.time[0], GRAPH_FORMAT),
        to_datetime: format(data.time[1], GRAPH_FORMAT),
      };

      await this.loadChartData(station, params);
    },
    closeModal() {
      this.modalVisible = false;
      setTimeout(() => {
        this.graphData = null;
      }, 200);
    },
  },
};
</script>

<template>
<div class="app">
  <div class="app__map">
    <div class="app__data">
      <p class="app__last-date">Данные от: {{ $options.LAST_DATA_UPDATE }}</p>
      <div class="app__pdks">
        <p class="app__pdks-title">Значения ПДК</p>
        <p class="app__pdks-item" v-for="({key, value}) in pdks" :key="key">
          <span>{{ key }}</span><span>{{ value }}</span>
        </p>
      </div>
    </div>
    <ya-map
      @select-station="selectStation"
      @select-new-station="selectNewStation"
      :points="points"
      :new-points="newPoints"
    />
  </div>
  <div class="app__info">
    <sidebar
      :station="selectedStation"
      @get-graph="getGraph"
    />
  </div>
  <graph-modal
    :graph-data="graphData"
    :modal-visible="modalVisible"
    @update-chart="updateChart"
    @close="closeModal"
  />
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
    position: relative;
  }

  &__info {
    flex-shrink: 0;
    position: relative;
    z-index: 2;
    width: 400px;
    transition: .25s;
  }

  &__data {
    position: absolute;
    top: 15px;
    right: 15px;
    z-index: 2000;
    display: flex;
    flex-direction: column;
    align-items: flex-end;
  }

  &__last-date {
    font-size: 14px;
    padding: 5px 10px;
    background: rgba(white, .95);
    border-radius: 5px;
    box-shadow: 0 10px 15px rgba(black, .14);
    margin-bottom: 10px;
  }

  &__pdks {
    width: 200px;
    padding: 5px 10px;
    background: rgba(white, .95);
    border-radius: 5px;
    box-shadow: 0 10px 15px rgba(black, .14);
  }

  &__pdks-title {
    font-weight: 600;
    margin-bottom: 5px;
    font-size: 15px;
  }

  &__pdks-item {
    display: flex;
    align-items: center;

    span {
      white-space: nowrap;
      overflow: hidden;
      font-size: 14px;

      &:first-child {
        font-weight: bold;
        color: #1E1E70;
        margin-right: 5px;
        flex-grow: 1;

        &::after {
          padding-left: 5px;
          display: inline-block;
          content: ". . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .   . . . . . . . . . . . . . . . . . . . . ";
          color: #999;
          font-size: 14px;
        }
      }

      &:last-child {
        flex-shrink: 0;
      }
    }
  }
}
</style>
