@echo off
echo ========================================
echo EduSage Server Diagnostic Tool
echo ========================================
echo.

echo 🔍 Checking server status...
echo.

REM Check port usage
echo Checking port usage:
netstat -ano | findstr ":3000\|:5000\|:8001"
echo.

REM Test each server
echo Testing individual servers:
echo.

echo 1. Testing Frontend (Port 3000)...
curl -s -o nul -w "Status: %%{http_code}\n" http://localhost:3000 2>nul || echo ❌ Frontend not responding

echo.
echo 2. Testing Backend (Port 5000)...
curl -s -o nul -w "Status: %%{http_code}\n" http://localhost:5000/api/status 2>nul || echo ❌ Backend not responding

echo.
echo 3. Testing Embeddings (Port 8001)...
curl -s -o nul -w "Status: %%{http_code}\n" http://localhost:8001/health 2>nul || echo ❌ Embeddings not responding

echo.
echo ========================================
echo Common Page Not Found Solutions:
echo ========================================
echo.
echo If you're seeing "page not found" errors:
echo.
echo 1. FRONTEND ISSUES (http://localhost:3000):
echo    - Run: cd edusage-frontend && npm run dev
echo    - Check for: npm install errors
echo    - Wait 10-15 seconds after starting
echo    - Try: http://localhost:3000 (homepage)
echo    - Try: http://localhost:3000/about (about page)
echo.
echo 2. BACKEND ISSUES (http://localhost:5000):
echo    - Run: cd edusage-backend && node server.js
echo    - Check for: MongoDB connection errors
echo    - Check for: Missing environment variables
echo    - Try: http://localhost:5000/api/status
echo.
echo 3. EMBEDDINGS ISSUES (http://localhost:8001):
echo    - Run: cd edusage-embeddings && python -m uvicorn embed_server:app --host 127.0.0.1 --port 8001
echo    - Check for: Python package installation errors
echo    - Try: http://localhost:8001/health
echo.
echo 4. QUICK FIX:
echo    - Close all server windows
echo    - Run: start-all-servers.bat
echo    - Wait 15-20 seconds
echo    - Refresh browser
echo.
echo ========================================
echo Troubleshooting Steps:
echo ========================================
echo.
echo Step 1: Check if servers are running
echo    - Look for 3 separate server windows
echo    - Each should show "Server running on port XXXX"
echo.
echo Step 2: Check for error messages
echo    - Look for red error text in server windows
echo    - Common errors: "Port already in use", "Module not found"
echo.
echo Step 3: Check browser console
echo    - Press F12 in browser
echo    - Look for JavaScript errors
echo    - Check Network tab for failed requests
echo.
echo Step 4: Test individual URLs
echo    - http://localhost:3000 (should show homepage)
echo    - http://localhost:3000/about (should show about page)
echo    - http://localhost:3000/login (should show login page)
echo.
echo ========================================
echo.

pause
