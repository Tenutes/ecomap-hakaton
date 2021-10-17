<script>
export default {
  name: 'Sidebar',
  components: {},
  props: {
    point: {
      type: Object,
      default: null,
    },
  },
  data() {
    return {};
  },
  computed: {},
  watch: {},
  created() {
  },
  mounted() {
  },
  updated() {
  },
  methods: {},
};
</script>

<template>
<div class="sidebar">
    <template v-if="point"></template>
    <template v-else>
      <h2>Для просмотра информации выберите любую точку на карте</h2>
    </template>
</div>
</template>

<style lang="scss" scoped>
.sidebar {
  padding: 15px;
  width: 100%;
  height: 100%;
  box-shadow: -5px 14px 14px rgba(black, .25);

  h2 {
    font-size: 20px;
  }
}
</style>
