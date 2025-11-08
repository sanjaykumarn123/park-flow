@echo off
echo ========================================
echo    ParkFlow Backend API Server
echo ========================================
echo.

REM Check if node_modules exists
if not exist "node_modules\" (
    echo Installing dependencies...
    call npm install
    echo.
)

echo Starting ParkFlow API server...
echo.
echo Server will start at: http://localhost:5000
echo.
echo Press Ctrl+C to stop the server
echo.

call npm start

pause
