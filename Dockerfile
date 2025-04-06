# Use an official Node.js runtime as a parent image
FROM node:18

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json first
COPY package*.json ./

# Install dependencies
RUN npm install

# Install nodemon globally
RUN npm install -g nodemon

# Copy the rest of the application files
COPY . .

# Expose the port that the app runs on
EXPOSE 5500

# Start the application
CMD ["nodemon", "app.js"]

# docker build --no-cache -t travel-admin-api .
# docker run -p 5500:5500 travel-admin-api
