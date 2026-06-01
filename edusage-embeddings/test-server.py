import requests
import json

def test_embeddings_server():
    """Test the embeddings server endpoints"""
    base_url = "http://localhost:8001"
    
    print("🔍 Testing EduSage Embeddings Server")
    print("=" * 40)
    
    # Test 1: Health check
    print("\n1. Testing health endpoint...")
    try:
        response = requests.get(f"{base_url}/health")
        if response.status_code == 200:
            health_data = response.json()
            print(f"✅ Health check passed")
            print(f"   Status: {health_data.get('status')}")
            print(f"   Model loaded: {health_data.get('model_loaded')}")
            print(f"   Model name: {health_data.get('model_name')}")
        else:
            print(f"❌ Health check failed: {response.status_code}")
            return False
    except requests.exceptions.RequestException as e:
        print(f"❌ Cannot connect to server: {e}")
        print("   Make sure the server is running on http://localhost:8001")
        return False
    
    # Test 2: Root endpoint
    print("\n2. Testing root endpoint...")
    try:
        response = requests.get(f"{base_url}/")
        if response.status_code == 200:
            root_data = response.json()
            print(f"✅ Root endpoint working")
            print(f"   Message: {root_data.get('message')}")
            print(f"   Version: {root_data.get('version')}")
        else:
            print(f"❌ Root endpoint failed: {response.status_code}")
    except requests.exceptions.RequestException as e:
        print(f"❌ Root endpoint error: {e}")
    
    # Test 3: Embedding generation
    print("\n3. Testing embedding generation...")
    test_texts = [
        "This is a test sentence for embedding generation.",
        "Machine learning is a subset of artificial intelligence.",
        "The quick brown fox jumps over the lazy dog."
    ]
    
    try:
        payload = {"texts": test_texts}
        response = requests.post(
            f"{base_url}/embed",
            json=payload,
            headers={"Content-Type": "application/json"}
        )
        
        if response.status_code == 200:
            embed_data = response.json()
            embeddings = embed_data.get("embeddings", [])
            print(f"✅ Embedding generation successful")
            print(f"   Number of embeddings: {len(embeddings)}")
            if embeddings:
                print(f"   Embedding dimension: {len(embeddings[0])}")
                print(f"   First embedding sample (first 5 values): {embeddings[0][:5]}")
        else:
            print(f"❌ Embedding generation failed: {response.status_code}")
            print(f"   Error: {response.text}")
    except requests.exceptions.RequestException as e:
        print(f"❌ Embedding generation error: {e}")
    
    print("\n" + "=" * 40)
    print("🎉 Embeddings server test completed!")
    return True

if __name__ == "__main__":
    test_embeddings_server()
