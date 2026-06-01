# EduSage Network Error Troubleshooting Guide

## Problem: Network Error in Frontend
The frontend is getting "Network Error" when trying to connect to the backend API.

## Quick Fix Steps:

### 1. Start the Backend Server
```bash
# Option 1: Use the provided script
Double-click: start-backend.bat

# Option 2: Manual start
cd edusage-backend
npm install
node server.js
```

### 2. Verify Backend is Running
- Open browser and go to: http://localhost:5000
- You should see a message or no error (blank page is OK)
- Check the terminal for "🚀 Server running on port 5000"

### 3. Start the Frontend
```bash
# Option 1: Use the provided script
Double-click: start-frontend.bat

# Option 2: Manual start
cd edusage-frontend
npm install
npm run dev
```

### 4. Use the Combined Startup Script
```bash
Double-click: start-servers.bat
```
This will start both backend and frontend simultaneously.

## Common Issues and Solutions:

### Issue 1: Port Already in Use
**Error:** "EADDRINUSE: address already in use :::5000"
**Solution:** 
- Close any existing Node.js processes
- Or change the port in server.js

### Issue 2: Missing Dependencies
**Error:** "Cannot find module 'openai'"
**Solution:**
```bash
cd edusage-backend
npm install
```

### Issue 3: OpenAI API Key Missing
**Error:** OpenAI API errors
**Solution:**
1. Create a `.env` file in `edusage-backend` folder
2. Add: `OPENAI_API_KEY=your_api_key_here`

### Issue 4: ChromaDB Not Running
**Error:** ChromaDB connection errors
**Solution:**
1. Install ChromaDB: https://docs.trychroma.com/getting-started
2. Start ChromaDB server on port 8000

### Issue 5: MongoDB Connection Issues
**Error:** MongoDB Atlas connection failed
**Solution:**
- The app will still work in limited mode
- Check your MongoDB Atlas credentials in .env

## Testing the Connection:
1. Start both servers
2. Go to: http://localhost:3000
3. Try to login/register
4. Check browser console for errors
5. Check backend terminal for API requests

## Expected Server Output:
**Backend:**
```
🚀 Server running on port 5000
✅ Full functionality available with MongoDB Atlas
```

**Frontend:**
```
- Local:            http://localhost:3000
- Environments:     .env.local
```

## Still Having Issues?
1. Check if Windows Firewall is blocking Node.js
2. Run Command Prompt as Administrator
3. Verify both backend and frontend are running in separate terminals
4. Check the API base URL in `edusage-frontend/services/api.ts`
