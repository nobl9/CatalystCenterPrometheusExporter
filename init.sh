#!/bin/bash
rm -rf ./dockprom
mkdir dockprom
cd dockprom
git clone https://github.com/stefanprodan/dockprom.git .
mv ./prometheus/prometheus.yml ./prometheus/prometheus.yml.bak
cp ../config/prometheus.yml ./prometheus/

docker build -t dnac-prometheus-exporter

SERVICE_DEFINITION="
  dnac-exporter:
    image: dnac-prometheus-exporter
    container_name: dnac-exporter
    environment:
      - DNAC_IP=$1
      - DNAC_USER=$2
      - DNAC_PASSWORD=$3
    expose:
      - 9000
    restart: unless-stopped
    networks:
      - monitor-net
    labels:
      org.label-schema.group: "monitoring"
"

echo "$SERVICE_DEFINITION" >> docker-compose.yml

docker-compose up -d
