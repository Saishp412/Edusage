FROM node:18-bullseye

# Install Python and dependencies for PyMuPDF
RUN apt-get update && apt-get install -y \
    python3 \
    python3-pip \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Install Python dependencies from requirements.txt
COPY requirements.txt ./
# For Debian bullseye, pip sometimes warns about root, we use --no-cache-dir
RUN pip3 install --no-cache-dir -r requirements.txt || pip3 install --no-cache-dir fitz==1.23.26 Pillow==10.4.0 PyMuPDF==1.23.26

# Copy node config
COPY package*.json ./
RUN npm ci

# Copy the rest of the application
COPY . .

# Create uploads directory
RUN mkdir -p uploads/diagrams

EXPOSE 5000

# Using npm start which points to node server.js
CMD ["npm", "start"]
