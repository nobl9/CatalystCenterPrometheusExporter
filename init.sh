#!/bin/bash
rm -rf ./dockprom
mkdir dockprom
cd dockprom
git clone https://github.com/stefanprodan/dockprom.git .
mv ./prometheus/prometheus.yml ./prometheus/prometheus.yml.bak
cp ../config/prometheus.yml ./prometheus/
# echo $1
# sed -i '' "s/IP_ADDRESS/$1/g" ./prometheus/prometheus.yml

# rm ../DNAC_USER_CONFIG.js
# cp ../DNAC_USER_CONFIG_TPL.js ../DNAC_USER_CONFIG.js
# sed -i '' "s/IP_ADDRESS/$2/g" ../DNAC_USER_CONFIG.js
# sed -i '' "s/USER_NAME/$3/g" ../DNAC_USER_CONFIG.js
# sed -i '' "s/USER_PASSWORD/$4/g" ../DNAC_USER_CONFIG.js

docker build -t dnac-prometheus-exporter
#docker run -d -p 9000:9000 -e DNAC_IP=$1 -e DNAC_USER=$2 -e DNAC_PASSWORD=$3 --name dnac-exporter dnac-prometheus-exporter

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
