FROM --platform=linux/amd64 node:14-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

ENV PORT=3001
ENV MOUNTED_PATH=/vivek_PV_dir

EXPOSE $PORT

CMD ["node", "index.js"]