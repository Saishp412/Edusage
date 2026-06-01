@echo off
echo ========================================
echo EduSage Full Stack Application Startup
echo ========================================
echo.

REM Check if all required directories exist
echo Checking project structure...
if not exist "edusage-frontend" (
    echo ❌ Error: edusage-frontend directory not found
    pause
    exit /b 1
)
if not exist "edusage-backend" (
    echo ❌ Error: edusage-backend directory not found
    pause
    exit /b 1
)
if not exist "edusage-embeddings" (
    echo ❌ Error: edusage-embeddings directory not found
    pause
    exit /b 1
)
echo ✅ All directories found

REM Check if Node.js is installed
echo.
echo Checking Node.js...
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Error: Node.js is not installed
    echo Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
)
echo ✅ Node.js is installed

REM Check if Python is installed
echo.
echo Checking Python...
python --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Error: Python is not installed
    echo Please install Python from https://python.org/
    pause
    exit /b 1
)
echo ✅ Python is installed

REM Install dependencies if needed
echo.
echo Installing/updating dependencies...

REM Frontend dependencies
echo Installing frontend dependencies...
cd /d "%~dp0edusage-frontend"
call npm install >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Error installing frontend dependencies
    pause
    exit /b 1
)
echo ✅ Frontend dependencies installed

REM Backend dependencies
echo Installing backend dependencies...
cd /d "%~dp0edusage-backend"
call npm install >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Error installing backend dependencies
    pause
    exit /b 1
)
echo ✅ Backend dependencies installed

REM Python dependencies
echo Installing Python dependencies...
cd /d "%~dp0edusage-embeddings"
pip install fastapi uvicorn sentence-transformers >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Error installing Python dependencies
    pause
    exit /b 1
)
echo ✅ Python dependencies installed

REM Start servers
echo.
echo ========================================
echo Starting All Servers...
echo ========================================

REM Start Embedding Server
echo.
echo 🚀 Starting Embedding Server (Port 8001)...
start "EduSage Embedding" cmd /k "cd /d \"%~dp0edusage-embeddings\" && python -m uvicorn embed_server:app --host 127.0.0.1 --port 8001 --log-level warning"

REM Wait for embedding server
echo Waiting for embedding server to start...
timeout /t 8 /nobreak >nul

REM Start Backend Server
echo.
echo 🚀 Starting Backend Server (Port 5000)...
start "EduSage Backend" cmd /k "cd /d \"%~dp0edusage-backend\" && node server.js"

REM Wait for backend server
echo Waiting for backend server to start...
timeout /t 5 /nobreak >nul

REM Start Frontend Server
echo.
echo 🚀 Starting Frontend Server (Port 3000)...
start "EduSage Frontend" cmd /k "cd /d \"%~dp0edusage-frontend\" && npm run dev"

REM Wait for frontend server
echo Waiting for frontend server to start...
timeout /t 8 /nobreak >nul

echo.
echo ========================================
echo 🎉 All Servers Started!
echo ========================================
echo.
echo 📍 Access Points:
echo    Frontend: http://localhost:3000
echo    Backend:  http://localhost:5000
echo    Embeddings: http://localhost:8001
echo.
echo 🧪 Test URLs:
echo    Homepage: http://localhost:3000
echo    About:    http://localhost:3000/about
echo    Features: http://localhost:3000/features
echo    Login:    http://localhost:3000/login
echo    Register: http://localhost:3000/register
echo.
echo 🔍 If you see "page not found" errors:
echo    1. Wait 10-15 seconds for servers to fully start
echo    2. Check each server window for error messages
echo    3. Try refreshing the browser
echo    4. Make sure all dependencies are installed
echo.
echo 💡 Tips:
echo    - All servers run in separate windows
echo    - Close this window to stop all servers
echo    - Check individual server windows for status
echo.

REM Test if servers are responding
echo Testing server connectivity...
timeout /t 3 /nobreak >nul

curl -s http://localhost:8001/health >nul 2>&1
if %errorlevel% equ 0 (
    echo ✅ Embedding server is responding
) else (
    echo ⚠️  Embedding server may still be starting...
)

curl -s http://localhost:5000/api/status >nul 2>&1
if %errorlevel% equ 0 (
    echo ✅ Backend server is responding
) else (
    echo ⚠️  Backend server may still be starting...
)

curl -s http://localhost:3000 >nul 2>&1
if %errorlevel% equ 0 (
    echo ✅ Frontend server is responding
) else (
    echo ⚠️  Frontend server may still be starting...
)

echo.
echo 🌐 Open your browser and go to: http://localhost:3000
echo.
pause
