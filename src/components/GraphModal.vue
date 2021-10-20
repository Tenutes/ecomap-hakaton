<script>
import { format, isSameDay, parseISO } from 'date-fns';

import LineChart from './LineChart';
import { DEFAULT_DATE_RANGE, DEFAULT_FORECAST_AMOUNT } from './constants';

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
    chartData() {
      if (!this.graphData) {
        return null;
      }
      let previousDay = null;
      return {
        labels: this.currentActiveSubstance?.data.map(({ date }) => {
          const currentDay = parseISO(date);
          if (!previousDay || !isSameDay(previousDay, currentDay)) {
            previousDay = currentDay;
            return format(parseISO(date), 'dd.MM HH:mm');
          }

          return format(currentDay, 'HH:mm');
        }),
        datasets: [
          {
            label: this.currentActiveSubstance?.name || 'Данных нет',
            backgroundColor: '#FFFFFF00',
            data: this.currentActiveSubstance?.data.map(({ value }) => value),
            borderColor: 'rgb(48,112,76)',
          },
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
        <p>Длительность предсказания</p>
        <el-time-select
          v-model="forecastAmount"
          :picker-options="{
              start: '00:20',
              step: '00:20',
              end: '24:00'
            }"
          :clearable="false"
          placeholder="Выберите время"
        >
        </el-time-select>
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
