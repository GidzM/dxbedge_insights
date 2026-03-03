# -----------------------------
# Build stage
# -----------------------------
FROM node:20-slim AS build
WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm ci

# Copy source and build
COPY . .
RUN npm run build


# -----------------------------
# Runtime stage
# -----------------------------
FROM node:20-slim AS runtime
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=8080

# Install only production dependencies
COPY package*.json ./
RUN npm ci --omit=dev

# Copy built frontend + backend server
COPY --from=build /app/dist ./dist
COPY server.mjs ./server.mjs
COPY sourceLabels.js ./sourceLabels.js
COPY server ./server
COPY SME_Notes.txt ./SME_Notes.txt
COPY Investor_project_5_-_commerical_information.txt ./Investor_project_5_-_commerical_information.txt
COPY knowledge ./knowledge

EXPOSE 8080
CMD ["npm", "run", "start"]