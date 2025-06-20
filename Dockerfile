
FROM node:23-bullseye AS builder

WORKDIR /app

COPY package*.json ./
RUN npm install

# 4. Copy the rest of your application code
COPY . .

# 5. Build the Next.js app
RUN npm run build

# 6. Use a lighter base image to serve the built app
FROM node:23-alpine AS runner

WORKDIR /app

# Copy only necessary files from the builder stage
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/next.config.ts ./next.config.ts

# Set environment variable to production
ENV NODE_ENV=production

# Expose the port Next.js runs on
EXPOSE 7777

# Start the app
CMD ["npm", "start"]
