FROM node:22-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build



FROM node:22-alpine AS runner
WORKDIR /app
COPY package*.json ./
COPY --from=builder /app/src/views/ ./dist/views/
COPY --from=builder /app/dist/ ./dist
COPY migrations/ ./migrations/
COPY start.sh .
RUN chmod +x start.sh
RUN npm install --omit=dev
EXPOSE 3000
CMD ["sh", "start.sh"]
