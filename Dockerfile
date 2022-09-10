FROM node:lts-alpine3.15

WORKDIR /usr/src/blockbookslab-be
COPY . .
RUN npm install
EXPOSE 4000
CMD [ "npm", "run", "start:dev" ]
