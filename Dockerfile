FROM node:22-alpine
WORKDIR /app

COPY app/* /app/

RUN npm install --production

ENV DNAC_IP=127.0.0.1
ENV DNAC_USER=admin
ENV DNAC_PASSWORD=password

COPY entrypoint.sh /usr/local/bin/entrypoint.sh

RUN chmod +x /usr/local/bin/entrypoint.sh

EXPOSE 9000

ENTRYPOINT ["/usr/local/bin/entrypoint.sh"]
