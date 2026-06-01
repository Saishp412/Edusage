FROM node:18-bullseye

# Install Python and system deps required for PyMuPDF image extraction
RUN apt-get update && apt-get install -y \
    python3 \
    python3-pip \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Install Python dependencies (PyMuPDF for PDF image extraction)
COPY requirements.txt ./
RUN pip3 install --no-cache-dir -r requirements.txt

# Install Node.js dependencies
COPY package*.json ./
RUN npm ci --omit=dev

# Copy application source
COPY . .

# Create uploads directory for diagrams
RUN mkdir -p uploads/diagrams

EXPOSE 5000

CMD ["node", "server.js"]
