import axios from 'axios';

import { API_URL } from '../config';

export class BaseApi {
  constructor(endpoint) {
    this.http = axios.create({
      baseURL: API_URL + endpoint,
    });
  }
}
