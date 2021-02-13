FROM node:14-slim
WORKDIR /app
COPY package.json /app
RUN npm cache clean --force
RUN npm install
RUN npm install pm2 -g
COPY . .
EXPOSE 5000
CMD ["node","start.js"]