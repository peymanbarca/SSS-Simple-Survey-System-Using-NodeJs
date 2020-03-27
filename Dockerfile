FROM node
WORKDIR /app
COPY package.json /app
COPY static /app/static
RUN npm install
RUN npm install pm2 -g
COPY server.js /app/server.js
CMD pm2-docker /app/server.js -i 2
