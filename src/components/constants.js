export const MAP_SETTINGS = {
  lang: 'ru_RU',
  coordorder: 'latlong',
  enterprise: false,
  version: '2.1',
};

export const MAP_DEFAULT_CENTER = [55.755811, 37.617617];
export const MAP_DEFAULT_ZOOM = 11;
export const MAP_OPTIONS = {
  restrictMapArea: [
    [55.954635, 37.153603],
    [55.550145, 38.118243],
  ],
};

export const DEFAULT_FORECAST_AMOUNT = 1;
export const DEFAULT_DATE_RANGE = [
  new Date(2020, 9, 18).getTime(),
  new Date(2020, 9, 19).getTime(),
];

export const CHART_CURRENT_COLOR = 'rgb(48,112,76)';
export const CHART_FLUCTUATION_COLOR = 'rgb(140,21,21)';
export const CHART_FORECAST_COLOR = 'rgb(5,36,143)';
