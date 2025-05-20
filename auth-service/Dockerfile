# ---------- Builder Stage ----------
FROM node:20.18.2-alpine AS builder

WORKDIR /app

# Copy the entire monorepo as context
COPY . .

# Install all deps
RUN npm install

# Build only the @ticket/core package
RUN npm run build --workspace=core
RUN npm run build --workspace=auth-service

# ---------- Runtime Stage ----------
FROM node:20.18.2-alpine AS runner

WORKDIR /app

# Copy core built files
COPY --from=builder /app/core/dist ./node_modules/@ticket/core/dist
COPY --from=builder /app/core/package.json ./node_modules/@ticket/core/package.json

# Copy auth-service files
COPY --from=builder /app/auth-service/dist /app/dist
COPY --from=builder /app/auth-service/package.json /app/
# Copy only build output and package.json


# Install only runtime deps
RUN npm install --omit=dev

# Display the contents of the dist folder

CMD ["node", "dist/main.js"]
