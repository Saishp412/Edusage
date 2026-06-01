FROM python:3.10-slim

WORKDIR /app

COPY requirements.txt ./
# Install dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Pre-download the model so it doesn't happen on every startup
RUN python -c "from sentence_transformers import SentenceTransformer; SentenceTransformer('all-MiniLM-L6-v2')"

COPY . .

EXPOSE 8001

CMD ["uvicorn", "embed_server:app", "--host", "0.0.0.0", "--port", "8001"]
