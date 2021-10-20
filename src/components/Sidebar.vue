<script>
export default {
  name: 'Sidebar',
  components: {},
  props: {
    station: {
      type: Object,
      default: null,
    },
  },
  methods: {
    getGraph() {
      this.$emit('get-graph', this.station);
    },
    getMapPolygon() {
      this.$emit('get-polygon', this.station);
    },
  },
};
</script>

<template>
<div class="sidebar">
  <template v-if="station">
    <div class="sidebar__block sidebar__block--padded">
      <h1>{{ station.name }}</h1>
    </div>
    <div class="sidebar__block" v-if="station.substances">
      <el-divider content-position="left">Концентрация веществ</el-divider>
      <div v-for="({name, value}, index) in station.substances" :key="index" class="sidebar__substance">
        <p class="sidebar__substance-name">{{ name }}</p>
        <p class="sidebar__substance-value">{{ value }}</p>
      </div>
    </div>
    <div class="sidebar__block" v-if="station.near_station_substances">
      <el-divider content-position="left">Концентрация веществ на ближайшей станции</el-divider>
      <div v-for="({name, value}, index) in station.near_station_substances" :key="index" class="sidebar__substance">
        <p class="sidebar__substance-name">{{ name }}</p>
        <p class="sidebar__substance-value">{{ value }}</p>
      </div>
    </div>
    <div class="sidebar__block sidebar__block--padded">
      <el-button type="success" @click="getGraph">Посмотреть график</el-button>
      <el-button type="primary" @click="getMapPolygon">Посмотреть красоту</el-button>
    </div>
  </template>
  <template v-else>
    <div class="sidebar__block sidebar__block--padded">
      <h2>Для просмотра информации выберите любую точку на карте</h2>
    </div>
    <div></div>
  </template>
</div>
</template>

<style lang="scss">
.sidebar {
  .el-divider {
    &--horizontal {
      margin-bottom: 35px;
    }
  }
}
</style>

<style lang="scss" scoped>
.sidebar {
  display: flex;
  flex-direction: column;
  padding: 40px 0;
  width: 100%;
  height: 100%;
  box-shadow: -5px 14px 14px rgba(black, .25);

  &__block {
    margin-bottom: 40px;

    &--padded {
      padding: 0 15px;
    }

    &:last-child {
      margin-top: auto;
      margin-bottom: 0;
    }
  }

  &__substance {
    padding: 0 15px;
    display: flex;
    justify-content: space-between;
    margin-bottom: 10px;

    &:last-child {
      margin-bottom: 0;
    }
  }

  &__substance-name {
    font-weight: bold;
    flex-grow: 1;
    overflow: hidden;
    white-space: nowrap;
    margin-right: 5px;

    &::after {
      padding-left: 5px;
      display: inline-block;
      content: ". . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .   . . . . . . . . . . . . . . . . . . . . ";
      color: #999;
      font-size: 14px;
    }
  }

  &__substance-value {

  }

  h2 {
    font-size: 20px;
    color: #999;
  }

  h1 {
    font-size: 25px;
  }
}
</style>
