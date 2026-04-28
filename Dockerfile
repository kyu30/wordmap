FROM node:20-bullseye

WORKDIR /app
COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

RUN npm install -g serve

EXPOSE 7860
CMD ["serve", "-s", "dist", "-l", "7860"]
