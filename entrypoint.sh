#!/bin/sh

pwd

cp ./DNAC_USER_CONFIG_TPL.js ./DNAC_USER_CONFIG.js

# Replace placeholders with the environment variables
sed -i "s/IP_ADDRESS/$DNAC_IP/g" ./DNAC_USER_CONFIG.js
sed -i "s/USER_NAME/$DNAC_USER/g" ./DNAC_USER_CONFIG.js
sed -i "s/USER_PASSWORD/$DNAC_PASSWORD/g" ./DNAC_USER_CONFIG.js

# Start the application
npm start
