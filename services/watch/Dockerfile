FROM node:latest

WORKDIR /opt/project

RUN apt-get update 
RUN apt-get install gdal-bin -y

RUN npm install -g webpack@5
RUN npm install -g webpack-cli@5

ENTRYPOINT npx webpack