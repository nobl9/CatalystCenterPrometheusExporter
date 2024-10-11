# DNAC Prometheus Exporter

This repository is reference source code for a Prometheus Data Exporter for DNAC. 

## Pre-requisites
1. Docker 25.0.2 or beyond recommended. docker-compose should be available.
2. Bash shell for helper scripts

## Configuration & Run
./init.sh <DNAC IP Address> <DNAC admin user> <DNAC admin password>
All parameters are mandatory

**Example**
./init.sh 1.2.3.4 admin admin_password

## Usage
Browse Prometheus at http://localhost:9090 and check whether metrics with dnac_ are exported.
If the metrics are present, execute queries and examine results and graphs.  

## Troubleshoot
Console logs should indicate if there are issues in starting up docker or node.
For checking prometheus and scraper connectivity check browser http://localhost:9090 -> Status -> Targets.

----

## Licensing info
BSD 3 license

----

## Credits and references

1. https://github.com/stefanprodan/dockprom
2. https://prometheus.io/
3. https://www.cisco.com/c/en/us/products/cloud-systems-management/dna-center/index.html
