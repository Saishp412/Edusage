# Google Custom Search API Setup - Step by Step Guide

## 🎯 Overview
This guide will help you set up Google Custom Search API to get high-quality Google search results instead of DuckDuckGo results.

## 📋 What You'll Get
- ✅ **Real Google Search Results** - High-quality, relevant results
- ✅ **Professional Search Experience** - Same as Google.com
- ✅ **Better Source Quality** - Educational and authoritative sources
- ✅ **Fast Search Speed** - Google's optimized infrastructure

---

## 🚀 Step 1: Get Google Cloud API Key

### 1.1 Create Google Cloud Project
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Sign in with your Google account
3. Click on the project dropdown at the top
4. Click **"NEW PROJECT"**
5. Enter project name: `edusage-search` (or your preferred name)
6. Click **"CREATE"**

### 1.2 Enable Custom Search API
1. In your new project, click the navigation menu (☰)
2. Go to **"APIs & Services"** → **"Library"**
3. Search for **"Custom Search API"**
4. Click on it
5. Click **"ENABLE"**

### 1.3 Create API Key
1. Go to **"APIs & Services"** → **"Credentials"**
2. Click **"+ CREATE CREDENTIALS"**
3. Select **"API key"**
4. Give it a name: `edusage-search-key`
5. Click **"CREATE AND CONTINUE"**
6. Copy your API key (it starts with `AIza...`)

**📝 Save your API key somewhere safe - you'll need it soon!**

---

## 🔍 Step 2: Create Custom Search Engine

### 2.1 Go to Google Custom Search
1. Go to [Google Custom Search](https://cse.google.com/)
2. Sign in with the same Google account
3. Click **"Add"** to create a new search engine

### 2.2 Configure Search Engine
1. **What to search?**: 
   - Select **"Search the entire web"**
   - This allows searching all websites, not just your site

2. **Language**: 
   - Select **"English"** (or your preferred language)

3. **Search engine name**:
   - Enter: `EdUsage Search`
   - This is just for your reference

4. **Description** (optional):
   - Enter: `Search engine for EdUsage application`

### 2.3 Get Search Engine ID
1. After creating, you'll see your search engine listed
2. Click on **"Control Panel"**
3. Look for **"Search engine ID"**
4. Copy the ID (it looks like `a1b2c3d4e5f6g7h8i9j0k`)

**📝 Save your Search Engine ID - you'll need this too!**

---

## ⚙️ Step 3: Add API Keys to Your Application

### 3.1 Locate Your .env File
1. Open your project folder
2. Navigate to: `edusage-backend/`
3. Open the `.env` file (you may need to show hidden files)

### 3.2 Add Google API Configuration
Add these lines to your `.env` file:

```env
# Google Custom Search API Configuration
GOOGLE_CUSTOM_SEARCH_API_KEY=AIzaSy...your-api-key-here
GOOGLE_SEARCH_ENGINE_ID=a1b2c3d4e5f6g7h8i9j0k...your-search-engine-id-here
```

**Example:**
```env
# Replace with your actual keys
GOOGLE_CUSTOM_SEARCH_API_KEY=AIzaSyB7K8l9m2n1o3p4q5r6s7t8u9v0w1x
GOOGLE_SEARCH_ENGINE_ID=017576898712345678:abcde123456
```

### 3.3 Save the File
1. Save the `.env` file
2. Make sure there are no extra spaces or quotes
3. Keep the file secure - don't share it!

---

## 🔄 Step 4: Restart Your Backend Server

### 4.1 Stop Current Server
1. Go to your backend terminal
2. Press `Ctrl + C` to stop the server

### 4.2 Start Server Again
1. Run the start command:
```bash
cd edusage-backend
npm start
```

### 4.3 Verify Configuration
Look for these messages in your server logs:
```
[WEB SEARCH] Trying Google Custom Search...
[WEB SEARCH] Google Custom Search successful: 10 high-quality results
```

---

## 🧪 Step 5: Test Google Search

### 5.1 Test in Frontend
1. Open your application: `http://localhost:3000`
2. Go to any notebook
3. Click the **"Search web for sources"** section
4. Search for something like: `"machine learning algorithms"`

### 5.2 Expected Results
You should now see:
- ✅ **Provider Badge**: "Google Custom Search"
- ✅ **High-Quality Results**: Real Google search results
- ✅ **Professional URLs**: Educational websites, documentation, tutorials
- ✅ **Rich Snippets**: Descriptive content from each page
- ✅ **No More DuckDuckGo**: Better quality search results

### 5.3 Example of Good Results
```
#1 wikipedia.org
Machine learning algorithms - Comprehensive overview
Machine learning algorithms are computational methods that enable systems to learn patterns from data...
https://en.wikipedia.org/wiki/Machine_learning_algorithms

#2 geeksforgeeks.org
Understanding Machine Learning Algorithms - Tutorial
A comprehensive guide to machine learning algorithms with examples and implementations...
https://www.geeksforgeeks.org/machine-learning-algorithms/

#3 stanford.edu
Machine Learning Course - Educational Content
Stanford's machine learning course covering supervised and unsupervised learning...
https://cs.stanford.edu/people/ang/courses/cs229/
```

---

## 🔧 Troubleshooting

### Common Issues & Solutions

#### ❌ "Google Custom Search API key not configured"
**Problem**: API key not added to `.env` file
**Solution**: 
1. Double-check your `.env` file has both keys
2. Ensure no extra spaces or quotes
3. Restart backend server

#### ❌ "Search engine ID not valid"
**Problem**: Wrong or missing search engine ID
**Solution**:
1. Go back to [Google Custom Search](https://cse.google.com/)
2. Copy the exact Search Engine ID from Control Panel
3. Update your `.env` file

#### ❌ "Daily limit exceeded"
**Problem**: Google's free tier limit (100 searches/day)
**Solution**:
1. Wait until tomorrow (limit resets at midnight PST)
2. Consider upgrading to paid plan
3. Use SerpApi as backup

#### ❌ "Still getting DuckDuckGo results"
**Problem**: API keys not working properly
**Solution**:
1. Check backend logs for error messages
2. Verify both API keys are correct
3. Ensure no typos in `.env` file
4. Restart backend server completely

---

## 📊 API Limits & Pricing

### Google Custom Search API (Free Tier)
- **Queries per day**: 100
- **Queries per month**: 3,000
- **Cost**: Free
- **Reset time**: Daily at midnight PST

### If You Need More
- **Google Cloud Pricing**: [pricing details](https://cloud.google.com/products/search-api/pricing)
- **Alternative**: Use SerpApi (more generous free tier)

---

## 🎯 Success Checklist

After setup, you should have:

- [ ] ✅ Google Cloud API key created
- [ ] ✅ Custom Search Engine created  
- [ ] ✅ Both keys added to `.env` file
- [ ] ✅ Backend server restarted
- [ ] ✅ Test search working in frontend
- [ ] ✅ Provider shows "Google Custom Search"
- [ ] ✅ High-quality results appearing

---

## 🚀 Alternative: SerpApi Setup

If Google setup is too complex, try SerpApi:

### Quick Setup
1. Sign up at [SerpApi](https://serpapi.com/)
2. Get API key from dashboard
3. Add to `.env`: `SERPAPI_KEY=your-key-here`
4. Restart backend server

### Benefits
- ✅ **Easier setup** - Just one API key
- ✅ **Higher limits** - 50 searches/month free
- ✅ **Same Google results** - Uses Google's search engine
- ✅ **Good documentation** - Easy to integrate

---

## 🎉 You're Done!

Once you complete these steps:
1. Your search will show **"Google Custom Search"** as provider
2. You'll get **real Google search results** 
3. Results will be **high-quality and educational**
4. No more **DuckDuckGo limitations**

**Enjoy your professional Google-powered search!** 🎯

---

## 📞 Need Help?

If you run into issues:
1. **Check the logs**: Look at your backend console output
2. **Verify keys**: Ensure both keys are correct
3. **Restart services**: Sometimes a full restart helps
4. **Contact support**: Check the application for help options

**Happy searching with Google!** 🔍✨
