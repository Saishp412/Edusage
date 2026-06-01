@echo off
echo Starting EduSage Frontend Server...
echo.

cd /d "%~dp0edusage-frontend"

echo Installing dependencies if needed...
call npm install

echo.
echo Starting frontend development server on port 3000...
echo Press Ctrl+C to stop the server
echo.

npm run dev

pause
