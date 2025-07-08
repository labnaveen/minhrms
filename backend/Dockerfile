# Specify the base image
FROM node:16

# Create and set the working directory
WORKDIR /usr/src/server

# Copy the package.json and package-lock.json files to the working directory
COPY package*.json ./
COPY .env .

# Install the dependencies
RUN npm install

# Copy the application code to the working directory
COPY . .

# Expose the port on which the application will listen
EXPOSE 3000

# Start the application
CMD ["npm", "run",  "dev"]

RUN env