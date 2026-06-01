import os
import sys
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from sentence_transformers import SentenceTransformer

# Fix for Windows multiprocessing issues
if sys.platform == "win32":
    # Set multiprocessing start method to spawn for Windows
    import multiprocessing
    multiprocessing.set_start_method("spawn", force=True)

app = FastAPI()

# Global model variable
model = None

class EmbedRequest(BaseModel):
    texts: list[str]

class EmbedResponse(BaseModel):
    embeddings: list[list[float]]

@app.on_event("startup")
async def startup_event():
    """Load the model only once at startup"""
    global model
    try:
        print("Loading SentenceTransformer model...")
        model = SentenceTransformer("all-MiniLM-L6-v2")
        print("Model loaded successfully!")
    except Exception as e:
        print(f"Error loading model: {e}")
        # Fallback to a smaller model if the main one fails
        try:
            print("Trying fallback model...")
            model = SentenceTransformer("all-MiniLM-L6-v2", device="cpu")
            print("Fallback model loaded successfully!")
        except Exception as e2:
            print(f"Error loading fallback model: {e2}")
            model = None

@app.post("/embed", response_model=EmbedResponse)
def embed(req: EmbedRequest):
    """Generate embeddings for input texts"""
    if model is None:
        raise HTTPException(status_code=500, detail="Model not loaded")
    
    try:
        embeddings = model.encode(
            req.texts,
            normalize_embeddings=True,
            batch_size=32,
            show_progress_bar=False
        )
        return {
            "embeddings": embeddings.tolist()
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Embedding generation failed: {str(e)}")

@app.get("/health")
def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "model_loaded": model is not None,
        "model_name": "all-MiniLM-L6-v2" if model else None
    }

@app.get("/")
def root():
    """Root endpoint"""
    return {
        "message": "EduSage Embeddings API",
        "version": "1.0.0",
        "endpoints": {
            "/embed": "POST - Generate embeddings",
            "/health": "GET - Health check"
        }
    }
