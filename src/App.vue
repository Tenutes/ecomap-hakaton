<script>
import Map from './components/Map';
import Sidebar from './components/Sidebar';
import StationService from './services/StationService';

export default {
  name: 'App',
  components: { Sidebar, Map },
  data() {
    return {
      currentPoint: null,
      points: null,
    };
  },

  async mounted() {
    this.points = await StationService.getStations();
  }
};
</script>

<template>
<div class="app">
  <div class="app__map">
    <Map/>
  </div>
  <div class="app__info">
    <Sidebar :point="currentPoint"/>
  </div>
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
    width: 350px;
    transition: .25s;
  }
}
</style>
