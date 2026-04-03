# build

FROM node:24 AS node

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm ci

COPY . .

RUN npm run build

# runtime

FROM nginx:alpine
COPY --from=node /usr/src/app/dist/dmx-frontend/browser /usr/share/nginx/html
COPY ./nginx.conf /etc/nginx/nginx.conf