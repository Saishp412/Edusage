@echo off
echo Starting Embedding Server...
echo.
echo Please make sure you have Python and required packages installed:
echo - sentence-transformers
echo - fastapi
echo - uvicorn
echo.
cd /d "%~dp0"
cd edusage-embeddings

REM Check if virtual environment exists
if not exist venv (
    echo Creating virtual environment...
    python -m venv venv
)

REM Activate virtual environment
call venv\Scripts\activate

REM Install required packages if not already installed
echo Installing required packages...
pip install sentence-transformers fastapi uvicorn

REM Start the embedding server
echo.
echo Starting embedding server on http://127.0.0.1:8001
echo Press Ctrl+C to stop the server
echo.
uvicorn embed_server:app --host 127.0.0.1 --port 8001

pause
