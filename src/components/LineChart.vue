<script>
import Annotation from 'chartjs-plugin-annotation';
import { Line, mixins } from 'vue-chartjs';

const { reactiveProp } = mixins;

export default {
  extends: Line,
  mixins: [reactiveProp],
  props: {
    chartData: {
      type: Object,
      default: () => ({}),
    },
    options: {
      type: Object,
      default: () => ({}),
    },
  },
  watch:{
    chartData() {
      this.$data._chart.destroy();
      this.renderChart(this.chartData, this.options);
    },
  },
  mounted() {
    this.addPlugin(Annotation);
    this.renderChart(this.chartData, this.options);
  },
};
</script>
