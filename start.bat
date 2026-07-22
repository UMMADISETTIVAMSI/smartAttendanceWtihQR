@echo off
echo Starting SmartAttendanceQR...

start cmd /k "set JAVA_HOME=C:\Program Files\Java\jdk-21.0.11 && set PATH=%JAVA_HOME%\bin;%PATH% && cd /d d:\desktop\SmartAttendanceQR\backend && mvn spring-boot:run"
timeout /t 20 /nobreak
start cmd /k "cd /d d:\desktop\SmartAttendanceQR\frontend && npm run dev"

echo Both servers started!
echo Backend:  http://localhost:8080
echo Frontend: http://localhost:5173
