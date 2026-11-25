FROM node:24-alpine
WORKDIR /app
ENV NODE_ENV=production PORT=40000
COPY package.json package-lock.json ./
RUN npm ci --omit=dev
COPY --chown=node:node . .
USER node
EXPOSE 40000
CMD ["node", "app.js"]
