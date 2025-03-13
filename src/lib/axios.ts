/* eslint-disable no-param-reassign */
import axios from 'axios';
import { ApiBaseUrl } from '../Constants';

const instance = axios.create({
  baseURL: ApiBaseUrl,
});

export default instance;
