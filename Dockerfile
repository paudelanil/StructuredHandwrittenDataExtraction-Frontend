# Stage 1: Build the application
FROM node:18-alpine AS build

# Set working directory
WORKDIR /app

# Copy package files and install dependencies
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

# Copy application files
COPY . .

# Build the application with a default API URL (will be replaced at runtime)
# Note: Create React App requires environment variables to start with REACT_APP_
ARG REACT_APP_BACKEND_URL=http://localhost:8000
ENV REACT_APP_BACKEND_URL=${REACT_APP_BACKEND_URL}
RUN yarn build

# Stage 2: Serve the built application
FROM nginx:alpine

# Copy the built app from the previous stage
COPY --from=build /app/build /usr/share/nginx/html

# Create a script to replace the API URL at runtime and start nginx
RUN echo '#!/bin/sh\n\
\n\
# Create JS file with environment variables\n\
echo "window.env = {" > /usr/share/nginx/html/env-config.js\n\
echo "  REACT_APP_BACKEND_URL: \"${REACT_APP_BACKEND_URL}\"," >> /usr/share/nginx/html/env-config.js\n\
echo "};" >> /usr/share/nginx/html/env-config.js\n\
\n\
# Start nginx\n\
exec nginx -g "daemon off;"' > /docker-entrypoint.sh && \
chmod +x /docker-entrypoint.sh

# Add env-config.js reference to index.html
RUN sed -i '/<head>/a \    <script src="%PUBLIC_URL%/env-config.js"></script>' /usr/share/nginx/html/index.html

# Expose port 80
EXPOSE 80

# Set entry point to our script
ENTRYPOINT ["/docker-entrypoint.sh"]