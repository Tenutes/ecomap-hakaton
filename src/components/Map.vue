<script>
import { yandexMap, ymapMarker } from 'vue-yandex-maps';

import { MAP_DEFAULT_CENTER, MAP_DEFAULT_ZOOM, MAP_SETTINGS } from './constants';

export default {
  name: 'Map',
  components: { yandexMap },
  props: {},
  data() {
    return {
      map: null,
    };
  },
  MAP_SETTINGS,
  MAP_DEFAULT_CENTER,
  MAP_DEFAULT_ZOOM,
  computed: {},
  watch: {},
  methods: {
    setMap(map) {
      this.map = map;
    },
  },
};
</script>

<template>
<div class="map" v-loading="!map">
  <yandex-map
    :settings="$options.MAP_SETTINGS"
    :coords="$options.MAP_DEFAULT_CENTER"
    :zoom="$options.MAP_DEFAULT_ZOOM"
    :behaviors="[]"
    :controls="[]"
    @map-was-initialized="setMap"
  />
</div>
</template>

<style lang="scss" scoped>
.map {
  width: 100%;
  height: 100%;

  * {
    width: 100%;
    height: 100%;
  }
}
</style>
