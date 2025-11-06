FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci || true
COPY . .
EXPOSE 8080
CMD ["node", "server.js"]
