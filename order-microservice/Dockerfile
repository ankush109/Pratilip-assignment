# Step 1: Use an official Node.js runtime as the base image
FROM node:18-alpine

# Step 2: Set the working directory inside the container
WORKDIR /usr/src/app

# Step 3: Copy package.json and package-lock.json (if available) to install dependencies
COPY package*.json ./

# Step 4: Install the Node.js dependencies
RUN npm install

# Step 5: Copy the rest of your application code to the working directory
COPY . .

# Step 6: Set environment variables if needed
# You can alternatively pass them during runtime with `docker run -e "VAR_NAME=value"`
# For now, we will use a placeholder.
ENV PORT=7000
ENV DATABASE_URL="postgresql://postgres:root@host.docker.internal:5432/order_db?schema=public"

RUN npx prisma migrate dev 
# Step 7: Expose the port on which your Node.js server will run
EXPOSE 7000

# Step 8: Start the application
CMD ["npm", "run","dev"]
