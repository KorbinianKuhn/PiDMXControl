# build
FROM node:24-alpine AS builder

WORKDIR /app

COPY . .

RUN npm ci
RUN npm run build:docker

# runtime
FROM nginx:latest

COPY --from=builder /app/dist/dmx-frontend/browser /usr/share/nginx/html
COPY ./nginx.conf /etc/nginx/conf.d/default.conf
COPY ./nginx.sh /nginx.sh

ENTRYPOINT ["bash", "./nginx.sh"]