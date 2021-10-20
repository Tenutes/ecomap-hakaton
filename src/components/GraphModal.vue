<script>
import { format, isSameDay, parseISO } from 'date-fns';

import LineChart from './LineChart';
import {
  CHART_CURRENT_COLOR,
  CHART_FLUCTUATION_COLOR, CHART_FORECAST_COLOR,
  DEFAULT_DATE_RANGE,
  DEFAULT_FORECAST_AMOUNT,
} from './constants';

export default {
  name: 'GraphModal',
  components: { LineChart },
  props: {
    graphData: {
      type: Object,
      default: () => ({}),
    },
    modalVisible: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      modalTab: null,
      chartOptions: {
        responsive: true,
        maintainAspectRatio: false,
      },
      chartDateRange: DEFAULT_DATE_RANGE,
      forecastAmount: DEFAULT_FORECAST_AMOUNT,
      dump: {
        chartDateRange: DEFAULT_DATE_RANGE,
        forecastAmount: DEFAULT_FORECAST_AMOUNT,
      },
    };
  },
  watch: {
    graphData(n) {
      this.modalTab = n?.substances?.[0]?.name;
    },
  },
  computed: {
    isChanged() {
      return this.chartDateRange !== this.dump.chartDateRange ||
        this.forecastAmount !== this.dump.forecastAmount;
    },
    currentActiveSubstance() {
      if (!this.graphData) {
        return null;
      }

      return this.graphData.substances.find(({ name }) => name === this.modalTab);
    },
    currentActiveSubstanceFluctuationDates() {
      if (!this.currentActiveSubstance) {
        return [];
      }

      return this.currentActiveSubstance.fluctuations.map(({ date }) => date);
    },
    pointsColor() {
      return this.currentActiveSubstance?.data.map(({ date }) => {
        if (this.currentActiveSubstanceFluctuationDates.includes(date)) {
          return CHART_FLUCTUATION_COLOR;
        }

        return CHART_CURRENT_COLOR;
      });
    },
    chartData() {
      if (!this.graphData) {
        return null;
      }
      let previousDay = null;
      // forecast
      // const lastValue = this.currentActiveSubstance?.data.at(-1).value;
      // const forecastNaNValues = this.currentActiveSubstance?.data.map(() => Number.NaN);
      // forecastNaNValues.pop();
      return {
        labels: [
          ...this.currentActiveSubstance?.data.map(({ date }) => {
            const currentDay = parseISO(date);
            if (!previousDay || !isSameDay(previousDay, currentDay)) {
              previousDay = currentDay;
              return format(parseISO(date), 'dd.MM HH:mm');
            }

            return format(currentDay, 'HH:mm');
          }),
        ],
        datasets: [
          {
            label: this.currentActiveSubstance?.name || 'Данных нет',
            backgroundColor: '#FFFFFF00',
            data: this.currentActiveSubstance?.data.map(({ value }) => value),
            borderColor: CHART_CURRENT_COLOR,
            pointBackgroundColor: this.pointsColor,
            pointBorderColor: this.pointsColor,
          },
          // forecast
          // {
          //   label: 'Предсказание',
          //   backgroundColor: '#FFFFFF00',
          //   data: [...forecastNaNValues, lastValue, .25],
          //   borderColor: CHART_FORECAST_COLOR,
          //   pointBackgroundColor: CHART_FORECAST_COLOR,
          //   pointBorderColor: CHART_FORECAST_COLOR,
          // },
        ],
      };
    },
  },
  methods: {
    handleChartUpdate() {
      this.dump = {
        chartDateRange: this.chartDateRange,
        forecastAmount: this.forecastAmount,
      };

      this.$emit('update-chart', {
        station: this.graphData.station,
        data: {
          forecast: this.forecastAmount,
          time: this.chartDateRange,
        },
      });
    },
  },
};
</script>

<template>
<el-dialog
  class="modal"
  :title="((graphData || {}).station || {}).name || 'Загружаем'"
  :visible.sync="modalVisible"
>
  <el-skeleton v-if="!graphData" :rows="6" animated/>
  <template v-else>
    <el-tabs v-if="graphData" v-model="modalTab">
      <el-tab-pane
        v-for="substance in graphData.substances"
        :key="substance.name"
        :label="substance.name"
        :name="substance.name"
      />
    </el-tabs>
    <div class="modal__chart">
      <LineChart :chart-data="chartData" :options="chartOptions"/>
    </div>
    <div class="modal__date">
      <div class="modal__date-block">
        <p>Начало и конец отображаемых данных</p>
        <el-date-picker
          v-model="chartDateRange"
          type="datetimerange"
          range-separator="до"
          start-placeholder="От"
          end-placeholder="До"
          :clearable="false"
        >
        </el-date-picker>
      </div>
      <div class="modal__date-block">
        <p>Длительность предсказания (ч.)</p>
        <el-input-number :min="1" :max="24" v-model="forecastAmount"/>
      </div>
      <div class="modal__date-block">
        <p>&nbsp;</p>
        <el-button :disabled="!isChanged" type="success" @click="handleChartUpdate">Показать</el-button>
      </div>
    </div>
  </template>
</el-dialog>
</template>

<style lang="scss">
.modal {
  .el-date-editor {
    .el-range-separator {
      padding: 0;
    }
  }
}
</style>

<style lang="scss" scoped>
.modal {
  &__chart {
    max-width: 100%;
    margin-bottom: 25px;
  }

  &__date {
    margin: -10px;
    width: calc(100% + 20px);
    display: flex;
    flex-wrap: wrap;
  }

  &__date-block {
    margin: 10px;

    p {
      margin-bottom: 5px;
      font-size: 14px;
    }
  }
}
</style>
