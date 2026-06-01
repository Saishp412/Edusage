@echo off
echo Installing Python dependencies for PyMuPDF image extraction...
echo.

REM Check if Python is installed
python --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Python is not installed or not in PATH
    echo Please install Python 3.7 or higher
    pause
    exit /b 1
)

echo Python found, installing dependencies...
pip install -r requirements.txt

if %errorlevel% equ 0 (
    echo.
    echo ✅ Python dependencies installed successfully!
    echo.
    echo You can now use PyMuPDF-based diagram extraction.
) else (
    echo.
    echo ❌ Failed to install Python dependencies
    echo Please check the error messages above
)

pause
