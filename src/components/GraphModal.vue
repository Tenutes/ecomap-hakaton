<script>
import { format, isSameDay, parseISO, parse, isBefore } from 'date-fns';

import { LAST_DATA_UPDATE } from '../config';

import LineChart from './LineChart';
import {
  CHART_CURRENT_COLOR,
  CHART_FLUCTUATION_COLOR,
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
    chartOptions() {
      return {
        responsive: true,
        maintainAspectRatio: false,
        annotation: this.chartPDKLine,
        scales: {
          yAxes: [{
            beginAtZero: true,
          }],
        },
      };
    },
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
    chartPDKLine() {
      const pdkValue = this.graphData.pdk[this.currentActiveSubstance.name];
      const yAdjust = pdkValue === 0 ? -12 : 12;
      return {
        annotations: [
          {
            type: 'line',
            mode: 'horizontal',
            scaleID: 'y-axis-0',
            value: pdkValue,
            borderColor: 'red',
            borderWidth: 1,
            label: {
              backgroundColor: 'rgba(0,0,140,.5)',
              cornerRadius: 2,
              xPadding: 4,
              yPadding: 3,
              position: 'left',
              yAdjust,
              xAdjust: 3,
              content: 'Пдк',
              enabled: true,
            },
          },
        ],
      };
    },
    chartCurrent() {
      let previousDay = null;
      return {
        labels: this.currentActiveSubstance?.data?.map(({ date }) => {
          const currentDay = parseISO(date);
          if (!previousDay || !isSameDay(previousDay, currentDay)) {
            previousDay = currentDay;
            return format(parseISO(date), 'dd.MM HH:mm');
          }

          return format(currentDay, 'HH:mm');
        }) || [],
        datasets:
          {
            label: this.currentActiveSubstance?.name || 'Данных нет',
            fill: false,
            data: this.currentActiveSubstance?.data.map(({ value }) => value),
            borderColor: CHART_CURRENT_COLOR,
            pointBackgroundColor: this.pointsColor,
            pointBorderColor: this.pointsColor,
            lineTension: .25,
          },
      };
    },
    chartForecast() {
      return {
        labels: [],
        datasets: null,
      };
    },
    chartDatasets() {
      const datasets = [];
      if (this.chartCurrent.labels.length) {
        datasets.push(this.chartCurrent.datasets);
      }
      if (this.chartForecast.labels.length) {
        datasets.push(this.chartForecast.datasets);
      }

      return datasets;
    },
    chartData() {
      if (!this.graphData) {
        return null;
      }

      return {
        labels: [
          ...this.chartCurrent.labels,
          ...this.chartForecast.labels,
        ],
        datasets: this.chartDatasets,
      };
    },
    modalTitle() {
      return this.graphData?.station?.name || 'Загружаем';
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
    isDateDisabled(date) {
      const maxDate = parse(LAST_DATA_UPDATE, 'dd.MM.yyyy HH:mm', new Date());
      return !(isSameDay(maxDate, date) || isBefore(date, maxDate));
    },
  },
};
</script>

<template>
<el-dialog
  class="modal"
  :title="modalTitle"
  :visible="modalVisible"
  @close="$emit('close')"
>
  <el-skeleton v-if="!graphData" :rows="10" animated/>
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
      <LineChart v-if="chartDatasets.length" :chart-data="chartData" :options="chartOptions"/>
      <p class="modal__chart-empty" v-else>Данных по данной станции на данной момент нет</p>
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
          :picker-options="{disabledDate: isDateDisabled}"
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

  &__chart-empty {
    font-weight: bold;
    font-size: 20px;
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
