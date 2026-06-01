@echo off
echo Starting EduSage Embeddings Server...
echo.

REM Check if Python is installed
python --version >nul 2>&1
if %errorlevel% neq 0 (
    echo Error: Python is not installed or not in PATH
    pause
    exit /b 1
)

REM Check if required packages are installed
echo Checking dependencies...
python -c "import fastapi, sentence_transformers, uvicorn" >nul 2>&1
if %errorlevel% neq 0 (
    echo Installing missing dependencies...
    pip install fastapi uvicorn sentence-transformers
    if %errorlevel% neq 0 (
        echo Error: Failed to install dependencies
        pause
        exit /b 1
    )
)

REM Start the server without reload to avoid multiprocessing issues
echo Starting embeddings server on http://localhost:8001
echo.
echo Note: Server is running without auto-reload for Windows compatibility
echo To restart the server, stop it (Ctrl+C) and run this script again
echo.

python -m uvicorn embed_server:app --host 0.0.0.0 --port 8001

pause
