<script>
import { yandexMap, ymapMarker } from 'vue-yandex-maps';

import PolygonImage from '../assets/map.png';
import NewPointImage from '../assets/point-new.png';
import PointImage from '../assets/point.png';
import { LAST_DATA_UPDATE } from '../config';

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
      polygon: {
        visible: false,
        coords: [[[55.95, 38.15], [55.45, 38.15], [55.45, 37.15], [55.95, 37.15]]],
        options: { fill: true, fillImageHref: PolygonImage, fillOpacity: .75 },
      },
    };
  },
  LAST_DATA_UPDATE,
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
    toggleMapPolygon() {
      this.polygon.visible = !this.polygon.visible;
    },
  },
};
</script>

<template>
<div class="map" v-loading="!map">
  <div class="map__buttons">
    <div>
      <el-tooltip :content="`На ${$options.LAST_DATA_UPDATE}`">
        <el-button type="primary" @click="toggleMapPolygon">{{ polygon.visible ? 'Спрятать' : 'Показать' }}
          карту распространения CO
        </el-button>
      </el-tooltip>
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
    </div>
    <div v-if="polygon.visible" class="polygon-legend">
      <p><span style="background: #FDE723"></span> - большая концентрация</p>
      <p><span style="background: #440054"></span> - малая концентрация</p>
    </div>
  </div>
  <div class="map__container" :class="{'choose-point': choosePoint}">
    <yandex-map
      :settings="$options.MAP_SETTINGS"
      :coords="$options.MAP_DEFAULT_CENTER"
      :zoom="$options.MAP_DEFAULT_ZOOM"
      :controls="[]"
      :behaviors="[]"
      :options="$options.MAP_OPTIONS"
      @map-was-initialized="setMap"
      @click="mapClick"
    >
      <ymap-marker
        v-if="polygon.visible"
        marker-id="polygon"
        marker-type="polygon"
        :coords="polygon.coords"
        :options="polygon.options"
      />
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

  &__buttons {
    position: absolute;
    top: 15px;
    left: 15px;
    z-index: 10;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
  }
}

.polygon-legend {
  padding: 10px 15px;
  margin-top: 10px;
  background: rgba(white, .85);
  box-shadow: 0 5px 10px rgba(black, .14);
  border-radius: 5px;

  p {
    margin-bottom: 5px;

    &:last-child {
      margin-bottom: 0;
    }

    span {
      display: inline-block;
      width: 15px;
      height: 15px;
      margin-right: 5px;
    }
  }
}
</style>
