FROM node:22-alpine

ENV NODE_ENV=production

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci --omit=dev

COPY backend/src ./backend/src

EXPOSE 3000
EXPOSE 9100

USER node

CMD ["npm", "start"]
