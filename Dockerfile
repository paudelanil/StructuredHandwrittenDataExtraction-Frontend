# Step 1: Use an official Node.js image
FROM node:18 AS build

# Step 2: Set the working directory
WORKDIR /app

# Step 3: Copy package.json and yarn.lock (or package-lock.json) to install dependencies
COPY package.json yarn.lock ./

# Step 4: Install dependencies
RUN yarn install

# Step 5: Copy the rest of the application files
COPY . .

# Step 6: Build the React app
RUN yarn build

# Step 7: Serve the app using a simple HTTP server
FROM nginx:alpine

# Step 8: Copy the build directory from the previous stage to NGINX’s public folder
COPY --from=build /app/build /usr/share/nginx/html

# Step 9: Expose the port that the app will run on
EXPOSE 80

ENV REACT_APP_API_URL=http://localhost:8000
# Step 10: Start NGINX
CMD ["nginx", "-g", "daemon off;"]
