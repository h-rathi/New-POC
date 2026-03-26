# Use lightweight Node.js image
FROM node:18-alpine

# Set working directory
WORKDIR /srv/app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm ci

# Copy the rest of the backend files
COPY . .

# Set environment to production
ENV NODE_ENV=production
ENV DATABASE_URL="mysql://root:root@mysql:3306/myapp_db"

RUN npx prisma generate

# Expose backend port
EXPOSE 3001

# Run your backend
CMD ["node", "app.js"]