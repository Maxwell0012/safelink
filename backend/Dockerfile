# 1. Start with a lightweight version of Node.js (The Base System)
FROM node:18-alpine

# 2. Create a folder inside the container (The Workspace)
WORKDIR /app

# 3. Copy the package list first (This makes builds faster) 
COPY package*.json ./

# 4. Install dependencies inside the container
RUN npm install

# 5. Copy the rest of your code
COPY . .

# 6. Open the door (Port 8080)
EXPOSE 8080

# 7. Start the server
CMD ["node", "index.js"]