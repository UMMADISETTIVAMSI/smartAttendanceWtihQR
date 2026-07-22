@echo off
echo Starting SmartAttendanceQR...

start cmd /k "cd /d d:\desktop\SmartAttendanceQR\backend && mvn spring-boot:run"
timeout /t 20 /nobreak
start cmd /k "cd /d d:\desktop\SmartAttendanceQR\frontend && npm run dev"

echo Both servers started!
echo Backend:  http://localhost:8080
echo Frontend: http://localhost:5173
