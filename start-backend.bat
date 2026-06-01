@echo off
echo Starting EduSage Backend Server...
echo.

cd /d "%~dp0edusage-backend"

echo Installing dependencies if needed...
call npm install

echo.
echo Starting backend server on port 5000...
echo Press Ctrl+C to stop the server
echo.

node server.js

pause
