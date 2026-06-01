# Google Search API Configuration Guide

## Overview
The web search feature supports multiple search providers:
1. **Google Custom Search API** (Recommended) - Official Google search results
2. **SerpApi** (Alternative) - Google results via proxy service
3. **DuckDuckGo** (Fallback) - Free, always available

## Option 1: Google Custom Search API Setup

### Step 1: Get Google Custom Search API Key
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing project
3. Enable "Custom Search API"
4. Create credentials → API Key
5. Copy the API key

### Step 2: Create a Custom Search Engine
1. Go to [Google Custom Search](https://cse.google.com/)
2. Click "Add" to create a new search engine
3. Enter your website (or use `www.google.com` for searching the entire web)
4. Click "Create"
5. Click "Control Panel" → "Basics"
6. Copy the "Search engine ID"

### Step 3: Add to Environment Variables
Add these to your `.env` file:

```env
# Google Custom Search API
GOOGLE_CUSTOM_SEARCH_API_KEY=your_google_api_key_here
GOOGLE_SEARCH_ENGINE_ID=your_search_engine_id_here
```

### Step 4: Test the Configuration
```bash
cd edusage-backend
npm start
# Test search in the frontend
```

## Option 2: SerpApi Setup (Alternative)

### Step 1: Get SerpApi Key
1. Go to [SerpApi](https://serpapi.com/)
2. Sign up for a free account
3. Go to dashboard → API Key
4. Copy the API key

### Step 2: Add to Environment Variables
```env
# SerpApi (Alternative to Google Custom Search)
SERPAPI_KEY=your_serpapi_key_here
```

## Option 3: DuckDuckGo (Free Fallback)

DuckDuckGo is always available as a free fallback and requires no configuration.

## Provider Priority

The system will try providers in this order:
1. Google Custom Search API (if configured)
2. SerpApi (if configured)  
3. DuckDuckGo (always available)

## Usage Examples

### Frontend Usage
```typescript
// Search for sources
const response = await API.post("/websearch", { 
  query: "software design patterns" 
});

// Add source to notebook
await API.post(`/websearch/${notebookId}/sources`, {
  title: result.title,
  url: result.url,
  snippet: result.snippet,
  searchQuery: "software design patterns"
});
```

### Backend Response
```json
{
  "query": "software design patterns",
  "results": [
    {
      "title": "Software Design Patterns",
      "snippet": "In software engineering...",
      "url": "https://example.com/patterns",
      "position": 1,
      "displayLink": "example.com",
      "formattedUrl": "https://example.com/patterns"
    }
  ],
  "totalResults": 10,
  "provider": "Google Custom Search",
  "searchTime": 0.5,
  "success": true
}
```

## Troubleshooting

### Google Custom Search API Issues
- **Error**: "API key not valid"
  - **Solution**: Check if API key is correct and enabled
- **Error**: "Search engine ID not valid"
  - **Solution**: Verify search engine ID from Google CSE
- **Error**: "Daily limit exceeded"
  - **Solution**: Google offers 100 queries/day for free

### SerpApi Issues
- **Error**: "SerpApi key not configured"
  - **Solution**: Add SERPAPI_KEY to .env file
- **Error**: "Insufficient credits"
  - **Solution**: Check SerpApi dashboard for credits

### General Issues
- **No results found**
  - **Solution**: Try different search terms
  - **Solution**: Check if search providers are working
- **Slow response**
  - **Solution**: Check network connection
  - **Solution**: Try different provider

## Features

### Search Results
- Title, snippet, URL
- Position ranking
- Display link and formatted URL
- Provider information
- Search time tracking

### Source Management
- Add sources to notebooks
- View saved sources
- Delete unwanted sources
- Search query tracking

### Provider Fallback
- Automatic fallback between providers
- Error handling and logging
- Status monitoring
- Graceful degradation

## Rate Limits

- **Google Custom Search**: 100 queries/day (free)
- **SerpApi**: 50 searches/month (free plan)
- **DuckDuckGo**: No official limit (recommended use)

## Security Notes

- API keys are stored in environment variables
- All search requests require authentication
- Sources are tied to user accounts
- URLs are validated before storage

## Best Practices

1. Use specific search terms for better results
2. Configure at least two search providers
3. Monitor API usage and limits
4. Regularly check search provider status
5. Use meaningful titles when saving sources
