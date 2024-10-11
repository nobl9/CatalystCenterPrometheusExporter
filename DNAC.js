import axios from 'axios';
import { readFileSync } from 'fs';
import { join } from 'path';

// Sample ping method
export const ping = () => "Hello from DNAC SDK";

// Package version
const VERSION = JSON.parse(readFileSync(join('./package.json'))).version;
const URL_LOGIN = '/api/system/v1/auth/token';
const URL_SITES = '/api/v1/group';
const URL_NETWORK_DEVICES = '/api/v1/network-device';
const URL_NETWORK_DEVICES_COUNT = '/api/v1/network-device/count';
const URL_NETWORK_SUMMARY = '/api/assurance/v1/network-device/healthSummary?measureBy=global&windowInMin=5&startTime=1526594700000&endTime=1526681100000&limit=300&offset=1';
const URL_SITES_COUNT = '/api/v1/group/count?groupType=SITE';

export default class DNAC {
  constructor(options) {
    this.VERSION = VERSION;

    // Merge default options with client-supplied options
    this.options = Object.assign({
      host: null,
      username: null,
      password: null
    }, options);

    this.AUTH_TOKEN = null;

    this.login();
  }

  // Login method to get authentication token
  async login() {
    try {
      const auth = 'Basic ' + Buffer.from(`${this.options.username}:${this.options.password}`).toString('base64');
      process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0"; // Avoid TLS certificate rejection

      const response = await axios.post(`${this.options.host}${URL_LOGIN}`, {}, {
        headers: {
          "Authorization": auth
        }
      });

      this.AUTH_TOKEN = response.data.Token;
      console.log('Successfully logged in');
    } catch (error) {
      console.error('Login failed:', error);
    }
  }

  // Helper for GET requests
  async _getRequest(url, params = {}) {
    try {
      if (!this.AUTH_TOKEN) {
        await this.login(); // Get token if not already available
      }

      const response = await axios.get(`${this.options.host}${url}`, {
        params,
        headers: {
          "X-Auth-Token": this.AUTH_TOKEN
        }
      });

      return response.data;
    } catch (error) {
      console.error(`GET request to ${url} failed:`, error);
      throw error;
    }
  }

  // Helper for POST requests
  async _postRequest(url, params = {}) {
    try {
      if (!this.AUTH_TOKEN) {
        await this.login(); // Get token if not already available
      }

      const response = await axios.post(`${this.options.host}${url}`, params, {
        headers: {
          "X-Auth-Token": this.AUTH_TOKEN
        }
      });

      return response.data;
    } catch (error) {
      console.error(`POST request to ${url} failed:`, error);
      throw error;
    }
  }

  // Method to get sites
  async getSites() {
    const params = {
      "groupType": "SITE",
      "offset": 1,
      "size": 1000,
      "field": "id,additionalInfo.attributes.type"
    };
    return await this._getRequest(URL_SITES, params);
  }

  // Method to get site count
  async getSitesCount() {
    return await this._getRequest(URL_SITES_COUNT);
  }

  // Method to get network devices
  async getNetworkDevices() {
    return await this._getRequest(URL_NETWORK_DEVICES);
  }

  // Method to get network devices count
  async getNetworkDevicesCount() {
    return await this._getRequest(URL_NETWORK_DEVICES_COUNT);
  }

  // Method to get network summary (POST request)
  async getNetworkSummary() {
    return await this._postRequest(URL_NETWORK_SUMMARY);
  }
}
