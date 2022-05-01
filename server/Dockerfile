FROM node:14-alpine
WORKDIR /server
COPY package.json .
RUN npm install
COPY . .
CMD npm start