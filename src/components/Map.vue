<script>
import { yandexMap, ymapMarker } from 'vue-yandex-maps';

import NewPointImage from '../assets/point-new.png';
import PointImage from '../assets/point.png';

import { MAP_DEFAULT_CENTER, MAP_DEFAULT_ZOOM, MAP_SETTINGS, MAP_OPTIONS } from './constants';

export default {
  name: 'Map',
  components: { yandexMap, ymapMarker },
  props: {
    newPoints: {
      type: Array,
      default: [],
    },
    points: {
      type: Array,
      default: [],
    },
  },
  data() {
    return {
      map: null,
      choosePoint: false,
      pointMarker: {
        layout: 'default#image',
        imageHref: PointImage,
        imageSize: [32, 32],
        imageOffset: [-16, -16],
      },
      newPointMarker: {
        layout: 'default#image',
        imageHref: NewPointImage,
        imageSize: [32, 32],
        imageOffset: [-16, -16],
      },
    };
  },
  MAP_SETTINGS,
  MAP_OPTIONS,
  MAP_DEFAULT_CENTER,
  MAP_DEFAULT_ZOOM,
  methods: {
    setMap(map) {
      this.map = map;
    },
    mapClick(e) {
      if (!this.choosePoint) {
        return;
      }

      const [lat, lng] = e.get('coords');
      this.$emit('select-new-station', { lat, lng });
      this.togglePointChoose();
    },
    pointClick(e, point, is_new = false) {
      e.stopPropagation();
      if (this.choosePoint) {
        return;
      }
      this.$emit('select-station', { point, is_new });
    },
    togglePointChoose() {
      this.choosePoint = !this.choosePoint;
    },
  },
};
</script>

<template>
<div class="map" v-loading="!map">
  <el-button
    :disabled="!map"
    type="warning"
    class="map__button"
    @click="togglePointChoose"
    :icon="choosePoint ? 'el-icon-close' : ''"
    :circle="choosePoint"
  >
    <template v-if="!choosePoint">Выбрать произвольную точку</template>
  </el-button>
  <div class="map__container" :class="{'choose-point': choosePoint}">
    <yandex-map
      :settings="$options.MAP_SETTINGS"
      :coords="$options.MAP_DEFAULT_CENTER"
      :zoom="$options.MAP_DEFAULT_ZOOM"
      :behaviors="[]"
      :controls="[]"
      :options="$options.MAP_OPTIONS"
      @map-was-initialized="setMap"
      @click="mapClick"
    >
      <ymap-marker
        v-for="point in points"
        :key="point.id"
        :marker-id="point.id"
        :coords="[point.lat, point.lng]"
        :hint-content="point.name"
        :icon="pointMarker"
        @click="e => pointClick(e, point)"
      />
      <ymap-marker
        v-for="newPoint in newPoints"
        :key="'n' + newPoint.id"
        :marker-id="'n' + newPoint.id"
        :coords="[newPoint.lat, newPoint.lng]"
        :hint-content="newPoint.name"
        :icon="newPointMarker"
        @click="e => pointClick(e, newPoint, true)"
      />
    </yandex-map>
  </div>
</div>
</template>

<style lang="scss">
.map {
  &__container {
    [class*="ymaps-2"][class*="-ground-pane"] {
      filter: url("data:image/svg+xml;utf8,<svg xmlns=\'http://www.w3.org/2000/svg\'><filter id=\'grayscale\'><feColorMatrix type=\'matrix\' values=\'0.3333 0.3333 0.3333 0 0 0.3333 0.3333 0.3333 0 0 0.3333 0.3333 0.3333 0 0 0 0 0 1 0\'/></filter></svg>#grayscale");
      -webkit-filter: grayscale(100%);
    }
  }
}
</style>

<style lang="scss" scoped>
.map {
  position: relative;
  height: 100%;

  &__container {
    width: 100%;
    height: 100%;

    * {
      width: 100%;
      height: 100%;
    }

    &.choose-point {
      cursor: crosshair;
    }
  }

  &__button {
    position: absolute;
    top: 15px;
    left: 15px;
    z-index: 10;
  }
}
</style>
