@echo off
echo ========================================
echo    ParkFlow Full-Stack Application
echo ========================================
echo.

echo Starting Backend Server...
start "ParkFlow Backend" cmd /k "cd server && npm install && npm start"

timeout /t 3 /nobreak > nul

echo Starting Frontend Application...
start "ParkFlow Frontend" cmd /k "npm install && npm run dev"

echo.
echo ========================================
echo Both servers are starting...
echo.
echo Backend:  http://localhost:5000
echo Frontend: http://localhost:3000
echo.
echo Close both terminal windows to stop
echo ========================================
echo.

pause
