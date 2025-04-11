# Stage 1: Build the application
FROM node:18-alpine AS build

# Set working directory
WORKDIR /app

# Copy package files and install dependencies
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

# Copy application files
COPY . .

# Build the application with a default API URL
ARG REACT_APP_BACKEND_URL=http://localhost:8000
ENV REACT_APP_BACKEND_URL=${REACT_APP_BACKEND_URL}
RUN yarn build

# Stage 2: Serve the built application
FROM nginx:alpine

# Copy the built app from the previous stage
COPY --from=build /app/build /usr/share/nginx/html

# Create the script file with proper line endings
RUN echo '#!/bin/sh' > /docker-entrypoint.sh && \
    echo '' >> /docker-entrypoint.sh && \
    echo '# Create JS file with environment variables' >> /docker-entrypoint.sh && \
    echo 'echo "window.env = {" > /usr/share/nginx/html/env-config.js' >> /docker-entrypoint.sh && \
    echo 'echo "  REACT_APP_BACKEND_URL: \"${REACT_APP_BACKEND_URL}\"," >> /usr/share/nginx/html/env-config.js' >> /docker-entrypoint.sh && \
    echo 'echo "};" >> /usr/share/nginx/html/env-config.js' >> /docker-entrypoint.sh && \
    echo '' >> /docker-entrypoint.sh && \
    echo '# Start nginx' >> /docker-entrypoint.sh && \
    echo 'exec nginx -g "daemon off;"' >> /docker-entrypoint.sh && \
    chmod +x /docker-entrypoint.sh && \
    cat /docker-entrypoint.sh  # Print the script to build logs for verification

# Add reference to env-config.js in index.html
RUN sed -i 's/<head>/<head>\n    <script src="env-config.js"><\/script>/' /usr/share/nginx/html/index.html

# Expose port 80
EXPOSE 80

# Set entry point
ENTRYPOINT ["/docker-entrypoint.sh"]