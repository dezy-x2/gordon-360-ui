/**
 * Housing API call functions
 * establishes the functions necessary to make calls to the back end.
 * @module housing
 */

import http from './http';

/**
 * @global
 * @typedef boolean
 * @property {status}
 * 
 */

/**
 * returns current status of student housing
 * @return {Promise<any>} Response
 */
const getHousingInfo = async () => {
  return await http.get(`housing/apartmentInfo`);
};

export default {
  getHousingInfo
};