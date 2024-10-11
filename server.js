import express from 'express';
import cluster from 'cluster';
import client from 'prom-client';
import DNAC from './DNAC.js';
import CONFIG from './DNAC_USER_CONFIG.js';

const server = express();
const { Histogram, Counter, Gauge, collectDefaultMetrics, register } = client;

console.log(CONFIG.ip);
console.log(CONFIG.user);
console.log(CONFIG.passwd);

const dnac = new DNAC({
  host: `https://${CONFIG.ip}`,
  username: CONFIG.user,
  password: CONFIG.passwd
});

// Initialize Prometheus metrics
const histogram = new Histogram({
  name: 'test_histogram',
  help: 'Example of a histogram',
  labelNames: ['code']
});

const counter = new Counter({
  name: 'test_counter',
  help: 'Example of a counter',
  labelNames: ['code']
});

const networkDeviceCount = new Gauge({
  name: 'dnac_network_device_count',
  help: 'Network Device Count'
});

const siteCount = new Gauge({
  name: 'dnac_site_count',
  help: 'Site Count'
});

const testGauge = new Gauge({
  name: 'test_gauge',
  help: 'Example of a gauge',
  labelNames: ['method', 'code']
});

// Use async/await for DNAC calls instead of callbacks
setInterval(async () => {
  try {
    const networkDevices = await dnac.getNetworkDevicesCount();
    console.log(`Collected network device count: ${networkDevices.response}`);
    networkDeviceCount.set(networkDevices.response);
  } catch (error) {
    console.error('Error fetching network devices:', error);
  }
}, 3000);

setInterval(async () => {
  try {
    const siteCountResp = await dnac.getSitesCount();
    console.log(`Collected site count: ${siteCountResp.response}`);
    siteCount.set(siteCountResp.response);
  } catch (error) {
    console.error('Error fetching site count:', error);
  }
}, 3000);

setTimeout(() => {
  histogram.labels('200').observe(Math.random());
  histogram.labels('300').observe(Math.random());
}, 10);

setInterval(() => {
  counter.inc({ code: 200 });
}, 5000);

setInterval(() => {
  counter.inc({ code: 400 });
}, 2000);

setInterval(() => {
  counter.inc();
}, 2000);

setInterval(() => {
  testGauge.set({ method: 'get', code: 200 }, Math.random());
  testGauge.set(Math.random());
  testGauge.labels('post', '300').inc();
}, 100);

// Metrics routes
server.get('/metrics', async (req, res) => {
  try {
    res.set('Content-Type', register.contentType);
    const metrics = await register.metrics(); // Awaiting for metrics to resolve
    res.end(metrics); // Send resolved metrics
  } catch (error) {
    console.error('Error retrieving metrics:', error);
    res.status(500).send('Error retrieving metrics');
  }
});

server.get('/metrics/counter', async (req, res) => {
  try {
    res.set('Content-Type', register.contentType);
    const counterMetrics = await register.getSingleMetricAsString('test_counter'); // Awaiting for the single metric
    res.end(counterMetrics); // Send resolved counter metrics
  } catch (error) {
    console.error('Error retrieving counter metrics:', error);
    res.status(500).send('Error retrieving counter metrics');
  }
});

// Enable collection of default metrics
collectDefaultMetrics();

console.log('Server listening on port 9000, metrics exposed on /metrics endpoint');
server.listen(9000);
