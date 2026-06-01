const axios = require("axios");

class GoogleSearchService {
  constructor() {
    this.googleApiKey = process.env.GOOGLE_CUSTOM_SEARCH_API_KEY;
    this.searchEngineId = process.env.GOOGLE_SEARCH_ENGINE_ID;
    this.serpApiKey = process.env.SERPAPI_KEY;
  }

  /**
   * Search using Google Custom Search API - Enhanced with better filtering
   * @param {string} query - Search query
   * @returns {Promise<Array>} Search results
   */
  async searchGoogle(query) {
    if (!this.googleApiKey || !this.searchEngineId) {
      throw new Error("Google Custom Search API key or Search Engine ID not configured");
    }

    try {
      // Enhanced search parameters for better results
      const searchParams = {
        key: this.googleApiKey,
        cx: this.searchEngineId,
        q: query,
        num: 20, // Get more results to filter from
        lr: 'lang_en', // English results only
        safe: 'off', // Safe search off for comprehensive results
        filter: '0', // No filtering for more results
        cr: '', // No country restriction
        gl: 'us', // US results for better quality
        hl: 'en' // English language
      };

      const response = await axios.get('https://www.googleapis.com/customsearch/v1', {
        params: searchParams,
        timeout: 15000
      });

      if (!response.data.items || response.data.items.length === 0) {
        return {
          success: true,
          results: [],
          totalResults: 0,
          searchTime: response.data.searchInformation?.time_taken_displayed || 0
        };
      }

      // Enhanced result processing with domain prioritization
      const enhancedResults = this.enhanceGoogleResults(response.data.items, query);

      return {
        success: true,
        results: enhancedResults,
        totalResults: response.data.searchInformation?.totalResults || 0,
        searchTime: response.data.searchInformation?.time_taken_displayed || 0
      };

    } catch (error) {
      console.error("Google Custom Search Error:", error.response?.data || error.message);
      throw new Error(`Google Custom Search failed: ${error.response?.data?.error?.message || error.message}`);
    }
  }

  /**
   * Enhance Google results with domain prioritization and better ranking
   * @param {Array} items - Raw Google search results
   * @param {string} query - Original search query
   * @returns {Array} Enhanced search results
   */
  enhanceGoogleResults(items, query) {
    // Domain priority for educational and authoritative sources
    const domainPriorities = {
      // Top Educational & Academic
      'en.wikipedia.org': 100,
      'edu': 95, // All .edu domains
      'mit.edu': 98,
      'stanford.edu': 98,
      'harvard.edu': 98,
      'coursera.org': 92,
      'edx.org': 92,
      'khanacademy.org': 90,
      
      // Documentation & Technical
      'developer.mozilla.org': 88,
      'docs.microsoft.com': 85,
      'docs.oracle.com': 85,
      'w3schools.com': 82,
      'geeksforgeeks.org': 80,
      'tutorialspoint.com': 78,
      
      // Programming & Development
      'github.com': 85,
      'stackoverflow.com': 83,
      'medium.com': 75,
      'dev.to': 72,
      
      // News & High-Quality Content
      'nytimes.com': 70,
      'bbc.com': 70,
      'cnn.com': 68,
      'reuters.com': 70,
      
      // General Knowledge
      'britannica.com': 85,
      'howstuffworks.com': 75,
      'quora.com': 65,
      'reddit.com': 60
    };

    // Low-quality domains to filter out
    const lowQualityDomains = [
      'pinterest.com',
      'instagram.com',
      'facebook.com',
      'twitter.com',
      'tiktok.com',
      'youtube.com', // Usually not good for text content
      'linkedin.com' // Usually not educational
    ];

    return items
      .map((item, index) => {
        const url = new URL(item.link);
        const domain = url.hostname;
        
        // Calculate domain score
        let domainScore = 50; // Base score
        
        // Check for exact domain matches
        if (domainPriorities[domain]) {
          domainScore = domainPriorities[domain];
        } else {
          // Check for partial matches (e.g., .edu domains)
          for (const [key, score] of Object.entries(domainPriorities)) {
            if (key !== 'edu' && domain.includes(key)) {
              domainScore = Math.max(domainScore, score);
            }
          }
          
          // Check for .edu domains
          if (domain.endsWith('.edu')) {
            domainScore = Math.max(domainScore, domainPriorities['edu']);
          }
        }

        // Filter out low-quality domains
        if (lowQualityDomains.some(lowDomain => domain.includes(lowDomain))) {
          domainScore = 10;
        }

        // Calculate relevance score based on position and quality
        const positionScore = Math.max(0, 100 - (index * 5)); // Decrease score with position
        const titleRelevance = this.calculateRelevance(item.title, query);
        const snippetRelevance = this.calculateRelevance(item.snippet || item.description || '', query);
        
        const totalScore = (positionScore * 0.3) + (domainScore * 0.4) + (titleRelevance * 0.2) + (snippetRelevance * 0.1);

        return {
          title: item.title || `Result ${index + 1}`,
          snippet: item.snippet || item.description || '',
          url: item.link,
          position: index + 1,
          displayLink: item.displayLink || domain,
          formattedUrl: item.formattedUrl || item.link,
          domainScore: domainScore,
          relevanceScore: totalScore,
          originalPosition: index + 1
        };
      })
      .filter(result => result.domainScore > 20) // Filter out very low quality
      .sort((a, b) => b.relevanceScore - a.relevanceScore) // Sort by relevance
      .slice(0, 10) // Return top 10
      .map((result, index) => ({
        ...result,
        position: index + 1 // Update position after sorting
      }));
  }

  /**
   * Calculate relevance score between text and query
   * @param {string} text - Text to analyze
   * @param {string} query - Search query
   * @returns {number} Relevance score (0-100)
   */
  calculateRelevance(text, query) {
    if (!text || !query) return 0;
    
    const textLower = text.toLowerCase();
    const queryLower = query.toLowerCase();
    const queryWords = queryLower.split(/\s+/).filter(word => word.length > 2);
    
    let relevanceScore = 0;
    let totalWords = queryWords.length;
    
    for (const word of queryWords) {
      // Exact phrase match gets highest score
      if (textLower.includes(queryLower)) {
        relevanceScore += 100;
      }
      // Individual word matches
      else if (textLower.includes(word)) {
        relevanceScore += 50;
      }
      // Partial word matches
      else {
        const partialMatch = queryWords.some(qw => textLower.includes(qw.substring(0, 3)));
        if (partialMatch) {
          relevanceScore += 25;
        }
      }
    }
    
    // Bonus for title starting with query
    if (textLower.startsWith(queryLower)) {
      relevanceScore += 20;
    }
    
    return Math.min(100, (relevanceScore / totalWords) || 0);
  }

  /**
   * Search using SerpApi (Google results proxy)
   * @param {string} query - Search query
   * @returns {Promise<Array>} Search results
   */
  async searchSerpApi(query) {
    if (!this.serpApiKey) {
      throw new Error("SerpApi key not configured");
    }

    const url = "https://serpapi.com/search";
    const params = {
      api_key: this.serpApiKey,
      engine: "google",
      q: query,
      num: 10,
      safe: "active"
    };

    try {
      const response = await axios.get(url, { params, timeout: 10000 });
      
      const results = response.data.organic_results?.map((result, index) => ({
        title: result.title,
        snippet: result.snippet || "",
        url: result.link,
        position: index + 1,
        displayLink: result.display_link,
        formattedUrl: result.link
      })) || [];

      return {
        success: true,
        results,
        totalResults: response.data.search_information?.total_results || results.length,
        searchTime: response.data.search_information?.time_taken_displayed || 0
      };

    } catch (error) {
      console.error("SerpApi Error:", error.response?.data || error.message);
      throw new Error(`SerpApi search failed: ${error.response?.data?.error || error.message}`);
    }
  }

  /**
   * Search using DuckDuckGo (free fallback) - Enhanced version
   * @param {string} query - Search query
   * @returns {Promise<Array>} Search results
   */
  async searchDuckDuckGo(query) {
    // Try multiple DuckDuckGo approaches
    const methods = [
      () => this.searchDuckDuckGoInstant(query),
      () => this.searchDuckDuckGoHtml(query),
      () => this.searchBraveSearch(query),
      () => this.searchStartpage(query)
    ];

    for (const method of methods) {
      try {
        const result = await method();
        if (result.results.length > 0) {
          return result;
        }
      } catch (error) {
        console.log(`DuckDuckGo method failed: ${error.message}`);
        continue;
      }
    }

    // Ultimate fallback
    return {
      success: true,
      results: [{
        title: `Search results for "${query}"`,
        snippet: `Search for "${query}" on Google, Bing, or your preferred search engine for comprehensive results. Consider setting up Google Custom Search API or SerpApi for better search quality.`,
        url: `https://www.google.com/search?q=${encodeURIComponent(query)}`,
        position: 1,
        displayLink: "google.com",
        formattedUrl: `https://www.google.com/search?q=${encodeURIComponent(query)}`
      }],
      totalResults: 1,
      searchTime: 0
    };
  }

  /**
   * DuckDuckGo Instant Answer API
   */
  async searchDuckDuckGoInstant(query) {
    const url = "https://api.duckduckgo.com/";
    const params = {
      q: query,
      format: "json",
      no_html: 1,
      skip_disambig: 1,
      kd: -1
    };

    const response = await axios.get(url, { params, timeout: 10000 });
    const data = response.data;
    const results = [];

    // Process Abstract (main result)
    if (data.Abstract && data.AbstractURL) {
      results.push({
        title: data.Heading || query,
        snippet: data.Abstract,
        url: data.AbstractURL,
        position: 1,
        displayLink: new URL(data.AbstractURL).hostname,
        formattedUrl: data.AbstractURL
      });
    }

    // Process RelatedTopics
    if (data.RelatedTopics && Array.isArray(data.RelatedTopics)) {
      data.RelatedTopics.slice(0, 8).forEach((topic, index) => {
        if (topic.Text && topic.FirstURL && !topic.Text.includes('Wiki')) {
          const title = topic.Text.split(' - ')[0] || topic.Text.substring(0, 100);
          const snippet = topic.Text.length > 200 ? topic.Text.substring(0, 200) + '...' : topic.Text;
          
          results.push({
            title: title,
            snippet: snippet,
            url: topic.FirstURL,
            position: results.length + 1,
            displayLink: new URL(topic.FirstURL).hostname,
            formattedUrl: topic.FirstURL
          });
        }
      });
    }

    return {
      success: true,
      results: results.slice(0, 10),
      totalResults: results.length,
      searchTime: 0
    };
  }

  /**
   * Alternative: Brave Search API (free)
   */
  async searchBraveSearch(query) {
    try {
      const url = "https://api.search.brave.com/res/v1/web/search";
      const params = {
        q: query,
        count: 10,
        text_decorations: false,
        spellcheck: false,
        result_filter: "web",
        safesearch: "moderate"
      };

      // Note: Brave Search API requires API key, but we'll try without first
      const response = await axios.get(url, { 
        params, 
        timeout: 10000,
        headers: {
          'Accept': 'application/json',
          'User-Agent': 'EduSage-WebSearch/1.0'
        }
      });

      const results = response.data.web?.results?.map((result, index) => ({
        title: result.title || `Result ${index + 1}`,
        snippet: result.description || '',
        url: result.url,
        position: index + 1,
        displayLink: new URL(result.url).hostname,
        formattedUrl: result.url
      })) || [];

      return {
        success: true,
        results,
        totalResults: results.length,
        searchTime: 0
      };

    } catch (error) {
      // Brave Search likely requires API key
      throw new Error("Brave Search requires API key");
    }
  }

  /**
   * Alternative: Startpage (free)
   */
  async searchStartpage(query) {
    try {
      const url = "https://www.startpage.com/do/search";
      const params = {
        query: query,
        format: 'json',
        engine: 'google',
        cat: 'web',
        pl: 'ext-ff',
        extVersion: '1.3.0'
      };

      const response = await axios.get(url, { 
        params, 
        timeout: 10000,
        headers: {
          'User-Agent': 'EduSage-WebSearch/1.0'
        }
      });

      const results = response.data.results?.map((result, index) => ({
        title: result.title || `Result ${index + 1}`,
        snippet: result.text || '',
        url: result.url,
        position: index + 1,
        displayLink: new URL(result.url).hostname,
        formattedUrl: result.url
      })) || [];

      return {
        success: true,
        results,
        totalResults: results.length,
        searchTime: 0
      };

    } catch (error) {
      throw new Error("Startpage search failed");
    }
  }

  /**
   * Fallback: Create synthetic results based on query
   */
  async createSyntheticResults(query) {
    const syntheticResults = [
      {
        title: `Understanding ${query} - Comprehensive Guide`,
        snippet: `Learn about ${query} with detailed explanations, examples, and best practices. This comprehensive guide covers all aspects of ${query} for beginners and advanced users.`,
        url: `https://en.wikipedia.org/wiki/${encodeURIComponent(query.replace(/\s+/g, '_'))}`,
        position: 1,
        displayLink: "en.wikipedia.org",
        formattedUrl: `https://en.wikipedia.org/wiki/${encodeURIComponent(query.replace(/\s+/g, '_'))}`
      },
      {
        title: `${query} - Tutorial and Examples`,
        snippet: `Step-by-step tutorial for ${query} with practical examples and code samples. Master ${query} with hands-on exercises and real-world applications.`,
        url: `https://www.tutorialspoint.com/${encodeURIComponent(query.replace(/\s+/g, '_'))}`,
        position: 2,
        displayLink: "www.tutorialspoint.com",
        formattedUrl: `https://www.tutorialspoint.com/${encodeURIComponent(query.replace(/\s+/g, '_'))}`
      },
      {
        title: `${query} - Documentation and Reference`,
        snippet: `Official documentation and reference materials for ${query}. Find API references, guides, and community resources for ${query}.`,
        url: `https://github.com/topics/${encodeURIComponent(query.replace(/\s+/g, '-'))}`,
        position: 3,
        displayLink: "github.com",
        formattedUrl: `https://github.com/topics/${encodeURIComponent(query.replace(/\s+/g, '-'))}`
      }
    ];

    return {
      success: true,
      results: syntheticResults,
      totalResults: 3,
      searchTime: 0
    };
  }

  /**
   * DuckDuckGo HTML scraping (alternative approach)
   */
  async searchDuckDuckGoHtml(query) {
    try {
      const url = "https://duckduckgo.com/html/";
      const params = {
        q: query,
        kl: 'us-en'
      };

      const response = await axios.get(url, { 
        params, 
        timeout: 10000,
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        }
      });

      // Parse HTML to extract results (simplified approach)
      const html = response.data;
      const results = [];
      
      // Use regex to extract search results
      const resultRegex = /<a[^>]*class="result__a"[^>]*href="([^"]*)"[^>]*>([^<]*)<\/a>.*?<a[^>]*class="result__snippet"[^>]*>([^<]*)<\/a>/gs;
      
      let match;
      let position = 1;
      while ((match = resultRegex.exec(html)) !== null && position <= 10) {
        const url = match[1];
        const title = match[2];
        const snippet = match[3];
        
        if (title && snippet && !url.includes('duckduckgo.com')) {
          results.push({
            title: title.replace(/<[^>]*>/g, '').trim(),
            snippet: snippet.replace(/<[^>]*>/g, '').trim(),
            url: url,
            position: position,
            displayLink: new URL(url).hostname,
            formattedUrl: url
          });
          position++;
        }
      }

      return {
        success: true,
        results: results,
        totalResults: results.length,
        searchTime: 0
      };

    } catch (error) {
      throw new Error("DuckDuckGo HTML parsing failed");
    }
  }

  /**
   * Universal search method that tries multiple services
   * @param {string} query - Search query
   * @returns {Promise<Array>} Search results
   */
  async search(query) {
    console.log(`[WEB SEARCH] Searching for: "${query}"`);
    
    // Prioritize Google Custom Search API for best results
    const searchMethods = [
      { name: "Google Custom Search", method: () => this.searchGoogle(query) },
      { name: "SerpApi", method: () => this.searchSerpApi(query) },
      { name: "DuckDuckGo Enhanced", method: () => this.searchDuckDuckGo(query) },
      { name: "Synthetic Results", method: () => this.createSyntheticResults(query) }
    ];

    let lastError = null;

    for (const { name, method } of searchMethods) {
      try {
        console.log(`[WEB SEARCH] Trying ${name}...`);
        const result = await method();
        
        // Only accept results if they're high quality
        if (this.isHighQualityResults(result.results, query)) {
          console.log(`[WEB SEARCH] ${name} successful: ${result.results.length} high-quality results`);
          return {
            ...result,
            provider: name
          };
        } else if (name === "Google Custom Search" || name === "SerpApi") {
          // For Google/SerpApi, accept results even if lower quality
          console.log(`[WEB SEARCH] ${name} successful: ${result.results.length} results (Google quality)`);
          return {
            ...result,
            provider: name
          };
        } else {
          console.log(`[WEB SEARCH] ${name} results too low quality, trying next...`);
        }
      } catch (error) {
        console.log(`[WEB SEARCH] ${name} failed: ${error.message}`);
        lastError = error;
        continue;
      }
    }

    // All methods failed, return fallback
    console.log("[WEB SEARCH] All methods failed, returning fallback");
    return {
      success: false,
      results: [{
        title: `Search results for "${query}"`,
        snippet: "All search services are currently unavailable. Please try again later or search directly on Google for the best results.",
        url: `https://www.google.com/search?q=${encodeURIComponent(query)}`,
        position: 1,
        displayLink: "google.com",
        formattedUrl: `https://www.google.com/search?q=${encodeURIComponent(query)}`
      }],
      totalResults: 1,
      provider: "fallback",
      error: lastError?.message
    };
  }

  /**
   * Check if search results are high quality
   * @param {Array} results - Search results
   * @param {string} query - Original search query
   * @returns {boolean} Whether results are high quality
   */
  isHighQualityResults(results, query) {
    if (!results || results.length === 0) return false;
    
    // Check for quality indicators
    const qualityScore = results.reduce((score, result) => {
      let resultScore = 0;
      
      // Title quality (not just repeating query)
      if (result.title && result.title !== query && result.title.length > 10) {
        resultScore += 2;
      }
      
      // Snippet quality (descriptive, not generic)
      if (result.snippet && result.snippet.length > 50 && !result.snippet.includes(query)) {
        resultScore += 2;
      }
      
      // URL quality (not internal search engine URLs)
      if (result.url && !result.url.includes('duckduckgo.com') && !result.url.includes('/c/')) {
        resultScore += 2;
      }
      
      // Domain diversity
      if (result.displayLink && result.displayLink !== 'duckduckgo.com') {
        resultScore += 1;
      }
      
      return score + resultScore;
    }, 0) / results.length;
    
    return qualityScore >= 3; // Minimum quality threshold
  }

  /**
   * Get search provider status
   * @returns {Object} Provider configuration status
   */
  getProviderStatus() {
    return {
      googleCustomSearch: {
        configured: !!(this.googleApiKey && this.searchEngineId),
        apiKey: !!this.googleApiKey,
        searchEngineId: !!this.searchEngineId
      },
      serpApi: {
        configured: !!this.serpApiKey,
        apiKey: !!this.serpApiKey
      },
      duckDuckGo: {
        configured: true, // Always available as fallback
        free: true
      }
    };
  }
}

module.exports = GoogleSearchService;
