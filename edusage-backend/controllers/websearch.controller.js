const GoogleSearchService = require("../services/googleSearch.service");
const WebSource = require("../models/WebSource.model");

// Initialize search service
const searchService = new GoogleSearchService();

// Search the web using multiple search providers (Google, SerpApi, DuckDuckGo)
exports.webSearch = async (req, res) => {
  try {
    const { query } = req.body;

    if (!query || query.trim().length === 0) {
      return res.status(400).json({ 
        message: "Search query is required" 
      });
    }

    console.log(`[WEB SEARCH CONTROLLER] Searching for: "${query}"`);

    // Use the universal search method
    const searchResult = await searchService.search(query);
    
    console.log(`[WEB SEARCH CONTROLLER] Search completed with ${searchResult.results.length} results using ${searchResult.provider}`);

    res.json({
      query,
      results: searchResult.results,
      totalResults: searchResult.totalResults,
      provider: searchResult.provider,
      searchTime: searchResult.searchTime,
      success: searchResult.success
    });

  } catch (error) {
    console.error("Web search controller error:", error);
    res.status(500).json({ 
      message: "Failed to perform web search",
      error: error.message 
    });
  }
};

// Get search provider status
exports.getSearchStatus = async (req, res) => {
  try {
    const status = searchService.getProviderStatus();
    
    res.json({
      status,
      message: "Search provider status retrieved successfully"
    });

  } catch (error) {
    console.error("Error getting search status:", error);
    res.status(500).json({ 
      message: "Failed to get search status" 
    });
  }
};

// Add a web source to a notebook
exports.addWebSource = async (req, res) => {
  try {
    const { notebookId } = req.params;
    const { title, url, snippet, searchQuery } = req.body;

    if (!notebookId || !title || !url) {
      return res.status(400).json({ 
        message: "Notebook ID, title, and URL are required" 
      });
    }

    const webSource = new WebSource({
      userId: req.userId,
      notebookId: notebookId,
      title,
      url,
      snippet,
      searchQuery,
      sourceType: "web"
    });

    await webSource.save();

    res.json({
      success: true,
      message: "Web source added successfully",
      webSource
    });

  } catch (error) {
    console.error("Error adding web source:", error);
    res.status(500).json({ 
      message: "Failed to add web source" 
    });
  }
};

// Get web sources for a notebook
exports.getWebSources = async (req, res) => {
  try {
    const { notebookId } = req.params;

    const webSources = await WebSource.find({
      userId: req.userId,
      notebookId: notebookId
    }).sort({ createdAt: -1 });

    res.json(webSources);

  } catch (error) {
    console.error("Error fetching web sources:", error);
    res.status(500).json({ 
      message: "Failed to fetch web sources" 
    });
  }
};

// Delete a web source
exports.deleteWebSource = async (req, res) => {
  try {
    const { sourceId } = req.params;

    const result = await WebSource.deleteOne({
      _id: sourceId,
      userId: req.userId
    });

    if (result.deletedCount === 0) {
      return res.status(404).json({ 
        message: "Web source not found" 
      });
    }

    res.json({
      success: true,
      message: "Web source deleted successfully"
    });

  } catch (error) {
    console.error("Error deleting web source:", error);
    res.status(500).json({ 
      message: "Failed to delete web source" 
    });
  }
};

// Alternative implementation using SerpApi (requires API key)
exports.webSearchSerpApi = async (req, res) => {
  try {
    const { query } = req.body;
    const SERPAPI_KEY = process.env.SERPAPI_KEY;

    if (!SERPAPI_KEY) {
      return res.status(500).json({ 
        message: "SerpApi key not configured" 
      });
    }

    const searchUrl = "https://serpapi.com/search";
    const params = {
      api_key: SERPAPI_KEY,
      engine: "google",
      q: query,
      num: 10
    };

    const response = await axios.get(searchUrl, { params });
    
    const results = response.data.organic_results?.map((result, index) => ({
      title: result.title,
      snippet: result.snippet,
      url: result.link,
      position: index + 1
    })) || [];

    res.json({
      query,
      results,
      totalResults: results.length
    });

  } catch (error) {
    console.error("SerpApi search error:", error);
    res.status(500).json({ 
      message: "Failed to perform web search" 
    });
  }
};
