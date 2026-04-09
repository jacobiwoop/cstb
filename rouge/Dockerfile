FROM node:20-bullseye-slim

WORKDIR /app
COPY . /app

RUN npm install
RUN npm run build

RUN npm install -g serve

EXPOSE 3002

CMD ["serve", "-s", "dist", "-p", "3002"]
