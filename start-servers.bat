@echo off
echo Starting EduSage Full Stack Application...
echo.

echo ========================================
echo Starting Embedding Server (Port 8001)
echo ========================================
start "EduSage Embedding" cmd /k "cd /d \"%~dp0edusage-embeddings\" && call venv\Scripts\activate && uvicorn embed_server:app --host 127.0.0.1 --port 8001"

echo.
echo Waiting for embedding server to start...
timeout /t 5 /nobreak >nul

echo ========================================
echo Starting Backend Server (Port 5000)
echo ========================================
start "EduSage Backend" cmd /k "cd /d \"%~dp0edusage-backend\" && node server.js"

echo.
echo Waiting for backend to start...
timeout /t 3 /nobreak >nul

echo ========================================
echo Starting Frontend Server (Port 3000)
echo ========================================
start "EduSage Frontend" cmd /k "cd /d \"%~dp0edusage-frontend\" && npm run dev"

echo.
echo ========================================
echo All Servers Starting Up...
echo ========================================
echo Embedding: http://localhost:8001
echo Backend: http://localhost:5000
echo Frontend: http://localhost:3000
echo.
echo All servers should be ready in a few seconds.
echo Close this window to stop all servers.
echo.

pause
