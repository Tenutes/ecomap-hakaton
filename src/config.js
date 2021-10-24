import { addDays, format, parse } from 'date-fns';

export const API_URL = process.env.VUE_APP_ROOT_API;

export const LAST_DATA_UPDATE = '31.12.2020 23:59:00';
export const MIN_DATE_NEW_POINT = '26.12.2020 00:00:00';

export const GRAPH_FORMAT = 'yyyy-MM-dd HH:mm:ss';
export const DEFAULT_START_DATE = parse(LAST_DATA_UPDATE, 'dd.MM.yyyy HH:mm:ss', new Date());
export const START_DATE = format(addDays(DEFAULT_START_DATE, -1), GRAPH_FORMAT);
export const END_DATE = format(DEFAULT_START_DATE, GRAPH_FORMAT);
export const MAX_DATA_LENGTH = 300;

export const PDK_VALUES = {
  CO: 5,
  NO: 0.2,
  NO2: 0.4,
  'PM2.5': 0.16,
  PM10: 0.3,
};
